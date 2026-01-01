"use client";

import React, { useMemo } from "react";

export default function OrderCard({ order, onApprove, onReject }) {
  /* ───────── NORMALIZE ITEMS ───────── */
  const items = useMemo(() => {
    if (Array.isArray(order.items) && order.items.length) {
      return order.items.map((i) => ({
        ...i,
        quantity: Number(i.quantity ?? 1),
      }));
    }

    // Legacy / Buy-now fallback
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
    (s, i) => s + (i.printName ? 50 * i.quantity : 0),
    0
  );

  const finalAmount =
    order.totalAmountPaid ??
    baseTotal + printTotal + (order.deliveryCharge || 0);

  return (
    <div
      className="
        relative rounded-2xl
        border border-white/10
        bg-[#0b0f15]/90
        backdrop-blur
        p-5
        shadow-[0_20px_60px_rgba(0,0,0,.6)]
        transition
        hover:border-cyan-400/30
      "
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

      {/* ───── STATUS PILLS ───── */}
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

      {/* ───── ITEMS LIST ───── */}
      <div className="my-4 space-y-2">
        {items.map((i, idx) => (
          <div
            key={idx}
            className="rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm"
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
              {i.printName && (
                <> · Print: {i.printedName}</>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* ───── ORDER DETAILS ───── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-sm text-slate-400">
        <Detail label="User ID" value={order.userId} />
        <Detail label="Txn ID" value={order.txnId || "—"} />
        <Detail
          label="Print Charge"
          value={`₹${printTotal}`}
        />
        <Detail
          label="Delivery Charge"
          value={`₹${order.deliveryCharge || 0}`}
        />
      </div>

      {/* ───── ADDRESS ───── */}
      {order.isOutsideCampus && order.deliveryAddress && (
        <div className="mt-4 rounded-xl border border-white/10 bg-black/30 p-3">
          <p className="text-xs text-slate-400 mb-1">
            Delivery Address
          </p>
          <p className="text-sm text-slate-200 leading-relaxed">
            {order.deliveryAddress.fullName}
            <br />
            {order.deliveryAddress.addressLine}
            <br />
            {order.deliveryAddress.city} –{" "}
            {order.deliveryAddress.pincode}
            <br />
            📞 {order.deliveryAddress.phone}
          </p>
        </div>
      )}

      {/* ───── PAYMENT SCREENSHOT ───── */}
      {order.paymentScreenshotUrl && (
        <a
          href={order.paymentScreenshotUrl}
          target="_blank"
          rel="noreferrer"
          className="
            inline-flex items-center gap-2
            mt-4
            text-cyan-300
            text-sm
            hover:underline
          "
        >
          View payment screenshot →
        </a>
      )}

      {/* ───── ACTIONS ───── */}
      <div className="mt-5 flex flex-wrap gap-3">
        <button
          onClick={() => onApprove(order.orderId)}
          className="
            px-4 py-2 rounded-lg
            bg-cyan-500/15
            text-cyan-300
            font-semibold
            border border-cyan-400/30
            hover:bg-cyan-500/25
            transition
          "
        >
          Approve Payment
        </button>

        <button
          onClick={() => onReject(order.orderId)}
          className="
            px-4 py-2 rounded-lg
            bg-red-500/10
            text-red-400
            font-semibold
            border border-red-500/30
            hover:bg-red-500/20
            transition
          "
        >
          Reject Payment
        </button>
      </div>
    </div>
  );
}

/* ───────────────── HELPERS ───────────────── */

function Detail({ label, value }) {
  return (
    <span>
      {label}:{" "}
      <span className="text-slate-200">{value}</span>
    </span>
  );
}

function StatusPill({ label, tone }) {
  const tones = {
    green: "bg-emerald-500/15 text-emerald-300 border-emerald-400/30",
    red: "bg-red-500/15 text-red-400 border-red-500/30",
    yellow: "bg-yellow-500/15 text-yellow-300 border-yellow-400/30",
    blue: "bg-cyan-500/15 text-cyan-300 border-cyan-400/30",
  };

  return (
    <span
      className={`
        px-3 py-1 rounded-full text-xs font-semibold
        border ${tones[tone]}
      `}
    >
      {label}
    </span>
  );
}
