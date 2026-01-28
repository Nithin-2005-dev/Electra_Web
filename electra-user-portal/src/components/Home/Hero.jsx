"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { auth, db } from "../../app/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import Link from "next/link";

export default function Hero() {
  const router = useRouter();

  const [checking, setChecking] = useState(true);
  const [user, setUser] = useState(null);
  const [hasProfile, setHasProfile] = useState(false);

  /* ---------- AUTH + PROFILE CHECK ---------- */
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      if (!firebaseUser) {
        setUser(null);
        setHasProfile(false);
        setChecking(false);
        return;
      }

      setUser(firebaseUser);

      const ref = doc(db, "users", firebaseUser.uid);
      const snap = await getDoc(ref);

      setHasProfile(snap.exists());
      setChecking(false);
    });

    return () => unsub();
  }, []);

  /* ---------- CTA HANDLER ---------- */
  const handleJoin = () => {
    if (checking) return;

    if (!user) {
      router.push("/auth/sign-in");
      return;
    }

    if (!hasProfile) {
      router.push("/auth/profile");
      return;
    }

    router.push("/dashboard");
  };

  return (
    <section className="hero">
      {/* BACKGROUND VIDEO */}
      <video
        className="video"
        src="/merch-drop.mp4"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
      />

      {/* OVERLAY */}
      <div className="overlay" />

      {/* CONTENT */}
      <div className="content">
        <h1>
          <span className="script">Electra</span>
          <span className="block">SOCIETY</span>
        </h1>

        <p className="subtitle">
          Official society of the Electrical Engineering Department.
          <br />
          NIT Silchar — where ideas become impact.
        </p>
        <div className="actions">
        <Link href={'/getyourmerch'}>
<button className="primary">Explore Merch</button>
        </Link>

          <button
            className="secondary"
            onClick={handleJoin}
            disabled={checking}
          >
            {checking
              ? "Loading…"
              : user
              ? hasProfile
                ? "Go to Dashboard"
                : "Complete Profile"
              : "Join Electra"}
          </button>
        </div>
      </div>

      <style jsx>{`
        .hero {
          position: relative;
          min-height: 100vh;
          background: #000;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .video {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          z-index: 0;
          filter: brightness(0.7) contrast(1.05);
        }

        .overlay {
          position: absolute;
          inset: 0;
          background: radial-gradient(
              1200px 600px at 60% 20%,
              rgba(255, 255, 255, 0.12),
              transparent 60%
            ),
            linear-gradient(
              180deg,
              rgba(0, 0, 0, 0.35),
              rgba(0, 0, 0, 0.9)
            );
          z-index: 1;
          pointer-events: none;
        }

        .content {
          position: relative;
          z-index: 2;
          text-align: center;
          max-width: 1100px;
          padding: 0 20px;
          color: #fff;
        }

        h1 {
          margin: 0;
          line-height: 1;
        }

        .script {
          display: block;
          font-family: "Playfair Display", serif;
          font-style: italic;
          font-weight: 400;
          font-size: clamp(5.2rem, 10vw, 7.4rem);
          line-height: 1;
          transform: translateY(0.6rem);
        }

        .block {
          display: block;
          font-family: "Inter", system-ui, sans-serif;
          font-weight: 900;
          letter-spacing: -0.04em;
          font-size: clamp(6rem, 13vw, 9.5rem);
          line-height: 1;
        }

        .subtitle {
          margin-top: 2.2rem;
          font-size: 1.15rem;
          line-height: 1.6;
          color: rgba(255, 255, 255, 0.65);
        }

        .actions {
          margin-top: 3rem;
          display: flex;
          gap: 1rem;
          justify-content: center;
          flex-wrap: wrap;
        }

        button {
          border-radius: 999px;
          padding: 0.9rem 1.8rem;
          font-size: 0.75rem;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .primary {
          background: #fff;
          color: #000;
          border: none;
        }

        .secondary {
          background: transparent;
          color: #fff;
          border: 1px solid rgba(255, 255, 255, 0.25);
        }

        .secondary:hover {
          border-color: rgba(255, 255, 255, 0.6);
        }
      `}</style>
    </section>
  );
}
