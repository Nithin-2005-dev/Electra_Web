"use client";

import { useEffect, useState } from "react";
import {
  doc,
  getDoc,
  setDoc,
  serverTimestamp,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
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
  const [buying, setBuying] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);

  /* ───────── LOAD PRODUCT ───────── */
  useEffect(() => {
    if (!productId) return;

    const loadProduct = async () => {
      const snap = await getDoc(doc(db, "products", productId));
      if (!snap.exists()) return router.replace("/gotyourmerch");

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
          border: 3px solid rgba(255, 255, 255, 0.2);
          border-top-color: #22d3ee;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </main>
  );
}

  if (!product || !active) return null;

  const images = Array.from(
    new Set([product.imageMain, ...product.imageGallery])
  ).filter(Boolean);

  const orderNow = async () => {
  if (buying || !product.available) return;

  const user = auth.currentUser;
  if (!user) return router.push("/auth/sign-in");

  setBuying(true);

  const q = query(
    collection(db, "orders"),
    where("userId", "==", user.uid)
  );

  const snap = await getDocs(q);

  const pendingOrder = snap.docs
    .map(d => d.data())
    .find(
      o =>
        o.productId === productId &&
        o.paymentStatus === "pending_payment"
    );

  if (pendingOrder) {
    router.push(`/checkout/${pendingOrder.orderId}`);
    return;
  }

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
};



  return (
    <main className="wrap">
      {/* PRODUCT */}
      <section className="gallery">
        <img
          className="main"
          src={cloudinaryUrl(active, "q_auto,f_auto,w_1400/")}
          alt={product.name}
        />
        <div className="thumbs">
          {images.map((pid, i) => (
            <img
              key={i}
              src={cloudinaryUrl(pid, "q_auto,f_auto,w_200/")}
              onClick={() => setActive(pid)}
              className={pid === active ? "active" : ""}
            />
          ))}
        </div>
      </section>

      <section className="info">
        <h1>{product.name}</h1>
        <div className="price">₹{product.price}</div>

        <button className="size-chart" onClick={() => setShowSizeChart(true)}>
          Size Chart
        </button>

        <button className="buy" disabled={!product.available || buying} onClick={orderNow}>
          {buying ? "Processing…" : "Buy It Now"}
        </button>

        {!product.available && <span className="out">Out of stock</span>}

        <div className="details">
          <h3>Product Details</h3>
          <ul>
            <li><strong>Fabric:</strong> French Terry Loopknit Cotton</li>
            <li><strong>Fit:</strong> Oversized</li>
            <li><strong>GSM:</strong> 240</li>
            <li><strong>Care:</strong> Cold wash, inside-out</li>
          </ul>
        </div>
      </section>

      {/* FAQ SECTION */}
      <section className="faq">
        <h2>Frequently Asked Questions</h2>

        {FAQS.map((f, i) => (
          <div
            key={i}
            className={`faq-item ${openFaq === i ? "open" : ""}`}
            onClick={() => setOpenFaq(openFaq === i ? null : i)}
          >
            <div className="question">
              <span>{f.q}</span>
              <span className="icon">{openFaq === i ? "−" : "+"}</span>
            </div>
            <div className="answer">{f.a}</div>
          </div>
        ))}
      </section>

      {/* SIZE CHART */}
      {showSizeChart && (
        <div className="modal" onClick={() => setShowSizeChart(false)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <button className="close">✕</button>
            <img src={product.sizeChartUrl} />
          </div>
        </div>
      )}

      {buying && (
        <div className="checkout-loading">
          <div className="spinner" />
          Redirecting to checkout…
        </div>
      )}

      <style jsx>{`
        /* FAQ */
        .faq {
          grid-column: 1 / -1;
          margin-top: 4rem;
          width: 100%;
          margin-inline: auto;
        }

        .faq h2 {
          font-size: 1.6rem;
          margin-bottom: 1.5rem;
          text-align: center;
        }

        .faq-item {
          border-bottom: 1px solid rgba(255,255,255,0.1);
          padding: 1rem 0;
          cursor: pointer;
        }

        .question {
          display: flex;
          justify-content: space-between;
          font-weight: 600;
          letter-spacing: 0.03em;
        }

        .answer {
          max-height: 0;
          overflow: hidden;
          color: #9ca3af;
          font-size: 0.9rem;
          transition: max-height 0.35s ease, opacity 0.3s ease;
          opacity: 0;
        }

        .faq-item.open .answer {
          max-height: 200px;
          opacity: 1;
          margin-top: 0.6rem;
        }

        .icon {
          color: #22d3ee;
        }
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

/* FAQ DATA */
const FAQS = [
  {
    q: "How long does delivery take?",
    a: "Orders are shipped in bulk. Delivery usually takes 5–10 working days after shipping.",
  },
  {
    q: "Can I cancel or change my order?",
    a: "Orders cannot be changed once payment is confirmed.",
  },
  {
    q: "How do I choose the right size?",
    a: "Please refer to the size chart above. Our fits are oversized by default.",
  },
  {
    q: "Is this official Electra merchandise?",
    a: "Yes. All merch is officially designed and distributed by Electra Society.",
  },
];
