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

  // payment
  const [txnId, setTxnId] = useState("");
  const [file, setFile] = useState(null);
  const [size, setSize] = useState("");

  // print
  const [printName, setPrintName] = useState(false);
  const [printedName, setPrintedName] = useState("");

  // delivery
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

  /* ───────── AUTH + ORDER LOAD ───────── */
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      if (!firebaseUser) {
        router.replace("/auth/sign-in");
        return;
      }

      setUser(firebaseUser);

      const snap = await getDoc(doc(db, "orders", orderId));
      if (!snap.exists()) {
        setError("Order not found");
        setLoading(false);
        return;
      }

      const data = snap.data();

      if (data.userId !== firebaseUser.uid) {
        setError("Unauthorized access");
        setLoading(false);
        return;
      }

      if (data.paymentStatus !== "pending_payment") {
        router.replace("/dashboard");
        return;
      }

      setOrder(data);
      setLoading(false);
    });

    return () => unsub();
  }, [orderId, router]);

  /* ───────── CLOUDINARY ───────── */
  const uploadToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append(
      "upload_preset",
      process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET
    );

    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
      { method: "POST", body: formData }
    );

    if (!res.ok) throw new Error("Upload failed");
    return res.json();
  };

  /* ───────── PRICE CALC ───────── */
  const deliveryFee = outside ? DELIVERY_CHARGE : 0;
  const printFee = printName ? PRINT_NAME_CHARGE : 0;
  const finalAmount =
    (order?.amount || 0) + deliveryFee + printFee;

  /* ───────── SUBMIT ───────── */
  const submitProof = async () => {
    if (!order || submitting) return;

    if (!txnId || !file || !size) {
      setError("Please fill all required fields");
      return;
    }

    if (printName && !printedName.trim()) {
      setError("Please enter the name to be printed");
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
        size,
        printName,
        printedName: printName ? printedName.trim() : null,

        isOutsideCampus: outside,
        deliveryCharge: deliveryFee,
        printNameCharge: printFee,
        deliveryAddress: outside ? address : null,

        totalAmountPaid: finalAmount,

        paymentScreenshotUrl: upload.secure_url,
        paymentScreenshotPublicId: upload.public_id,
        paymentStatus: "pending_verification",
        updatedAt: serverTimestamp(),
      });

      fetch("/api/notify-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId }),
      }).catch(() => {});

      router.push(`/dashboard/orders/${orderId}`);
    } catch (err) {
      console.error(err);
      setError("Failed to submit payment. Try again.");
    } finally {
      setSubmitting(false);
    }
  };

  /* ───────── LOADING ───────── */
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

  if (!order) return <main>{error}</main>;

  /* ───────── UI ───────── */
  return (
    <main className="wrap">
      <div className="card">
        <h1>Complete Payment</h1>

        <p className="info">Base price: ₹{order.amount}</p>
        {printName && <p className="info">Name print: ₹50</p>}
        {outside && <p className="info">Delivery: ₹100</p>}
        <p className="info">
          <strong>Total payable: ₹{finalAmount}</strong>
        </p>

        <img src="/upi-qr.png" alt="UPI QR" className="qr" />

        <label>
          T-Shirt Size *
          <select value={size} onChange={(e) => setSize(e.target.value)}>
            <option value="">Select size</option>
            <option>S</option>
            <option>M</option>
            <option>L</option>
            <option>XL</option>
          </select>
        </label>

        <label className="checkbox">
          <input
            type="checkbox"
            checked={printName}
            onChange={(e) => setPrintName(e.target.checked)}
          />
          Print name on T-shirt (+₹50)
        </label>

        {printName && (
          <label>
            Name to print *
            <input
              value={printedName}
              onChange={(e) => setPrintedName(e.target.value)}
            />
          </label>
        )}

        <label className="checkbox">
          <input
            type="checkbox"
            checked={outside}
            onChange={(e) => setOutside(e.target.checked)}
          />
          I am outside campus (+₹100 delivery)
        </label>

        {outside && (
          <>
            <label>
              Full Name *
              <input
                value={address.fullName}
                onChange={(e) =>
                  setAddress({ ...address, fullName: e.target.value })
                }
              />
            </label>

            <label>
              Phone *
              <input
                value={address.phone}
                onChange={(e) =>
                  setAddress({ ...address, phone: e.target.value })
                }
              />
            </label>

            <label>
              Address *
              <input
                value={address.addressLine}
                onChange={(e) =>
                  setAddress({ ...address, addressLine: e.target.value })
                }
              />
            </label>

            <label>
              City *
              <input
                value={address.city}
                onChange={(e) =>
                  setAddress({ ...address, city: e.target.value })
                }
              />
            </label>

            <label>
              Pincode *
              <input
                value={address.pincode}
                onChange={(e) =>
                  setAddress({ ...address, pincode: e.target.value })
                }
              />
            </label>
          </>
        )}

        <label>
          Transaction ID *
          <input
            value={txnId}
            onChange={(e) => setTxnId(e.target.value)}
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

        <button onClick={submitProof} disabled={submitting}>
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
