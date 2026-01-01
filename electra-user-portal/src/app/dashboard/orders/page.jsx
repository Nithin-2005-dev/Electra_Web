"use client";

import { useEffect, useMemo, useState } from "react";
import { auth, db } from "../../lib/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/navigation";

/* ───────────────── HELPERS ───────────────── */

function formatDate(ts) {
  if (!ts?.seconds) return "—";
  return new Date(ts.seconds * 1000).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function getOrderState(order) {
  if (order.paymentStatus === "rejected")
    return { label: "Rejected", tone: "red" };

  if (order.fulfillmentStatus === "delivered")
    return { label: "Delivered", tone: "green" };

  if (order.fulfillmentStatus === "shipped")
    return { label: "Shipped", tone: "blue" };

  if (order.paymentStatus === "confirmed")
    return { label: "Processing", tone: "yellow" };

  if (order.paymentStatus === "pending_verification")
    return { label: "Payment under verification", tone: "gray" };

  return { label: "Awaiting payment", tone: "gray" };
}

/* ───────────────── COMPONENT ───────────────── */

export default function OrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("active");

  /* ───────── AUTH + FETCH ───────── */
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        router.replace("/auth/sign-in");
        return;
      }

      const q = query(
        collection(db, "orders"),
        where("userId", "==", user.uid)
      );

      const snap = await getDocs(q);
      const data = snap.docs
        .map((d) => d.data())
        .sort(
          (a, b) =>
            (b.createdAt?.seconds || 0) -
            (a.createdAt?.seconds || 0)
        );

      setOrders(data);
      setLoading(false);
    });

    return () => unsub();
  }, [router]);

  /* ───────── GROUPS ───────── */
  const activeOrders = useMemo(
    () =>
      orders.filter(
        (o) =>
          o.paymentStatus !== "rejected" &&
          o.fulfillmentStatus !== "delivered"
      ),
    [orders]
  );

  const completedOrders = useMemo(
    () => orders.filter((o) => o.fulfillmentStatus === "delivered"),
    [orders]
  );

  const rejectedOrders = useMemo(
    () => orders.filter((o) => o.paymentStatus === "rejected"),
    [orders]
  );

  const visible =
    tab === "active"
      ? activeOrders
      : tab === "completed"
      ? completedOrders
      : rejectedOrders;

  /* ───────── LOADING UI ───────── */
  if (loading) {
    return (
      <main className="wrap_dashboard_orders">
        <h1>Your Orders</h1>

        <div className="tabs">
          <button className="active">Active</button>
          <button>Completed</button>
          <button>Rejected</button>
        </div>

        <div className="list">
          {Array.from({ length: 4 }).map((_, i) => (
            <OrderSkeleton key={i} />
          ))}
        </div>

        <style jsx>{`
          .wrap_dashboard_orders {
            min-height: 100vh;
            background: #000;
            color: #fff;
            padding: 2rem;
          }

          h1 {
            font-size: 1.8rem;
            margin-bottom: 1rem;
          }

          .tabs {
            display: flex;
            gap: 0.6rem;
            margin-bottom: 1.6rem;
          }

          .tabs button {
            padding: 0.45rem 1rem;
            border-radius: 999px;
            border: 1px solid rgba(255,255,255,0.2);
            background: transparent;
            color: #6b7280;
            font-size: 0.8rem;
          }

          .tabs .active {
            background: #fff;
            color: #000;
            border-color: #fff;
          }

          .list {
            display: grid;
            gap: 1rem;
          }
        `}</style>
      </main>
    );
  }

  return (
    <main className="wrap_dashboard_orders">
      <h1>Your Orders</h1>

      <div className="tabs">
        {[
          ["active", `Active (${activeOrders.length})`],
          ["completed", `Completed (${completedOrders.length})`],
          ["rejected", `Rejected (${rejectedOrders.length})`],
        ].map(([k, l]) => (
          <button
            key={k}
            className={tab === k ? "active" : ""}
            onClick={() => setTab(k)}
          >
            {l}
          </button>
        ))}
      </div>

      {visible.length === 0 ? (
        <p className="empty">No orders here.</p>
      ) : (
        <div className="list">
          {visible.map((order) => (
            <OrderCard key={order.orderId} order={order} />
          ))}
        </div>
      )}

      <style jsx>{`
        .wrap_dashboard_orders {
          min-height: 100vh;
          background: #000;
          color: #fff;
          padding: 2rem;
        }

        h1 {
          font-size: 1.8rem;
          margin-bottom: 1rem;
        }

        .tabs {
          display: flex;
          gap: 0.6rem;
          margin-bottom: 1.6rem;
          flex-wrap: wrap;
        }

        .tabs button {
          padding: 0.45rem 1rem;
          border-radius: 999px;
          border: 1px solid rgba(255,255,255,0.2);
          background: transparent;
          color: #9ca3af;
          font-size: 0.8rem;
          cursor: pointer;
        }

        .tabs .active {
          background: #fff;
          color: #000;
          border-color: #fff;
        }

        .list {
          display: grid;
          gap: 1rem;
        }

        .empty {
          color: #9ca3af;
          margin-top: 2rem;
        }
      `}</style>
    </main>
  );
}

/* ───────────────── ORDER CARD ───────────────── */

