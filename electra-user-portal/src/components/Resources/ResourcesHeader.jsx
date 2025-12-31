"use client";

import { useParams, usePathname } from "next/navigation";

export default function ResourcesHeader() {
  const params = useParams();
  const pathname = usePathname();

  const semester = params?.semester;
  const subject = params?.subject;

  const isRoot = pathname === "/Resources";
  const isSemester = semester && !subject;
  const isSubject = semester && subject;

  return (
    <header className="res-wrap">
      {/* ambient background */}
      <div className="res-ambient" aria-hidden />

      <div className="res-container">
        {/* EYEBROW */}
        <p className="res-eyebrow">Academic Resources</p>

        {/* TITLE */}
        <h1 className="res-title">
          Electra <span>Knowledge Grid</span>
        </h1>

        {/* SUBTEXT */}
        <p className="res-subtitle">
          Curated notes, books, assignments and PYQs — organized semester-wise
          for Electrical Engineering students.
        </p>

        {/* BREADCRUMB / CONTEXT */}
        <div className="res-context">
          {isRoot && (
            <>
              <span>Select a semester</span>
            </>
          )}

          {isSemester && (
            <>
              <span className="muted">Semester</span>
              <strong>{semester}</strong>
              <span className="arrow">→</span>
              <span>Select subject</span>
            </>
          )}

          {isSubject && (
            <>
              <span className="muted">Semester</span>
              <strong>{semester}</strong>
              <span className="arrow">→</span>
              <strong>
                {decodeURIComponent(subject).toUpperCase()}
              </strong>
            </>
          )}
        </div>
      </div>

      {/* STYLES */}
      <style jsx>{`
        /* ===== LAYOUT ===== */
        .res-wrap {
          position: relative;
          padding: 5.5rem 1.25rem 4.5rem;
          text-align: center;
          overflow: hidden;
        }

        .res-container {
          position: relative;
          z-index: 1;
          max-width: 960px;
          margin: 0 auto;
        }

        /* ===== AMBIENT ===== */
        .res-ambient {
          position: absolute;
          inset: 0;
          background:
            radial-gradient(
              600px circle at 50% -120px,
              rgba(34, 211, 238, 0.12),
              transparent 65%
            ),
            radial-gradient(
              800px circle at 50% 100%,
              rgba(99, 102, 241, 0.08),
              transparent 70%
            );
          pointer-events: none;
        }

        /* ===== EYEBROW ===== */
        .res-eyebrow {
          font-size: 0.7rem;
          letter-spacing: 0.38em;
          text-transform: uppercase;
          color: rgba(34, 211, 238, 0.75);
          margin-bottom: 1rem;
        }

        /* ===== TITLE ===== */
        .res-title {
          font-size: clamp(2rem, 4.5vw, 3rem);
          font-weight: 800;
          letter-spacing: -0.03em;
          color: #ffffff;
          line-height: 1.1;
        }

        .res-title span {
          color: #67e8f9;
        }

        /* ===== SUBTITLE ===== */
        .res-subtitle {
          margin: 1.2rem auto 0;
          max-width: 680px;
          font-size: 0.95rem;
          line-height: 1.6;
          color: #9ca3af;
        }

        /* ===== CONTEXT PILL ===== */
        .res-context {
          margin: 2rem auto 0;
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.55rem 1rem;
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(8px);
          font-size: 0.78rem;
          color: #9ca3af;
        }

        .res-context strong {
          color: #ffffff;
          font-weight: 500;
        }

        .res-context .muted {
          color: #6b7280;
        }

        .res-context .dot,
        .res-context .arrow {
          opacity: 0.6;
        }

        /* ===== MOBILE TUNING ===== */
        @media (max-width: 640px) {
          .res-wrap {
            padding-top: 4.5rem;
          }

          .res-subtitle {
            font-size: 0.88rem;
          }

          .res-context {
            font-size: 0.72rem;
          }
        }
      `}</style>
    </header>
  );
}
