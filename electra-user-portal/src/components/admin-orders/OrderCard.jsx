"use client";

import React from "react";

export default function OrderCard({ order, onApprove, onReject }) {
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
            {order.productName}
          </h3>
          <p className="text-slate-400 text-sm mt-0.5">
            Order ID:{" "}
            <span className="text-slate-300">{order.orderId}</span>
          </p>
        </div>

        <div className="text-right shrink-0">
          <div className="text-cyan-300 font-bold text-lg">
            ₹{order.totalAmountPaid ?? order.amount}
          </div>
          <div className="text-xs text-slate-400">
            Base ₹{order.amount}
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

      {/* ───── DIVIDER ───── */}
      <div className="my-4 h-px bg-white/10" />

      {/* ───── ORDER DETAILS ───── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-sm text-slate-400">
        <Detail label="User ID" value={order.userId} />
        <Detail label="Email" value={order.email || "—"} />
        <Detail label="Size" value={order.size || "—"} />
        <Detail
          label="Print Name"
          value={
            order.printName
              ? `Yes (${order.printedName})`
              : "No"
          }
        />
        <Detail
          label="Outside Campus"
          value={order.isOutsideCampus ? "Yes" : "No"}
        />
        <Detail
          label="Delivery Charge"
          value={`₹${order.deliveryCharge || 0}`}
        />
        <Detail
          label="Print Charge"
          value={`₹${order.printNameCharge || 0}`}
        />
        <Detail
          label="Txn ID"
          value={order.txnId || "—"}
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
