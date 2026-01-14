"use client";

import { useEffect, useState } from "react";

export default function ResourceHint() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const seen = localStorage.getItem("resources_hint_seen");
    if (!seen) {
      setShow(true);
      localStorage.setItem("resources_hint_seen", "true");
    }
  }, []);

  if (!show) return null;

  return (
    <div className="hint-wrap">
      <div className="hint">
        <span className="dot" />
        <p>
          Browse resources by semester and subject.
          <strong> Upload or manage your own</strong> from
          <span className="accent"> My Resources</span>.
        </p>

        <button
          className="hint-close"
          onClick={() => setShow(false)}
          aria-label="Dismiss"
        >
          ✕
        </button>
      </div>

      <style jsx>{`
        .hint-wrap {
          display: flex;
          justify-content: center;
          margin-top: -1.5rem;
          margin-bottom: 2rem;
          padding: 0 1rem;
        }

        .hint {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          padding: 0.55rem 0.9rem;
          border-radius: 999px;
          background: rgba(15, 23, 42, 0.6);
          border: 1px solid rgba(99, 102, 241, 0.35);
          backdrop-filter: blur(10px);
          font-size: 0.75rem;
          color: #c7d2fe;
          max-width: 100%;
        }

        .hint p {
          margin: 0;
          line-height: 1.4;
          white-space: nowrap;
        }

        .hint strong {
          font-weight: 500;
          color: #fff;
        }

        .accent {
          color: #67e8f9;
          margin-left: 0.25rem;
        }

        .dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #67e8f9;
          box-shadow: 0 0 8px #67e8f9;
        }

        .hint-close {
          background: transparent;
          border: none;
          color: #9ca3af;
          cursor: pointer;
          font-size: 0.75rem;
          padding-left: 0.4rem;
        }

        .hint-close:hover {
          color: #fff;
        }

        @media (max-width: 640px) {
          .hint p {
            white-space: normal;
          }
        }
      `}</style>
    </div>
  );
}
