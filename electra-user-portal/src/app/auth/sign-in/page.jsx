"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { auth } from "../../lib/firebase";
import {
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
} from "firebase/auth";

export default function SignInPage() {
  const router = useRouter();

  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const unsub = onAuthStateChanged(auth, (user) => {
      if (user) {
        router.replace("/dashboard");
      }
    });

    return () => unsub();
  }, [mounted, router]);

  if (!mounted) return null;

  const handleGoogle = async () => {
    try {
      setLoading(true);
      setMessage("");

      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch {
      setMessage("Google sign-in failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="wrap_signin">
      <div className="bg-noise" />
      <div className="card">
        <p className="eyebrow">WELCOME TO ELECTRA</p>
        <h1>Sign in to continue</h1>
        <p className="sub">
          Use your Google account to access merch, resources, and your dashboard.
        </p>

        <button className="google" onClick={handleGoogle} disabled={loading}>
          <span className="g-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" width="18" height="18">
              <path
                fill="#EA4335"
                d="M12 10.2v3.9h5.4c-.2 1.3-1.5 3.9-5.4 3.9-3.2 0-5.8-2.7-5.8-6s2.6-6 5.8-6c1.8 0 3 .8 3.7 1.5l2.5-2.4C16.7 3.6 14.6 2.8 12 2.8a9.2 9.2 0 0 0 0 18.4c5.3 0 8.8-3.7 8.8-9a7.6 7.6 0 0 0-.1-1.3H12z"
              />
              <path
                fill="#34A853"
                d="M3.9 7.5 7 9.8a6 6 0 0 1 5-3.8V2.8a9.2 9.2 0 0 0-8.1 4.7z"
              />
              <path
                fill="#FBBC05"
                d="M12 21.2c2.5 0 4.6-.8 6.1-2.2l-3-2.5c-.8.6-1.8 1.1-3.1 1.1a6 6 0 0 1-5.6-4.1l-3.2 2.4A9.2 9.2 0 0 0 12 21.2z"
              />
              <path
                fill="#4285F4"
                d="M3.2 16 6.4 13.6a6.3 6.3 0 0 1-.3-1.6c0-.6.1-1.1.3-1.6L3.2 8A9.2 9.2 0 0 0 2.8 12c0 1.4.3 2.8.8 4z"
              />
            </svg>
          </span>
          {loading ? "Connecting..." : "Continue with Google"}
        </button>

        <p className="hint">Fast and secure login. No password needed.</p>

        {message && <p className="msg">{message}</p>}
      </div>

      <style jsx>{`
        .wrap_signin {
          position: relative;
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #000;
          padding: 1.1rem;
          overflow: hidden;
        }

        .bg-noise {
          position: absolute;
          inset: 0;
          pointer-events: none;
          opacity: 0.2;
          background:
            repeating-linear-gradient(
              0deg,
              rgba(255, 255, 255, 0.015) 0px,
              rgba(255, 255, 255, 0.015) 1px,
              transparent 1px,
              transparent 3px
            );
        }

        .card {
          position: relative;
          width: 100%;
          max-width: 460px;
          background:
            linear-gradient(160deg, rgba(8, 8, 8, 0.95), rgba(22, 22, 22, 0.92) 60%, rgba(10, 10, 10, 0.96));
          border: 1px solid rgba(255, 255, 255, 0.14);
          border-radius: 22px;
          padding: 1.35rem 1.1rem;
          box-shadow:
            0 24px 60px rgba(0, 0, 0, 0.72),
            inset 0 1px 0 rgba(255, 255, 255, 0.08);
          backdrop-filter: blur(10px);
          overflow: hidden;
        }

        .card::before {
          content: "";
          position: absolute;
          inset: 0;
          pointer-events: none;
          background:
            linear-gradient(
              rgba(255, 255, 255, 0.03) 1px,
              transparent 1px
            );
          background-size: 100% 4px;
          opacity: 0.24;
        }

        .eyebrow {
          position: relative;
          margin: 0 0 0.45rem;
          font-size: 0.72rem;
          letter-spacing: 0.16em;
          color: #d1d5db;
          font-weight: 700;
        }

        h1 {
          position: relative;
          margin: 0;
          color: #fff;
          font-size: clamp(1.45rem, 5vw, 1.95rem);
          line-height: 1.2;
        }

        .sub {
          position: relative;
          color: #d1d5db;
          margin: 0.7rem 0 1rem;
          font-size: 0.95rem;
          line-height: 1.55;
        }

        .google {
          position: relative;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 0.6rem;
          width: 100%;
          min-height: 48px;
          padding: 0.7rem 1rem;
          background: linear-gradient(90deg, #f8fafc, #e2e8f0);
          border: 1px solid rgba(255, 255, 255, 0.2);
          color: #0f172a;
          border-radius: 12px;
          font-weight: 700;
          cursor: pointer;
          transition: transform 0.15s ease, box-shadow 0.2s ease;
        }

        .google:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 12px 30px rgba(226, 232, 240, 0.24);
        }

        .google:disabled {
          opacity: 0.72;
          cursor: wait;
        }

        .g-icon {
          width: 24px;
          height: 24px;
          border-radius: 999px;
          display: grid;
          place-items: center;
          background: #fff;
        }

        .hint {
          position: relative;
          margin: 0.8rem 0 0;
          color: #9ca3af;
          text-align: center;
          font-size: 0.84rem;
        }

        .msg {
          position: relative;
          margin-top: 0.7rem;
          color: #fca5a5;
          font-size: 0.88rem;
          text-align: center;
        }

        @media (min-width: 640px) {
          .card {
            padding: 1.9rem 1.6rem;
          }
        }
      `}</style>
    </main>
  );
}
