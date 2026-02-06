"use client";

import { useState, useEffect } from "react";
import { auth, db } from "../../app/lib/firebase";
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";
import { useRouter } from "next/navigation";

export default function ProductInfo({
  product,
  buying,
  onBuy,
  onOpenSizeChart,
  size,
  setSize,
  printName,
  setPrintName,
  printedName,
  setPrintedName,
}) {
  const router = useRouter();
  const [adding, setAdding] = useState(false);
  const [toast, setToast] = useState(false);

  /* ───────── AUTO HIDE TOAST ───────── */
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(false), 3200);
    return () => clearTimeout(t);
  }, [toast]);

  /* ───────── ADD TO CART ───────── */
  const addToCart = async () => {
    if (!product?.available || !size || adding) return;

    const user = auth.currentUser;
    if (!user) {
      router.push("/auth/sign-in");
      return;
    }
    if (printName && !printedName.trim()) {
      alert("Please enter the name to be printed");
      return;
    }

    try {
      setAdding(true);

      const userRef = doc(db, "users", user.uid);
      const snap = await getDoc(userRef);

      const cartKey = `${product.productId}_${size}_${printName ? printedName.trim() : "no-print"}`;

      const cartItem = {
        productId: product.productId,
        productName: product.name,
        price: product.price,
        image: product.imageMain || null,
        size,
        quantity: 1,
        printName,
        printedName: printName ? printedName.trim() : null,
        addedAt: serverTimestamp(),
      };

      Object.keys(cartItem).forEach(
        (k) => cartItem[k] === undefined && delete cartItem[k]
      );

      if (!snap.exists()) {
        await setDoc(userRef, {
          cart: {
            items: { [cartKey]: cartItem },
            updatedAt: serverTimestamp(),
          },
        });
      } else {
        await updateDoc(userRef, {
          [`cart.items.${cartKey}`]: cartItem,
          "cart.updatedAt": serverTimestamp(),
        });
      }

      setSize(null);
      setPrintName(false);
      setPrintedName("");
      setToast(true);
    } catch (err) {
      console.error("Add to cart failed:", err);
      alert("Failed to add to cart");
    } finally {
      setAdding(false);
    }
  };

  return (
    <>
      <section className="info">
        <h1 className="title">{product?.name}</h1>

        {product?.tagline && (
          <p className="tagline">{product.tagline}</p>
        )}

        <div className="price">₹{product?.price}</div>

        {product?.desc && (
          <div className="desc-block">
            <p>{product.desc}</p>
          </div>
        )}

        {/* SIZE */}
        <div className="block">
          <div className="block-head">
            <span>Select Size</span>
            <button className="size-chart" onClick={onOpenSizeChart}>
              Size chart
            </button>
          </div>

          <div className="sizes">
            {["XS","S", "M", "L", "XL","2XL","3XL"].map((s) => (
              <button
                key={s}
                type="button"
                className={`size-btn ${size === s ? "active" : ""}`}
                onClick={() => setSize(s)}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* PRINT NAME */}
        <div className="block">
          <label className="print-toggle">
            <input
              type="checkbox"
              checked={printName}
              onChange={() => setPrintName((p) => !p)}
            />
            <span>Print name on T-shirt (+₹40)</span>
          </label>

          {printName && (
            <input
              className="print-input"
              placeholder="Enter name to print"
              maxLength={12}
              value={printedName}
              onChange={(e) => setPrintedName(e.target.value)}
            />
          )}
        </div>

        {/* ACTIONS */}
        <div className="actions">
          <button
            className="add-cart"
            disabled={!product?.available || product.isComing || !size || adding}
            onClick={addToCart}
          >
            {adding ? "Adding…" : "Add to Cart"}
          </button>

          <button
            className="buy"
            disabled={!product?.available || product.isComing || !size || buying}
            onClick={() =>
              onBuy({
                size,
                printName,
                printedName: printName ? printedName.trim() : null,
              })
            }
          >
            {buying ? "Processing…" : "Buy It Now"}
          </button>
        </div>

        {!product?.available && <span className="out">Out of stock</span>}
      </section>

      {toast && (
        <div className="toast">
          <span>Added to cart</span>
          <button onClick={() => router.push("/cart")}>
            View cart →
          </button>
        </div>
      )}

      <style jsx>{`
        .info { 
          display: flex; 
          flex-direction: column; 
          gap: 1.4rem;
          width: 100%;
          max-width: 100%;
        }

        .title { 
          font-size: clamp(1.5rem, 4vw, 2rem);
          font-weight: 700;
          line-height: 1.2;
          word-wrap: break-word;
        }

        .tagline {
          color: #9ca3af;
          font-size: clamp(0.8rem, 2vw, 0.9rem);
          margin-top: -0.5rem;
          line-height: 1.4;
        }

        .price { 
          font-size: clamp(1.25rem, 3vw, 1.5rem);
          color: #22d3ee;
          font-weight: 700;
        }

        .desc-block {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          padding: clamp(0.6rem, 2vw, 0.8rem);
          border-radius: 10px;
          font-size: clamp(0.8rem, 2vw, 0.85rem);
          line-height: 1.6;
          color: #e5e7eb;
        }

        .block { 
          display: flex;
          flex-direction: column;
          gap: 0.6rem;
          width: 100%;
        }

        .block-head {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: clamp(0.8rem, 2vw, 0.85rem);
          color: #9ca3af;
          gap: 0.5rem;
        }

        .size-chart {
          background: none;
          border: none;
          color: #9ca3af;
          text-decoration: underline;
          cursor: pointer;
          font-size: clamp(0.75rem, 2vw, 0.85rem);
          padding: 0;
          white-space: nowrap;
        }

        .sizes { 
          display: flex;
          gap: clamp(0.4rem, 1.5vw, 0.6rem);
          flex-wrap: wrap;
          width: 100%;
        }

        .size-btn {
          padding: clamp(0.5rem, 2vw, 0.6rem) clamp(0.8rem, 2.5vw, 1rem);
          border-radius: 10px;
          border: 1px solid rgba(255,255,255,0.25);
          background: transparent;
          color: #fff;
          cursor: pointer;
          font-size: clamp(0.8rem, 2vw, 0.9rem);
          transition: all 0.2s ease;
          flex-shrink: 0;
          min-width: 44px;
          text-align: center;
        }

        .size-btn:hover {
          border-color: rgba(255,255,255,0.4);
        }

        .size-btn.active {
          background: #22d3ee;
          border-color: #22d3ee;
          color: #000;
          font-weight: 700;
        }

        .print-toggle {
          display: flex;
          gap: 0.6rem;
          align-items: center;
          cursor: pointer;
          font-size: clamp(0.8rem, 2vw, 0.9rem);
        }

        .print-toggle input[type="checkbox"] {
          width: 18px;
          height: 18px;
          cursor: pointer;
          flex-shrink: 0;
        }

        .print-input {
          padding: clamp(0.55rem, 2vw, 0.65rem);
          border-radius: 10px;
          background: #000;
          color: #fff;
          border: 1px solid rgba(255,255,255,0.25);
          font-size: clamp(0.85rem, 2vw, 0.95rem);
          width: 100%;
          transition: border-color 0.2s ease;
        }

        .print-input:focus {
          outline: none;
          border-color: #22d3ee;
        }

        .actions { 
          display: flex;
          gap: clamp(0.5rem, 2vw, 0.8rem);
          width: 100%;
          flex-wrap: wrap;
        }

        .add-cart {
          flex: 1;
          min-width: 140px;
          padding: clamp(0.75rem, 2vw, 0.85rem);
          border-radius: 14px;
          border: 1px solid rgba(255,255,255,0.3);
          background: transparent;
          color: #fff;
          font-weight: 700;
          font-size: clamp(0.85rem, 2vw, 0.95rem);
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .add-cart:hover:not(:disabled) {
          background: rgba(255,255,255,0.05);
          border-color: rgba(255,255,255,0.5);
        }

        .buy {
          flex: 1;
          min-width: 140px;
          padding: clamp(0.75rem, 2vw, 0.85rem);
          border-radius: 14px;
          border: none;
          background: linear-gradient(180deg,#22d3ee,#0ea5e9);
          color: #000;
          font-weight: 800;
          font-size: clamp(0.85rem, 2vw, 0.95rem);
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .buy:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(34, 211, 238, 0.3);
        }

        button:disabled { 
          opacity: 0.5;
          cursor: not-allowed;
        }

        .toast {
          position: fixed;
          bottom: 20px;
          left: 50%;
          transform: translateX(-50%);
          background: rgba(20, 20, 20, 0.85);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.18);
          color: #fff;
          padding: 0.75rem 1rem;
          border-radius: 999px;
          display: flex;
          align-items: center;
          gap: 0.75rem;
          max-width: calc(100vw - 32px);
          width: max-content;
          box-shadow: 0 18px 40px rgba(0, 0, 0, 0.7);
          z-index: 100;
          font-size: clamp(0.8rem, 2vw, 0.9rem);
          animation: slideUp 0.3s ease;
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translate(-50%, 20px);
          }
          to {
            opacity: 1;
            transform: translate(-50%, 0);
          }
        }

        .toast button {
          background: none;
          border: none;
          color: #22d3ee;
          font-weight: 600;
          cursor: pointer;
          white-space: nowrap;
          padding: 0;
          font-size: inherit;
        }

        .out { 
          color: #ef4444;
          font-size: clamp(0.8rem, 2vw, 0.85rem);
          font-weight: 600;
        }

        /* Tablet */
        @media (max-width: 768px) {
          .info {
            gap: 1.2rem;
          }

          .sizes {
            gap: 0.5rem;
          }

          .size-btn {
            min-width: 42px;
          }
        }

        /* Small Mobile */
        @media (max-width: 480px) {
          .info {
            gap: 1rem;
          }

          .actions {
            flex-direction: column;
          }

          .add-cart,
          .buy {
            width: 100%;
            min-width: unset;
          }

          .sizes {
            gap: 0.4rem;
          }

          .size-btn {
            padding: 0.5rem 0.7rem;
            min-width: 40px;
            font-size: 0.85rem;
          }
        }

        /* Very Small Mobile */
        @media (max-width: 375px) {
          .toast {
            flex-direction: column;
            gap: 0.4rem;
            border-radius: 16px;
            text-align: center;
            padding: 0.75rem 1rem;
          }

          .toast button {
            font-size: 0.85rem;
          }

          .sizes {
            gap: 0.35rem;
          }

          .size-btn {
            padding: 0.45rem 0.6rem;
            min-width: 38px;
            font-size: 0.8rem;
          }
        }

        /* Landscape Mobile */
        @media (max-width: 768px) and (orientation: landscape) {
          .info {
            gap: 0.8rem;
          }

          .actions {
            flex-direction: row;
          }

          .sizes {
            gap: 0.4rem;
          }
        }
      `}</style>
    </>
  );
}