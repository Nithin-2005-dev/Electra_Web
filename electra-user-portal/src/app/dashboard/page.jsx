"use client";

import { useEffect, useState } from "react";
import { auth, db } from "../lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/navigation";
import { useAuthGuard } from "../lib/useAuthGaurd";

export default function DashboardPage() {
  const router = useRouter();
  const { loading: authLoading } = useAuthGuard({ requireProfile: true });

  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  /* ───────── FIXED AUTH + FETCH ───────── */
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user) return;

      try {
        const ref = doc(db, "users", user.uid);
        const snap = await getDoc(ref);

        if (snap.exists()) {
          setUserData(snap.data());
        }
      } finally {
        setLoading(false);
      }
    });

    return () => unsub();
  }, []);

  /* ───────── SIGN OUT ───────── */
  const handleLogout = async () => {
    await signOut(auth);
    router.push("/");
  };

  /* ───────── PREMIUM LOADING ───────── */
  if (authLoading || loading) {
    return (
      <main className="wrap_signout">
        {/* HEADER SKELETON */}
        <div className="skel header">
          <div className="line w40" />
          <div className="pill" />
        </div>

        {/* PROFILE CARD SKELETON */}
        <div className="skel card">
          <div className="line w25" />
          <div className="grid">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="box" />
            ))}
          </div>
        </div>

        {/* ACTIONS SKELETON */}
        <div className="grid actions">
          <div className="box tall" />
          <div className="box tall" />
        </div>

        <style jsx>{`
          .wrap_signout {
            min-height: 100vh;
            background: radial-gradient(circle at top, #0b0f0f, #050505);
            padding: clamp(1.2rem, 4vw, 2.5rem);
            max-width: 1100px;
            margin: 0 auto;
          }

          .skel {
            background: linear-gradient(
              90deg,
              #111 25%,
              #1a1a1a 37%,
              #111 63%
            );
            background-size: 400% 100%;
            animation: shimmer 1.4s infinite;
            border-radius: 18px;
            margin-bottom: 2rem;
          }

          .header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 1.6rem;
          }

          .line {
            height: 18px;
            border-radius: 8px;
          }

          .w40 { width: 40%; }
          .w25 { width: 25%; }

          .pill {
            width: 90px;
            height: 36px;
            border-radius: 999px;
          }

          .card {
            padding: 1.6rem;
          }

          .grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
            gap: 1rem;
            margin-top: 1.2rem;
          }

          .box {
            height: 54px;
            border-radius: 14px;
          }

          .box.tall {
            height: 120px;
          }

          .actions {
            grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          }

          @keyframes shimmer {
            0% { background-position: 100% 0; }
            100% { background-position: 0 0; }
          }
        `}</style>
      </main>
    );
  }

  /* ───────── DASHBOARD ───────── */
  return (
    <main className="wrap_signout">
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
        .wrap_signout {
          min-height: 100vh;
          background: radial-gradient(circle at top, #0b0f0f, #050505);
          color: #fff;
          padding: clamp(1.2rem, 4vw, 2.5rem);
          max-width: 1100px;
          margin: 0 auto;
        }

        .top {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          margin-bottom: 2.6rem;
        }

        .eyebrow {
          color: #9ca3af;
          font-size: 0.7rem;
          letter-spacing: 0.28em;
          text-transform: uppercase;
          margin-bottom: 0.25rem;
        }

        h1 {
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
        }

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

        .actions {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 1.2rem;
        }

        .fade-in {
          animation: fadeIn 0.45s ease-out forwards;
        }

        .slide-up {
          animation: slideUp 0.55s ease-out forwards;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes slideUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </main>
  );
}

/* ───────── SMALL COMPONENTS ───────── */

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
          transition: transform 0.25s ease, border 0.25s ease;
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
