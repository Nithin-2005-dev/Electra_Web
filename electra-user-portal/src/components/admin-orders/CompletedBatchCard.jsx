"use client";

import { useMemo, useState } from "react";

export default function CompletedBatchCard({
  productId,
  productName,
  orders = [], // item-level rows
}) {
  const [open, setOpen] = useState(false);

  /* ───────── GROUP BY ORDER ───────── */
  const grouped = useMemo(() => {
    const map = {};
    for (const i of orders) {
      if (!map[i.orderId]) {
        map[i.orderId] = {
          orderId: i.orderId,
          customer: i.deliveryAddress,
          items: [],
          deliveryCharge: i.deliveryCharge || 0,
          printNameCharge: i.printName ? 50 : 0,
          totalAmountPaid: i.totalAmountPaid || 0,
        };
      }
      map[i.orderId].items.push(i);
    }
    return Object.values(map);
  }, [orders]);

  const totalQty = orders.reduce(
    (s, i) => s + (i.quantity || 1),
    0
  );

  return (
    <div className="completed-wrapper">
      {/* SUMMARY */}
      <div
        className={`completed-card ${open ? "open" : ""}`}
        onClick={() => setOpen((v) => !v)}
      >
        <div>
          <h3>{productName}</h3>
          <p>
            <strong>{grouped.length}</strong> orders ·{" "}
            <strong>{totalQty}</strong> items
          </p>
        </div>

        <span className="badge">Delivered</span>
      </div>

      {/* DROPDOWN */}
      {open && (
        <div className="dropdown">
          {grouped.map((o) => (
            <div key={o.orderId} className="order-block">
              {/* ORDER HEADER */}
              <div className="order-head">
                <div>
                  <div className="order-id">
                    Order #{o.orderId}
                  </div>
                  <div className="meta">
                    {o.customer?.fullName || "—"} ·{" "}
                    {o.customer?.phone || "—"}
                  </div>
                </div>

                <div className="paid">
                  ₹{o.totalAmountPaid}
                </div>
              </div>

              {/* ITEMS */}
              {o.items.map((i, idx) => (
                <div key={idx} className="item-row">
                  <div className="meta">
                    {i.productName} · Size {i.size || "—"} · Qty{" "}
                    {i.quantity}
                    {i.printName &&
                      ` · Printed: ${i.printedName}`}
                  </div>

                  <div className="price">
                    ₹{(i.price || 0) * i.quantity}
                  </div>
                </div>
              ))}

              {/* CHARGES */}
              <div className="charges">
                {o.printNameCharge ? (
                  <div>
                    Name print
                    <span>₹{o.printNameCharge}</span>
                  </div>
                ) : null}

                {o.deliveryCharge ? (
                  <div>
                    Delivery
                    <span>₹{o.deliveryCharge}</span>
                  </div>
                ) : null}
              </div>
            </div>
          ))}
        </div>
      )}

      <style jsx>{`
        .completed-wrapper {
          margin-bottom: 1.2rem;
        }

        .completed-card {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem 1.3rem;
          border-radius: 16px;
          background: linear-gradient(
            180deg,
            rgba(12, 20, 16, 0.95),
            rgba(6, 12, 9, 0.95)
          );
          border: 1px solid rgba(34, 197, 94, 0.3);
          cursor: pointer;
        }

        .completed-card h3 {
          margin: 0;
          font-size: 0.95rem;
          font-weight: 700;
        }

        .completed-card p {
          font-size: 0.75rem;
          color: #9ca3af;
        }

        .badge {
          font-size: 0.7rem;
          padding: 0.3rem 0.7rem;
          border-radius: 999px;
          background: rgba(34, 197, 94, 0.15);
          color: #4ade80;
          border: 1px solid rgba(34, 197, 94, 0.35);
        }

        .dropdown {
          margin-top: 0.5rem;
          border-radius: 14px;
          background: #020906;
          border: 1px solid rgba(34, 197, 94, 0.25);
          overflow: hidden;
        }

        .order-block {
          padding: 0.9rem 1rem;
          border-top: 1px solid rgba(255, 255, 255, 0.08);
        }

        .order-block:first-child {
          border-top: none;
        }

        .order-head {
          display: flex;
          justify-content: space-between;
          margin-bottom: 0.4rem;
        }

        .order-id {
          font-size: 0.75rem;
          font-weight: 700;
        }

        .paid {
          font-size: 0.8rem;
          font-weight: 700;
          color: #4ade80;
        }

        .item-row {
          display: flex;
          justify-content: space-between;
          font-size: 0.65rem;
          color: #9ca3af;
          margin-top: 0.2rem;
        }

        .charges {
          margin-top: 0.4rem;
          font-size: 0.65rem;
          color: #9ca3af;
        }

        .charges div {
          display: flex;
          justify-content: space-between;
        }

        @media (max-width: 640px) {
          .item-row,
          .order-head {
            flex-direction: column;
          }

          .paid {
            margin-top: 0.2rem;
          }
        }
      `}</style>
    </div>
  );
}
