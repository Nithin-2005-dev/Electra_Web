"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { auth, db } from "../../lib/firebase";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

export default function ProfilePage() {
  const router = useRouter();

  const [user, setUser] = useState(null);
  const [checking, setChecking] = useState(true);

  const [name, setName] = useState("");
  const [college, setCollege] = useState("");
  const [stream, setStream] = useState("");
  const [year, setYear] = useState("");
  const [phone, setPhone] = useState(""); // ✅ NEW

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  /* ---------- AUTH HYDRATION ---------- */
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      if (!firebaseUser) {
        router.replace("/auth/sign-in");
        return;
      }

      setUser(firebaseUser);

      const ref = doc(db, "users", firebaseUser.uid);
      const snap = await getDoc(ref);

      if (snap.exists()) {
        router.replace("/dashboard");
        return;
      }

      setChecking(false);
    });

    return () => unsub();
  }, [router]);

  /* ---------- VALIDATION ---------- */
  const isValid =
    name.trim().length >= 2 &&
    college.trim().length >= 3 &&
    stream.trim().length >= 2 &&
    ["1", "2", "3", "4"].includes(year) &&
    phone.trim().length >= 10; // ✅ phone mandatory

  /* ---------- SUBMIT ---------- */
  const handleSubmit = async () => {
    if (!user || !isValid) return;

    try {
      setLoading(true);
      setError("");

      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        name,
        email: user.email,
        phone, // ✅ from input
        college,
        stream,
        year: Number(year),
        role: "member",
        createdAt: serverTimestamp(),
      });

      router.push("/dashboard");
    } catch {
      setError("Failed to save profile. Try again.");
    } finally {
      setLoading(false);
    }
  };

  /* ---------- LOADING ---------- */
  if (checking) {
    return (
      <main className="wrap">
        <p className="loading">Checking account…</p>
        <style jsx>{`
          .wrap {
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

  return (
    <main className="wrap">
      <div className="card">
        <h1>Complete your profile</h1>
        <p className="sub">
          This helps us verify members and manage society activities
        </p>

        <label>
          Full name
          <input value={name} onChange={(e) => setName(e.target.value)} />
        </label>

        <label>
          Phone number <span style={{ color: "#ef4444" }}>*</span>
          <input
            type="tel"
            placeholder="10-digit phone number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </label>

        <label>
          College
          <input value={college} onChange={(e) => setCollege(e.target.value)} />
        </label>

        <label>
          Stream / Department
          <input value={stream} onChange={(e) => setStream(e.target.value)} />
        </label>

        <label>
          Year
          <select value={year} onChange={(e) => setYear(e.target.value)}>
            <option value="">Select year</option>
            <option value="1">1st Year</option>
            <option value="2">2nd Year</option>
            <option value="3">3rd Year</option>
            <option value="4">4th Year</option>
          </select>
        </label>

        {error && <p className="error">{error}</p>}

        <button
          className="primary"
          disabled={!isValid || loading}
          onClick={handleSubmit}
        >
          {loading ? "Saving…" : "Finish Setup"}
        </button>
      </div>

      <style jsx>{`
        .wrap {
          min-height: 100vh;
          display: grid;
          place-items: center;
          background: #000;
          padding: 2rem;
        }

        .card {
          width: 100%;
          max-width: 460px;
          background: #0b0b0b;
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 14px;
          padding: 2rem;
        }

        h1 {
          color: #fff;
          font-size: 1.5rem;
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

        input,
        select {
          background: #000;
          border: 1px solid rgba(255, 255, 255, 0.12);
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
          margin-top: 0.5rem;
        }

        .primary:disabled {
          opacity: 0.5;
        }

        .error {
          color: #ef4444;
          font-size: 0.85rem;
        }
      `}</style>
    </main>
  );
}
