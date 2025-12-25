"use client";

import { useEffect, useState } from "react";
import { auth, db } from "../lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { useAuthGuard } from "../lib/useAuthGaurd";
import { signOut } from "firebase/auth";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const router = useRouter();
  const { loading: authLoading } = useAuthGuard({ requireProfile: true });

  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  /* ---------- FETCH USER PROFILE ---------- */
  useEffect(() => {
    if (!auth.currentUser) return;

    const fetchUser = async () => {
      const ref = doc(db, "users", auth.currentUser.uid);
      const snap = await getDoc(ref);

      if (snap.exists()) {
        setUserData(snap.data());
      }
      setLoading(false);
    };

    fetchUser();
  }, []);

  /* ---------- SIGN OUT ---------- */
  const handleLogout = async () => {
    await signOut(auth);
    router.push("/");
  };

  if (authLoading || loading) {
    return (
      <main className="loading">
        Loading dashboard…
        <style jsx>{`
          .loading {
            min-height: 100vh;
            display: grid;
            place-items: center;
            background: radial-gradient(circle at top, #0b0f0f, #050505);
            color: #9ca3af;
          }
        `}</style>
      </main>
    );
  }

  return (
    <main className="wrap">
      {/* HEADER */}
      <header className="top fade-in">
        <div>
          <p className="eyebrow">Welcome back</p>
          <h1>{userData.name}</h1>
        </div>

        <button onClick={handleLogout}>Sign out</button>
      </header>

      {/* PROFILE */}
      <section className="card slide-up">
        <h2>Profile</h2>

        <div className="grid">
          <Item label="Email" value={userData.email} />
          <Item label="Phone" value={userData.phone} />
          <Item label="College" value={userData.college} />
          <Item label="Stream" value={userData.stream} />
          <Item label="Year" value={`${userData.year} Year`} />
        </div>
      </section>

      {/* ACTIONS */}
      <section className="actions">
        <Action
          title="Merch Store"
          desc="Browse and order exclusive Electra merchandise"
          onClick={() => router.push("/gotyourmerch")}
        />
        <Action
          title="My Orders"
          desc="Track, manage, and view your order history"
          onClick={() => router.push("/dashboard/orders")}
        />
      </section>

      <style jsx>{`
        /* ---------- PAGE ---------- */
        .wrap {
          min-height: 100vh;
          background: radial-gradient(circle at top, #0b0f0f, #050505);
          color: #fff;
          padding: clamp(1.2rem, 4vw, 2.5rem);
          max-width: 1100px;
          margin: 0 auto;
        }

        /* ---------- HEADER ---------- */
        .top {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          margin-bottom: 2.4rem;
        }

        .eyebrow {
          color: #9ca3af;
          font-size: 0.7rem;
          letter-spacing: 0.28em;
          text-transform: uppercase;
          margin-bottom: 0.25rem;
        }

        .top h1 {
          font-size: clamp(1.6rem, 3vw, 2.2rem);
          font-weight: 700;
        }

        .top button {
          background: transparent;
          border: 1px solid rgba(255,255,255,0.25);
          color: #fff;
          padding: 0.55rem 1rem;
          border-radius: 999px;
          cursor: pointer;
          transition: all 0.25s ease;
        }

        .top button:hover {
          background: rgba(255,255,255,0.08);
          border-color: #fff;
        }

        /* ---------- PROFILE CARD ---------- */
        .card {
          background: linear-gradient(180deg, #0f1414, #070808);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 20px;
          padding: 1.6rem;
          margin-bottom: 2.6rem;
          box-shadow:
            0 10px 30px rgba(0,0,0,0.6),
            inset 0 1px 0 rgba(255,255,255,0.05);
        }

        .card h2 {
          margin-bottom: 1.3rem;
          font-size: 1.1rem;
        }

        .grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 1rem;
        }

        /* ---------- ACTIONS ---------- */
        .actions {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 1.2rem;
        }

        /* ---------- MOTION (CSS ONLY) ---------- */
        .fade-in {
          animation: fadeIn 0.45s ease-out forwards;
        }

        .slide-up {
          animation: slideUp 0.55s ease-out forwards;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(16px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </main>
  );
}

/* ---------- SMALL COMPONENTS ---------- */

function Item({ label, value }) {
  return (
    <div className="item">
      <span>{label}</span>
      <strong>{value}</strong>

      <style jsx>{`
        .item {
          background: linear-gradient(180deg, #0b0f0f, #060707);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 14px;
          padding: 0.9rem 1rem;
          box-shadow: inset 0 1px 0 rgba(255,255,255,0.04);
          transition: border 0.25s ease;
        }

        .item:hover {
          border-color: rgba(255,255,255,0.25);
        }

        span {
          display: block;
          color: #9ca3af;
          font-size: 0.7rem;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          margin-bottom: 0.25rem;
        }

        strong {
          font-size: 0.95rem;
          font-weight: 500;
        }
      `}</style>
    </div>
  );
}

function Action({ title, desc, onClick }) {
  return (
    <div className="action" onClick={onClick}>
      <h3>{title}</h3>
      <p>{desc}</p>

      <style jsx>{`
        .action {
          cursor: pointer;
          background: linear-gradient(180deg, #0f1414, #070808);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 20px;
          padding: 1.6rem;
          box-shadow:
            0 10px 30px rgba(0,0,0,0.6),
            inset 0 1px 0 rgba(255,255,255,0.05);
          transition: all 0.3s ease;
        }

        .action:hover {
          transform: translateY(-4px);
          border-color: rgba(255,255,255,0.35);
        }

        h3 {
          margin-bottom: 0.35rem;
          font-size: 1.05rem;
        }

        p {
          color: #9ca3af;
          font-size: 0.85rem;
          line-height: 1.5;
        }
      `}</style>
    </div>
  );
}
