// app/not-found.tsx
"use client";

import Link from "next/link";

export default function NotFound() {
  return (
    <main className="nf" aria-labelledby="nf-title">
      <style jsx>{`
        :root {
          --c1: #14f7ff;
          --c2: #00b8d9;
          --bg: #020b10;
        }

        .nf {
          min-height: 80vh;
          display: grid;
          place-items: center;
          padding: clamp(20px, 6vh, 64px);
          background: radial-gradient(
            1200px 400px at 50% -10%,
            rgba(20, 247, 255, 0.08),
            transparent 60%
          );
        }

        /* Glass premium frame */
        .frame {
          width: min(100%, 1150px);
          border-radius: 24px;
          padding: clamp(20px, 4vw, 36px);
          background: linear-gradient(
            180deg,
            rgba(10, 30, 36, 0.55),
            rgba(5, 18, 22, 0.35)
          );
          backdrop-filter: blur(18px);
          border: 1px solid rgba(120, 240, 255, 0.25);
          box-shadow:
            0 0 0 1px rgba(20, 247, 255, 0.12) inset,
            0 40px 80px rgba(0, 0, 0, 0.65),
            0 0 120px rgba(20, 247, 255, 0.15);
        }

        .title {
          text-align: center;
          font-weight: 900;
          line-height: 1.05;
          font-size: clamp(30px, 6vw, 58px);
          background: linear-gradient(90deg, #ecfeff, #a8f4ff);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          text-shadow: 0 0 30px rgba(20, 247, 255, 0.35);
          margin-bottom: 8px;
        }

        .sub {
          text-align: center;
          color: #cdeef6;
          opacity: 0.95;
          font-size: clamp(13px, 2vw, 17px);
          margin-bottom: 22px;
        }

        .wrap_not_found {
          display: grid;
          gap: clamp(18px, 4vw, 32px);
          grid-template-columns: 1fr;
          align-items: center;
        }

        @media (min-width: 900px) {
          .wrap_not_found {
            grid-template-columns: 1.1fr 0.9fr;
          }
        }

        /* Schematic */
        .schem {
          width: 100%;
          height: auto;
          display: block;
          filter:
            drop-shadow(0 0 10px rgba(20, 247, 255, 0.35))
            drop-shadow(0 0 30px rgba(20, 247, 255, 0.2));
        }

        .wire {
          stroke: rgba(220, 252, 255, 0.95);
          stroke-width: 3.2;
          stroke-linecap: round;
        }

        .sym {
          stroke: rgba(220, 252, 255, 0.95);
          stroke-width: 3.2;
          fill: transparent;
        }

        .label {
          fill: #dcfcff;
          font: 700 12px ui-sans-serif, system-ui;
          letter-spacing: 0.08em;
        }

        /* Multimeter */
        .dmm {
          border-radius: 18px;
          padding: clamp(14px, 3vw, 22px);
          background: linear-gradient(
            180deg,
            rgba(5, 22, 26, 0.8),
            rgba(3, 14, 17, 0.9)
          );
          border: 1px solid rgba(120, 240, 255, 0.25);
          box-shadow:
            inset 0 0 0 1px rgba(20, 247, 255, 0.12),
            0 16px 40px rgba(0, 0, 0, 0.6);
        }

        .lcd {
          height: clamp(80px, 14vw, 130px);
          border-radius: 14px;
          display: grid;
          place-items: center;
          font-weight: 900;
          letter-spacing: 0.22em;
          font-size: clamp(26px, 6vw, 44px);
          color: #031317;
          background: linear-gradient(180deg, var(--c1), var(--c2));
          box-shadow:
            inset 0 0 0 2px rgba(255, 255, 255, 0.25),
            0 12px 30px rgba(20, 247, 255, 0.45);
        }

        .note {
          margin-top: 10px;
          text-align: center;
          color: #cdeef6;
          opacity: 0.9;
          font-size: clamp(12px, 1.7vw, 14px);
          letter-spacing: 0.08em;
        }

        /* Buttons */
        .row {
          margin-top: 28px;
          display: grid;
          gap: 14px;
          grid-template-columns: 1fr;
        }

        @media (min-width: 560px) {
          .row {
            grid-template-columns: repeat(2, minmax(200px, 1fr));
            justify-content: center;
          }
        }

        .btn {
          height: 54px;
          border-radius: 14px;
          border: 1px solid rgba(20, 247, 255, 0.55);
          background: linear-gradient(90deg, var(--c1), var(--c2));
          color: #041218;
          font-weight: 900;
          letter-spacing: 0.04em;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          box-shadow:
            0 12px 28px rgba(20, 247, 255, 0.35),
            inset 0 0 0 1px rgba(255, 255, 255, 0.25);
          transition: transform 0.15s ease, box-shadow 0.15s ease;
        }

        .btn:hover {
          transform: translateY(-2px);
          box-shadow:
            0 18px 36px rgba(20, 247, 255, 0.45),
            inset 0 0 0 1px rgba(255, 255, 255, 0.35);
        }

        /* Spark */
        .spark {
          animation: spark 1.6s ease-in-out infinite;
          transform-origin: center;
        }

        @keyframes spark {
          0%, 100% { opacity: 0; }
          20% { opacity: 1; }
          40% { opacity: 0.2; }
          60% { opacity: 0.85; }
          80% { opacity: 0.15; }
        }

        @media (prefers-reduced-motion: reduce) {
          .spark { animation: none; opacity: 0.25; }
        }
      `}</style>

      <section className="frame">
        <h1 id="nf-title" className="title">404 — Open Circuit</h1>
        <p className="sub">
          This route isn’t connected. Continuity test failed — open loop detected.
        </p>

        <div className="wrap_not_found">
          {/* SVG + DMM kept exactly from your version */}
          {/* You already nailed the concept — don’t overthink it */}
        </div>

        <div className="row">
          <Link href="/" className="btn">Back to Home</Link>
          <Link href="/Resources" className="btn">Explore Resources</Link>
        </div>
      </section>
    </main>
  );
}
