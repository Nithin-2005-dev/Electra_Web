"use client";

export default function ActiveProductCard({ data }) {
  return (
    <div className="card">
      <h3>{data.productName}</h3>

      <p className="count">
        {data.total} active orders
      </p>

      <div className="meta">
        <strong>Sizes</strong>
        <ul>
          {Object.entries(data.sizes).map(([s, c]) => (
            <li key={s}>{s} × {c}</li>
          ))}
        </ul>
      </div>

      {data.printNames.length > 0 && (
        <div className="meta">
          <strong>Names to print</strong>
          <p className="names">
            {data.printNames.join(", ")}
          </p>
        </div>
      )}

      <style jsx>{`
        .card {
          background: #0b0f15;
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 14px;
          padding: 1rem;
        }

        h3 {
          margin-bottom: 0.4rem;
        }

        .count {
          color: #22d3ee;
          font-weight: 700;
        }

        .meta {
          margin-top: 0.6rem;
          font-size: 0.85rem;
          color: #cbd5f5;
        }

        ul {
          padding-left: 1rem;
        }

        .names {
          color: #9ca3af;
        }
      `}</style>
    </div>
  );
}
