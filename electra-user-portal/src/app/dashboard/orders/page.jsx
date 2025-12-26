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
      <main className="wrap">
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
          .wrap {
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
    <main className="wrap">
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
        .wrap {
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
        <strong className="title">{order.productName}</strong>
        <span className="amount">₹{order.amount}</span>
      </div>

      {/* STATUS BADGE */}
      <div className={`status ${state.tone}`}>
        {state.label}
      </div>

      {/* TIMELINE */}
      <div className="timeline">
        <Timeline label="Placed" date={formatDate(order.createdAt)} />
        <Timeline label="Verified" date={formatDate(order.approvedAt)} />
        <Timeline label="Shipped" date={formatDate(order.shippedAt)} />
        <Timeline label="Delivered" date={formatDate(order.deliveredAt)} />
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
        Order ID · <span>{order.orderId}</span>
      </div>

      <style jsx>{`
        .card {
          background:
            linear-gradient(180deg, #0d0f12, #07080a);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 18px;
          padding: 1.25rem 1.2rem;
          box-shadow:
            0 8px 20px rgba(0,0,0,0.6),
            inset 0 1px 0 rgba(255,255,255,0.04);
          transition:
            transform 0.25s ease,
            box-shadow 0.25s ease,
            border-color 0.25s ease;
        }

        .clickable {
          cursor: pointer;
        }

        .clickable:hover {
          transform: translateY(-4px);
          box-shadow:
            0 14px 36px rgba(0,0,0,0.75),
            inset 0 1px 0 rgba(255,255,255,0.08);
          border-color: rgba(255,255,255,0.16);
        }

        /* HEADER */
        .top {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 1rem;
          margin-bottom: 0.6rem;
        }

        .title {
          font-size: 0.95rem;
          font-weight: 600;
          letter-spacing: 0.04em;
          color: #e5e7eb;
        }

        .amount {
          font-size: 0.9rem;
          font-weight: 600;
          color: #22d3ee;
          white-space: nowrap;
        }

        /* STATUS */
        .status {
          display: inline-block;
          margin-bottom: 0.8rem;
          padding: 0.28rem 0.7rem;
          border-radius: 999px;
          font-size: 0.65rem;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          border: 1px solid transparent;
          width: fit-content;
        }

        .green {
          color: #22c55e;
          border-color: rgba(34,197,94,0.35);
          background: rgba(34,197,94,0.08);
        }

        .blue {
          color: #38bdf8;
          border-color: rgba(56,189,248,0.35);
          background: rgba(56,189,248,0.08);
        }

        .yellow {
          color: #facc15;
          border-color: rgba(250,204,21,0.35);
          background: rgba(250,204,21,0.08);
        }

        .red {
          color: #ef4444;
          border-color: rgba(239,68,68,0.35);
          background: rgba(239,68,68,0.08);
        }

        .gray {
          color: #9ca3af;
          border-color: rgba(156,163,175,0.25);
          background: rgba(156,163,175,0.06);
        }

        /* TIMELINE */
        .timeline {
          font-size: 0.78rem;
          color: #9ca3af;
          display: grid;
          gap: 0.3rem;
          padding-left: 0.2rem;
        }

        /* PAY BUTTON */
        .payBtn {
          margin-top: 0.9rem;
          background: linear-gradient(180deg,#ffffff,#e5e7eb);
          color: #000;
          border: none;
          border-radius: 999px;
          padding: 0.45rem 1.2rem;
          font-size: 0.65rem;
          letter-spacing: 0.18em;
          font-weight: 600;
          cursor: pointer;
        }

        .payBtn:hover {
          opacity: 0.9;
        }

        /* FOOTER */
        .meta {
          margin-top: 0.9rem;
          font-size: 0.65rem;
          letter-spacing: 0.08em;
          color: #6b7280;
        }

        .meta span {
          color: #9ca3af;
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
