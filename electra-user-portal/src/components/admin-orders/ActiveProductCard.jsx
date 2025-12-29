"use client";

import { useMemo } from "react";

export default function ActiveProductCard({ data }) {
  const { productName, items = [] } = data;

  /* ───────── DERIVED DATA ───────── */

  const total = useMemo(
    () => items.reduce((sum, i) => sum + (i.quantity || 1), 0),
    [items]
  );

  const sizes = useMemo(() => {
    const map = {};
    for (const i of items) {
      if (!i.size) continue;
      map[i.size] = (map[i.size] || 0) + (i.quantity || 1);
    }
    return map;
  }, [items]);

  const printNames = useMemo(() => {
    return items
      .filter((i) => i.printName && i.printedName)
      .map((i) => i.printedName);
  }, [items]);

  /* ───────── UI ───────── */

  return (
    <div className="card">
      <h3>{productName}</h3>

      <p className="count">{total} active items</p>

      {Object.keys(sizes).length > 0 && (
        <div className="meta">
          <strong>Sizes</strong>
          <ul>
            {Object.entries(sizes).map(([s, c]) => (
              <li key={s}>
                {s} × {c}
              </li>
            ))}
          </ul>
        </div>
      )}

      {printNames.length > 0 && (
        <div className="meta">
          <strong>Names to print</strong>
          <p className="names">{printNames.join(", ")}</p>
        </div>
      )}

      <style jsx>{`
        .card {
          background: #0b0f15;
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 14px;
          padding: 1rem;
        }

        h3 {
          margin-bottom: 0.4rem;
          font-size: 1rem;
          font-weight: 600;
        }

        .count {
          color: #22d3ee;
          font-weight: 700;
          font-size: 0.9rem;
        }

        .meta {
          margin-top: 0.6rem;
          font-size: 0.85rem;
          color: #cbd5f5;
        }

        ul {
          padding-left: 1rem;
          margin: 0.3rem 0 0;
        }

        li {
          font-size: 0.8rem;
          line-height: 1.3;
        }

        .names {
          color: #9ca3af;
          margin-top: 0.2rem;
          font-size: 0.8rem;
        }
      `}</style>
    </div>
  );
}
