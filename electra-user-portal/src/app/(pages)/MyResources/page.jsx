"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { auth } from "../../lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/navigation";
import { useSignInRequiredPopup } from "../../lib/useSignInRequiredPopup";
import SignInRequiredPopup from "../../../components/auth/SignInRequiredPopup";

export default function DashboardPage() {
  const router = useRouter();
  const { open, secondsLeft, requireSignIn, goToSignIn, popupTitle, popupMessage } = useSignInRequiredPopup(router);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const safeStats = stats || {
    total: 0,
    publicCount: 0,
    privateCount: 0,
    lastUploaded: null,
  };

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        requireSignIn({
          title: "Sign in to access My Resources",
          message: "This space shows your personal uploads, drafts, and contribution activity.",
        });
        setLoading(false);
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
  }, [router, requireSignIn]);

  if (loading) {
    return (
      <main className="loader">
        <SignInRequiredPopup open={open} secondsLeft={secondsLeft} onContinue={goToSignIn} title={popupTitle} message={popupMessage} />
        <div className="dot" />
        <p>Loading your workspace…</p>

        <style jsx>{`
          .loader {
            min-height: 100vh;
            display: grid;
            place-items: center;
            background: #000;
            color: #6b7280;
          }
          .dot {
            width: 10px;
            height: 10px;
            border-radius: 50%;
            background: #fff;
            animation: blink 1.2s infinite ease-in-out;
            margin-bottom: 1rem;
          }
          @keyframes blink {
            0%,100% { opacity: 0.2 }
            50% { opacity: 1 }
          }
        `}</style>
      </main>
    );
  }

  return (
    <main className="page">
      <SignInRequiredPopup open={open} secondsLeft={secondsLeft} onContinue={goToSignIn} title={popupTitle} message={popupMessage} />
      {/* INTRO */}
      <section className="intro">
        <span className="label">ELECTRA SOCIETY</span>
        <h1>Your Contribution Space</h1>
        <p className="lead">
          This is where your academic work becomes part of a shared knowledge
          system — helping juniors, peers, and future batches learn faster.
        </p>
      </section>

      {/* WHY CONTRIBUTE */}
      <section className="why">
        <h2>Why your contribution matters</h2>
        <p>
          Every note, assignment, or reference you upload reduces friction for
          someone else. It saves hours, removes confusion, and creates a culture
          where learning compounds instead of restarting every semester.
        </p>
        <p>
          Electra is not a content dump. It is a curated academic memory of NIT
          Silchar — built student by student.
        </p>
      </section>

      {/* STATS */}
      <section className="stats">
        <Stat title="Total uploads" value={safeStats.total} />
        <Stat title="Public resources" value={safeStats.publicCount} />
        <Stat title="Private drafts" value={safeStats.privateCount} />
      </section>

      {/* CONTROL */}
      <section className="control">
        <h2>You stay in control</h2>
        <p>
          Not everything needs to be public. You can keep resources private —
          for drafts, personal notes, or content you’re not ready to share.
        </p>
        <p>
          You decide what the community sees. You can change visibility anytime.
        </p>
      </section>

      {/* LATEST */}
      <section className="latest">
        <h2>Latest activity</h2>

        {safeStats.lastUploaded ? (
          <div className="latest-card">
            <div className="bar" />
            <div>
              <strong>{safeStats.lastUploaded.name}</strong>
              <span>
                {safeStats.lastUploaded.subject} · Semester{" "}
                {safeStats.lastUploaded.semester}
              </span>
            </div>
            <button onClick={() => router.push("/MyResources/manage-resources")}>
              Open
            </button>
          </div>
        ) : (
          <p className="muted">You haven’t uploaded anything yet.</p>
        )}
      </section>

      {/* ACTIONS */}
      <section className="actions">
        <button
          className="primary"
          onClick={() => router.push("/MyResources/upload-resources")}
        >
          Upload resource
        </button>
        <button
          className="secondary"
          onClick={() => router.push("/MyResources/manage-resources")}
        >
          Manage my resources
        </button>
      </section>

      <style jsx>{`
        .page {
          min-height: 100vh;
          background: #000;
          color: #fff;
          padding: 4rem 1.5rem 6rem;
        }

        section {
          max-width: 920px;
          margin: 0 auto 4rem;
        }

        .label {
          font-size: 0.7rem;
          letter-spacing: 0.35em;
          color: #6b7280;
        }

        h1 {
          font-size: 3rem;
          margin: 0.6rem 0 1rem;
        }

        h2 {
          font-size: 1.25rem;
          margin-bottom: 0.8rem;
        }

        .lead {
          font-size: 1.05rem;
          color: #9ca3af;
          max-width: 640px;
          line-height: 1.7;
        }

        p {
          color: #9ca3af;
          line-height: 1.7;
          margin-bottom: 0.8rem;
        }

        .stats {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.5rem;
        }

        .latest-card {
          display: flex;
          align-items: center;
          gap: 1.2rem;
          border: 1px solid #1f2933;
          padding: 1.2rem 1.4rem;
          border-radius: 12px;
        }

        .bar {
          width: 3px;
          height: 32px;
          background: #fff;
        }

        .latest-card span {
          display: block;
          font-size: 0.85rem;
          color: #6b7280;
        }

        .latest-card button {
          margin-left: auto;
          background: none;
          border: 1px solid #374151;
          color: #fff;
          padding: 0.4rem 1.2rem;
          border-radius: 999px;
        }

        .actions {
          display: flex;
          gap: 1rem;
          flex-wrap: wrap;
        }

        .primary {
          background: #fff;
          color: #000;
          padding: 0.85rem 2.2rem;
          border-radius: 999px;
          font-weight: 600;
        }

        .secondary {
          background: none;
          border: 1px solid #374151;
          color: #fff;
          padding: 0.85rem 2.2rem;
          border-radius: 999px;
        }

        .muted {
          color: #6b7280;
        }

        @media (max-width: 800px) {
          h1 {
            font-size: 2.2rem;
          }
          .stats {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </main>
  );
}

function Stat({ title, value }) {
  return (
    <div className="stat">
      <span>{title}</span>
      <strong>{value}</strong>

      <style jsx>{`
        .stat {
          border: 1px solid #1f2933;
          padding: 1.6rem;
          border-radius: 12px;
        }
        span {
          font-size: 0.75rem;
          color: #6b7280;
          letter-spacing: 0.08em;
        }
        strong {
          display: block;
          font-size: 2.4rem;
          margin-top: 0.4rem;
        }
      `}</style>
    </div>
  );
}




