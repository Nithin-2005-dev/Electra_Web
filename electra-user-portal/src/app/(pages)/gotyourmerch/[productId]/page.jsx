"use client";

import { useEffect, useState } from "react";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { db, auth } from "../../../lib/firebase";
import { cloudinaryUrl } from "../../../lib/cloudinary";
import { useParams, useRouter } from "next/navigation";
import { nanoid } from "nanoid";

export default function ProductPage() {
  const { productId } = useParams();
  const router = useRouter();

  const [product, setProduct] = useState(null);
  const [active, setActive] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showSizeChart, setShowSizeChart] = useState(false);

  // 🔒 BUY LOCK
  const [buying, setBuying] = useState(false);

  /* ───────── LOAD PRODUCT ───────── */
  useEffect(() => {
    if (!productId) return;

    const loadProduct = async () => {
      const snap = await getDoc(doc(db, "products", productId));

      if (!snap.exists()) {
        router.replace("/gotyourmerch");
        return;
      }

      const data = snap.data();

      setProduct({
        ...data,
        imageGallery: Array.isArray(data.imageGallery)
          ? data.imageGallery
          : [],
      });

      setActive(data.imageMain);
      setLoading(false);
    };

    loadProduct();
  }, [productId, router]);

  if (loading) {
    return (
      <main className="loading">
        <div className="spinner" />
        Loading product…
        <style jsx>{`
          .loading {
            min-height: 100vh;
            display: grid;
            place-items: center;
            background: #000;
            color: #9ca3af;
            gap: 1rem;
          }
          .spinner {
            width: 36px;
            height: 36px;
            border: 3px solid rgba(255,255,255,0.2);
            border-top-color: #22d3ee;
            border-radius: 50%;
            animation: spin 0.8s linear infinite;
          }
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </main>
    );
  }

  if (!product || !active) return null;

  /* ───────── SAFE IMAGE LIST ───────── */
  const images = Array.from(
    new Set([product.imageMain, ...product.imageGallery])
  ).filter(Boolean);

  /* ───────── BUY NOW ───────── */
  const orderNow = async () => {
    if (buying || !product.available) return;

    const user = auth.currentUser;
    if (!user) {
      router.push("/auth/sign-in");
      return;
    }

    try {
      setBuying(true);

      const orderId = `ORD-${nanoid(6).toUpperCase()}`;

      await setDoc(doc(db, "orders", orderId), {
        orderId,
        userId: user.uid,
        productId,
        productName: product.name,
        amount: product.price,
        paymentStatus: "pending_payment",
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      router.push(`/checkout/${orderId}`);
    } catch (err) {
      console.error(err);
      setBuying(false);
      alert("Failed to create order. Try again.");
    }
  };

  /* ───────── UI ───────── */
  return (
    <main className="wrap">
      {/* LEFT — GALLERY */}
      <section className="gallery">
        <img
          className="main"
          src={cloudinaryUrl(active, "q_auto,f_auto,w_1400/")}
          alt={product.name}
        />

        <div className="thumbs">
          {images.map((pid, index) => (
            <img
              key={`${pid}-${index}`}
              src={cloudinaryUrl(pid, "q_auto,f_auto,w_200/")}
              onClick={() => setActive(pid)}
              className={pid === active ? "active" : ""}
              alt=""
            />
          ))}
        </div>
      </section>

      {/* RIGHT — INFO */}
      <section className="info">
        <h1>{product.name}</h1>

        <div className="price">₹{product.price}</div>

        <button
          className="size-chart"
          onClick={() => setShowSizeChart(true)}
        >
          Size Chart
        </button>

        <button
          className="buy"
          disabled={!product.available || buying}
          onClick={orderNow}
        >
          {buying ? "Processing…" : "Buy It Now"}
        </button>

        {!product.available && (
          <span className="out">Out of stock</span>
        )}

        {/* PRODUCT DETAILS */}
        <div className="details">
          <h3>Product Details</h3>
          <ul>
            <li><strong>Fabric:</strong> 100% French Terry Loopknit Cotton</li>
            <li><strong>Fit:</strong> Oversized Fit</li>
            <li><strong>GSM:</strong> 240 GSM</li>
            <li><strong>Colour:</strong> Navy Blue</li>
            <li><strong>Neck:</strong> Ribbed Crew Neck</li>
            <li><strong>Care:</strong> Machine wash cold, inside-out</li>
          </ul>
        </div>
      </section>

      {/* SIZE CHART MODAL */}
      {showSizeChart && (
        <div className="modal" onClick={() => setShowSizeChart(false)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <button
              className="close"
              onClick={() => setShowSizeChart(false)}
            >
              ✕
            </button>
            <img src={product.sizeChartUrl} alt="Size chart" />
          </div>
        </div>
      )}

      {/* CHECKOUT LOCK */}
      {buying && (
        <div className="checkout-loading">
          <div className="spinner" />
          <p>Redirecting to checkout…</p>
        </div>
      )}

      <style jsx>{`
        .wrap {
          min-height: 100vh;
          background: #000;
          color: #fff;
          padding: 2rem;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 2.5rem;
          align-items: center;
        }

        /* GALLERY */
        .gallery {
          display: flex;
          flex-direction: column;
        }

        .main {
          width: 100%;
          height: 620px; /* 🔒 LOCK HEIGHT */
          object-fit: contain;
          border-radius: 14px;
          background: #0b0f15;
        }

        .thumbs {
          display: flex;
          gap: 0.6rem;
          margin-top: 0.8rem;
        }

        .thumbs img {
          width: 72px;
          border-radius: 6px;
          cursor: pointer;
          opacity: 0.6;
          border: 1px solid transparent;
        }

        .thumbs img.active {
          opacity: 1;
          border-color: #22d3ee;
        }

        /* INFO */
        .info h1 {
          font-size: 2rem;
          margin-bottom: 0.4rem;
        }

        .price {
          font-size: 1.6rem;
          font-weight: 700;
          margin-bottom: 1rem;
          color: #22d3ee;
        }

        .size-chart {
          background: none;
          border: none;
          color: #9ca3af;
          text-decoration: underline;
          cursor: pointer;
          margin-bottom: 1rem;
        }

        .buy {
          padding: 0.9rem;
          border-radius: 12px;
          border: none;
          background: linear-gradient(180deg,#22d3ee,#0ea5e9);
          color: #000;
          font-weight: 700;
          cursor: pointer;
          width: 100%;
        }

        .buy:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .details {
          margin-top: 2rem;
          border-top: 1px solid rgba(255,255,255,0.1);
          padding-top: 1.2rem;
        }

        .details ul {
          list-style: none;
          padding: 0;
          color: #9ca3af;
        }

        .details li {
          margin-bottom: 0.4rem;
        }

        /* MODAL */
        .modal {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.75);
          backdrop-filter: blur(6px);
          display: grid;
          place-items: center;
          z-index: 50;
        }

        .modal-box {
          background: #0b0f15;
          padding: 1rem;
          border-radius: 14px;
          position: relative;
        }

        .modal-box img {
          max-width: 90vw;
          max-height: 80vh;
        }

        .close {
          position: absolute;
          top: 10px;
          right: 10px;
          background: none;
          border: none;
          color: #fff;
          font-size: 1.2rem;
          cursor: pointer;
        }

        /* LOCK SCREEN */
        .checkout-loading {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.75);
          backdrop-filter: blur(6px);
          display: grid;
          place-items: center;
          z-index: 100;
          color: #e5e7eb;
          text-align: center;
        }

        /* MOBILE */
        @media (max-width: 900px) {
          .wrap {
            grid-template-columns: 1fr;
          }
          .main {
            height: 420px;
          }
        }
      `}</style>
    </main>
  );
}
