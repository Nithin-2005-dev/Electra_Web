// src/components/ElectraFunctionGeneratorInteractive.jsx
"use client";

import { useEffect, useRef, useState } from "react";
import TypeIt from "typeit";

const OFF_TEXT =
  "Electra Society — official student body of Electrical Engineering, NIT Silchar. Explore events, projects, mentorship, and a vibrant community driving practical innovation.";
const INTRO = "Booting Electra FG‑EE‑01…";
const ON_TEXT =
  "Electra Society is the official student body of the Electrical Engineering Department at NIT Silchar. We bring together builders, researchers, and creative engineers to turn ideas into working systems across power, electronics, and intelligent software. Throughout the year we run hands‑on hackathons, PowerSurge modules, Off the Hook ice‑breakers, the sport‑packed Electra Cup, and speaker sessions with faculty and industry. Our projects explore smart grids, renewable integration, EV mobility, embedded systems, signal processing, and AI‑assisted design. Mentorship and a responsive alumni network help first‑years level up quickly while senior teams publish, compete, and prototype. For partners and sponsors, Electra delivers focused outreach, polished execution, and campus‑wide visibility—backed by a culture that values precision, curiosity, and real impact.";

export default function ElectraFunctionGeneratorInteractive() {
  // State
  const [mounted, setMounted] = useState(false);
  const [powered, setPowered] = useState(true);
  const [mode, setMode] = useState("ION"); // ION | ATTEN
  const [show, setShow] = useState("detail"); // intro | detail
  const [speed, setSpeed] = useState(24);
  const [intensity, setIntensity] = useState(65);

  // Refs
  const textEl = useRef(null);
  const instance = useRef(null);
  const bootTimer = useRef(null);
  const [typeKey, setTypeKey] = useState(0);

  const reduce =
    typeof window !== "undefined" &&
    window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;

  useEffect(() => setMounted(true), []);

  // Utilities
  const safeDestroy = () => {
    const inst = instance.current;
    if (!inst) return;
    try { inst.destroy?.(); } catch {}
    instance.current = null;
  };

  const hardResetSpan = () => {
    safeDestroy();
    clearTimeout(bootTimer.current);
    setTypeKey((k) => k + 1);
  };

  const printInstant = (content) => {
    if (!textEl.current) return;
    textEl.current.textContent = content;
  };

  const typeOnce = (content, delay = 200) => {
    if (!textEl.current) return;
    if (reduce) {
      printInstant(content);
      return;
    }
    safeDestroy();
    textEl.current.textContent = "";
    const inst = new TypeIt(textEl.current, {
      speed,
      cursor: false,
      lifeLike: true,
      startDelay: delay,
      deleteSpeed: Math.max(14, Math.min(32, Math.round(speed * 0.75))),
    })
      .type(content)
      .go();
    instance.current = inst;
  };

  // Power toggle
  const togglePower = () => {
    if (powered) {
      hardResetSpan();
      setPowered(false);
      setShow("detail");
      setTimeout(() => printInstant(OFF_TEXT), 0);
    } else {
      setPowered(true);
      hardResetSpan();
      setShow("intro");
      setTimeout(() => typeOnce(INTRO, 120), 0);
      bootTimer.current = setTimeout(() => {
        hardResetSpan();
        setShow("detail");
        setTimeout(() => typeOnce(ON_TEXT, 140), 0);
      }, 1100);
    }
  };

  const replay = () => {
    if (!powered) return;
    togglePower();
    setTimeout(() => togglePower(), 40);
  };

  const setView = (v) => {
    setShow(v);
    hardResetSpan();
    if (!powered) {
      setTimeout(() => printInstant(OFF_TEXT), 0);
      return;
    }
    setTimeout(() => typeOnce(v === "intro" ? INTRO : ON_TEXT, 100), 0);
  };

  // Re-type when speed changes
  useEffect(() => {
    if (!mounted) return;
    setView(show);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [speed]);

  // Visuals
  const ledPower = powered ? "#0aff84" : "#3b4d4f";
  const ledIon = mode === "ION" ? "rgba(20,247,255,0.9)" : "rgba(120,140,150,0.6)";
  const ledAtt = mode === "ATTEN" ? "rgba(0,184,217,0.9)" : "rgba(120,140,150,0.6)";
  const scanOpacity = powered ? (mode === "ION" ? 0.22 + intensity / 600 : 0.12 + intensity / 1000) : 0.12;

  if (!mounted) {
    return (
      <section className="fg-section">
        <div className="wrap">
          <div className="fg">
            <h3>About Electra Society</h3>
            <p>Electra Society — official student body of Electrical Engineering, NIT Silchar.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="fg-section">
      <style jsx>{`
        :root {
          --primary: #00b8d9; --secondary: #14f7ff;
          --textPrimary: #e6eef5; --textMuted: #a7b2bc;
          --metal1: #0c121a; --metal2: #0a0f16; --edge: #142131;
        }

        .fg-section{
          isolation:isolate; overflow:hidden; color:var(--textMuted);
          font-family: Inter, ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Arial;
        }

        .wrap{ max-width: 70rem; margin: 0 auto; padding: 1.25rem 1rem 2rem; }

        .fg{
          position:relative; border-radius:16px; border:1px solid var(--edge); overflow:hidden;
          background:
            radial-gradient(60% 120% at 50% -30%, rgba(255,255,255,.05), rgba(255,255,255,.02)),
            linear-gradient(180deg, var(--metal1), var(--metal2));
          box-shadow:0 0 0 1px rgba(255,255,255,.02) inset, 0 22px 46px rgba(0,0,0,.45)
        }

        .glass{
          pointer-events:none; position:absolute; inset:-1px; border-radius:16px;
          background:
            linear-gradient(180deg, rgba(255,255,255,.08), transparent 40%),
            radial-gradient(600px 200px at 80% -20%, rgba(255,255,255,.08), transparent 60%);
          mix-blend-mode:screen; opacity:.25; z-index:0
        }

        .top{
          display:grid; grid-template-columns:1fr; gap:.75rem; padding:.75rem .8rem .2rem .8rem
        }
        @media (min-width: 540px){ .top{ grid-template-columns:1fr auto; align-items:center } }

        .brand{ color:var(--textPrimary); font-weight:800; letter-spacing:.08em; text-transform:uppercase; font-size:.78rem }

        .controls{ display:flex; flex-wrap:wrap; gap:.4rem }

        .btn{
          display:inline-flex; align-items:center; gap:.45rem; padding:.42rem .64rem;
          border-radius:8px; border:1px solid rgba(255,255,255,.12);
          background:rgba(255,255,255,.03); color:var(--textPrimary);
          font-size:.82rem; transition:transform .08s, background .2s, border-color .2s; cursor:pointer
        }
        .btn:disabled{ color:#3c5262; border-color:#3c5262; background:#1b2735; cursor:not-allowed }
        .btn:active:not(:disabled){ transform:translateY(1px) }
        .btn-primary{ background:rgba(0,255,120,.08); border-color:rgba(0,255,120,.25); color:#0aff84 }
        .btn-toggle-active{ box-shadow:0 0 8px rgba(20,247,255,.5), inset 0 0 0 1px rgba(20,247,255,.25); border-color:rgba(20,247,255,.35) }

        .led{ width:.68rem; height:.68rem; border-radius:999px; box-shadow:0 0 10px currentColor; background:currentColor }

        .panel{ display:grid; grid-template-columns:1fr; gap:.9rem; padding:0 .8rem .9rem .8rem }
        @media (min-width: 900px){ .panel{ grid-template-columns: minmax(0,1fr) auto } }

        .screen{
          position:relative; border:1px solid #172433; border-radius:12px; background:transparent; padding: .9rem .9rem 1rem .9rem; min-height: 180px;
          box-shadow:inset 0 0 0 1px rgba(255,255,255,.02); overflow:hidden; color:var(--textMuted); line-height:1.72
        }
        @media (min-width: 640px){ .screen{ min-height: 190px } }
        @media (min-width: 1024px){ .screen{ min-height: 210px } }

        .screen::before{
          content:""; position:absolute; inset:0;
          background: radial-gradient(120% 160% at 50% 0%, rgba(8,16,26,.38), rgba(8,16,26,.12) 40%, rgba(8,16,26,.06) 100%);
          z-index:0; pointer-events:none
        }

        .title{
          margin:0 0 .5rem 0; color:var(--textPrimary);
          font-size: clamp(1rem, 2.1vw, 1.22rem); font-weight:900; letter-spacing:-.01em; text-shadow:0 1px 0 rgba(0,0,0,.28);
          position:relative; z-index:1
        }

        .line{ position:relative; z-index:1; color:#dbe7f2 }

        .typed{
          color:#dbe7f2;
          background:linear-gradient(90deg, var(--primary), var(--secondary));
          -webkit-background-clip:text; background-clip:text;
          filter:drop-shadow(0 0 10px rgba(20,247,255,.18))
        }
        @supports (-webkit-text-fill-color: transparent){
          .typed{ -webkit-text-fill-color:transparent; -webkit-text-stroke:0.35px rgba(255,255,255,.35) }
        }

        .scan{
          position:absolute; left:-35%; top:-140%; width:60%; height:300%; pointer-events:none; mix-blend-mode:screen;
          background:linear-gradient(100deg, rgba(255,255,255,0) 0%, rgba(255,255,255,.12) 45%, rgba(255,255,255,0) 100%);
          transform:rotate(10deg); animation:sweep 5s linear infinite; opacity:${scanOpacity}; z-index:0
        }
        @keyframes sweep{ 0%{ transform:translate3d(0,0,0) rotate(10deg) } 100%{ transform:translate3d(220%,0,0) rotate(10deg) } }
        @media (prefers-reduced-motion: reduce){ .scan{ animation:none !important } }

        /* Clamp text for very small screens to avoid overflow; allow scroll inside screen at extreme cases */
        .screen p{ max-height: 48vh; overflow:auto }
      `}</style>

      <div className="wrap">
        <div className="fg">
          <span className="glass" aria-hidden />
          <div className="top">
            <div className="brand">Electra Function Generator FG‑EE‑01</div>
            <div className="controls" role="toolbar" aria-label="Function generator controls">
              <button type="button" className={`btn ${powered ? "btn-primary" : ""}`} onClick={togglePower} aria-pressed={powered}>
                <span className="led" style={{ color: ledPower }} /> {powered ? "Power ON" : "Power OFF"}
              </button>

              <button type="button" className={`btn ${mode === "ION" ? "btn-toggle-active" : ""}`} onClick={() => setMode("ION")} disabled={!powered}>
                <span className="led" style={{ color: ledIon }} /> ION
              </button>

              <button type="button" className={`btn ${mode === "ATTEN" ? "btn-toggle-active" : ""}`} onClick={() => setMode("ATTEN")} disabled={!powered}>
                <span className="led" style={{ color: ledAtt }} /> ATTEN
              </button>

              <button type="button" className="btn" onClick={() => setView("intro")} disabled={!powered} aria-pressed={show === "intro"}>Intro</button>
              <button type="button" className="btn" onClick={() => setView("detail")} disabled={!powered} aria-pressed={show === "detail"}>Detail</button>

              <button type="button" className="btn" onClick={replay} disabled={!powered}>Replay</button>

              <button
                type="button"
                className="btn"
                onClick={() => { clearTimeout(bootTimer.current); safeDestroy(); printInstant(powered ? (show === "intro" ? INTRO : ON_TEXT) : OFF_TEXT); }}
              >
                Instant
              </button>

              <div className="btn" aria-label="Typing speed">
                Speed
                <button type="button" className="btn" onClick={() => setSpeed((s) => Math.max(12, s - 4))} disabled={!powered} title="Faster">–</button>
                <span style={{ padding: "0 .4rem" }}>{speed}</span>
                <button type="button" className="btn" onClick={() => setSpeed((s) => Math.min(48, s + 4))} disabled={!powered} title="Slower">+</button>
              </div>
            </div>
          </div>

          <div className="panel">
            <div className="screen" aria-live="polite" aria-atomic="true">
              <span className="scan" aria-hidden />
              <h3 className="title">About Electra Society</h3>
              <p className="line">
                <span key={typeKey} ref={textEl} className="typed" />
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
