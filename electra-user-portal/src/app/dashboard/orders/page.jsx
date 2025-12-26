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
  const [tab, setTab] = useState("active"); // active | completed | rejected

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

  /* ───────── LOADING ───────── */
  if (loading) {
    return (
      <main className="center">Loading your orders…</main>
    );
  }

  return (
    <main className="wrap">
      <h1>Your Orders</h1>

      {/* ───── TABS ───── */}
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

      {/* ───── CONTENT ───── */}
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

        .center {
          min-height: 100vh;
          display: grid;
          place-items: center;
          color: #9ca3af;
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
    e.stopPropagation(); // ⛔ prevent card click
    router.push(`/checkout/${order.orderId}`);
  };

  return (
    <div
      className="card clickable"
      onClick={() =>
        router.push(`/dashboard/orders/${order.orderId}`)
      }
    >
      <div className="top">
        <strong>{order.productName}</strong>
        <span>₹{order.amount}</span>
      </div>

      <div className={`status ${state.tone}`}>
        {state.label}
      </div>

      <div className="timeline">
        <Timeline label="Placed" date={formatDate(order.createdAt)} />
        <Timeline label="Verified" date={formatDate(order.approvedAt)} />
        <Timeline label="Shipped" date={formatDate(order.shippedAt)} />
        <Timeline label="Delivered" date={formatDate(order.deliveredAt)} />
      </div>

      {/* ✅ CONTINUE PAYMENT BUTTON */}
      {order.paymentStatus === "pending_payment" && (
        <button
          className="payBtn"
          onClick={continuePayment}
        >
          Continue payment
        </button>
      )}

      <div className="meta">
        Order ID: {order.orderId}
      </div>

      <style jsx>{`
        .card {
          background: #0b0b0b;
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 16px;
          padding: 1rem;
          transition: transform 0.15s ease, border-color 0.15s ease;
        }

        .clickable {
          cursor: pointer;
        }

        .clickable:hover {
          transform: translateY(-2px);
          border-color: rgba(255,255,255,0.2);
        }

        .top {
          display: flex;
          justify-content: space-between;
          margin-bottom: 0.4rem;
        }

        .status {
          font-size: 0.75rem;
          margin-bottom: 0.6rem;
        }

        .green { color: #22c55e; }
        .blue { color: #38bdf8; }
        .yellow { color: #facc15; }
        .red { color: #ef4444; }
        .gray { color: #9ca3af; }

        .timeline {
          font-size: 0.78rem;
          color: #9ca3af;
          display: grid;
          gap: 0.25rem;
          margin-bottom: 0.6rem;
        }

        .payBtn {
          margin-top: 0.6rem;
          background: #fff;
          color: #000;
          border: none;
          border-radius: 999px;
          padding: 0.45rem 1rem;
          font-size: 0.7rem;
          letter-spacing: 0.12em;
          cursor: pointer;
        }

        .payBtn:hover {
          opacity: 0.9;
        }

        .meta {
          margin-top: 0.6rem;
          font-size: 0.7rem;
          color: #6b7280;
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
