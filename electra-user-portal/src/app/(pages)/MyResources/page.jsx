"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { auth } from "../../lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const router = useRouter();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        router.push("/sign-in");
        return;
      }

      const token = await user.getIdToken();
      const res = await axios.get("/api/resources/my", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const resources = res.data.resources || [];

      setStats({
        total: resources.length,
        publicCount: resources.filter(r => r.visibility === "public").length,
        privateCount: resources.filter(r => r.visibility === "private").length,
        lastUploaded:
          resources.length > 0
            ? [...resources].sort(
                (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
              )[0]
            : null,
      });

      setLoading(false);
    });

    return () => unsub();
  }, [router]);

  if (loading) {
    return (
      <div className="loader">
        <div className="ring" />
        <p>Loading your contribution hub…</p>

        <style jsx>{`
          .loader {
            min-height: 100vh;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            background: #05070c;
            color: #9ca3af;
          }
          .ring {
            width: 48px;
            height: 48px;
            border-radius: 50%;
            border: 2px solid rgba(255,255,255,0.1);
            border-top-color: #22d3ee;
            animation: spin 1s linear infinite;
            margin-bottom: 1rem;
          }
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <main className="page">
      <div className="wrap">

        {/* HEADER */}
        <header className="hero">
          <p className="eyebrow">MY RESOURCES</p>
          <h1>Your Contribution Hub</h1>
          <p className="desc">
            Upload, manage, and control how your academic resources appear across Electra.
          </p>
        </header>

        {/* STATS */}
        <section className="stats">
          <Stat title="Total Resources" value={stats.total} />
          <Stat title="Public" value={stats.publicCount} accent="cyan" />
          <Stat title="Private" value={stats.privateCount} accent="red" />
        </section>

        {/* LATEST */}
        <section className="latest">
          <h2>Latest Contribution</h2>

          {stats.lastUploaded ? (
            <div className="latest-card">
              <div className="dot" />
              <div className="info">
                <strong>{stats.lastUploaded.name}</strong>
                <span>
                  {stats.lastUploaded.subject} · Semester {stats.lastUploaded.semester}
                </span>
              </div>
              <button onClick={() => router.push("/MyResources/manage-resources")}>
                View
              </button>
            </div>
          ) : (
            <p className="muted">No uploads yet</p>
          )}
        </section>

        {/* COMMAND BAR */}
        <section className="commands">
          <button
            className="primary"
            onClick={() => router.push("/MyResources/upload-resources")}
          >
            Upload Resource
          </button>

          <button
            className="secondary"
            onClick={() => router.push("/MyResources/manage-resources")}
          >
            Manage Resources
          </button>
        </section>

      </div>

      <style jsx>{`
        .page {
          min-height: 100vh;
          {/* background: #05070c; */}
          color: #fff;
          padding: 3rem 1.5rem;
        }

        .wrap {
          max-width: 1100px;
          margin: 0 auto;
        }

        /* HERO */
        .hero {
          margin-bottom: 3rem;
        }

        .eyebrow {
          font-size: 0.7rem;
          letter-spacing: 0.35em;
          color: #67e8f9;
        }

        h1 {
          font-size: 2.6rem;
          margin: 0.6rem 0;
        }

        .desc {
          color: #9ca3af;
          max-width: 520px;
          line-height: 1.6;
        }

        /* STATS */
        .stats {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.5rem;
          margin-bottom: 3.5rem;
        }

        /* LATEST */
        .latest h2 {
          font-size: 1.1rem;
          margin-bottom: 1rem;
        }

        .latest-card {
          display: flex;
          align-items: center;
          gap: 1.2rem;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 18px;
          padding: 1.2rem 1.4rem;
          max-width: 720px;
        }

        .dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: #22d3ee;
        }

        .info {
          flex: 1;
        }

        .info span {
          color: #9ca3af;
          font-size: 0.85rem;
        }

        .latest-card button {
          background: transparent;
          border: 1px solid rgba(255,255,255,0.25);
          color: #fff;
          padding: 0.45rem 1.2rem;
          border-radius: 999px;
          cursor: pointer;
        }

        /* COMMAND BAR */
        .commands {
          margin-top: 4rem;
          display: flex;
          gap: 1rem;
        }

        .primary {
          background: rgba(34,211,238,0.15);
          border: 1px solid rgba(34,211,238,0.6);
          color: #67e8f9;
          padding: 0.9rem 2.2rem;
          border-radius: 999px;
          font-weight: 600;
        }

        .secondary {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.25);
          color: #fff;
          padding: 0.9rem 2.2rem;
          border-radius: 999px;
        }

        .muted {
          color: #9ca3af;
        }

        @media (max-width: 900px) {
          .stats {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </main>
  );
}

/* STAT */
function Stat({ title, value, accent }) {
  return (
    <div className={`stat ${accent || ""}`}>
      <span>{title}</span>
      <strong>{value}</strong>

      <style jsx>{`
        .stat {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 18px;
          padding: 1.6rem;
        }

        span {
          font-size: 0.75rem;
          color: #9ca3af;
        }

        strong {
          display: block;
          font-size: 2.2rem;
          margin-top: 0.4rem;
        }

        .cyan strong { color: #22d3ee; }
        .red strong { color: #f87171; }
      `}</style>
    </div>
  );
}
