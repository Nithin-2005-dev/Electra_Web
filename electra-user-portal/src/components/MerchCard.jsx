"use client";

import Link from "next/link";
import { cloudinaryUrl } from "../app/lib/cloudinary";
import { auth, db } from "../app/lib/firebase";
import { doc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import { useEffect, useState } from "react";

export default function MerchCard({ product }) {
  const soldOut = !product.available;

  const [user, setUser] = useState(null);
  const [subscribed, setSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  /* ───────── AUTH LISTENER ───────── */
  useEffect(() => {
    const unsub = auth.onAuthStateChanged((u) => {
      setUser(u || null);
      setSubscribed(
        !!u && product.interestedUsers?.includes(u.uid)
      );
    });
    return () => unsub();
  }, [product.interestedUsers]);

  /* ───────── TOAST ───────── */
  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  };

  /* ───────── NOTIFY LOGIC ───────── */
  const toggleNotify = async () => {
    if (loading) return;

    if (!user) {
      showToast("Please sign in to get notified");
      return;
    }

    try {
      setLoading(true);
      const ref = doc(db, "products", product.id);

      if (subscribed) {
        await updateDoc(ref, {
          interestedUsers: arrayRemove(user.uid),
        });
        setSubscribed(false);
        showToast("Unsubscribed successfully");
      } else {
        await updateDoc(ref, {
          interestedUsers: arrayUnion(user.uid),
        });
        setSubscribed(true);
        showToast("You’ll be notified when available");
      }
    } catch (err) {
      console.error(err);
      showToast("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="card">
        {/* IMAGE — ONLY CLICKABLE AREA */}
        <Link
          href={`/gotyourmerch/${product.id}`}
          className="imageLink"
        >
          <div className="imageWrap">
            {soldOut && <span className="sold">SOLD OUT</span>}

            <img
              src={cloudinaryUrl(product.imageMain, "q_auto,f_auto,w_900/")}
              alt={product.name}
              loading="lazy"
            />

            <div className="imageGlow" />
          </div>
        </Link>

        {/* INFO */}
        <div className="info">
          <p className="name">{product.name}</p>
          <p className="price">₹{product.price}</p>

          {/* NOTIFY BUTTON */}
          {soldOut && (
            <button
              type="button"
              onClick={toggleNotify}
              disabled={loading}
              className="notifyBtn"
            >
              {loading
                ? "PLEASE WAIT…"
                : subscribed
                ? "SUBSCRIBED ✓"
                : "NOTIFY ME"}
            </button>
          )}
        </div>
      </div>

      {/* TOAST */}
      {toast && <div className="toast">{toast}</div>}

      <style jsx>{`
        .card {
          border-radius: 26px;
          padding: 1rem;
          background: linear-gradient(180deg, #0e1111, #070808);
          box-shadow:
            0 10px 20px rgba(0, 0, 0, 0.6),
            0 30px 70px rgba(0, 0, 0, 0.85),
            inset 0 1px 0 rgba(255, 255, 255, 0.05);

          transform: translateY(18px) scale(0.97);
          opacity: 0;
          animation: cardEnter 0.65s ease-out forwards;
          transition: transform 0.35s ease, box-shadow 0.35s ease;
        }

        .card:hover {
          transform: translateY(-6px) scale(1.03);
          box-shadow:
            0 18px 40px rgba(0, 0, 0, 0.75),
            0 60px 140px rgba(0, 0, 0, 0.95),
            inset 0 1px 0 rgba(255, 255, 255, 0.08);
        }

        /* IMAGE LINK */
        .imageLink {
          display: block;
          text-decoration: none;
        }

        .imageWrap {
          position: relative;
          width: 100%;
          aspect-ratio: 1 / 1.25;
          border-radius: 20px;
          background: radial-gradient(
            120% 90% at 50% 0%,
            #1a1f1f,
            #060707
          );
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        img {
          max-width: 82%;
          max-height: 82%;
          object-fit: contain;
          filter:
            drop-shadow(0 20px 35px rgba(0, 0, 0, 0.7))
            drop-shadow(0 6px 12px rgba(0, 0, 0, 0.8));
          transition: transform 0.45s ease;
        }

        .imageWrap:hover img {
          transform: scale(1.06);
        }

        .imageGlow {
          position: absolute;
          inset: 0;
          background: radial-gradient(
            circle at center,
            rgba(0, 229, 255, 0.045),
            transparent 60%
          );
          pointer-events: none;
        }

        .sold {
          position: absolute;
          top: 14px;
          left: 14px;
          z-index: 3;
          background: rgba(10, 10, 10, 0.85);
          border: 1px solid rgba(255, 255, 255, 0.18);
          backdrop-filter: blur(8px);
          color: #f9fafb;
          font-size: 0.65rem;
          letter-spacing: 0.22em;
          padding: 0.45rem 0.8rem;
          border-radius: 999px;
        }

        .info {
          text-align: center;
          padding: 1.1rem 0.3rem 0.4rem;
        }

        .name {
          font-size: 0.85rem;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: #e5e7eb;
          margin-bottom: 0.35rem;
        }

        .price {
          font-size: 0.75rem;
          color: #9ca3af;
          letter-spacing: 0.14em;
        }

        .notifyBtn {
          margin-top: 0.6rem;
          background: none;
          border: 1px solid rgba(255,255,255,0.25);
          color: #fff;
          padding: 0.4rem 0.9rem;
          border-radius: 999px;
          font-size: 0.65rem;
          letter-spacing: 0.18em;
          cursor: pointer;
        }

        .notifyBtn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .toast {
          position: fixed;
          bottom: 28px;
          left: 50%;
          transform: translateX(-50%);
          background: rgba(10,10,10,0.9);
          border: 1px solid rgba(255,255,255,0.15);
          padding: 0.6rem 1rem;
          border-radius: 999px;
          font-size: 0.7rem;
          letter-spacing: 0.12em;
          color: #f9fafb;
          z-index: 999;
          backdrop-filter: blur(8px);
          animation: toastIn 0.3s ease;
        }

        @keyframes toastIn {
          from {
            opacity: 0;
            transform: translate(-50%, 10px);
          }
          to {
            opacity: 1;
            transform: translate(-50%, 0);
          }
        }

        @keyframes cardEnter {
          to {
            transform: translateY(0) scale(1);
            opacity: 1;
          }
        }
      `}</style>
    </>
  );
}
