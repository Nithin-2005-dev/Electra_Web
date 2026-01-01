"use client";

import { useRouter } from "next/navigation";

export default function SemesterGrid() {
  const router = useRouter();

  return (
    <section className="semester-wrap">
      <div className="semester-grid">
        {Array.from({ length: 8 }).map((_, i) => {
          const semester = i + 1;

          return (
            <button
              key={semester}
              onClick={() => router.push(`/Resources/${semester}`)}
              className="semester-card"
            >
              {/* TOP LABEL */}
              <span className="semester-eyebrow">Semester</span>

              {/* NUMBER */}
              <span className="semester-number">{semester}</span>

              {/* META */}
              <span className="semester-meta">
                Notes · Books · PYQs · Assignments
              </span>

              {/* CTA (desktop only) */}
              <span className="semester-cta">
                Explore resources →
              </span>
            </button>
          );
        })}
      </div>

      <style jsx>{`
        /* ===== WRAPPER ===== */
        .semester-wrap {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 1rem;
        }

        /* ===== GRID ===== */
        .semester-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 0.9rem;
        }

        /* ===== CARD ===== */
        .semester-card {
          position: relative;
          overflow: hidden;
          background: linear-gradient(
            180deg,
            #0c1017 0%,
            #070a10 100%
          );
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 16px;
          padding: 1.1rem 1.1rem 1.2rem;
          text-align: left;
          transition: all 0.28s cubic-bezier(0.22, 1, 0.36, 1);
          cursor: pointer;
        }

        /* tap feedback (mobile) */
        .semester-card:active {
          transform: scale(0.985);
          border-color: rgba(103, 232, 249, 0.4);
        }

        /* ===== CONTENT ===== */
        .semester-eyebrow {
          font-size: 0.62rem;
          letter-spacing: 0.28em;
          text-transform: uppercase;
          color: #6b7280;
        }

        .semester-number {
          display: block;
          margin-top: 0.3rem;
          font-size: 2.1rem;
          font-weight: 700;
          color: #ffffff;
          line-height: 1;
        }

        .semester-meta {
          display: block;
          margin-top: 0.4rem;
          font-size: 0.7rem;
          color: #9ca3af;
          line-height: 1.4;
        }

        .semester-cta {
          display: none;
          margin-top: 0.8rem;
          font-size: 0.7rem;
          font-weight: 500;
          color: #67e8f9;
        }

        /* ===== HOVER (DESKTOP ONLY) ===== */
        @media (hover: hover) {
          .semester-card:hover {
            transform: translateY(-4px);
            border-color: rgba(103, 232, 249, 0.45);
            box-shadow: 0 16px 40px rgba(0, 0, 0, 0.6);
          }

          .semester-card:hover .semester-cta {
            display: inline-block;
          }
        }

        /* ===== TABLET ===== */
        @media (min-width: 640px) {
          .semester-grid {
            grid-template-columns: repeat(3, 1fr);
            gap: 1.2rem;
          }

          .semester-card {
            padding: 1.4rem 1.4rem 1.6rem;
          }

          .semester-number {
            font-size: 2.4rem;
          }

          .semester-meta {
            font-size: 0.75rem;
          }
        }

        /* ===== DESKTOP ===== */
        @media (min-width: 1024px) {
          .semester-grid {
            grid-template-columns: repeat(4, 1fr);
            gap: 1.5rem;
          }

          .semester-number {
            font-size: 2.8rem;
          }

          .semester-meta {
            font-size: 0.8rem;
          }
        }
      `}</style>
    </section>
  );
}
