// app/not-found.tsx
"use client";

import Link from "next/link";

export default function NotFound() {
  return (
    <main className="nf" aria-labelledby="nf-title">
      <style jsx>{`
        :root { --c1:#14f7ff; --c2:#00b8d9; }

        .nf {
          min-height: 70vh;
          display: grid; place-items: center;
          padding: clamp(16px, 6vh, 56px) clamp(10px, 4vw, 24px);
        }

        /* Transparent frame (no background) */
        .frame {
          width: min(100%, 1100px);
          border-radius: 20px;
          border: 1px solid rgba(141,255,255,.26);
          background: transparent;
          padding: clamp(14px, 3.6vw, 26px);
        }

        .title {
          text-align: center;
          font-weight: 900; line-height: 1.05;
          font-size: clamp(26px, 6vw, 54px);
          background: linear-gradient(90deg, #eaffff, #bff5ff);
          -webkit-background-clip: text; background-clip: text; color: transparent;
          text-shadow: 0 0 24px rgba(20,247,255,.22);
          margin: 2px 0 6px;
        }

        .sub {
          text-align: center; color: #cfeaf2; opacity: .96;
          font-size: clamp(12px, 1.9vw, 16px);
          margin-bottom: clamp(10px, 2.4vh, 16px);
        }

        /* Responsive grid: single column on small screens */
        .wrap {
          display: grid; gap: clamp(12px, 3vw, 22px);
          grid-template-columns: 1fr;
          align-items: center;
        }
        @media (min-width: 880px) { .wrap { grid-template-columns: 1.05fr .95fr; } }

        /* Schematic SVG is fluid */
        .schem { width: 100%; height: auto; display: block; }
        .wire { stroke: rgba(223,251,255,.92); stroke-width: 3; stroke-linecap: round; }
        .sym  { stroke: rgba(223,251,255,.92); stroke-width: 3; fill: transparent; }
        .glow { filter: drop-shadow(0 0 6px rgba(20,247,255,.35)); }
        .label { fill: #dffbff; font: 700 12px/1.2 ui-sans-serif, system-ui, Segoe UI, Roboto; letter-spacing: .06em; }

        .dmm { border: 1px dashed rgba(141,255,255,.26); border-radius: 14px; padding: clamp(10px, 2.2vw, 16px); background: transparent; }
        .lcd {
          height: clamp(70px, 12vw, 120px);
          border: 1px solid rgba(141,255,255,.22); border-radius: 10px;
          display: grid; place-items: center;
          color: #041218; font-weight: 900; letter-spacing: .18em; font-size: clamp(22px, 6vw, 40px);
          text-shadow: none;
          background: linear-gradient(180deg, var(--c1), var(--c2));
          box-shadow: 0 8px 22px rgba(20,247,255,.22);
        }
        .note { margin-top: 8px; color:#cfeaf2; opacity:.92; font-size:clamp(12px,1.7vw,14px); letter-spacing:.06em; }

        /* Buttons: solid neon background + larger tap targets */
        .row {
          margin-top: clamp(12px, 2.4vh, 18px);
          display: grid; gap: 10px;
          grid-template-columns: 1fr;
        }
        @media (min-width: 560px) { .row { grid-template-columns: repeat(2, max(180px, 1fr)); justify-content: center; } }

        .btn {
          min-height: 48px; padding: 0 18px;
          border-radius: 12px; border: 1px solid rgba(20,247,255,.45);
          background: linear-gradient(90deg, var(--c1), var(--c2));
          color: #041218; font-weight: 800; letter-spacing: .02em; text-decoration: none;
          display: inline-flex; align-items: center; justify-content: center;
          box-shadow: 0 10px 24px rgba(20,247,255,.26);
          transition: transform .12s ease, box-shadow .12s ease;
          text-align: center;
        }
        .btn:where(:hover,:focus-visible) { transform: translateY(-1px); box-shadow: 0 12px 28px rgba(20,247,255,.32); outline: none; }

        /* Spark animation at the open switch gap */
        .spark { animation: spark 1.6s ease-in-out infinite; transform-origin: center; }
        @keyframes spark { 0%,100%{opacity:0} 20%{opacity:.95} 40%{opacity:.2} 60%{opacity:.75} 80%{opacity:.15} }

        @media (prefers-reduced-motion: reduce) { .spark { animation: none; opacity: .18; } }
      `}</style>

      <section className="frame">
        <h1 id="nf-title" className="title">404 — Open Circuit</h1>
        <p className="sub">The route isn’t connected; continuity shows an open loop.</p>

        <div className="wrap">
          <figure aria-label="Open-circuit schematic">
            <svg className="schem glow" viewBox="0 0 760 260" role="img">
              {/* Battery */}
              <line x1="60" y1="130" x2="90" y2="130" className="wire" />
              <line x1="90" y1="110" x2="90" y2="150" className="sym" />
              <line x1="100" y1="115" x2="100" y2="145" className="sym" />
              <text x="58" y="120" className="label">Battery</text>

              {/* Wire to switch */}
              <line x1="100" y1="130" x2="320" y2="130" className="wire" />

              {/* Open switch */}
              <line x1="320" y1="130" x2="360" y2="130" className="wire" />
              <line x1="360" y1="130" x2="380" y2="110" className="sym" />
              <line x1="380" y1="130" x2="420" y2="130" className="sym" />
              <circle cx="380" cy="130" r="4" className="sym" />
              <circle cx="380" cy="120" r="6" fill="url(#sparkGrad)" className="spark" />

              {/* Resistor (load) */}
              <line x1="420" y1="130" x2="520" y2="130" className="wire" />
              <polyline points="520,130 535,120 550,140 565,120 580,140 595,120 610,130" className="sym" />
              <line x1="610" y1="130" x2="700" y2="130" className="wire" />
              <text x="525" y="110" className="label">Load</text>

              {/* Ground return */}
              <line x1="700" y1="130" x2="700" y2="200" className="wire" />
              <line x1="700" y1="200" x2="60"  y2="200" className="wire" />
              <line x1="60"  y1="200" x2="60"  y2="130" className="wire" />

              {/* Voltmeter */}
              <circle cx="370" cy="60" r="26" className="sym" />
              <text x="363" y="66" className="label" style={{fontSize:'16px'}}>V</text>
              <line x1="370" y1="86" x2="370" y2="130" className="wire" />
              <line x1="420" y1="130" x2="420" y2="60" className="wire" />
              <line x1="420" y1="60"  x2="396" y2="60" className="wire" />

              <defs>
                <radialGradient id="sparkGrad">
                  <stop offset="0%" stopColor="#ffffff" />
                  <stop offset="55%" stopColor="#14f7ff" />
                  <stop offset="100%" stopColor="transparent" />
                </radialGradient>
              </defs>
            </svg>
          </figure>

          <aside className="dmm" aria-label="Digital multimeter">
            <div className="lcd" aria-hidden>OL</div>
            <div className="note">Continuity/Ohms: open loop — path not found.</div>
          </aside>
        </div>
      </section>
    </main>
  );
}
