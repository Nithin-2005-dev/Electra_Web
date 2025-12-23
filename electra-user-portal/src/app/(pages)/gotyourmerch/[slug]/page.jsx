"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import ProductGallery from "../../../../components/ProductGallery";

const PRODUCT = {
  name: "POTTER",
  price: "₹1,190",
  originalPrice: "₹2,990",
  discount: "-60%",
  images: [
    "https://spankersindia.com/cdn/shop/files/front_nbg.png?v=1764075361&width=990",
    "https://spankersindia.com/cdn/shop/files/29.jpg?v=1765529242&width=990",
    "https://spankersindia.com/cdn/shop/files/28.jpg?v=1765529242&width=990",
  ],
  specs: [
    ["Fabric", "100% French Terry Loopknit Cotton"],
    ["Fit", "Oversized Fit"],
    ["GSM", "240 GSM"],
    ["Print", "HD Silicon Puff, Screen"],
    ["Colour", "Chocolate Brown"],
    ["Design", "Potter"],
  ],
};

const RELATED = [
  PRODUCT.images[0],
  PRODUCT.images[1],
  PRODUCT.images[2],
];

export default function ProductPage() {
  const [showSizeChart, setShowSizeChart] = useState(false);

  return (
    <>
      <motion.section
        className="page"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        {/* MAIN GRID */}
        <div className="productGrid">
          {/* LEFT */}
          <div className="left">
            <ProductGallery images={PRODUCT.images} />
          </div>

          {/* RIGHT */}
          <div className="right">
            <h1>{PRODUCT.name}</h1>

            <div className="price">
              <span className="old">{PRODUCT.originalPrice}</span>
              <span className="new">{PRODUCT.price}</span>
              <span className="discount">{PRODUCT.discount}</span>
            </div>

            <button className="sizeChart" onClick={() => setShowSizeChart(true)}>
              Size Chart
            </button>

            <div className="sizes">
              {["XS", "S", "M", "L", "XL", "2XL"].map((s) => (
                <button key={s}>{s}</button>
              ))}
            </div>

            
            <button className="buy">BUY NOW</button>
          </div>
        </div>

        {/* DETAILS */}
        <div className="details">
          <h2>Product Details</h2>

          <div className="specTable">
            {PRODUCT.specs.map(([k, v]) => (
              <div key={k} className="row">
                <span>{k}</span>
                <span>{v}</span>
              </div>
            ))}
          </div>
        </div>

        {/* RELATED */}
        
      </motion.section>

      {/* SIZE CHART MODAL */}
      {showSizeChart && (
        <div className="overlay" onClick={() => setShowSizeChart(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <img src="/size-chart.png" alt="Size chart" />
            <button onClick={() => setShowSizeChart(false)}>✕</button>
          </div>
        </div>
      )}

      <style jsx>{`
        .page {
          background: linear-gradient(180deg, #0c121a, #090d13);
          color: #e6eef5;
          padding: 4rem 3rem 6rem;
        }

        /* GRID */
        .productGrid {
          display: grid;
          grid-template-columns: 1.1fr 0.9fr;
          gap: 4rem;
          align-items: center;
        }

        .left {
          max-width: 520px;
        }

        .right h1 {
          font-size: 2.6rem;
          margin-bottom: 1rem;
        }

        .price {
          display: flex;
          gap: 1rem;
          margin-bottom: 1.5rem;
        }

        .old {
          text-decoration: line-through;
          opacity: 0.4;
        }

        .new {
          font-size: 1.6rem;
        }

        .discount {
          border: 1px solid #ff4d4d;
          color: #ff4d4d;
          padding: 0.2rem 0.6rem;
          font-size: 0.75rem;
          border-radius: 6px;
        }

        .sizeChart {
          background: none;
          border: none;
          color: #4cc9f0;
          cursor: pointer;
          margin-bottom: 1rem;
        }

        .sizes {
          display: flex;
          gap: 0.6rem;
          margin-bottom: 2rem;
        }

        .sizes button {
          width: 46px;
          height: 42px;
          background: transparent;
          border: 1px solid rgba(255,255,255,0.3);
          color: #fff;
        }

        .cart {
          width: 100%;
          padding: 1rem;
          background: transparent;
          border: 1px solid rgba(255,255,255,0.6);
          color: #fff;
          margin-bottom: 1rem;
        }

        .buy {
          width: 100%;
          padding: 1rem;
          background: #fff;
          color: #000;
          border: none;
        }

        /* DETAILS */
        .details {
          margin: 2rem;
        }

        .details h2 {
          margin-bottom: 1.5rem;
          letter-spacing: 0.12em;
          text-transform: uppercase;
        }

        .specTable {
          border-top: 1px solid rgba(255,255,255,0.08);
        }

        .row {
          display: grid;
          grid-template-columns: 1fr 2fr;
          padding: 1rem 0;
          border-bottom: 1px solid rgba(255,255,255,0.08);
        }

        .row span:first-child {
          color: #8fa3b8;
          text-transform: uppercase;
          font-size: 0.8rem;
        }

        /* RELATED */
        .related {
          margin-top: 5rem;
        }

        .relatedGrid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.5rem;
        }

        .relatedGrid img {
          width: 100%;
          border-radius: 10px;
        }

        /* MODAL */
        .overlay {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.7);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 999;
        }

        .modal {
          position: relative;
          background: #0a0f16;
          padding: 1rem;
          border-radius: 12px;
        }

        .modal img {
          max-width: 90vw;
          max-height: 80vh;
        }

        .modal button {
          position: absolute;
          top: 8px;
          right: 10px;
          background: none;
          border: none;
          color: #fff;
          font-size: 1.2rem;
        }

        /* MOBILE */
        @media (max-width: 900px) {
          .productGrid {
            grid-template-columns: 1fr;
          }

          .relatedGrid {
            grid-template-columns: 1fr 1fr;
          }
        }
      `}</style>
    </>
  );
}
