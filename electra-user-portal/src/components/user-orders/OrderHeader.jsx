"use client";

export default function OrderHeader({ order }) {
  const statusColor = {
    placed: "#60a5fa",
    confirmed: "#22d3ee",
    shipped: "#fbbf24",
    delivered: "#22c55e",
  }[order.status] || "#9ca3af";

  const statusLabel = {
    placed: "Order Placed",
    confirmed: "Confirmed",
    shipped: "Shipped",
    delivered: "Delivered",
  }[order.status] || "Processing";

  return (
    <section className="oh-wrap">
      {/* LEFT */}
      <div className="oh-left">
        <p className="oh-order">Order #{order.orderId}</p>
        <h1 className="oh-product">{order.productName}</h1>

        <div className="oh-status">
          <span
            className="oh-dot"
            style={{ background: statusColor }}
          />
          <span className="oh-status-text">{statusLabel}</span>
        </div>
      </div>

      {/* RIGHT */}
      <div className="oh-right">
        <div className="oh-amount">₹{order.amount}</div>
        <div className="oh-payment">
          Payment: <strong>{order.paymentStatus}</strong>
        </div>
      </div>

      <style jsx>{`
        .oh-wrap {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 1.2rem;
          padding: 1.4rem;
          background: linear-gradient(
            180deg,
            #0b0f15,
            #070b10
          );
          border-radius: 18px;
          border: 1px solid rgba(255,255,255,0.08);
          margin-bottom: 1.4rem;
        }

        .oh-left {
          min-width: 0;
        }

        .oh-order {
          font-size: 0.8rem;
          color: #9ca3af;
          margin-bottom: 0.25rem;
        }

        .oh-product {
          font-size: clamp(1.2rem, 3vw, 1.6rem);
          font-weight: 800;
          color: #fff;
          line-height: 1.2;
          margin-bottom: 0.5rem;
        }

        .oh-status {
          display: inline-flex;
          align-items: center;
          gap: 0.45rem;
          font-size: 0.85rem;
          font-weight: 600;
          color: #e5e7eb;
        }

        .oh-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          box-shadow: 0 0 10px currentColor;
        }

        .oh-right {
          text-align: right;
          flex-shrink: 0;
        }

        .oh-amount {
          font-size: 1.4rem;
          font-weight: 800;
          color: #22d3ee;
        }

        .oh-payment {
          font-size: 0.8rem;
          color: #9ca3af;
          margin-top: 0.2rem;
        }

        /* MOBILE */
        @media (max-width: 640px) {
          .oh-wrap {
            flex-direction: column;
            align-items: flex-start;
          }

          .oh-right {
            text-align: left;
          }
        }
      `}</style>
    </section>
  );
}
