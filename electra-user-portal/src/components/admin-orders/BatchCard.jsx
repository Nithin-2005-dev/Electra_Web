"use client";

import React from "react";

export default function BatchCard({ productName, count, action, onAction }) {
  return (
    <div className="batch-card">
      {/* LEFT */}
      <div className="info">
        <h3 className="product">{productName}</h3>
        <p className="count">
          <strong>{count}</strong> orders
        </p>
      </div>

      {/* RIGHT */}
      <button
        className={`action-btn ${action === "Reject" ? "danger" : ""}`}
        onClick={onAction}
      >
        {action}
      </button>

      <style jsx>{`
        .batch-card {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 1rem;

          padding: 1rem 1.2rem;
          border-radius: 14px;

          background: #0b0f15;
          border: 1px solid rgba(255, 255, 255, 0.08);

          transition: transform 0.15s ease, box-shadow 0.15s ease,
            border-color 0.15s ease;
        }

        .batch-card:hover {
          transform: translateY(-1px);
          border-color: rgba(34, 211, 238, 0.4);
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.45);
        }

        /* INFO */
        .info {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .product {
          margin: 0;
          font-size: 0.95rem;
          font-weight: 600;
          color: #e5e7eb;
          line-height: 1.3;
        }

        .count {
          margin: 0;
          font-size: 0.8rem;
          color: #9ca3af;
        }

        .count strong {
          color: #22d3ee;
          font-weight: 700;
        }

        /* BUTTON */
        .action-btn {
          padding: 0.55rem 1rem;
          border-radius: 999px;

          border: 1px solid rgba(34, 211, 238, 0.4);
          background: rgba(34, 211, 238, 0.12);

          color: #22d3ee;
          font-size: 0.75rem;
          font-weight: 700;
          letter-spacing: 0.02em;

          cursor: pointer;
          transition: background 0.15s ease, transform 0.15s ease,
            box-shadow 0.15s ease;
        }

        .action-btn:hover {
          background: rgba(34, 211, 238, 0.22);
          box-shadow: 0 6px 18px rgba(34, 211, 238, 0.25);
          transform: translateY(-1px);
        }

        /* DANGER VARIANT */
        .action-btn.danger {
          border-color: rgba(248, 113, 113, 0.45);
          background: rgba(248, 113, 113, 0.12);
          color: #f87171;
        }

        .action-btn.danger:hover {
          background: rgba(248, 113, 113, 0.22);
          box-shadow: 0 6px 18px rgba(248, 113, 113, 0.3);
        }

        /* MOBILE */
        @media (max-width: 640px) {
          .batch-card {
            padding: 0.9rem;
          }

          .product {
            font-size: 0.9rem;
          }

          .action-btn {
            font-size: 0.7rem;
            padding: 0.5rem 0.9rem;
          }
        }
      `}</style>
    </div>
  );
}
