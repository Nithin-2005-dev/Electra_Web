"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useState } from "react";

export default function MerchCard({ product }) {
  const [hovered, setHovered] = useState(false);

  return (
    <Link href={`/gotyourmerch/${product.slug}`} className="link">
      <motion.div
        className="card"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        whileHover={{ scale: 1.03 }}
        transition={{ type: "spring", stiffness: 160, damping: 20 }}
      >
        {/* IMAGE */}
        <div className="imageWrap">
          <img
            src={hovered ? product.backImage : product.frontImage}
            alt={product.name}
          />
        </div>

        {/* TEXT */}
        <div className="info">
          <p className="name">{product.name}</p>
          <p className="price">{product.price}</p>
        </div>
      </motion.div>

      <style jsx>{`
        .link {
          text-decoration: none;
        }

        .card {
          max-width: 260px;
          margin: auto;
          cursor: pointer;
          color: var(--text-primary);
          border-radius: 12px;
          transition: box-shadow .16s ease, transform .12s ease;
        }

        .imageWrap {
          width: 100%;
          height: 320px;
          background: radial-gradient(
            circle at top,
            rgba(0,229,255,0.06),
            rgba(10,10,10,0.9)
          );
          border-radius: 16px;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        img {
          height: 100%;
          width: auto;
          object-fit: contain;
          transition: transform 0.4s ease;
        }

        .card:hover img {
          transform: scale(1.05);
        }

        .card:hover {
          box-shadow: 0 14px 40px rgba(0,0,0,0.6), 0 0 24px rgba(0,229,255,0.04);
        }

        .info {
          text-align: center;
          margin-top: 0.9rem;
        }

        .name {
          font-size: 0.95rem;
          font-weight: 500;
          letter-spacing: 0.04em;
          margin-bottom: 0.25rem;
          text-transform: uppercase;
          color: #cfd8e3;
        }

        .price {
          font-size: 0.85rem;
          color: #cfd8e3;
        }
      `}</style>
    </Link>
  );
}
