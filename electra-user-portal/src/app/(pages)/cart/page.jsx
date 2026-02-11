"use client";

import { useEffect, useState } from "react";
import { auth, db } from "../../lib/firebase";
import {
  doc,
  getDoc,
  updateDoc,
  setDoc,
  serverTimestamp,
  deleteField,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/navigation";
import { nanoid } from "nanoid";
import { cloudinaryImage } from "../../lib/cloudinary";
import { useSignInRequiredPopup } from "../../lib/useSignInRequiredPopup";
import SignInRequiredPopup from "../../../components/auth/SignInRequiredPopup";

export default function CartPage() {
  const router = useRouter();
  const { open, secondsLeft, requireSignIn, goToSignIn, popupTitle, popupMessage } = useSignInRequiredPopup(router);

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [selected, setSelected] = useState({});
  const [checkoutError, setCheckoutError] = useState("");

  /* ───────── LOAD CART ───────── */
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        requireSignIn({
          title: "Sign in to view your cart",
          message: "Your cart is saved to your account so you can continue shopping across sessions.",
        });
        setLoading(false);
        return;
      }

      const snap = await getDoc(doc(db, "users", user.uid));
      const cartItems = snap.data()?.cart?.items || {};
      const itemsArr = Object.entries(cartItems).map(([key, value]) => ({
        key,
        ...value,
      }));

      const uniqueProductIds = Array.from(
        new Set(itemsArr.map((i) => i.productId).filter(Boolean))
      );
      const productSnaps = await Promise.all(
        uniqueProductIds.map((id) => getDoc(doc(db, "products", id)))
      );
      const productMap = productSnaps.reduce((acc, s, idx) => {
        acc[uniqueProductIds[idx]] = s.exists() ? s.data() : {};
        return acc;
      }, {});

      const merged = itemsArr.map((i) => {
        const meta = productMap[i.productId] || {};
        return {
          ...i,
          available: meta.available,
          isComing: meta.isComing,
        };
      });

      setItems(merged);
      setSelected(
        merged.reduce((acc, i) => {
          const blocked = i.available === false || i.isComing;
          acc[i.key] = !blocked;
          return acc;
        }, {})
      );
      setLoading(false);
    });

    return () => unsub();
  }, [router, requireSignIn]);

  /* ───────── UPDATE QTY ───────── */
  const updateQty = async (key, qty) => {
    if (qty < 1) return;

    setItems((prev) =>
      prev.map((i) => (i.key === key ? { ...i, quantity: qty } : i))
    );

    await updateDoc(doc(db, "users", auth.currentUser.uid), {
      [`cart.items.${key}.quantity`]: qty,
      "cart.updatedAt": serverTimestamp(),
    });
  };

  /* ───────── REMOVE ITEM ───────── */
  const removeItem = async (key) => {
    setItems((prev) => prev.filter((i) => i.key !== key));
    setSelected((prev) => {
      const next = { ...prev };
      delete next[key];
      return next;
    });
    setCheckoutError("");

    await updateDoc(doc(db, "users", auth.currentUser.uid), {
      [`cart.items.${key}`]: deleteField(),
      "cart.updatedAt": serverTimestamp(),
    });
  };

  const updateCartItemKey = async (key, nextSize, nextPrintedName) => {
    const userId = auth.currentUser.uid;
    const userRef = doc(db, "users", userId);
    const snap = await getDoc(userRef);
    const cartItems = snap.data()?.cart?.items || {};
    const current = cartItems[key];
    if (!current) return;

    const printName = !!current.printName;
    const safeName = printName ? (nextPrintedName || "").trim() : "";
    const nextKey = `${current.productId}_${nextSize}_${printName ? safeName : "no-print"}`;

    if (nextKey === key) {
      setCheckoutError("");
      return;
    }

    const existing = cartItems[nextKey];

    const updatedItem = {
      ...current,
      size: nextSize,
      printedName: printName ? safeName : null,
    };

    // merge if same product+size+name exists
    if (existing) {
      const mergedQty =
        (Number(existing.quantity) || 0) + (Number(current.quantity) || 0);

      await updateDoc(userRef, {
        [`cart.items.${nextKey}`]: {
          ...existing,
          ...updatedItem,
          quantity: mergedQty,
        },
        [`cart.items.${key}`]: deleteField(),
        "cart.updatedAt": serverTimestamp(),
      });

      setItems((prev) =>
        prev
          .filter((i) => i.key !== key)
          .map((i) =>
            i.key === nextKey
              ? { ...i, ...updatedItem, quantity: mergedQty }
              : i
          )
      );
    } else {
      await updateDoc(userRef, {
        [`cart.items.${nextKey}`]: updatedItem,
        [`cart.items.${key}`]: deleteField(),
        "cart.updatedAt": serverTimestamp(),
      });

      setItems((prev) =>
        prev.map((i) =>
          i.key === key ? { ...updatedItem, key: nextKey } : i
        )
      );
    }

    setSelected((prev) => {
      const next = { ...prev };
      const wasSelected = !!next[key];
      delete next[key];
      next[nextKey] = wasSelected;
      return next;
    });
    setCheckoutError("");
  };

  const updatePrintToggle = async (key, nextPrintName) => {
    const userId = auth.currentUser.uid;
    const userRef = doc(db, "users", userId);
    const snap = await getDoc(userRef);
    const cartItems = snap.data()?.cart?.items || {};
    const current = cartItems[key];
    if (!current) return;

    const safeName = (current.printedName || "").trim();
    const nextKey = `${current.productId}_${current.size}_${
      nextPrintName ? safeName || "" : "no-print"
    }`;

    const updatedItem = {
      ...current,
      printName: nextPrintName,
      printedName: nextPrintName ? safeName : null,
    };

    if (nextKey === key) {
      await updateDoc(userRef, {
        [`cart.items.${key}`]: updatedItem,
        "cart.updatedAt": serverTimestamp(),
      });
      setItems((prev) =>
        prev.map((i) => (i.key === key ? { ...updatedItem, key } : i))
      );
      setCheckoutError("");
      return;
    }

    const existing = cartItems[nextKey];
    if (existing) {
      const mergedQty =
        (Number(existing.quantity) || 0) + (Number(current.quantity) || 0);
      await updateDoc(userRef, {
        [`cart.items.${nextKey}`]: {
          ...existing,
          ...updatedItem,
          quantity: mergedQty,
        },
        [`cart.items.${key}`]: deleteField(),
        "cart.updatedAt": serverTimestamp(),
      });

      setItems((prev) =>
        prev
          .filter((i) => i.key !== key)
          .map((i) =>
            i.key === nextKey
              ? { ...i, ...updatedItem, quantity: mergedQty }
              : i
          )
      );
    } else {
      await updateDoc(userRef, {
        [`cart.items.${nextKey}`]: updatedItem,
        [`cart.items.${key}`]: deleteField(),
        "cart.updatedAt": serverTimestamp(),
      });

      setItems((prev) =>
        prev.map((i) =>
          i.key === key ? { ...updatedItem, key: nextKey } : i
        )
      );
    }

    setSelected((prev) => {
      const next = { ...prev };
      const wasSelected = !!next[key];
      delete next[key];
      next[nextKey] = wasSelected;
      return next;
    });
    setCheckoutError("");
  };

  /* ───────── TOTALS ───────── */
  const selectedItems = items.filter((i) => selected[i.key]);

  const baseTotal = selectedItems.reduce(
    (s, i) => s + (typeof i.price === "number" ? i.price * i.quantity : 0),
    0
  );

  const printTotal = selectedItems.reduce(
    (s, i) => s + (i.printName ? 40 * i.quantity : 0),
    0
  );

  const grandTotal = baseTotal + printTotal;

  /* ───────── CHECKOUT ───────── */
  const proceedToCheckout = async () => {
    if (!selectedItems.length || processing) return;
    const blocked = selectedItems.find(
      (i) => i.available === false || i.isComing
    );
    if (blocked) {
      setCheckoutError("Some selected items are unavailable. Unselect them to continue.");
      return;
    }
    const invalid = selectedItems.find(
      (i) => i.printName && !String(i.printedName || "").trim()
    );
    if (invalid) {
      setCheckoutError("Please add the printed name for selected items.");
      return;
    }

    setProcessing(true);
    setCheckoutError("");

    const orderId = `ORD-${nanoid(6).toUpperCase()}`;

    await setDoc(doc(db, "orders", orderId), {
      orderId,
      userId: auth.currentUser.uid,
      items: selectedItems,
      amount: baseTotal,
      printNameCharge: printTotal,
      paymentStatus: "pending_payment",
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    const toDelete = selectedItems.reduce((acc, i) => {
      acc[`cart.items.${i.key}`] = deleteField();
      return acc;
    }, {});
    await updateDoc(doc(db, "users", auth.currentUser.uid), {
      ...toDelete,
      "cart.updatedAt": serverTimestamp(),
    });

    router.push(`/checkout/${orderId}`);
  };

  /* ───────── LOADING UI ───────── */
  if (loading) {
    return (
      <main className="state">
        <SignInRequiredPopup open={open} secondsLeft={secondsLeft} onContinue={goToSignIn} title={popupTitle} message={popupMessage} />
        <div className="skeleton-card" />
        <div className="skeleton-card" />
        <div className="skeleton-card" />

        <style jsx>{`
          .state {
            max-width: 900px;
            margin: auto;
            padding: 2rem;
            display: grid;
            gap: 1rem;
          }
          .skeleton-card {
            height: 120px;
            border-radius: 18px;
            background: linear-gradient(
              90deg,
              #111 25%,
              #1a1a1a 37%,
              #111 63%
            );
            background-size: 400% 100%;
            animation: shimmer 1.4s infinite;
          }
          @keyframes shimmer {
            to {
              background-position: -400% 0;
            }
          }
        `}</style>
      </main>
    );
  }

  /* ───────── EMPTY CART UI ───────── */
  if (!items.length) {
    return (
      <main className="empty">
        <SignInRequiredPopup open={open} secondsLeft={secondsLeft} onContinue={goToSignIn} title={popupTitle} message={popupMessage} />
        <div className="empty-card">
          <div className="icon">🛒</div>
          <h2>Your cart is empty</h2>
          <p>Add something you actually want to wear.</p>
          <button onClick={() => router.push("/getyourmerch")}>
            Explore merch
          </button>
        </div>

        <style jsx>{`
          .empty {
            min-height: 70vh;
            display: grid;
            place-items: center;
            padding: 2rem;
            color: #fff;
          }
          .empty-card {
            text-align: center;
            padding: 3rem 2.5rem;
            background: linear-gradient(180deg, #121212, #0b0b0b);
            border-radius: 24px;
            box-shadow: 0 20px 50px rgba(0,0,0,0.55);
          }
          .icon {
            font-size: 2.6rem;
            margin-bottom: 1rem;
          }
          h2 {
            font-size: 1.25rem;
            margin-bottom: 0.4rem;
          }
          p {
            font-size: 0.85rem;
            color: #9ca3af;
            margin-bottom: 1.6rem;
          }
          button {
            padding: 0.9rem 1.8rem;
            border-radius: 999px;
            background: #fff;
            color: #000;
            font-weight: 600;
            border: none;
            cursor: pointer;
          }
        `}</style>
      </main>
    );
  }

  /* ───────── MAIN CART UI ───────── */
  return (
    <main className="cart">
      <SignInRequiredPopup open={open} secondsLeft={secondsLeft} onContinue={goToSignIn} title={popupTitle} message={popupMessage} />
    {/* ───────── CART HEADER / FLOW ───────── */}
<header className="cartHeader">
  <div>
    <h1>Your Cart</h1>
    <p>{items.length} item{items.length !== 1 ? "s" : ""}</p>
  </div>

  <button
    className="continue"
    onClick={() => router.push("/getyourmerch")}
  >
    ← Continue shopping
  </button>
</header>

      <section className="items">
        {items.map((item) => (
          <div key={item.key} className="item">
            <label className="select">
              <input
                type="checkbox"
                checked={!!selected[item.key]}
                disabled={item.available === false || item.isComing}
                onChange={(e) =>
                  setSelected((prev) => ({
                    ...prev,
                    [item.key]: e.target.checked,
                  }))
                }
              />
            </label>
            <img src={cloudinaryImage(item.image, "q_auto,f_auto,w_200/")} />

            <div className="meta">
              <h3>{item.productName}</h3>
              {(item.available === false || item.isComing) && (
                <span className="badge warn">
                  {item.isComing ? "Coming soon" : "Unavailable"}
                </span>
              )}
              <div className="row-inline">
                <span className="muted">Size</span>
                <select
                  className="size-edit"
                  value={item.size}
                  onChange={(e) =>
                    updateCartItemKey(item.key, e.target.value, item.printedName)
                  }
                >
                  {["XS","S", "M", "L", "XL","2XL","3XL"].map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>

              {item.printName && (
                <div className="row-inline">
                  <span className="muted">Printed name</span>
                  <input
                    className="name-edit"
                    value={item.printedName || ""}
                    maxLength={12}
                    onChange={(e) => {
                      setItems((prev) =>
                        prev.map((i) =>
                          i.key === item.key
                            ? { ...i, printedName: e.target.value }
                            : i
                        )
                      );
                      if (checkoutError) setCheckoutError("");
                    }}
                    onBlur={(e) =>
                      updateCartItemKey(item.key, item.size, e.target.value)
                    }
                  />
                </div>
              )}

              <div className="row-inline">
                {item.printName ? (
                  <button
                    className="name-action remove"
                    onClick={() => updatePrintToggle(item.key, false)}
                  >
                    Remove name
                  </button>
                ) : (
                  <button
                    className="name-action add"
                    onClick={() => updatePrintToggle(item.key, true)}
                  >
                    Add name (+₹40)
                  </button>
                )}
              </div>

              <div className="qty">
                <button onClick={() => updateQty(item.key, item.quantity - 1)}>
                  –
                </button>
                <span>{item.quantity}</span>
                <button onClick={() => updateQty(item.key, item.quantity + 1)}>
                  +
                </button>
              </div>

              <button className="remove" onClick={() => removeItem(item.key)}>
                Remove
              </button>
            </div>

            <div className="price">₹{item.price * item.quantity}</div>
          </div>
        ))}
      </section>

      <aside className="summary">
        <div className="row">
          <span>Base</span>
          <span>₹{baseTotal}</span>
        </div>

        {printTotal > 0 && (
          <div className="row">
            <span>Name print</span>
            <span>₹{printTotal}</span>
          </div>
        )}

        <hr />

        <div className="row total">
          <span>Total</span>
          <span>₹{grandTotal}</span>
        </div>

        {checkoutError && (
          <div className="checkout-error">{checkoutError}</div>
        )}

        <button onClick={proceedToCheckout} disabled={processing || !selectedItems.length}>
          {processing ? "Processing…" : "Proceed to Checkout"}
        </button>
      </aside>
        <style jsx>{`
:root {
  --bg: #0a0a0a;
  --card: #111111;
  --muted: #9ca3af;
  --border: rgba(255,255,255,0.08);
  --accent: #22d3ee;
  --danger: #ef4444;
}

.cart {
  display: grid;
  grid-template-columns: 1fr 380px;
  gap: 2.5rem;
  padding: 2.5rem 1.5rem 4rem;
  max-width: 1240px;
  margin: auto;
  color: #fff;
}

/* ───────── ITEMS ───────── */

.items {
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
}

.item {
  display: grid;
  grid-template-columns: 28px 110px 1fr auto;
  gap: 1.2rem;
  padding: 1.2rem;
  background: linear-gradient(180deg, #121212, #0b0b0b);
  border-radius: 18px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.4);
  transition: transform .15s ease, box-shadow .15s ease;
}

.item:hover {
  transform: translateY(-2px);
  box-shadow: 0 14px 40px rgba(0,0,0,0.55);
}

.item img {
  width: 110px;
  height: 140px;
  object-fit: contain;
  border-radius: 14px;
  background: #000;
}

.select {
  display: grid;
  place-items: center;
}

.select input {
  width: 18px;
  height: 18px;
  accent-color: #22d3ee;
}

.row-inline {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  margin-top: 0.4rem;
}

.size-edit,
.name-edit {
  background: #000;
  border: 1px solid rgba(255,255,255,0.15);
  border-radius: 8px;
  color: #fff;
  font-size: 0.8rem;
  padding: 0.35rem 0.5rem;
}

.name-edit {
  width: 140px;
}

.name-action {
  padding: 0.3rem 0.7rem;
  border-radius: 999px;
  font-size: 0.7rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  border: 1px solid rgba(255,255,255,0.15);
  background: rgba(255,255,255,0.04);
  color: #e5e7eb;
  cursor: pointer;
}

.name-action.add {
  border-color: rgba(34,211,238,0.4);
  color: #67e8f9;
}

.name-action.remove {
  border-color: rgba(239,68,68,0.35);
  color: #fca5a5;
}

.checkout-error {
  margin-top: 0.8rem;
  padding: 0.6rem 0.8rem;
  border-radius: 12px;
  border: 1px solid rgba(248,113,113,0.35);
  background: rgba(248,113,113,0.08);
  color: #fca5a5;
  font-size: 0.8rem;
}

/* ───────── META ───────── */

.meta h3 {
  font-size: 0.95rem;
  font-weight: 600;
  margin-bottom: 0.2rem;
}

.muted {
  font-size: 0.8rem;
  color: var(--muted);
}

.badge {
  display: inline-block;
  margin-top: 0.4rem;
  padding: 0.25rem 0.55rem;
  font-size: 0.7rem;
  border-radius: 999px;
  background: rgba(34,211,238,0.12);
  color: var(--accent);
}

.badge.warn {
  background: rgba(239,68,68,0.12);
  color: #fca5a5;
  border: 1px solid rgba(239,68,68,0.25);
}

/* ───────── QTY ───────── */

.qty {
  display: inline-flex;
  align-items: center;
  gap: 0.6rem;
  margin-top: 0.8rem;
  padding: 0.3rem 0.6rem;
  border-radius: 999px;
  background: rgba(255,255,255,0.04);
}

.qty button {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  border: none;
  background: rgba(255,255,255,0.1);
  color: #fff;
  font-size: 1rem;
  cursor: pointer;
  transition: background .15s ease, transform .1s ease;
}

.qty button:hover {
  background: rgba(255,255,255,0.2);
}

.qty button:active {
  transform: scale(0.92);
}

.qty span {
  font-size: 0.85rem;
  min-width: 18px;
  text-align: center;
}

/* ───────── PRICE / REMOVE ───────── */

.price {
  align-self: center;
  font-size: 1rem;
  font-weight: 700;
}

.remove {
  margin-top: 0.7rem;
  font-size: 0.72rem;
  color: var(--danger);
  background: none;
  border: none;
  cursor: pointer;
  opacity: 0.85;
}

.remove:hover {
  opacity: 1;
  text-decoration: underline;
}

/* ───────── SUMMARY ───────── */

.summary {
  position: sticky;
  top: 90px;
  height: fit-content;
  padding: 1.6rem;
  border-radius: 22px;
  background: linear-gradient(180deg, #121212, #0c0c0c);
  box-shadow: 0 18px 40px rgba(0,0,0,0.5);
}

.summary .row {
  display: flex;
  justify-content: space-between;
  font-size: 0.85rem;
  margin-bottom: 0.6rem;
  color: var(--muted);
}

.summary .total {
  margin-top: 0.8rem;
  font-size: 1.1rem;
  font-weight: 700;
  color: #fff;
}

.summary hr {
  border: none;
  height: 1px;
  background: var(--border);
  margin: 1rem 0;
}

.summary button {
  width: 100%;
  margin-top: 1.2rem;
  padding: 0.9rem;
  border-radius: 999px;
  font-weight: 600;
  font-size: 0.9rem;
  background: #fff;
  color: #000;
  border: none;
  cursor: pointer;
  transition: transform .15s ease, opacity .15s ease;
}

.summary button:hover {
  transform: translateY(-1px);
}

.summary button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* ───────── MOBILE ───────── */

@media (max-width: 768px) {
  .cart {
    grid-template-columns: 1fr;
    padding-bottom: 7rem;
  }

  .item {
    grid-template-columns: 28px 90px 1fr;
    gap: 1rem;
  }

  .price {
    grid-column: span 3;
    text-align: right;
    margin-top: 0.4rem;
  }
}

@media (max-width: 520px) {
  .item {
    grid-template-columns: 1fr;
    gap: 0.8rem;
  }

  .select {
    justify-self: start;
  }

  .item img {
    width: 100%;
    max-width: 220px;
    height: auto;
    justify-self: center;
  }

  .price {
    grid-column: 1 / -1;
    text-align: left;
  }

  .row-inline {
    flex-wrap: wrap;
  }

  .size-edit,
  .name-edit {
    width: 100%;
  }

  .qty {
    flex-wrap: wrap;
  }
}
/* ───────── BREADCRUMB ───────── */
.breadcrumb {
  grid-column: 1 / -1;
  display: flex;
  gap: 0.4rem;
  font-size: 0.75rem;
  color: #9ca3af;
}

.breadcrumb span {
  cursor: pointer;
}

/* ───────── STEPS ───────── */
.steps {
  grid-column: 1 / -1;
  display: flex;
  gap: 1.6rem;
  font-size: 0.75rem;
  color: #9ca3af;
  margin: 0.8rem 0 1.2rem;
}

.steps .done {
  color: #22d3ee;
}

.steps .active {
  color: #22d3ee;
  font-weight: 600;
}

/* ───────── CART HEADER ───────── */
.cartHeader {
  grid-column: 1 / -1;
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  padding-bottom: 1.4rem;
  margin-bottom: 0.8rem;
  border-bottom: 1px solid rgba(255,255,255,0.08);
}

.cartHeader h1 {
  font-size: 1.6rem;
  font-weight: 700;
}

.cartHeader p {
  font-size: 0.85rem;
  color: #9ca3af;
  margin-top: 0.2rem;
}

.cartHeader .continue {
  background: none;
  border: none;
  color: #e5e7eb;
  font-size: 0.8rem;
  cursor: pointer;
  opacity: 0.85;
  transition: opacity 0.15s ease, transform 0.15s ease;
}

.cartHeader .continue:hover {
  opacity: 1;
  transform: translateX(-2px);
}

/* ───────── MOBILE ───────── */
@media (max-width: 768px) {
  .cartHeader {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.6rem;
  }

  .cartHeader h1 {
    font-size: 1.35rem;
  }

  .steps {
    gap: 1rem;
  }
}

`}</style>
    </main>
  );
}




