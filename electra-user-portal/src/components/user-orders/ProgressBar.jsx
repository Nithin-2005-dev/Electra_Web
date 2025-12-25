"use client";

import {
  Package,
  CheckCircle,
  Truck,
  Home,
  XCircle,
} from "lucide-react";
import { deriveOrderStep } from "../../app/lib/orderStatus"

const STEPS = [
  { key: "placed", label: "Order Placed", icon: Package },
  { key: "confirmed", label: "Confirmed", icon: CheckCircle },
  { key: "shipped", label: "Shipped", icon: Truck },
  { key: "delivered", label: "Delivered", icon: Home },
];

const STEP_INDEX = {
  placed: 0,
  confirmed: 1,
  shipped: 2,
  delivered: 3,
};

export default function ProgressBar({ order }) {
  const { step, terminal } = deriveOrderStep(order);

  /* ───────── CANCELLED ───────── */
  if (step === "cancelled") {
    return (
      <div className="cancelled">
        <XCircle size={26} />
        <span>Order Cancelled</span>

        <style jsx>{`
          .cancelled {
            display: flex;
            align-items: center;
            gap: 0.6rem;
            padding: 1.1rem;
            border-radius: 14px;
            background: #140b0b;
            color: #f87171;
            font-weight: 600;
            border: 1px solid rgba(248,113,113,0.35);
          }
        `}</style>
      </div>
    );
  }

  const currentIndex = STEP_INDEX[step] ?? 0;
  const progressPct = (currentIndex / (STEPS.length - 1)) * 100;

  return (
    <div className="wrap">
      <div className="track">
        <div className="fill" style={{ width: `${progressPct}%` }} />
      </div>

      <div className="steps">
        {STEPS.map((s, i) => {
          const Icon = s.icon;

          const status =
            i < currentIndex
              ? "done"
              : i === currentIndex
              ? "active"
              : "pending";

          return (
            <div key={s.key} className={`step ${status}`}>
              <div className="icon">
                <Icon size={18} />
              </div>
              <span>{s.label}</span>
            </div>
          );
        })}
      </div>

      <style jsx>{`
        .wrap {
          position: relative;
          padding: 1.8rem 1rem 2rem;
          background: #0b0f15;
          border-radius: 18px;
          border: 1px solid rgba(255,255,255,0.08);
        }

        .track {
          position: absolute;
          top: 38px;
          left: 1.2rem;
          right: 1.2rem;
          height: 3px;
          background: rgba(255,255,255,0.12);
          border-radius: 999px;
          overflow: hidden;
        }

        .fill {
          height: 100%;
          background: linear-gradient(90deg,#22d3ee,#0ea5e9);
          box-shadow: 0 0 14px rgba(34,211,238,0.6);
          transition: width 0.45s ease;
        }

        .steps {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          position: relative;
          z-index: 2;
        }

        .step {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.45rem;
          text-align: center;
        }

        .icon {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          display: grid;
          place-items: center;
          background: #0b0f15;
          border: 2px solid rgba(255,255,255,0.2);
          color: #9ca3af;
        }

        .step span {
          font-size: 0.75rem;
          color: #9ca3af;
        }

        .step.done .icon {
          background: #22d3ee;
          color: #000;
          border-color: #22d3ee;
          box-shadow: 0 0 14px rgba(34,211,238,0.6);
        }

        .step.done span {
          color: #22d3ee;
          font-weight: 600;
        }

        .step.active .icon {
          border-color: #22d3ee;
          color: #22d3ee;
          box-shadow: 0 0 10px rgba(34,211,238,0.4);
        }

        .step.active span {
          color: #e5e7eb;
          font-weight: 600;
        }
      `}</style>
    </div>
  );
}
