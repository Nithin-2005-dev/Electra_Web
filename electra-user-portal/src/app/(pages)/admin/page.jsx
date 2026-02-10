"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { auth, db } from "../../lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

export default function AdminHomePage() {
  const router = useRouter();

  const [checking, setChecking] = useState(true);
  const [notAdmin, setNotAdmin] = useState(false);
  const [seconds, setSeconds] = useState(10);

  /* ───────── AUTH + ROLE CHECK ───────── */
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        router.replace("/");
        return;
      }

      try {
        const snap = await getDoc(doc(db, "users", user.uid));

        if (!snap.exists() || snap.data().role !== "admin") {
          setNotAdmin(true);
          setChecking(false);
          return;
        }

        // ✅ user is admin
        setChecking(false);
      } catch (err) {
        console.error("Admin check failed", err);
        setNotAdmin(true);
        setChecking(false);
      }
    });

    return () => unsub();
  }, [router]);

  /* ───────── COUNTDOWN (STATE ONLY) ───────── */
  useEffect(() => {
    if (!notAdmin || seconds <= 0) return;

    const interval = setInterval(() => {
      setSeconds((s) => s - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [notAdmin, seconds]);

  /* ───────── REDIRECT SIDE EFFECT ───────── */
  useEffect(() => {
    if (notAdmin && seconds <= 0) {
      router.replace("/");
    }
  }, [notAdmin, seconds, router]);

  /* ───────── LOADING ───────── */
  if (checking) {
    return (
      <main className="admin-wrap center">
        <p>Checking admin access…</p>

        <style jsx>{`
          .center {
            height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #9ca3af;
          }
        `}</style>
      </main>
    );
  }

  /* ───────── NOT ADMIN UI ───────── */
  if (notAdmin) {
    return (
      <main className="admin-wrap center">
        <div className="error-box">
          <h1>Access Denied</h1>
          <p>You are not authorized to access this page.</p>
          <span>Redirecting in {seconds}s…</span>
        </div>

        <style jsx>{`
          .admin-wrap {
            min-height: 100vh;
            background: #000;
            color: #fff;
          }

          .center {
            display: flex;
            justify-content: center;
            align-items: center;
          }

          .error-box {
            text-align: center;
            padding: 2.4rem 2.6rem;
            background: rgba(255, 255, 255, 0.04);
            border: 1px solid rgba(255, 0, 0, 0.35);
            border-radius: 20px;
            max-width: 420px;
          }

          h1 {
            font-size: 1.6rem;
            font-weight: 700;
            color: #f87171;
            margin-bottom: 0.6rem;
          }

          p {
            color: #d1d5db;
            margin-bottom: 0.8rem;
          }

          span {
            font-size: 0.85rem;
            color: #9ca3af;
          }
        `}</style>
      </main>
    );
  }

  /* ───────── ADMIN DASHBOARD ───────── */
  return (
    <main className="admin-wrap">
      <header className="header">
        <h1>Admin Dashboard</h1>
        <p>Electra Society · Control Panel</p>
      </header>

      <section className="grid">
        <AdminCard
          title="Orders"
          desc="Approve payments, manage shipping & deliveries"
          action="Manage Orders"
          onClick={() => router.push("/admin/orders")}
        />

        <AdminCard
          title="Products"
          desc="Create, update and manage merchandise"
          action="Manage Products"
          onClick={() => router.push("/admin/products")}
        />

        <AdminCard
          title="Users"
          desc="View members, roles, activity and analytics"
          action="Manage Users"
          onClick={() => router.push("/admin/users")}
        />

        <AdminCard
          title="Analytics"
          desc="Track merch views, intent, and cart conversions"
          action="Open Analytics"
          onClick={() => router.push("/admin/analytics")}
        />
      </section>

      <style jsx>{`
        .admin-wrap {
          min-height: 100vh;
          background: #000;
          color: #fff;
          padding: 3rem 2rem;
        }

        .header {
          margin-bottom: 2.5rem;
        }

        h1 {
          font-size: 2rem;
          font-weight: 700;
        }

        .header p {
          color: #9ca3af;
          margin-top: 0.3rem;
        }

        .grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
          gap: 1.6rem;
        }
      `}</style>
    </main>
  );
}

/* ───────────────── CARD ───────────────── */

function AdminCard({ title, desc, action, onClick }) {
  return (
    <div className="card" onClick={onClick}>
      <div>
        <h2>{title}</h2>
        <p>{desc}</p>
      </div>

      <button>{action} →</button>

      <style jsx>{`
        .card {
          background: linear-gradient(
            180deg,
            rgba(11, 15, 21, 0.95),
            rgba(6, 8, 12, 0.95)
          );
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 18px;
          padding: 1.8rem;
          cursor: pointer;
          transition: all 0.25s ease;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          min-height: 180px;
        }

        .card:hover {
          border-color: rgba(34, 211, 238, 0.45);
          transform: translateY(-3px);
          box-shadow: 0 20px 50px rgba(0, 0, 0, 0.6);
        }

        h2 {
          font-size: 1.25rem;
          font-weight: 700;
          margin-bottom: 0.4rem;
        }

        p {
          font-size: 0.85rem;
          color: #9ca3af;
          line-height: 1.4;
        }

        button {
          align-self: flex-start;
          margin-top: 1.4rem;
          background: rgba(34, 211, 238, 0.12);
          border: 1px solid rgba(34, 211, 238, 0.4);
          color: #22d3ee;
          padding: 0.55rem 1.1rem;
          border-radius: 999px;
          font-size: 0.75rem;
          font-weight: 600;
          cursor: pointer;
        }
      `}</style>
    </div>
  );
}
