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

      // normalize legacy orders
      if (!data.items) {
        data.items = [{
          productId: data.productId,
          productName: data.productName,
          size: data.size,
          printName: data.printName,
          printedName: data.printedName,
          price: data.price,
        }];
      }

      setOrder(data);
      setLoading(false);
    });

    return () => unsub();
  }, [orderId, router]);

  /* ───────── CLOUDINARY ───────── */
  const uploadToCloudinary = async (file) => {
    const fd = new FormData();
    fd.append("file", file);
    fd.append(
      "upload_preset",
      process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET
    );

    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
      { method: "POST", body: fd }
    );

    if (!res.ok) throw new Error("Upload failed");
    return res.json();
  };

  /* ───────── PRICE CALC ───────── */
  const printTotal =
    order?.items.reduce(
      (sum, i) => sum + (i.printName ? PRINT_NAME_CHARGE : 0),
      0
    ) || 0;

  const deliveryFee = outside ? DELIVERY_CHARGE : 0;
  const finalAmount = order?.amount + printTotal + deliveryFee;

  /* ───────── SUBMIT ───────── */
  const submitProof = async () => {
    if (!txnId || !file) {
      setError("Please provide transaction ID and screenshot");
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

      const upload = await uploadToCloudinary(file);

      await updateDoc(doc(db, "orders", orderId), {
        txnId: txnId.trim(),
        isOutsideCampus: outside,
        deliveryCharge: deliveryFee,
        printNameCharge: printTotal,
        deliveryAddress: outside ? address : null,
        totalAmountPaid: finalAmount,
        paymentScreenshotUrl: upload.secure_url,
        paymentScreenshotPublicId: upload.public_id,
        paymentStatus: "pending_verification",
        updatedAt: serverTimestamp(),
      });

      router.push(`/dashboard/orders/${orderId}`);
    } catch (err) {
      console.error(err);
      setError("Payment submission failed");
    } finally {
      setSubmitting(false);
    }
  };

  /* ───────── LOADING ───────── */
  if (loading) {
    return (
      <main className="loading">Loading checkout…</main>
    );
  }

  if (!order) return <main>{error}</main>;

  /* ───────── UI ───────── */
  return (
    <main className="wrap">
      <div className="card">
        <h1>Complete Payment</h1>

        <img src="/upi-qr.png" className="qr" />

        <label>
          Transaction ID *
          <input value={txnId} onChange={(e) => setTxnId(e.target.value)} />
        </label>

        <label>
          Payment screenshot *
          <input type="file" onChange={(e) => setFile(e.target.files[0])} />
        </label>

        <label className="checkbox">
          <input
            type="checkbox"
            checked={outside}
            onChange={(e) => setOutside(e.target.checked)}
          />
          I am outside campus (+₹100)
        </label>

        {outside &&
          Object.keys(address).map((k) => (
            <label key={k}>
              {k}
              <input
                value={address[k]}
                onChange={(e) =>
                  setAddress({ ...address, [k]: e.target.value })
                }
              />
            </label>
          ))}

        {/* ITEMS */}
        <div className="items">
          {order.items.map((item, i) => (
            <div key={i} className="item">
              <strong>{item.productName}</strong>
              <div className="muted">Size: {item.size}</div>
              {item.printName && (
                <div className="muted">
                  Printed name: {item.printedName} (+₹50)
                </div>
              )}
              <div className="price">₹{item.price}</div>
            </div>
          ))}
        </div>

        <div className="summary">
          <p>Base total: ₹{order?.amount}</p>
          {printTotal > 0 && <p>Name print: ₹{printTotal}</p>}
          {outside && <p>Delivery: ₹100</p>}
          <p className="total">Total payable: ₹{finalAmount}</p>
        </div>

        {error && <p className="error">{error}</p>}

        <button onClick={submitProof} disabled={submitting}>
          {submitting ? "Submitting…" : "Submit for verification"}
        </button>
      </div>
       <style jsx>{`/* ---------- PAGE ---------- */
.wrap {
  min-height: 100vh;
  background: #000;
  color: #fff;
  display: grid;
  place-items: center;
  padding: 2rem;
}

/* ---------- CARD ---------- */
.card {
  width: 100%;
  max-width: 420px;
  background: #0b0b0b;
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 16px;
  padding: 1.6rem;
  text-align: center;
  box-shadow:
    0 10px 30px rgba(0,0,0,0.6),
    inset 0 1px 0 rgba(255,255,255,0.04);
}

/* ---------- HEADINGS ---------- */
.card h1 {
  font-size: 1.4rem;
  margin-bottom: 1rem;
  font-weight: 600;
}

/* ---------- INFO TEXT ---------- */
.info {
  color: #9ca3af;
  font-size: 0.9rem;
  margin-bottom: 0.4rem;
  line-height: 1.4;
}

/* ---------- ORDER ITEMS ---------- */
.info strong {
  color: #e5e7eb;
  font-weight: 600;
}

.card .info + .info {
  margin-top: 0.2rem;
}

/* ---------- QR IMAGE ---------- */
.qr {
  width: 220px;
  margin: 1.2rem auto;
  border-radius: 12px;
  background: #000;
  border: 1px solid rgba(255,255,255,0.08);
}

/* ---------- FORM LABELS ---------- */
label {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  font-size: 0.8rem;
  color: #9ca3af;
  margin-bottom: 0.8rem;
  text-align: left;
}

/* ---------- INPUTS ---------- */
input,
select {
  background: #000;
  border: 1px solid rgba(255,255,255,0.12);
  border-radius: 8px;
  padding: 0.6rem;
  color: #fff;
  font-size: 0.85rem;
  outline: none;
  transition: border 0.25s ease;
}

input:focus,
select:focus {
  border-color: #22d3ee;
}

/* ---------- CHECKBOX ---------- */
.checkbox {
  flex-direction: row;
  align-items: center;
  gap: 0.6rem;
  font-size: 0.8rem;
}

/* ---------- BUTTON ---------- */
button {
  width: 100%;
  padding: 0.7rem;
  background: #fff;
  color: #000;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  margin-top: 0.6rem;
  font-size: 0.85rem;
  font-weight: 600;
  transition: opacity 0.2s ease, transform 0.2s ease;
}

button:hover {
  transform: translateY(-1px);
}

button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

/* ---------- ERROR ---------- */
.error {
  color: #ef4444;
  font-size: 0.85rem;
  margin-top: 0.6rem;
}

/* ---------- LOADING ---------- */
.loading {
  min-height: 100vh;
  display: grid;
  place-items: center;
  background: #000;
  color: #9ca3af;
  font-size: 0.95rem;
}

      `}</style>
    </main>
  );
}

