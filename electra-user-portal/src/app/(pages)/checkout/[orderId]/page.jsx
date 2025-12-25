"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { auth, db } from "../../../lib/firebase";
import {
  doc,
  getDoc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

export default function CheckoutPage() {
  const { orderId } = useParams();
  const router = useRouter();

  const [user, setUser] = useState(null);
  const [order, setOrder] = useState(null);

  // 🔐 Payment + customization
  const [txnId, setTxnId] = useState("");
  const [file, setFile] = useState(null);
  const [size, setSize] = useState("");
  const [printName, setPrintName] = useState(false);
  const [printedName, setPrintedName] = useState("");

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  /* ───────────────── AUTH + ORDER LOAD ───────────────── */
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      if (!firebaseUser) {
        router.replace("/auth/sign-in");
        return;
      }

      setUser(firebaseUser);

      const ref = doc(db, "orders", orderId);
      const snap = await getDoc(ref);

      if (!snap.exists()) {
        setError("Order not found");
        setLoading(false);
        return;
      }

      const data = snap.data();

      // 🔒 STRICT OWNERSHIP CHECK
      if (data.userId !== firebaseUser.uid) {
        setError("Unauthorized access");
        setLoading(false);
        return;
      }

      // 🔒 BLOCK ACCESS IF PAYMENT ALREADY MOVED FORWARD
      if (data.paymentStatus !== "pending_payment") {
        router.replace("/dashboard");
        return;
      }

      setOrder(data);
      setLoading(false);
    });

    return () => unsub();
  }, [orderId, router]);

  /* ───────────────── CLOUDINARY UPLOAD ───────────────── */
  const uploadToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append(
      "upload_preset",
      process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET
    );

    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
      {
        method: "POST",
        body: formData,
      }
    );

    if (!res.ok) throw new Error("Image upload failed");
    return res.json();
  };

  /* ───────────────── SUBMIT PAYMENT PROOF ───────────────── */
  const submitProof = async () => {
    if (!order || !user) return;

    // 🔴 HARD VALIDATIONS
    if (!txnId || !file || !size) {
      setError("Please fill all required fields");
      return;
    }

    if (printName && !printedName.trim()) {
      setError("Please enter the name to be printed");
      return;
    }

    try {
      setSubmitting(true);
      setError("");

      // 1️⃣ Upload screenshot
      const uploadResult = await uploadToCloudinary(file);

      // 2️⃣ Update order atomically
      await updateDoc(doc(db, "orders", orderId), {
        txnId: txnId.trim(),
        size,
        printName,
        printedName: printName ? printedName.trim() : null,
        paymentScreenshotUrl: uploadResult.secure_url,
        paymentScreenshotPublicId: uploadResult.public_id,
        paymentStatus: "pending_verification",
        updatedAt: serverTimestamp(),
      });

      // 3️⃣ Notify admin + user (server side)
      const res = await fetch("/api/notify-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId }),
      });

      if (!res.ok) {
        throw new Error("Admin notification failed");
      }

      // 4️⃣ Redirect
      router.push("/dashboard");
    } catch (err) {
      console.error(err);
      setError("Failed to submit payment proof. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  /* ───────────────── LOADING / ERROR ───────────────── */
  if (loading) {
    return (
      <main className="loading">
        Loading checkout…
        <style jsx>{`
          .loading {
            min-height: 100vh;
            display: grid;
            place-items: center;
            background: #000;
            color: #9ca3af;
          }
        `}</style>
      </main>
    );
  }

  if (!order) {
    return <main className="loading">{error}</main>;
  }

  /* ───────────────── UI ───────────────── */
  return (
    <main className="wrap">
      <div className="card">
        <h1>Complete Payment</h1>

        <p className="info">
          Order ID: <strong>{order.orderId}</strong>
        </p>

        <p className="info">
          Amount: <strong>₹{order.amount}</strong>
        </p>

        <img src="/upi-qr.png" alt="UPI QR" className="qr" />

        <p className="note">
          Pay the <strong>exact amount</strong> and mention
          <br />
          <strong>{order.orderId}</strong> in the UPI note
        </p>

        {/* ───── SIZE ───── */}
        <label>
          T-Shirt Size *
          <select value={size} onChange={(e) => setSize(e.target.value)}>
            <option value="">Select size</option>
            <option value="S">Small</option>
            <option value="M">Medium</option>
            <option value="L">Large</option>
            <option value="XL">XL</option>
          </select>
        </label>

        {/* ───── PRINT NAME ───── */}
        <label className="checkbox">
          <input
            type="checkbox"
            checked={printName}
            onChange={(e) => setPrintName(e.target.checked)}
          />
          Print name on T-shirt
        </label>

        {printName && (
          <label>
            Name to print *
            <input
              value={printedName}
              onChange={(e) => setPrintedName(e.target.value)}
              placeholder="Enter name"
            />
          </label>
        )}

        {/* ───── PAYMENT DETAILS ───── */}
        <label>
          Transaction ID *
          <input
            value={txnId}
            onChange={(e) => setTxnId(e.target.value)}
            placeholder="Enter UPI transaction ID"
          />
        </label>

        <label>
          Payment screenshot *
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files[0])}
          />
        </label>

        {error && <p className="error">{error}</p>}

        <button
          onClick={submitProof}
          disabled={submitting}
        >
          {submitting ? "Submitting…" : "Submit for verification"}
        </button>
      </div>

      <style jsx>{`
        .wrap {
          min-height: 100vh;
          background: #000;
          color: #fff;
          display: grid;
          place-items: center;
          padding: 2rem;
        }

        .card {
          width: 100%;
          max-width: 420px;
          background: #0b0b0b;
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 16px;
          padding: 1.6rem;
          text-align: center;
        }

        .info {
          color: #9ca3af;
          font-size: 0.9rem;
        }

        .qr {
          width: 220px;
          margin: 1.2rem auto;
          border-radius: 12px;
        }

        .note {
          font-size: 0.8rem;
          color: #facc15;
          margin-bottom: 1rem;
        }

        label {
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
          font-size: 0.8rem;
          color: #9ca3af;
          margin-bottom: 0.8rem;
          text-align: left;
        }

        select,
        input {
          background: #000;
          border: 1px solid rgba(255,255,255,0.12);
          border-radius: 8px;
          padding: 0.6rem;
          color: #fff;
        }

        .checkbox {
          flex-direction: row;
          align-items: center;
          gap: 0.6rem;
          font-size: 0.8rem;
        }

        button {
          width: 100%;
          padding: 0.7rem;
          background: #fff;
          color: #000;
          border-radius: 8px;
          border: none;
          cursor: pointer;
          margin-top: 0.6rem;
        }

        button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .error {
          color: #ef4444;
          font-size: 0.85rem;
        }
      `}</style>
    </main>
  );
}
