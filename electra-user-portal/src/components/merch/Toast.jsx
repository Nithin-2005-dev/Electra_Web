"use client";

import React from "react";

export default function Toasts({ toasts = [], onRemove }) {
  return (
    <div className="toast-root">
      {toasts.map((t) => (
        <div key={t.id} className={`toast ${t.type || "info"}`}>
          <div className="msg">{t.message}</div>
          <button className="close" onClick={() => onRemove(t.id)}>×</button>
        </div>
      ))}

      <style jsx>{`
        .toast-root {
          position: fixed;
          right: 1rem;
          top: 1rem;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          z-index: 9999;
        }

        .toast {
          background: rgba(255,255,255,0.06);
          color: #fff;
          padding: 0.6rem 0.8rem;
          border-radius: 8px;
          min-width: 200px;
          box-shadow: 0 6px 18px rgba(0,0,0,0.5);
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 0.5rem;
        }

        .toast.info { border-left: 4px solid #60a5fa; }
        .toast.success { border-left: 4px solid #34d399; }
        .toast.error { border-left: 4px solid #f87171; }

        .close {
          background: transparent;
          border: none;
          color: #fff;
          font-size: 16px;
          cursor: pointer;
        }

        .msg { flex: 1; }
      `}</style>
    </div>
  );
}
