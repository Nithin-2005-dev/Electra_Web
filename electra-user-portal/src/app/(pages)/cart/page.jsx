"use client";

import { useState } from "react";

export default function ProductInfo({
  product,
  buying,
  onBuy,
  onOpenSizeChart,
}) {
  const [size, setSize] = useState("");
  const [printName, setPrintName] = useState(false);
  const [printedName, setPrintedName] = useState("");
  const [adding, setAdding] = useState(false);

  const canAdd =
    size &&
    (!printName || printedName.trim().length > 0) &&
    product?.available;

  const addToCart = async () => {
    if (!canAdd || adding) return;

    setAdding(true);

    // 🔒 ONLY PREPARE PAYLOAD HERE
    const cartPayload = {
      productId: product.productId,
      size,
      printName,
      printedName: printName ? printedName.trim() : null,
      quantity: 1,
    };

    console.log("ADD TO CART →", cartPayload);

    // 🔥 actual Firestore logic will live here later

    setAdding(false);
  };

  return (
    <section className="info">
      <h1>{product.name}</h1>
      <div className="price">₹{product.price}</div>

      {/* SIZE CHART */}
      <button className="size-chart" onClick={onOpenSizeChart}>
        Size Chart
      </button>

      {/* SIZE SELECT */}
      <div className="size-block">
        <p className="size-label">Select Size</p>

        <div className="size-grid">
          {["S", "M", "L", "XL"].map((s) => (
            <button
              key={s}
              type="button"
              className={`size-pill ${size === s ? "active" : ""}`}
              onClick={() => setSize(s)}
            >
              {s}
            </button>
          ))}
        </div>

        {!size && <p className="hint">Please select a size</p>}
      </div>

      {/* PRINT NAME */}
      <div className="print-block">
        <label className="print-toggle">
          <input
            type="checkbox"
            checked={printName}
            onChange={(e) => setPrintName(e.target.checked)}
          />
          Print name on T-shirt (+₹50)
        </label>

        {printName && (
          <input
            className="print-input"
            placeholder="Enter name to print"
            value={printedName}
            maxLength={12}
            onChange={(e) => setPrintedName(e.target.value)}
          />
        )}

        {printName && !printedName && (
          <p className="hint">Enter the name to be printed</p>
        )}
      </div>

      {/* BUY NOW (UNCHANGED) */}
      <button
        className="buy"
        disabled={!product.available || buying}
        onClick={onBuy}
      >
        {buying ? "Processing…" : "Buy It Now"}
      </button>

      {/* ADD TO CART */}
      <button
        className="add-cart"
        disabled={!canAdd || adding}
        onClick={addToCart}
      >
        {adding ? "Adding…" : "Add to Cart"}
      </button>

      {!product.available && <span className="out">Out of stock</span>}
    </section>
  );
}
