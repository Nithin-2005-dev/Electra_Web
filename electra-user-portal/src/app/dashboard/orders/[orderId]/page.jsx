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

  if (loading) {
    return (
      <main className="center">
        <span className="loader" />
      </main>
    );
  }

  if (!order) return null;

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

        .center {
          min-height: 100vh;
          display: grid;
          place-items: center;
          background: #000;
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

        .loader {
          width: 36px;
          height: 36px;
          border: 3px solid rgba(255,255,255,0.15);
          border-top-color: #22d3ee;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
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
    <div style={{
      display: "flex",
      justifyContent: "space-between",
      background: "rgba(255,255,255,0.03)",
      padding: "0.7rem 0.9rem",
      borderRadius: "10px"
    }}>
      <span>{label}</span>
      <span style={{ color: "#9ca3af", fontSize: "0.85rem" }}>{date}</span>
    </div>
  );
}
