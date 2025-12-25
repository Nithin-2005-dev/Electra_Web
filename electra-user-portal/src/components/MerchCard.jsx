"use client";

import Link from "next/link";
import { cloudinaryUrl } from "../app/lib/cloudinary";

export default function MerchCard({ product }) {
  const disabled = !product.available;
  const Wrapper = disabled ? "div" : Link;

  return (
    <Wrapper
      href={disabled ? undefined : `/gotyourmerch/${product.id}`}
      className={`link ${disabled ? "disabled-link" : ""}`}
    >
      <div className={`card ${disabled ? "disabled" : ""}`}>
        {/* IMAGE STAGE */}
        <div className="imageWrap">
          {disabled && <span className="sold">SOLD OUT</span>}

          <img
            src={cloudinaryUrl(product.imageMain, "q_auto,f_auto,w_900/")}
            alt={product.name}
            loading="lazy"
          />

          <div className="imageGlow" />
        </div>

        {/* INFO */}
        <div className="info">
          <p className="name">{product.name}</p>
          <p className="price">₹{product.price}</p>
        </div>
      </div>

      <style jsx>{`
        /* ───────── LINK ───────── */
        .link {
          text-decoration: none;
          display: block;
        }

        .disabled-link {
          pointer-events: none;
        }

        /* ───────── CARD ───────── */
        .card {
          border-radius: 26px;
          padding: 1rem;

          background: linear-gradient(
            180deg,
            #0e1111,
            #070808
          );

          box-shadow:
            0 10px 20px rgba(0, 0, 0, 0.6),
            0 30px 70px rgba(0, 0, 0, 0.85),
            inset 0 1px 0 rgba(255, 255, 255, 0.05);

          transform: translateY(18px) scale(0.97);
          opacity: 0;

          animation: cardEnter 0.65s ease-out forwards;
          transition:
            transform 0.35s ease,
            box-shadow 0.35s ease;
        }

        /* HOVER (ONLY IF AVAILABLE) */
        .card:not(.disabled):hover {
          transform: translateY(-6px) scale(1.03);
          box-shadow:
            0 18px 40px rgba(0, 0, 0, 0.75),
            0 60px 140px rgba(0, 0, 0, 0.95),
            inset 0 1px 0 rgba(255, 255, 255, 0.08);
        }

        .card.disabled {
          opacity: 0.45;
          filter: grayscale(0.25);
        }

        /* ───────── IMAGE STAGE ───────── */
        .imageWrap {
          position: relative;
          width: 100%;
          aspect-ratio: 1 / 1.25;
          border-radius: 20px;

          background: radial-gradient(
            120% 90% at 50% 0%,
            #1a1f1f,
            #060707
          );

          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        img {
          max-width: 82%;
          max-height: 82%;
          object-fit: contain;

          filter:
            drop-shadow(0 20px 35px rgba(0, 0, 0, 0.7))
            drop-shadow(0 6px 12px rgba(0, 0, 0, 0.8));

          transition: transform 0.45s ease;
        }

        .card:not(.disabled):hover img {
          transform: scale(1.06);
        }

        /* LUXURY GLOW */
        .imageGlow {
          position: absolute;
          inset: 0;
          background: radial-gradient(
            circle at center,
            rgba(0, 229, 255, 0.045),
            transparent 60%
          );
          pointer-events: none;
        }

        /* ───────── SOLD OUT TAG ───────── */
        .sold {
          position: absolute;
          top: 14px;
          left: 14px;
          z-index: 3;

          background: rgba(10, 10, 10, 0.85);
          border: 1px solid rgba(255, 255, 255, 0.18);
          backdrop-filter: blur(8px);

          color: #f9fafb;
          font-size: 0.65rem;
          letter-spacing: 0.22em;
          padding: 0.45rem 0.8rem;
          border-radius: 999px;
        }

        /* ───────── INFO ───────── */
        .info {
          text-align: center;
          padding: 1.1rem 0.3rem 0.4rem;
        }

        .name {
          font-size: 0.85rem;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: #e5e7eb;
          margin-bottom: 0.35rem;
        }

        .price {
          font-size: 0.75rem;
          color: #9ca3af;
          letter-spacing: 0.14em;
        }

        /* ───────── ENTRANCE ANIMATION ───────── */
        @keyframes cardEnter {
          to {
            transform: translateY(0) scale(1);
            opacity: 1;
          }
        }
      `}</style>
    </Wrapper>
  );
}
