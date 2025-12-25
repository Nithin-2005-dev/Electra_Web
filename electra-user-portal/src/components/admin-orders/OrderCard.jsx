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
      {/* Top row */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-white font-semibold text-lg leading-tight">
            {order.productName}
          </h3>
          <p className="text-slate-400 text-sm mt-0.5">
            Order ID: <span className="text-slate-300">{order.orderId}</span>
          </p>
        </div>

        <div className="text-right shrink-0">
          <span className="text-cyan-300 font-bold text-lg">
            ₹{order.amount}
          </span>
        </div>
      </div>

      {/* Divider */}
      <div className="my-4 h-px bg-white/10" />

      {/* Meta info */}
      <div className="grid gap-1 text-sm text-slate-400">
        <span>
          Email: <span className="text-slate-200">{order.email}</span>
        </span>

        {order.txnId && (
          <span>
            Txn ID: <span className="text-slate-200">{order.txnId}</span>
          </span>
        )}

        {order.paymentScreenshotUrl && (
          <a
            href={order.paymentScreenshotUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 text-cyan-300 hover:underline w-fit"
          >
            View payment screenshot →
          </a>
        )}
      </div>

      {/* Actions */}
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
          Approve
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
          Reject
        </button>
      </div>
    </div>
  );
}
