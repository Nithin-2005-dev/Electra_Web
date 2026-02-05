"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { auth } from "../../lib/firebase";
import {
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
} from "firebase/auth";
import { sendEmailLink } from "../../lib/auth";

export default function SignInPage() {
  const router = useRouter();

  const [mounted, setMounted] = useState(false);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // ✅ Prevent hydration issues
  useEffect(() => {
    setMounted(true);
  }, []);

  // ✅ Auth state listener
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

  /* ---------- GOOGLE SIGN-IN ---------- */
  const handleGoogle = async () => {
    try {
      setLoading(true);
      setMessage("");

      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch {
      setMessage("Google sign-in failed");
    } finally {
      setLoading(false);
    }
  };

  /* ---------- EMAIL LINK SIGN-IN ---------- */
  const handleEmail = async () => {
    if (!email.includes("@")) return;

    try {
      setLoading(true);
      setMessage("");

      await sendEmailLink(email);
      setMessage("📩 Check your email to complete sign-in.");
    } catch {
      setMessage("Failed to send email link.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="wrap_signin">
      <div className="card">
        <h1>Sign in</h1>
        <p className="sub">Access your Electra account</p>

        <button
          suppressHydrationWarning
          className="google"
          onClick={handleGoogle}
          disabled={loading}
        >
          Continue with Google
        </button>

        <div className="divider">
          <span>or</span>
        </div>

        <label>
          Email
          <input
            suppressHydrationWarning
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>

        <button
          suppressHydrationWarning
          className="primary"
          disabled={loading || !email.includes("@")}
          onClick={handleEmail}
        >
          {loading ? "Sending…" : "Send sign-in link"}
        </button>

        {message && <p className="msg">{message}</p>}
      </div>

      <style jsx>{`
        .wrap_signin {
          min-height: 100vh;
          display: grid;
          place-items: center;
          background: #000;
          padding: 2rem;
        }

        .card {
          width: 100%;
          max-width: 420px;
          background: #0b0b0b;
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 14px;
          padding: 2rem;
        }

        h1 {
          color: #fff;
          font-size: 1.6rem;
        }

        .sub {
          color: #9ca3af;
          margin-bottom: 1.5rem;
        }

        label {
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
          color: #9ca3af;
          font-size: 0.8rem;
          margin-bottom: 1rem;
        }

        input {
          background: #000;
          border: 1px solid rgba(255,255,255,0.12);
          border-radius: 8px;
          padding: 0.7rem;
          color: #fff;
        }

        .primary {
          width: 100%;
          padding: 0.75rem;
          background: #fff;
          color: #000;
          border-radius: 8px;
          border: none;
          margin-top: 0.4rem;
        }

        .google {
          width: 100%;
          padding: 0.7rem;
          background: transparent;
          border: 1px solid rgba(255,255,255,0.2);
          color: #fff;
          border-radius: 8px;
          margin-bottom: 1.2rem;
        }

        .divider {
          text-align: center;
          position: relative;
          margin: 1rem 0;
        }

        .divider span {
          background: #0b0b0b;
          padding: 0 0.6rem;
          color: #6b7280;
          font-size: 0.75rem;
        }

        .divider::before {
          content: "";
          position: absolute;
          inset: 50% 0 auto 0;
          height: 1px;
          background: rgba(255,255,255,0.1);
        }

        .msg {
          margin-top: 0.8rem;
          color: #9ca3af;
          font-size: 0.85rem;
        }
      `}</style>
    </main>
  );
}
