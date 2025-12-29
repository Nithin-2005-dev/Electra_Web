"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { auth, db } from "../../../lib/firebase";
import { doc, getDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

export default function CheckoutPage() {
  const { orderId } = useParams();
  const router = useRouter();

  const [order, setOrder] = useState(null);
  const [txnId, setTxnId] = useState("");
  const [file, setFile] = useState(null);
  const [outside, setOutside] = useState(false);
  const [address, setAddress] = useState({
    fullName: "",
    phone: "",
    addressLine: "",
    city: "",
    pincode: "",
  });

  const DELIVERY_CHARGE = 100;
  const PRINT_NAME_CHARGE = 50;

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  /* ───────── LOAD ORDER ───────── */
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user) return router.replace("/auth/sign-in");

      const snap = await getDoc(doc(db, "orders", orderId));
      if (!snap.exists()) {
        setError("Order not found");
        setLoading(false);
        return;
      }

      const data = snap.data();
      if (data.userId !== user.uid) {
        setError("Unauthorized access");
        setLoading(false);
        return;
      }

      if (data.paymentStatus !== "pending_payment") {
        router.replace("/dashboard");
        return;
      }

      if (!data.items) {
        data.items = [
          {
            productName: data.productName,
            size: data.size,
            printName: data.printName,
            printedName: data.printedName,
            price: data.price,
            quantity: 1,
          },
        ];
      }

      setOrder(data);
      setLoading(false);
    });

    return () => unsub();
  }, [orderId, router]);

  /* ───────── PRICE CALC (FIXED) ───────── */
  const printTotal =
    order?.items.reduce(
      (s, i) =>
        s +
        (i.printName
          ? PRINT_NAME_CHARGE * (i.quantity || 1)
          : 0),
      0
    ) || 0;

  const deliveryFee = outside ? DELIVERY_CHARGE : 0;
  const finalAmount = order?.amount + printTotal + deliveryFee;

  /* ───────── SUBMIT ───────── */
  const submitProof = async () => {
    if (!txnId || !file) {
      setError("Transaction ID and screenshot are required");
      return;
    }

    if (outside) {
      const { fullName, phone, addressLine, city, pincode } = address;
      if (!fullName || !phone || !addressLine || !city || !pincode) {
        setError("Please complete delivery address");
        return;
      }
    }

    try {
      setSubmitting(true);
      setError("");

      await updateDoc(doc(db, "orders", orderId), {
        txnId: txnId.trim(),
        isOutsideCampus: outside,
        deliveryCharge: deliveryFee,
        printNameCharge: printTotal,
        deliveryAddress: outside ? address : null,
        totalAmountPaid: finalAmount,
        paymentStatus: "pending_verification",
        updatedAt: serverTimestamp(),
      });

      fetch("/api/notify-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId }),
      }).catch(() => {});

      router.push(`/dashboard/orders/${orderId}`);
    } catch {
      setError("Payment submission failed");
    } finally {
      setSubmitting(false);
    }
  };

  /* ───────── LOADING UI ───────── */
  if (loading) {
    return (
      <main className="loading">
        <div className="skeleton" />
        <div className="skeleton" />
        <div className="skeleton" />

        <style jsx>{`
          .loading {
            min-height: 100vh;
            display: grid;
            place-items: center;
            gap: 1rem;
            background: #000;
          }
          .skeleton {
            width: 420px;
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

  if (!order) return <main>{error}</main>;

  /* ───────── UI ───────── */
  return (
    <main className="checkout">
      <section className="payment">
        <h1>Complete Payment</h1>
        <p className="step">Scan → Pay → Upload proof</p>

        <img src="/upi-qr.png" className="qr" />

        <label>
          Transaction ID *
          <input value={txnId} onChange={(e) => setTxnId(e.target.value)} />
        </label>

        <label>
          Payment Screenshot *
          <input type="file" onChange={(e) => setFile(e.target.files[0])} />
        </label>

        <label className="checkbox">
          <input
            type="checkbox"
            checked={outside}
            onChange={(e) => setOutside(e.target.checked)}
          />
          Outside campus (+₹100 delivery)
        </label>

        {outside && (
          <div className="address">
            {Object.keys(address).map((k) => (
              <input
                key={k}
                placeholder={k}
                value={address[k]}
                onChange={(e) =>
                  setAddress({ ...address, [k]: e.target.value })
                }
              />
            ))}
          </div>
        )}

        {error && <p className="error">{error}</p>}

        <button onClick={submitProof} disabled={submitting}>
          {submitting ? "Submitting…" : "Submit for verification"}
        </button>
      </section>

      <aside className="summary">
        <h2>Order Summary</h2>

        <div className="items">
          {order.items.map((item, i) => (
            <div key={i} className="summary-item">
              <div className="left">
                <p className="name">{item.productName}</p>
                <p className="meta">
                  Size: {item.size} · Qty: {item.quantity || 1}
                </p>
                {item.printName && (
                  <p className="meta">
                    Printed name: {item.printedName} <span>(+₹50 each)</span>
                  </p>
                )}
              </div>
              <div className="right">
                ₹{item.price * (item.quantity || 1)}
              </div>
            </div>
          ))}
        </div>

        <hr />

        <div className="row">
          <span>Base total</span>
          <span>₹{order.amount}</span>
        </div>

        {printTotal > 0 && (
          <div className="row">
            <span>Name print</span>
            <span>₹{printTotal}</span>
          </div>
        )}

        {outside && (
          <div className="row">
            <span>Delivery</span>
            <span>₹100</span>
          </div>
        )}

        <div className="row total">
          <span>Total</span>
          <span>₹{finalAmount}</span>
        </div>
      </aside>

 <style jsx>{`
        .checkout {
          min-height: 100vh;
          background: #000;
          color: #fff;
          display: grid;
          grid-template-columns: 1fr 360px;
          gap: 2rem;
          padding: 2rem;
          max-width: 1100px;
          margin: auto;
        }

        .payment {
          background: #0b0b0b;
          border-radius: 20px;
          padding: 2rem;
          box-shadow: 0 20px 50px rgba(0,0,0,0.6);
        }

        h1 {
          font-size: 1.4rem;
          margin-bottom: 0.2rem;
        }

        .step {
          font-size: 0.85rem;
          color: #9ca3af;
          margin-bottom: 1.2rem;
        }

        .qr {
          width: 220px;
          margin: 1.2rem auto;
          display: block;
          border-radius: 14px;
        }

        label {
          font-size: 0.75rem;
          color: #9ca3af;
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
          margin-bottom: 0.8rem;
        }

        input {
          background: #000;
          border: 1px solid rgba(255,255,255,0.12);
          border-radius: 10px;
          padding: 0.6rem;
          color: #fff;
        }

        .checkbox {
          flex-direction: row;
          align-items: center;
          gap: 0.6rem;
          font-size: 0.8rem;
        }

        .address {
          display: grid;
          gap: 0.6rem;
          margin-bottom: 0.8rem;
        }

        button {
          width: 100%;
          padding: 0.8rem;
          border-radius: 999px;
          background: #fff;
          color: #000;
          font-weight: 600;
          border: none;
          cursor: pointer;
          margin-top: 0.6rem;
        }

        .summary {
  background: radial-gradient(
    120% 120% at 50% 0%,
    #141414 0%,
    #0b0b0b 60%
  );
  border-radius: 22px;
  padding: 1.8rem;
  box-shadow: 0 20px 50px rgba(0,0,0,0.55);
}

.summary h2 {
  font-size: 1.05rem;
  font-weight: 600;
  margin-bottom: 1rem;
}

/* ITEMS */
.summary .items {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.summary-item {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
}

.summary-item .left {
  max-width: 70%;
}

.summary-item .name {
  font-size: 0.9rem;
  font-weight: 600;
  color: #fff;
}

.summary-item .meta {
  font-size: 0.75rem;
  color: #9ca3af;
  line-height: 1.4;
}

.summary-item .meta span {
  color: #22d3ee;
}

.summary-item .right {
  font-size: 0.9rem;
  font-weight: 600;
  white-space: nowrap;
}

/* DIVIDER */
.summary hr {
  border: none;
  height: 1px;
  background: rgba(255,255,255,0.08);
  margin: 1.2rem 0;
}

/* TOTAL ROWS */
.summary .row {
  display: flex;
  justify-content: space-between;
  font-size: 0.85rem;
  color: #9ca3af;
  margin-bottom: 0.4rem;
}

.summary .row.total {
  margin-top: 0.8rem;
  padding-top: 0.8rem;
  border-top: 1px dashed rgba(255,255,255,0.15);
  font-size: 1.05rem;
  font-weight: 700;
  color: #fff;
}


        .item {
          font-size: 0.8rem;
          margin-bottom: 0.6rem;
          color: #9ca3af;
        }

        .price {
          color: #fff;
          font-weight: 600;
        }

        .row {
          display: flex;
          justify-content: space-between;
          font-size: 0.85rem;
          margin-top: 0.4rem;
          color: #9ca3af;
        }

        .total {
          font-size: 1rem;
          font-weight: 700;
          color: #fff;
          margin-top: 0.8rem;
        }

        .error {
          color: #ef4444;
          font-size: 0.8rem;
          margin-top: 0.4rem;
        }

        @media (max-width: 768px) {
          .checkout {
            grid-template-columns: 1fr;
          }
          .summary {
            position: static;
          }
        }
      `}</style>
    </main>
  );
}


