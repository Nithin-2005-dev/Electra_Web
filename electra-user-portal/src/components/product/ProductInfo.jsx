"use client";

import { useState, useEffect } from "react";
import { auth, db } from "../../app/lib/firebase";
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  serverTimestamp,
} from "firebase/firestore";
import { useRouter } from "next/navigation";
import { logMerchEvent } from "../../app/lib/merchAnalytics";
import { useSignInRequiredPopup } from "../../app/lib/useSignInRequiredPopup";
import SignInRequiredPopup from "../auth/SignInRequiredPopup";

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
  const { open, secondsLeft, requireSignIn, goToSignIn, popupTitle, popupMessage } = useSignInRequiredPopup(router);
  const [adding, setAdding] = useState(false);
  const [toast, setToast] = useState("");
  const [sizeError, setSizeError] = useState("");
  const [nameError, setNameError] = useState("");
  const [notifyLoading, setNotifyLoading] = useState(false);
  const [subscribed, setSubscribed] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  /* ───────── AUTO HIDE TOAST ───────── */
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(""), 3200);
    return () => clearTimeout(t);
  }, [toast]);

  useEffect(() => {
    const unsub = auth.onAuthStateChanged((u) => {
      if (!u) {
        setSubscribed(false);
        setCartCount(0);
        return;
      }
      const list = product?.interestedUsers || [];
      setSubscribed(Array.isArray(list) && list.includes(u.uid));
    });
    return () => unsub();
  }, [product?.interestedUsers]);

  useEffect(() => {
    let cancelled = false;
    const loadCartState = async () => {
      const user = auth.currentUser;
      if (!user || !product?.productId) {
        setCartCount(0);
        return;
      }
      try {
        const snap = await getDoc(doc(db, "users", user.uid));
        const cartItems = snap.data()?.cart?.items || {};
        const count = Object.values(cartItems).reduce(
          (s, i) => s + (Number(i?.quantity) || 0),
          0
        );
        if (!cancelled) setCartCount(count);
      } catch {
        if (!cancelled) setCartCount(0);
      }
    };

    loadCartState();
    return () => {
      cancelled = true;
    };
  }, [product?.productId]);

  /* ───────── ADD TO CART ───────── */
  const addToCart = async () => {
    if (!product?.available || !size || adding) return;

    const user = auth.currentUser;
    if (!user) {
      requireSignIn({
        title: "Sign in to add this item",
        message: "Your selection is linked to your account so we can save your cart and checkout details.",
      });
      return;
    }
    if (printName && !printedName.trim()) {
      setNameError("Please enter the name to be printed.");
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

      logMerchEvent("add_to_cart_success", {
        productId: product.productId,
        meta: {
          size,
          printName,
          printedName: printName ? printedName.trim() : null,
        },
      });

      setSize(null);
      setPrintName(false);
      setPrintedName("");
      setToast("Added to cart");
      setSizeError("");
      setNameError("");
      setCartCount((c) => Math.max(1, c + 1));
    } catch (err) {
      console.error("Add to cart failed:", err);
      logMerchEvent("add_to_cart_failed", {
        productId: product?.productId,
      });
      alert("Failed to add to cart");
    } finally {
      setAdding(false);
    }
  };

  return (
    <>
      <SignInRequiredPopup open={open} secondsLeft={secondsLeft} onContinue={goToSignIn} title={popupTitle} message={popupMessage} />
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
                onClick={() => {
                  setSize(s);
                  if (sizeError) setSizeError("");
                }}
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
              onChange={(e) => {
                setPrintedName(e.target.value);
                if (nameError) setNameError("");
              }}
            />
          )}
        </div>

        {/* ACTIONS / NOTIFY */}
        {!product?.available || product.isComing ? (
          <div className="actions">
            <button
              className="notify"
              disabled={notifyLoading}
              onClick={async () => {
                if (notifyLoading) return;
                const user = auth.currentUser;
                if (!user) {
                  setToast("Please sign in to get notified");
                  return;
                }
                if (!product?.productId) return;
                try {
                  setNotifyLoading(true);
                  const ref = doc(db, "products", product.productId);
                  if (subscribed) {
                    await updateDoc(ref, {
                      interestedUsers: arrayRemove(user.uid),
                    });
                    setSubscribed(false);
                    setToast("Unsubscribed");
                  } else {
                    await updateDoc(ref, {
                      interestedUsers: arrayUnion(user.uid),
                    });
                    setSubscribed(true);
                    setToast("You'll be notified");
                  }
                } finally {
                  setNotifyLoading(false);
                }
              }}
            >
              {subscribed ? "SUBSCRIBED ✓" : "NOTIFY ME"}
            </button>
          </div>
        ) : (
          <div className="actions">
            <button
              className="add-cart"
              disabled={product?.available === false || product.isComing || adding}
              onClick={() => {
                const attemptMeta = {
                  sizeSelected: !!size,
                  printName,
                  nameValid: !printName || !!printedName.trim(),
                  isLoggedIn: !!auth.currentUser,
                };

                if (!size) {
                  logMerchEvent("add_to_cart_attempt", {
                    productId: product?.productId,
                    meta: { ...attemptMeta, status: "missing_size" },
                  });
                  setSizeError("Please select a size before continuing.");
                  return;
                }
                if (printName && !printedName.trim()) {
                  logMerchEvent("add_to_cart_attempt", {
                    productId: product?.productId,
                    meta: { ...attemptMeta, status: "missing_print_name" },
                  });
                  setNameError("Please enter the name to be printed.");
                  return;
                }
                setSizeError("");
                setNameError("");
                logMerchEvent("add_to_cart_attempt", {
                  productId: product?.productId,
                  meta: { ...attemptMeta, status: "submitted" },
                });
                addToCart();
              }}
            >
              {adding ? "Adding…" : "Add to Cart"}
            </button>

            <button
              className="buy"
              disabled={product?.available === false || product.isComing || buying}
              onClick={() => {
                if (!size) {
                  setSizeError("Please select a size before continuing.");
                  return;
                }
                if (printName && !printedName.trim()) {
                  setNameError("Please enter the name to be printed.");
                  return;
                }
                setSizeError("");
                setNameError("");
                onBuy({
                  size,
                  printName,
                  printedName: printName ? printedName.trim() : null,
                });
              }}
            >
              {buying ? "Processing…" : "Buy It Now"}
            </button>
          </div>
        )}

        {sizeError && (
          <div className="size-error">
            <span className="dot" />
            <span>{sizeError}</span>
          </div>
        )}

        {nameError && (
          <div className="size-error">
            <span className="dot" />
            <span>{nameError}</span>
          </div>
        )}

        {!product?.available && <span className="out">Out of stock</span>}
      </section>

      {toast && (
        <div className="toast">
          <span>{toast}</span>
          {toast === "Added to cart" && (
            <button onClick={() => router.push("/cart")}>
              View cart →
            </button>
          )}
        </div>
      )}

      {cartCount > 0 && (
        <button
          className="cart-fab"
          onClick={() => router.push("/cart")}
          aria-label="Open cart"
          title="Open cart"
        >
          <span className="cart-emoji" aria-hidden="true">
            🛒
          </span>
          <span className="cart-badge" aria-hidden="true">
            {cartCount}
          </span>
        </button>
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

        .cart-fab {
          position: fixed;
          right: 18px;
          bottom: 18px;
          width: 58px;
          height: 58px;
          border-radius: 999px;
          background:
            radial-gradient(120% 120% at 20% 15%, rgba(255,255,255,0.35) 0%, rgba(255,255,255,0) 45%),
            linear-gradient(180deg, #1b1f26 0%, #13161b 55%, #0b0d11 100%);
          border: 1px solid rgba(255, 255, 255, 0.12);
          box-shadow:
            0 16px 34px rgba(0, 0, 0, 0.65),
            inset 0 1px 0 rgba(255,255,255,0.18),
            inset 0 -10px 18px rgba(0,0,0,0.55),
            0 0 18px rgba(148, 163, 184, 0.35);
          cursor: pointer;
          z-index: 200;
          display: grid;
          place-items: center;
          transition: transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease;
          animation: floaty 3.2s ease-in-out infinite;
        }

        .cart-fab:hover {
          transform: translateY(-4px) scale(1.03);
          border-color: rgba(148, 163, 184, 0.6);
          box-shadow:
            0 22px 44px rgba(0, 0, 0, 0.75),
            inset 0 1px 0 rgba(255,255,255,0.35),
            inset 0 -10px 18px rgba(0,0,0,0.65),
            0 0 28px rgba(148, 163, 184, 0.45);
        }

        .cart-emoji {
          font-size: 1.18rem;
          line-height: 1;
          display: block;
          filter: drop-shadow(0 2px 6px rgba(0,0,0,0.55));
          transform: translateY(1px);
        }

        .cart-badge {
          position: absolute;
          top: -4px;
          right: -4px;
          min-width: 18px;
          height: 18px;
          padding: 0 5px;
          border-radius: 999px;
          background: #111827;
          color: #e5e7eb;
          font-size: 0.65rem;
          font-weight: 700;
          display: grid;
          place-items: center;
          border: 1px solid rgba(255, 255, 255, 0.2);
          box-shadow: 0 6px 14px rgba(0,0,0,0.5);
        }

        @keyframes floaty {
          0% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-4px);
          }
          100% {
            transform: translateY(0);
          }
        }

        .out { 
          color: #ef4444;
          font-size: clamp(0.8rem, 2vw, 0.85rem);
          font-weight: 600;
        }

        .size-error {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 0.75rem;
          border-radius: 999px;
          border: 1px solid rgba(248, 113, 113, 0.35);
          background: rgba(248, 113, 113, 0.08);
          color: #fca5a5;
          font-size: clamp(0.78rem, 2vw, 0.85rem);
          font-weight: 600;
          width: fit-content;
        }

        .size-error .dot {
          width: 8px;
          height: 8px;
          border-radius: 999px;
          background: #f87171;
          box-shadow: 0 0 10px rgba(248, 113, 113, 0.6);
        }

        .notify {
          width: 100%;
          padding: clamp(0.75rem, 2vw, 0.85rem);
          border-radius: 999px;
          background: transparent;
          border: 1px solid rgba(255,255,255,0.35);
          color: #fff;
          font-weight: 700;
          font-size: clamp(0.85rem, 2vw, 0.95rem);
          letter-spacing: 0.12em;
          cursor: pointer;
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

