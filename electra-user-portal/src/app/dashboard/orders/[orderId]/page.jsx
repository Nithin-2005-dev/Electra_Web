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
    ? new Date(ts.seconds * 1000).toLocaleString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "—";

export default function OrderDetailsPage() {
  const { orderId } = useParams();
  const router = useRouter();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user) return router.replace("/auth/sign-in");

      const snap = await getDoc(doc(db, "orders", orderId));
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
      <main className="page">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="panel skeleton" />
        ))}
        <style jsx>{`
          .page {
            min-height: 100vh;
            background: #000;
            padding: 2rem;
            max-width: 960px;
            margin: auto;
          }
          .panel {
            height: 120px;
            border-radius: 16px;
            background: linear-gradient(
              90deg,
              #111 25%,
              #1a1a1a 37%,
              #111 63%
            );
            background-size: 400% 100%;
            animation: shimmer 1.4s infinite;
            margin-bottom: 1rem;
          }
          @keyframes shimmer {
            to {
              background-position: -400% 0;
            }
          }
        `}</style>
      </main>
    );
  }

  if (!order) return null;

  const items =
    order.items || [
      {
        productName: order.productName,
        size: order.size,
        printName: order.printName,
        printedName: order.printedName,
        quantity: 1,
        price: order.price,
      },
    ];

  const totalPaid =
    order.totalAmountPaid ??
    order.amount +
      (order.printNameCharge || 0) +
      (order.deliveryCharge || 0);

  return (
    <main className="page">
      {/* HEADER */}
      <header className="header">
        <div>
          <h1>Order #{order.orderId}</h1>
          <p className="sub">
            Placed on {formatDate(order.createdAt)}
          </p>
        </div>

        <div className="amountBox">
          <span >Total paid:</span>
          <strong>₹{totalPaid}</strong>
        </div>
      </header>

      {/* PROGRESS */}
      <section className="panel">
        <ProgressBar order={order} />
      </section>

      {/* ITEMS */}
      <section className="panel">
        <h2 className="sectionTitle">Items</h2>

        {items.map((item, i) => (
          <div key={i} className="itemRow">
            <div>
              <strong>{item.productName}</strong>
              <p className="muted">
                Size: {item.size}
                {item.printName && (
                  <> · Printed: {item.printedName}</>
                )}
              </p>
            </div>
            <div className="price">
              {item.quantity || 1} × ₹{item.price}
            </div>
          </div>
        ))}
      </section>

      {/* PAYMENT SUMMARY */}
      <section className="panel payment">
        <h2 className="sectionTitle">Payment Summary</h2>

        <div className="payRow">
          <span>Base amount</span>
          <span>₹{order.amount}</span>
        </div>

        {order.printNameCharge > 0 && (
          <div className="payRow">
            <span>Name print</span>
            <span>₹{order.printNameCharge}</span>
          </div>
        )}

        {order.deliveryCharge > 0 && (
          <div className="payRow">
            <span>Delivery</span>
            <span>₹{order.deliveryCharge}</span>
          </div>
        )}

        <div className="divider" />

        <div className="payRow total">
          <span>Total paid</span>
          <span>₹{totalPaid}</span>
        </div>
      </section>

      {/* TIMELINE */}
      <section className="panel timeline">
        <Timeline label="Placed" date={order.createdAt} />
        <Timeline label="Approved" date={order.approvedAt} />
        <Timeline label="Shipped" date={order.shippedAt} />
        <Timeline label="Delivered" date={order.deliveredAt} />
      </section>

      <style jsx>{`
        .page {
          min-height: 100vh;
          background: #000;
          color: #fff;
          padding: clamp(1.2rem, 4vw, 2.5rem);
          max-width: 960px;
          margin: auto;
        }

        .header {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          margin-bottom: 1.6rem;
          gap: 1rem;
        }

        h1 {
          font-size: 1.4rem;
          font-weight: 700;
        }

        .sub {
          font-size: 0.85rem;
          color: #9ca3af;
        }

        .amountBox span {
          font-size: 1rem;
          color: #9ca3af;
        }

        .amountBox strong {
          font-size: 1.6rem;
          color: #22d3ee;
        }

        .panel {
          background: linear-gradient(180deg, #0d0f12, #07080a);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 18px;
          padding: 1.4rem;
          margin-bottom: 1rem;
          box-shadow: 0 10px 30px rgba(0,0,0,0.6);
        }

        .sectionTitle {
          font-size: 0.95rem;
          font-weight: 600;
          margin-bottom: 0.8rem;
        }

        .itemRow {
          display: flex;
          justify-content: space-between;
          padding: 0.6rem 0;
          border-bottom: 1px dashed rgba(255,255,255,0.08);
        }

        .itemRow:last-child {
          border-bottom: none;
        }

        .muted {
          font-size: 0.8rem;
          color: #9ca3af;
        }

        .price {
          font-size: 0.85rem;
          white-space: nowrap;
        }

        /* PAYMENT SUMMARY */
        .payment {
          background: radial-gradient(
            120% 120% at 50% 0%,
            #141414 0%,
            #0b0b0b 60%
          );
        }

        .payRow {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 0.9rem;
          color: #9ca3af;
          padding: 0.3rem 0;
        }

        .payRow span:last-child {
          font-weight: 500;
          color: #e5e7eb;
        }

        .divider {
          height: 1px;
          background: rgba(255,255,255,0.12);
          margin: 0.9rem 0;
        }

        .payRow.total {
          font-size: 1.1rem;
          font-weight: 700;
          color: #fff;
        }

        .payRow.total span:last-child {
          color: #22d3ee;
        }

        .timeline {
          display: grid;
          gap: 0.6rem;
        }

        @media (max-width: 640px) {
          .header {
            flex-direction: column;
            align-items: flex-start;
          }
        }
      `}</style>
    </main>
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
        {formatDate(date)}
      </span>
    </div>
  );
}
