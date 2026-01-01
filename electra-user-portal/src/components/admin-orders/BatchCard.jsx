"use client";

import React, { useMemo, useState } from "react";
import * as XLSX from "xlsx";

export default function BatchCard({
  productId,
  productName,
  orders = [],
  action,
  onAction,
}) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(null); // "export" | "action" | null

  /* ───────── NORMALIZE ITEMS ───────── */
  const items = useMemo(() => {
    return orders
      .filter((i) => i.productId === productId)
      .map((i) => ({
        ...i,
        quantity: Number(i.quantity ?? 1),
      }));
  }, [orders, productId]);

  /* ───────── COUNTS ───────── */
  const totalProducts = useMemo(
    () => items.reduce((s, i) => s + i.quantity, 0),
    [items]
  );

  const totalOrders = useMemo(
    () => new Set(items.map((i) => i.orderId)).size,
    [items]
  );

  /* ───────── EXPORT ───────── */
  const exportToExcel = async () => {
    if (!items.length || loading) return;
    setLoading("export");

    try {
      const rows = items.map((i) => ({
        Order_ID: i.orderId,
        Product: productName,
        Size: i.size,
        Qty: i.quantity,
        Amount: (i.price || 0) * i.quantity,
        Print: i.printName ? i.printedName : "",
        Status: i.paymentStatus,
      }));

      const ws = XLSX.utils.json_to_sheet(rows);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(
        wb,
        ws,
        productName.slice(0, 31)
      );
      XLSX.writeFile(
        wb,
        `${productName.replace(/\s+/g, "_")}_BATCH.xlsx`
      );
    } finally {
      setLoading(null);
    }
  };

  const handleAction = async () => {
    if (loading) return;
    setLoading("action");
    try {
      await onAction?.();
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="batch-wrapper">
      {/* ───────── SUMMARY CARD ───────── */}
      <div
        className={`batch-card ${open ? "active" : ""}`}
        onClick={() => setOpen((v) => !v)}
      >
        <div className="info">
          <h3 className="product">{productName}</h3>
          <p className="count">
            <strong>{totalOrders}</strong> orders ·{" "}
            <strong>{totalProducts}</strong> T-shirts
          </p>
        </div>

        <div className="actions" onClick={(e) => e.stopPropagation()}>
          <button
            className={`export-btn ${
              loading === "export" ? "loading" : ""
            }`}
            onClick={exportToExcel}
            disabled={!items.length || loading}
            aria-busy={loading === "export"}
          >
            Export Excel
          </button>

          {action && (
            <button
              className={`action-btn ${
                loading === "action" ? "loading" : ""
              }`}
              onClick={handleAction}
              disabled={loading}
              aria-busy={loading === "action"}
            >
              {action}
            </button>
          )}
        </div>
      </div>

      {/* ───────── DROPDOWN ───────── */}
      {open && (
        <div className="dropdown">
          <div className="dropdown-inner">
            {items.map((i, idx) => (
              <div key={idx} className="order-row">
                <div className="left">
                  <div className="order-id">#{i.orderId}</div>
                  <div className="meta">
                    Size {i.size || "—"} · Qty {i.quantity}
                    {i.printName && <> · Print: {i.printedName}</>}
                  </div>
                </div>

                <div className="right">
                  <div className="price">
                    ₹{(i.price || 0) * i.quantity}
                  </div>
                  <div className="status">{i.paymentStatus}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ───────── STYLES ───────── */}
      <style jsx>{`
        .batch-wrapper {
          margin-bottom: 1.4rem;
        }

        .batch-card {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 1rem;
          padding: 1.05rem 1.3rem;
          border-radius: 16px;
          background: linear-gradient(
            180deg,
            rgba(18, 22, 30, 0.98),
            rgba(10, 12, 18, 0.98)
          );
          border: 1px solid rgba(255,255,255,0.14);
          cursor: pointer;
          position: relative;
        }

        .batch-card.active {
          border-color: rgba(34,211,238,0.5);
          box-shadow: 0 0 0 1px rgba(34,211,238,0.25);
        }

        .batch-card::before {
          content: "";
          position: absolute;
          left: 0;
          top: 12px;
          bottom: 12px;
          width: 4px;
          border-radius: 4px;
          background: linear-gradient(180deg, #22d3ee, transparent);
          opacity: 0.7;
        }

        .product {
          margin: 0;
          font-size: 0.95rem;
          font-weight: 700;
          color: #f9fafb;
        }

        .count {
          font-size: 0.78rem;
          color: #9ca3af;
        }

        .count strong {
          color: #22d3ee;
        }

        .actions {
          display: flex;
          gap: 0.5rem;
          flex-shrink: 0;
        }

        .export-btn,
        .action-btn {
          position: relative;
          padding: 0.5rem 0.95rem;
          border-radius: 999px;
          border: 1px solid rgba(255,255,255,0.3);
          background: rgba(255,255,255,0.1);
          color: #e5e7eb;
          font-size: 0.72rem;
          cursor: pointer;
          white-space: nowrap;
          display: inline-flex;
          align-items: center;
          justify-content: center;
        }

        .export-btn:disabled,
        .action-btn:disabled {
          opacity: 0.55;
          cursor: not-allowed;
        }

        /* ───── BUTTON LOADING ───── */
        .export-btn.loading::after,
        .action-btn.loading::after {
          content: "";
          width: 13px;
          height: 13px;
          margin-left: 8px;
          border-radius: 50%;
          border: 2px solid currentColor;
          border-top-color: transparent;
          animation: spin 0.8s linear infinite;
        }

        /* ───────── DROPDOWN ───────── */
        .dropdown {
          margin-top: 0.55rem;
          border-radius: 14px;
          background: linear-gradient(
            180deg,
            rgba(7, 10, 15, 0.98),
            rgba(4, 6, 9, 0.98)
          );
          border: 1px solid rgba(255,255,255,0.1);
        }

        .dropdown-inner {
          border-left: 3px solid rgba(34,211,238,0.45);
        }

        .order-row {
          display: flex;
          justify-content: space-between;
          gap: 1rem;
          padding: 0.75rem 1rem;
          border-top: 1px solid rgba(255,255,255,0.08);
        }

        .order-row:first-child {
          border-top: none;
        }

        .order-id {
          font-size: 0.78rem;
          font-weight: 600;
          color: #e5e7eb;
        }

        .meta {
          font-size: 0.68rem;
          color: #9ca3af;
          margin-top: 0.15rem;
        }

        .price {
          font-size: 0.8rem;
          font-weight: 600;
          color: #22d3ee;
        }

        .status {
          font-size: 0.65rem;
          color: #9ca3af;
          text-transform: capitalize;
          margin-top: 0.15rem;
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }

        /* ───────── MOBILE ───────── */
        @media (max-width: 640px) {
          .batch-card {
            flex-direction: column;
            align-items: flex-start;
            gap: 0.7rem;
          }

          .actions {
            width: 100%;
            justify-content: flex-end;
          }

          .order-row {
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  );
}
