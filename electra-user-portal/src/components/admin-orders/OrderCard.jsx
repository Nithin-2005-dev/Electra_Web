"use client";

import React, { useMemo, useState } from "react";

export default function OrderCard({ order, onApprove, onReject }) {
  const [loadingAction, setLoadingAction] = useState(null);

  /* ───────── NORMALIZE ITEMS ───────── */
  const items = useMemo(() => {
    if (Array.isArray(order.items) && order.items.length) {
      return order.items.map((i) => ({
        ...i,
        quantity: Number(i.quantity ?? 1),
      }));
    }

    return [
      {
        productId: order.productId,
        productName: order.productName,
        size: order.size,
        quantity: 1,
        printName: order.printName,
        printedName: order.printedName,
        price: order.amount,
      },
    ];
  }, [order]);

  /* ───────── TOTALS ───────── */
  const baseTotal = items.reduce(
    (s, i) => s + (i.price || 0) * i.quantity,
    0
  );

  const printTotal = items.reduce(
    (s, i) => s + (i.printName ? 40 * i.quantity : 0),
    0
  );

  const finalAmount =
    order.totalAmountPaid ??
    baseTotal + printTotal + (order.deliveryCharge || 0);

  /* ───────── ACTIONS ───────── */
  const handleApprove = async () => {
    if (loadingAction) return;
    setLoadingAction("approve");
    await onApprove(order.orderId);
  };

  const handleReject = async () => {
    if (loadingAction) return;
    setLoadingAction("reject");
    await onReject(order.orderId);
  };

  return (
    <div
      className={`order-card relative rounded-2xl bg-[#0b0f15]/90 backdrop-blur p-5 transition`}
    >
      {/* ───── HEADER ───── */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-white font-semibold text-lg leading-tight">
            {items.length === 1
              ? items[0].productName
              : `${items.length} items`}
          </h3>
          <p className="text-slate-400 text-sm mt-0.5">
            Order ID:{" "}
            <span className="text-slate-300">{order.orderId}</span>
          </p>
        </div>

        <div className="text-right shrink-0">
          <div className="text-cyan-300 font-bold text-lg">
            ₹{finalAmount}
          </div>
          <div className="text-xs text-slate-400">
            Base ₹{baseTotal}
          </div>
        </div>
      </div>

      {/* ───── STATUS ───── */}
      <div className="mt-3 flex flex-wrap gap-2">
        <StatusPill
          label={`Payment: ${order.paymentStatus}`}
          tone={
            order.paymentStatus === "confirmed"
              ? "green"
              : order.paymentStatus === "rejected"
              ? "red"
              : "yellow"
          }
        />
        <StatusPill
          label={`Fulfillment: ${order.fulfillmentStatus ?? "placed"}`}
          tone="blue"
        />
      </div>

      {/* ───── ITEMS ───── */}
      <div className="my-4 space-y-2">
        {items.map((i, idx) => (
          <div
            key={idx}
            className="rounded-lg border border-white/20 bg-black/30 px-3 py-2 text-sm"
          >
            <div className="flex justify-between">
              <span className="text-slate-200 font-medium">
                {i.productName}
              </span>
              <span className="text-slate-400">
                × {i.quantity}
              </span>
            </div>
            <div className="text-slate-400 text-xs mt-0.5">
              Size: {i.size || "—"}
              {i.printName && <> · Print: {i.printedName}</>}
            </div>
          </div>
        ))}
      </div>

      {/* ───── DETAILS ───── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-sm text-slate-400">
        <Detail label="User ID" value={order.userId} />
        <Detail label="Txn ID" value={order.txnId || "—"} />
        <Detail label="Print Charge" value={`₹${printTotal}`} />
        <Detail
          label="Delivery Charge"
          value={`₹${order.deliveryCharge || 0}`}
        />
      </div>

      {/* ───── ACTIONS ───── */}
      <div className="mt-5 flex gap-3 flex-wrap">
        <button
          onClick={handleApprove}
          disabled={loadingAction !== null}
          aria-busy={loadingAction === "approve"}
          className={`action-btn px-4 py-2 rounded-lg font-semibold transition
            bg-cyan-500/15 text-cyan-300 border border-cyan-400/40
            hover:bg-cyan-500/25
            ${loadingAction === "approve" ? "loading" : ""}
          `}
        >
          Approve Payment
        </button>

        <button
          onClick={handleReject}
          disabled={loadingAction !== null}
          aria-busy={loadingAction === "reject"}
          className={`action-btn px-4 py-2 rounded-lg font-semibold transition
            bg-red-500/10 text-red-400 border border-red-500/40
            hover:bg-red-500/20
            ${loadingAction === "reject" ? "loading" : ""}
          `}
        >
          Reject Payment
        </button>
      </div>

      {/* ───── LOCAL STYLES ───── */}
      <style jsx>{`
        .order-card {
          margin-bottom: 1.75rem;
          border: 1px solid rgba(255, 255, 255, 0.22);
          box-shadow:
            0 0 0 1px rgba(255,255,255,0.04),
            0 20px 60px rgba(0,0,0,0.65);
        }

        .order-card::after {
          content: "";
          position: absolute;
          inset: 0;
          border-radius: inherit;
          pointer-events: none;
          box-shadow: inset 0 0 0 1px rgba(34,211,238,0.08);
        }

        .action-btn {
          position: relative;
          display: inline-flex;
          align-items: center;
          justify-content: center;
        }

        .action-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .action-btn.loading::after {
          content: "";
          width: 14px;
          height: 14px;
          margin-left: 8px;
          border-radius: 50%;
          border: 2px solid currentColor;
          border-top-color: transparent;
          animation: spin 0.8s linear infinite;
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
}

/* ───────── HELPERS ───────── */

function Detail({ label, value }) {
  return (
    <span>
      {label}: <span className="text-slate-200">{value}</span>
    </span>
  );
}

function StatusPill({ label, tone }) {
  const tones = {
    green:
      "bg-emerald-500/15 text-emerald-300 border border-emerald-400/30",
    red:
      "bg-red-500/15 text-red-400 border border-red-500/30",
    yellow:
      "bg-yellow-500/15 text-yellow-300 border border-yellow-400/30",
    blue:
      "bg-cyan-500/15 text-cyan-300 border border-cyan-400/30",
  };

  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-semibold ${tones[tone]}`}
    >
      {label}
    </span>
  );
}
