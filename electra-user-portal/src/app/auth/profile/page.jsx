"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { auth, db } from "../../lib/firebase";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { useSignInRequiredPopup } from "../../lib/useSignInRequiredPopup";
import SignInRequiredPopup from "../../../components/auth/SignInRequiredPopup";

export default function ProfilePage() {
  const router = useRouter();
  const { open, secondsLeft, requireSignIn, goToSignIn, popupTitle, popupMessage } = useSignInRequiredPopup(router);

  const [user, setUser] = useState(null);
  const [checking, setChecking] = useState(true);

  const [name, setName] = useState("");
  const [college, setCollege] = useState("");
  const [stream, setStream] = useState("");
  const [year, setYear] = useState("");
  const [phone, setPhone] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      if (!firebaseUser) {
        requireSignIn({
          title: "Sign in to complete profile",
          message: "Profile setup is account-specific, so you need to sign in first.",
        });
        setChecking(false);
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
  }, [router, requireSignIn]);

  const isValid =
    name.trim().length >= 2 &&
    college.trim().length >= 3 &&
    stream.trim().length >= 2 &&
    ["1", "2", "3", "4", "m.tech", "phd", "mba", "faculty", "alumni"].includes(year) &&
    phone.trim().length >= 10;

  const handleSubmit = async () => {
    if (!user || !isValid) return;

    try {
      setLoading(true);
      setError("");

      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        name,
        email: user.email,
        phone,
        college,
        stream,
        year,
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

  if (checking) {
    return (
      <main className="wrap_profile">
        <SignInRequiredPopup open={open} secondsLeft={secondsLeft} onContinue={goToSignIn} title={popupTitle} message={popupMessage} />
        <p className="loading">Checking account...</p>
        <style jsx>{`
          .wrap_profile {
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
    <main className="wrap_profile">
      <SignInRequiredPopup open={open} secondsLeft={secondsLeft} onContinue={goToSignIn} title={popupTitle} message={popupMessage} />
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
            <option value="m.tech">M.tech</option>
            <option value="phd">PHD</option>
            <option value="mba">MBA</option>
            <option value="faculty">Faculty</option>
            <option value="alumni">Alumni</option>
          </select>
        </label>

        {error && <p className="error">{error}</p>}

        <button
          className="primary"
          disabled={!isValid || loading}
          onClick={handleSubmit}
        >
          {loading ? "Saving..." : "Finish Setup"}
        </button>
      </div>

      <style jsx>{`
        .wrap_profile {
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

