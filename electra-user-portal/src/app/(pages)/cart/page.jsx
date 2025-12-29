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

export default function CartPage() {
  const router = useRouter();

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  /* ───────── LOAD CART ───────── */
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        router.replace("/auth/sign-in");
        return;
      }

      const snap = await getDoc(doc(db, "users", user.uid));
      const cartItems = snap.data()?.cart?.items || {};

      setItems(
        Object.entries(cartItems).map(([key, value]) => ({
          key,
          ...value,
        }))
      );
      setLoading(false);
    });

    return () => unsub();
  }, [router]);

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

    await updateDoc(doc(db, "users", auth.currentUser.uid), {
      [`cart.items.${key}`]: deleteField(),
      "cart.updatedAt": serverTimestamp(),
    });
  };

  /* ───────── TOTALS ───────── */
  const baseTotal = items.reduce(
    (s, i) => s + (typeof i.price === "number" ? i.price * i.quantity : 0),
    0
  );

  const printTotal = items.reduce(
    (s, i) => s + (i.printName ? 50 * i.quantity : 0),
    0
  );

  const grandTotal = baseTotal + printTotal;

  /* ───────── CHECKOUT ───────── */
  const proceedToCheckout = async () => {
    if (!items.length || processing) return;

    setProcessing(true);

    const orderId = `ORD-${nanoid(6).toUpperCase()}`;

    await setDoc(doc(db, "orders", orderId), {
      orderId,
      userId: auth.currentUser.uid,
      items,
      amount: baseTotal,
      paymentStatus: "pending_payment",
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    await updateDoc(doc(db, "users", auth.currentUser.uid), {
      cart: { items: {} },
    });

    router.push(`/checkout/${orderId}`);
  };

  /* ───────── LOADING UI ───────── */
  if (loading) {
    return (
      <main className="state">
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
        <div className="empty-card">
          <div className="icon">🛒</div>
          <h2>Your cart is empty</h2>
          <p>Add something you actually want to wear.</p>
          <button onClick={() => router.push("/gotyourmerch")}>
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
    {/* ───────── CART HEADER / FLOW ───────── */}
<header className="cartHeader">
  <div>
    <h1>Your Cart</h1>
    <p>{items.length} item{items.length !== 1 ? "s" : ""}</p>
  </div>

  <button
    className="continue"
    onClick={() => router.push("/gotyourmerch")}
  >
    ← Continue shopping
  </button>
</header>

      <section className="items">
        {items.map((item) => (
          <div key={item.key} className="item">
            <img src={cloudinaryImage(item.image, "q_auto,f_auto,w_200/")} />

            <div className="meta">
              <h3>{item.productName}</h3>
              <p className="muted">Size: {item.size}</p>

              {item.printName && (
                <span className="badge">Printed: {item.printedName}</span>
              )}

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

        <button onClick={proceedToCheckout} disabled={processing}>
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
  grid-template-columns: 110px 1fr auto;
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
  object-fit: cover;
  border-radius: 14px;
  background: #000;
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
    grid-template-columns: 90px 1fr;
    gap: 1rem;
  }

  .price {
    grid-column: span 2;
    text-align: right;
    margin-top: 0.4rem;
  }

  .summary {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    top: auto;
    border-radius: 22px 22px 0 0;
    padding: 1.2rem 1.4rem;
    backdrop-filter: blur(10px);
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