function OrderCard({ order }) {
  const router = useRouter();
  const state = getOrderState(order);

  const totalPaid =
    order.totalAmountPaid ??
    order.amount +
      (order.printNameCharge || 0) +
      (order.deliveryCharge || 0);

  const items = order.items || [
    {
      productName: order.productName,
      size: order.size,
      printName: order.printName,
      printedName: order.printedName,
      quantity: 1,
      price: order.price,
    },
  ];

  const continuePayment = (e) => {
    e.stopPropagation();
    router.push(`/checkout/${order.orderId}`);
  };

  return (
    <div
      className="card clickable"
      onClick={() =>
        router.push(`/dashboard/orders/${order.orderId}`)
      }
    >
      {/* HEADER */}
      <div className="top">
        <div>
          <strong className="title">Order #{order.orderId}</strong>
          <div className={`status ${state.tone}`}>
            {state.label}
          </div>
        </div>

        <div className="amount">
          ₹{totalPaid}
          <span>Total</span>
        </div>
      </div>

      {/* ITEMS */}
      <div className="items">
        {items.slice(0, 2).map((item, i) => (
          <div key={i} className="itemRow">
            <div className="left">
              <p className="name">{item.productName}</p>
              <p className="meta">
                Size: {item.size}
                {item.printName && (
                  <> · Printed: {item.printedName}</>
                )}
              </p>
            </div>
            <div className="right">
              {item.quantity || 1} × ₹{item.price}
            </div>
          </div>
        ))}

        {items.length > 2 && (
          <div className="more">
            +{items.length - 2} more item(s)
          </div>
        )}
      </div>

      {/* TIMELINE (COMPACT) */}
      <div className="timeline">
        <span>Placed · {formatDate(order.createdAt)}</span>
        {order.approvedAt && (
          <span>Verified · {formatDate(order.approvedAt)}</span>
        )}
        {order.shippedAt && (
          <span>Shipped · {formatDate(order.shippedAt)}</span>
        )}
        {order.deliveredAt && (
          <span>Delivered · {formatDate(order.deliveredAt)}</span>
        )}
      </div>

      {/* ACTION */}
      {order.paymentStatus === "pending_payment" && (
        <button
          className="payBtn"
          onClick={continuePayment}
        >
          Continue payment
        </button>
      )}

      {/* FOOTER */}
      <div className="meta">
        Placed on <strong>{formatDate(order.createdAt)}</strong>
      </div>

      <style jsx>{`
        .card {
          background: linear-gradient(180deg, #0d0f12, #07080a);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 18px;
          padding: 1.3rem;
          box-shadow: 0 10px 30px rgba(0,0,0,0.6);
          transition: transform .25s ease, box-shadow .25s ease;
        }

        .clickable:hover {
          transform: translateY(-4px);
          box-shadow: 0 16px 44px rgba(0,0,0,0.8);
        }

        /* HEADER */
        .top {
          display: flex;
          justify-content: space-between;
          gap: 1rem;
          margin-bottom: 1rem;
        }

        .title {
          font-size: 0.9rem;
          font-weight: 600;
          color: #e5e7eb;
        }

        .amount {
          text-align: right;
          font-size: 1rem;
          font-weight: 700;
          color: #22d3ee;
        }

        .amount span {
          display: block;
          font-size: 0.65rem;
          color: #9ca3af;
          font-weight: 400;
        }

        /* STATUS */
        .status {
          margin-top: 0.35rem;
          padding: 0.28rem 0.7rem;
          border-radius: 999px;
          font-size: 0.6rem;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          width: fit-content;
        }

        /* ITEMS */
        .items {
          display: grid;
          gap: 0.7rem;
          margin-bottom: 0.9rem;
        }

        .itemRow {
          display: flex;
          justify-content: space-between;
          gap: 1rem;
        }

        .name {
          font-size: 0.82rem;
          font-weight: 600;
          color: #fff;
        }

        .meta {
          font-size: 0.72rem;
          color: #9ca3af;
        }

        .right {
          font-size: 0.78rem;
          white-space: nowrap;
          color: #e5e7eb;
        }

        .more {
          font-size: 0.7rem;
          color: #22d3ee;
        }

        /* TIMELINE */
        .timeline {
          display: flex;
          flex-wrap: wrap;
          gap: 0.8rem;
          font-size: 0.7rem;
          color: #9ca3af;
          margin-bottom: 0.9rem;
        }

        /* PAY BUTTON */
        .payBtn {
          background: linear-gradient(180deg,#ffffff,#e5e7eb);
          color: #000;
          border-radius: 999px;
          padding: 0.45rem 1.4rem;
          font-size: 0.65rem;
          letter-spacing: 0.18em;
          font-weight: 600;
          border: none;
          cursor: pointer;
        }

        /* FOOTER */
        .meta strong {
          color: #e5e7eb;
        }
      `}</style>
    </div>
  );
}

function Timeline({ label, date }) {
  return (
    <div>
      {label}: <strong>{date}</strong>
    </div>
  );
}

/* ───────────────── SKELETON ───────────────── */

function OrderSkeleton() {
  return (
    <div className="skeleton">
      <div className="row" />
      <div className="bar short" />
      <div className="bar" />
      <div className="bar tiny" />

      <style jsx>{`
        .skeleton {
          background: #0b0b0b;
          border-radius: 16px;
          padding: 1rem;
          border: 1px solid rgba(255,255,255,0.08);
        }

        .row {
          height: 16px;
          width: 60%;
          margin-bottom: 0.6rem;
          background: linear-gradient(
            90deg,
            #111 25%,
            #1a1a1a 37%,
            #111 63%
          );
          background-size: 400% 100%;
          animation: shimmer 1.4s infinite;
          border-radius: 6px;
        }

        .bar {
          height: 10px;
          background: #1a1a1a;
          border-radius: 6px;
          margin-top: 0.4rem;
        }

        .short { width: 40%; }
        .tiny { width: 30%; }

        @keyframes shimmer {
          0% { background-position: 100% 0; }
          100% { background-position: 0 0; }
        }
      `}</style>
    </div>
  );
}
