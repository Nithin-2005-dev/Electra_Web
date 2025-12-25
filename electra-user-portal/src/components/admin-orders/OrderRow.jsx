"use client";

import React from "react";

export default function OrderRow({ order }) {
  return (
    <div className="order-row">
      {/* PRODUCT */}
      <div className="cell product">
        <span className="label">Product</span>
        <span className="value">{order.productName}</span>
      </div>

      {/* ORDER ID */}
      <div className="cell order-id">
        <span className="label">Order ID</span>
        <span className="value mono">{order.orderId}</span>
      </div>

      {/* AMOUNT */}
      <div className="cell amount">
        <span className="label">Amount</span>
        <span className="value price">₹{order.amount}</span>
      </div>

      <style jsx>{`
        .order-row {
          display: grid;
          grid-template-columns: 2fr 1.5fr 1fr;
          gap: 1rem;

          padding: 0.9rem 1.1rem;
          border-radius: 12px;

          background: #0b0f15;
          border: 1px solid rgba(255, 255, 255, 0.08);

          transition: background 0.15s ease,
            border-color 0.15s ease,
            transform 0.15s ease;
        }

        .order-row:hover {
          background: #0e141b;
          border-color: rgba(255, 255, 255, 0.14);
          transform: translateY(-1px);
        }

        /* CELL */
        .cell {
          display: flex;
          flex-direction: column;
          gap: 0.2rem;
          min-width: 0;
        }

        .label {
          font-size: 0.7rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: #9ca3af;
        }

        .value {
          font-size: 0.85rem;
          font-weight: 600;
          color: #e5e7eb;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .mono {
          font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
          font-size: 0.8rem;
          color: #cbd5f5;
        }

        .price {
          color: #22d3ee;
          font-weight: 700;
        }

        /* MOBILE */
        @media (max-width: 640px) {
          .order-row {
            grid-template-columns: 1fr;
            gap: 0.6rem;
          }

          .cell {
            flex-direction: row;
            justify-content: space-between;
            align-items: center;
          }

          .label {
            font-size: 0.65rem;
          }

          .value {
            max-width: 65%;
            text-align: right;
          }
        }
      `}</style>
    </div>
  );
}
