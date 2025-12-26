"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { auth, db } from "../../../lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import ProgressBar from "../../../../components/user-orders/ProgressBar";

/* ───────── HELPERS ───────── */
const formatDate = (ts) =>
  ts?.seconds
    ? new Date(ts.seconds * 1000).toLocaleString("en-IN")
    : null;

export default function OrderDetailsPage() {
  const { orderId } = useParams();
  const router = useRouter();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user) return router.replace("/auth/sign-in");

      const ref = doc(db, "orders", orderId);
      const snap = await getDoc(ref);

      if (!snap.exists() || snap.data().userId !== user.uid) {
        router.replace("/dashboard/orders");
        return;
      }

      setOrder(snap.data());
      setLoading(false);
    });

    return () => unsub();
  }, [orderId, router]);

  /* ───────── LOADING UI ───────── */
  if (loading) {
    return (
      <main className="page">
        {/* HEADER SKELETON */}
        <div className="panel headerSkel">
          <div className="skel title" />
          <div className="skel amount" />
        </div>

        {/* PROGRESS */}
        <div className="panel">
          <div className="skel bar" />
        </div>

        {/* META */}
        <div className="panel grid">
          <div className="skel line" />
          <div className="skel line" />
        </div>

        {/* TIMELINE */}
        <div className="panel timeline">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="skel row" />
          ))}
        </div>

        <style jsx>{`
          .page {
            min-height: 100vh;
            background: #000;
            padding: clamp(1.2rem, 4vw, 2.5rem);
            max-width: 920px;
            margin: 0 auto;
          }

          .panel {
            background: #0b0f15;
            border: 1px solid rgba(255,255,255,0.08);
            border-radius: 16px;
            padding: 1.2rem;
            margin-bottom: 1rem;
          }

          .headerSkel {
            display: flex;
            justify-content: space-between;
            gap: 1rem;
          }

          .skel {
            background: linear-gradient(
              90deg,
              #111 25%,
              #1a1a1a 37%,
              #111 63%
            );
            background-size: 400% 100%;
            animation: shimmer 1.4s infinite;
            border-radius: 8px;
          }

          .title {
            height: 22px;
            width: 60%;
          }

          .amount {
            height: 22px;
            width: 80px;
          }

          .bar {
            height: 16px;
            width: 100%;
            border-radius: 999px;
          }

          .line {
            height: 14px;
            width: 100%;
          }

          .row {
            height: 44px;
            border-radius: 10px;
          }

          .grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
            gap: 1rem;
          }

          .timeline {
            display: grid;
            gap: 0.6rem;
          }

          @keyframes shimmer {
            0% { background-position: 100% 0; }
            100% { background-position: 0 0; }
          }
        `}</style>
      </main>
    );
  }

  if (!order) return null;

  /* ───────── ACTUAL PAGE ───────── */
  return (
    <main className="page">
      {/* HEADER */}
      <header className="header">
        <div>
          <h1>Order #{order.orderId}</h1>
          <p className="product">{order.productName}</p>
        </div>
        <div className="amount">₹{order.amount}</div>
      </header>

      {/* PROGRESS */}
      <section className="panel">
        <ProgressBar order={order} />
      </section>

      {/* META */}
      <section className="panel grid">
        <Meta label="Payment status" value={order.paymentStatus} />
        <Meta label="Placed on" value={formatDate(order.createdAt)} />
      </section>

      {/* TIMELINE */}
      <section className="panel timeline">
        <Timeline label="Placed" date={formatDate(order.createdAt)} />
        <Timeline label="Approved" date={formatDate(order.approvedAt)} />
        <Timeline label="Shipped" date={formatDate(order.shippedAt)} />
        <Timeline label="Delivered" date={formatDate(order.deliveredAt)} />
      </section>

      <style jsx>{`
        .page {
          min-height: 100vh;
          background: #000;
          color: #fff;
          padding: clamp(1.2rem, 4vw, 2.5rem);
          max-width: 920px;
          margin: 0 auto;
        }

        .header {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          margin-bottom: 1.6rem;
        }

        .product {
          color: #9ca3af;
          font-size: 0.95rem;
        }

        .amount {
          font-size: 1.4rem;
          font-weight: 700;
          color: #22d3ee;
        }

        .panel {
          background: #0b0f15;
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 16px;
          padding: 1.2rem;
          margin-bottom: 1rem;
        }

        .grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 1rem;
        }

        .timeline {
          display: grid;
          gap: 0.6rem;
        }
      `}</style>
    </main>
  );
}

/* ───────── SUB COMPONENTS ───────── */

function Meta({ label, value }) {
  return (
    <div>
      <p style={{ color: "#9ca3af", fontSize: "0.8rem" }}>{label}</p>
      <strong>{value}</strong>
    </div>
  );
}

function Timeline({ label, date }) {
  if (!date) return null;
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        background: "rgba(255,255,255,0.03)",
        padding: "0.7rem 0.9rem",
        borderRadius: "10px",
      }}
    >
      <span>{label}</span>
      <span style={{ color: "#9ca3af", fontSize: "0.85rem" }}>
        {date}
      </span>
    </div>
  );
}
