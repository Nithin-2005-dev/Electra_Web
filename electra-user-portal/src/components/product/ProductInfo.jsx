"use client";

import { useState } from "react";
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

      const cartItem = {
        productId: product.productId, // guaranteed by you
        size,
        printName,
        printedName: printName ? printedName.trim() : null,
        quantity: 1,
        addedAt: serverTimestamp(),
      };

      // Firestore-safe cleanup
      Object.keys(cartItem).forEach(
        (k) => cartItem[k] === undefined && delete cartItem[k]
      );

      if (!snap.exists()) {
        await setDoc(userRef, {
          cart: {
            items: {
              [`${product.productId}_${size}`]: cartItem,
            },
            updatedAt: serverTimestamp(),
          },
        });
        return;
      }

      await updateDoc(userRef, {
        [`cart.items.${product.productId}_${size}`]: cartItem,
        "cart.updatedAt": serverTimestamp(),
      });
    } catch (err) {
      console.error("Add to cart failed:", err);
      alert("Failed to add to cart");
    } finally {
      setAdding(false);
    }
  };

  return (
    <section className="info">
      <h1 className="title">{product?.name}</h1>
      <div className="price">₹{product?.price}</div>

      {/* SIZE */}
      <div className="block">
        <div className="block-head">
          <span>Select Size</span>
          <button className="size-chart" onClick={onOpenSizeChart}>
            Size chart
          </button>
        </div>

        <div className="sizes">
          {["S", "M", "L", "XL"].map((s) => (
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
          <span>Print name on T-shirt (+₹50)</span>
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

      {/* ACTION BUTTONS */}
      <div className="actions">
        <button
          className="add-cart"
          disabled={!product?.available || !size || adding}
          onClick={addToCart}
        >
          {adding ? "Adding…" : "Add to Cart"}
        </button>

        <button
          className="buy"
          disabled={!product?.available || !size || buying}
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

      {/* DETAILS */}
      <div className="details">
        <h3>Product Details</h3>
        <ul>
          <li><strong>Fabric:</strong> {product?.material || "French Terry Loopknit Cotton"}</li>
          <li><strong>Fit:</strong> {product?.fit || "Oversized"}</li>
          <li><strong>GSM:</strong> {product?.gsm || 240}</li>
          <li><strong>Care:</strong> Cold wash, inside-out</li>
        </ul>
      </div>

      <style jsx>{`
        .info { display:flex; flex-direction:column; gap:1.4rem; }
        .title { font-size:2rem; font-weight:700; }
        .price { font-size:1.5rem; color:#22d3ee; font-weight:700; }

        .block { display:flex; flex-direction:column; gap:0.6rem; }
        .block-head { display:flex; justify-content:space-between; font-size:0.85rem; color:#9ca3af; }
        .size-chart { background:none; border:none; color:#9ca3af; text-decoration:underline; cursor:pointer; }

        .sizes { display:flex; gap:0.6rem; }
        .size-btn {
          padding:0.6rem 1rem;
          border-radius:10px;
          border:1px solid rgba(255,255,255,0.25);
          background:transparent;
          color:#fff;
          cursor:pointer;
        }
        .size-btn.active {
          background:#22d3ee;
          color:#000;
          font-weight:700;
        }

        .print-toggle { display:flex; gap:0.6rem; align-items:center; }
        .print-input {
          padding:0.65rem;
          border-radius:10px;
          background:#000;
          color:#fff;
          border:1px solid rgba(255,255,255,0.25);
        }

        .actions { display:flex; gap:0.8rem; }
        .add-cart {
          flex:1;
          padding:0.85rem;
          border-radius:14px;
          border:1px solid rgba(255,255,255,0.3);
          background:transparent;
          color:#fff;
          font-weight:700;
          cursor:pointer;
        }
        .buy {
          flex:1;
          padding:0.85rem;
          border-radius:14px;
          border:none;
          background:linear-gradient(180deg,#22d3ee,#0ea5e9);
          color:#000;
          font-weight:800;
          cursor:pointer;
        }
        button:disabled { opacity:0.5; cursor:not-allowed; }

        .out { color:#ef4444; font-size:0.85rem; }
        .details { border-top:1px solid rgba(255,255,255,0.1); padding-top:1.2rem; }
      `}</style>
    </section>
  );
}
