"use client";

import { useState } from "react";

export default function TeamHeader({ yearRef, setYear }) {
  const YEARS = ["2025", "2024", "2023", "2022", "2021", "2020"];
  const [activeYear, setActiveYear] = useState("2025");

  const changeYear = (y) => {
    setActiveYear(y);
    if (yearRef?.current) yearRef.current.value = y;
    setYear(y);
  };

  return (
    <section className="team-header">
      <div className="container">
        {/* LEFT */}
        <div className="left">
          <span className="eyebrow">Our People</span>

          <h1 className="title">
            Electra <span>Core Team</span>
          </h1>

          <p className="subtitle">
            Leadership and contributors shaping innovation, culture,
            and real-world impact at Electra Society.
          </p>
        </div>

        {/* RIGHT (DESKTOP SELECT) */}
        <div className="right">
          <label>Academic Year</label>
          <select
            ref={yearRef}
            value={activeYear}
            onChange={(e) => changeYear(e.target.value)}
          >
            {YEARS.map((y) => (
              <option key={y} value={y}>
                {y}–{String(Number(y) + 1).slice(2)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* YEAR FILTER */}
      <div className="year-filter">
        {YEARS.map((y) => (
          <button
            key={y}
            onClick={() => changeYear(y)}
            className={y === activeYear ? "active" : ""}
          >
            {y}
          </button>
        ))}
      </div>

      <style jsx>{`
        /* ===== LAYOUT ===== */
        .team-header {
          padding: 5rem 1.5rem 3rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.06);
          background: linear-gradient(
            to bottom,
            rgba(255, 255, 255, 0.02),
            transparent
          );
        }

        .container {
          max-width: 1200px;
          margin: 0 auto;
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          gap: 3rem;
        }

        /* ===== LEFT ===== */
        .eyebrow {
          font-size: 0.65rem;
          letter-spacing: 0.35em;
          text-transform: uppercase;
          color: #6ee7f5;
          opacity: 0.75;
        }

        .title {
          margin-top: 0.75rem;
          font-size: clamp(2.4rem, 5vw, 3.2rem);
          font-weight: 800;
          color: #ffffff;
          letter-spacing: -0.02em;
        }

        .title span {
          color: #67e8f9;
        }

        .subtitle {
          margin-top: 1.2rem;
          max-width: 520px;
          color: #9ca3af;
          font-size: 0.95rem;
          line-height: 1.6;
        }

        /* ===== RIGHT SELECT ===== */
        .right label {
          display: block;
          font-size: 0.65rem;
          letter-spacing: 0.25em;
          text-transform: uppercase;
          color: #6b7280;
          margin-bottom: 0.4rem;
          text-align: right;
        }

        .right select {
          background: #0b0f15;
          color: #e5e7eb;
          border: 1px solid rgba(255, 255, 255, 0.15);
          padding: 0.55rem 1rem;
          border-radius: 10px;
          font-size: 0.85rem;
          cursor: pointer;
          transition: border 0.2s ease;
        }

        .right select:hover {
          border-color: rgba(103, 232, 249, 0.6);
        }

        .right option {
          background: #0b0f15;
          color: #e5e7eb;
        }

        /* ===== YEAR FILTER ===== */
        .year-filter {
          max-width: 1200px;
          margin: 2.2rem auto 0;
          display: flex;
          gap: 0.6rem;
          flex-wrap: wrap;
        }

        .year-filter button {
          padding: 0.5rem 1.1rem;
          border-radius: 999px;
          font-size: 0.85rem;
          background: transparent;
          color: #9ca3af;
          border: 1px solid rgba(255, 255, 255, 0.12);
          transition: all 0.2s ease;
        }

        .year-filter button:hover {
          color: #e5e7eb;
          border-color: rgba(255, 255, 255, 0.35);
        }

        .year-filter button.active {
          background: rgba(103, 232, 249, 0.15);
          color: #e5e7eb;
          border-color: rgba(103, 232, 249, 0.6);
        }

        /* ===== RESPONSIVE ===== */
        @media (max-width: 900px) {
          .container {
            flex-direction: column;
            align-items: flex-start;
          }

          .right {
            display: none;
          }
        }
      `}</style>
    </section>
  );
}
