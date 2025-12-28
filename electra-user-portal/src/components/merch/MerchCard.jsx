"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { auth, db } from "../../app/lib/firebase";
import { doc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import { cloudinaryImage, cloudinaryVideo } from "../../app/lib/cloudinary";

export default function MerchCard({ product }) {
  const soldOut = !product.available;

  const [user, setUser] = useState(null);
  const [subscribed, setSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const [playing, setPlaying] = useState(false);
  const [direction, setDirection] = useState("forward");

  const forwardRef = useRef(null);
  const backwardRef = useRef(null);

  const isTouch =
    typeof window !== "undefined" &&
    window.matchMedia("(hover: none)").matches;

  /* ───────── AUTH ───────── */
  useEffect(() => {
    const unsub = auth.onAuthStateChanged((u) => {
      setUser(u || null);
      setSubscribed(
        !!u && product.interestedUsers?.includes(u.uid)
      );
    });
    return () => unsub();
  }, [product.interestedUsers]);

  /* ───────── VIDEO CONTROL ───────── */
  const startPreview = () => {
    if (!product.video) return;

    setPlaying(true);
    setDirection("forward");

    backwardRef.current?.pause();
    if (backwardRef.current) backwardRef.current.currentTime = 0;

    forwardRef.current.currentTime = 0;
    forwardRef.current.play();
  };

  const stopPreview = () => {
    setPlaying(false);

    forwardRef.current?.pause();
    backwardRef.current?.pause();

    if (forwardRef.current) forwardRef.current.currentTime = 0;
    if (backwardRef.current) backwardRef.current.currentTime = 0;
  };

  const onForwardEnd = () => {
    setDirection("backward");
    backwardRef.current.currentTime = 0;
    backwardRef.current.play();
  };

  const onBackwardEnd = () => {
    setDirection("forward");
    forwardRef.current.currentTime = 0;
    forwardRef.current.play();
  };

  /* ───────── MOBILE TOUCH (FIX) ───────── */
  const handleMobileTouch = (e) => {
    if (!isTouch || !product.video) return;

    // First tap → play video
    if (!playing) {
      e.preventDefault();
      startPreview();
      return;
    }

    // Second tap → navigate
    window.location.href = `/gotyourmerch/${product.id}`;
  };

  /* ───────── TOAST ───────── */
  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  };

  /* ───────── NOTIFY ───────── */
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
        showToast("Unsubscribed");
      } else {
        await updateDoc(ref, {
          interestedUsers: arrayUnion(user.uid),
        });
        setSubscribed(true);
        showToast("You’ll be notified");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div
        className="card"
        onMouseEnter={!isTouch ? startPreview : undefined}
        onMouseLeave={!isTouch ? stopPreview : undefined}
        onTouchStart={handleMobileTouch}
      >
        <Link href={`/gotyourmerch/${product.id}`} className="imageLink">
          <div className="imageWrap">
            {soldOut && <span className="sold">SOLD OUT</span>}

            <img
              src={cloudinaryImage(
                product.imageMain,
                "q_auto,f_auto,w_900/"
              )}
              alt={product.name}
              className={playing ? "hide" : ""}
            />

            {product.video && (
              <video
                ref={forwardRef}
                className={`video ${
                  playing && direction === "forward" ? "show" : ""
                }`}
                src={cloudinaryVideo(product.video, "q_auto,f_auto/")}
                muted
                playsInline
                preload="auto"
                onEnded={onForwardEnd}
              />
            )}

            {product.video && (
              <video
                ref={backwardRef}
                className={`video reverse ${
                  playing && direction === "backward" ? "show" : ""
                }`}
                src={cloudinaryVideo(product.video, "q_auto,f_auto/")}
                muted
                playsInline
                preload="auto"
                onEnded={onBackwardEnd}
              />
            )}
          </div>
        </Link>

        <div className="info">
          <p className="name">{product.name}</p>
          <p className="price">₹{product.price}</p>

          {soldOut && (
            <button
              className="notifyBtn"
              onClick={toggleNotify}
              disabled={loading}
            >
              {subscribed ? "SUBSCRIBED ✓" : "NOTIFY ME"}
            </button>
          )}
        </div>
      </div>

      {toast && <div className="toast">{toast}</div>}

      <style jsx>{`
        .card {
          border-radius: 26px;
          padding: 1rem;
          background: linear-gradient(180deg, #0e1111, #070808);
          transition: transform 0.35s ease;
        }

        .card:hover {
          transform: translateY(-6px) scale(1.03);
        }

        .imageWrap {
          position: relative;
          aspect-ratio: 1 / 1.25;
          border-radius: 20px;
          overflow: hidden;
          background: #050606;
        }

        img {
          width: 100%;
          height: 100%;
          object-fit: contain;
          transition: opacity 0.3s ease;
        }

        .hide {
          opacity: 0;
        }

        .video {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .video.show {
          opacity: 1;
        }

        .reverse {
          transform: scaleX(-1);
        }

        .sold {
          position: absolute;
          top: 14px;
          left: 14px;
          z-index: 5;
          background: rgba(0, 0, 0, 0.85);
          padding: 0.4rem 0.8rem;
          border-radius: 999px;
          font-size: 0.65rem;
        }

        .info {
          text-align: center;
          padding-top: 1rem;
        }

        .name {
          letter-spacing: 0.22em;
          text-transform: uppercase;
        }

        .price {
          font-size: 0.75rem;
          color: #9ca3af;
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
      `}</style>
    </>
  );
}
