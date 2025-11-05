"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { motion, useInView, useAnimation } from "framer-motion";
import { EventData as EVENTS } from "../app/utils/Eventsdata";

const COLORS = { neon1: "#14f7ff", neon2: "#00b8d9", accent: "#ff3366" };

/* Shared: view activation */
function useActivateAnimation() {
  const ref = useRef(null);
  const inView = useInView(ref, { amount: 0.55, once: false });
  const controls = useAnimation();
  useEffect(() => { if (inView) controls.start("on"); }, [inView, controls]);
  return { ref, controls, inView };
}

/* Desktop card (md+) */
function EventCard({ side, idx, e }) {
  const { ref, controls, inView } = useActivateAnimation();
  return (
    <div ref={ref} data-node-index={idx} className={`relative w-full ${side === "left" ? "pr-8 sm:pr-10 md:pr-12 text-right" : "pl-8 sm:pl-10 md:pl-12 text-left"}`}>
      {/* Lead + pin */}
      <div className={`absolute top-7 ${side === "left" ? "right-0" : "left-0"}`} aria-hidden>
        <div className="h-[2px] bg-cyan-100/40 w-10 sm:w-12 md:w-14" />
        <div className={`absolute -top-[6px] ${side === "left" ? "-right-[58px] sm:-right-[62px]" : "-left-[58px] sm:-left-[62px]"} w-[12px] h-[12px] rounded-full`}
             style={{ background: COLORS.neon1, filter: "drop-shadow(0 0 10px rgba(20,247,255,.95))" }} />
        <motion.div
          initial={{ opacity: 0, scale: 0.75 }}
          animate={inView ? { opacity: [0, 1, 0], scale: [0.75, 1.32, 1.5] } : { opacity: 0, scale: 0.75 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className={`absolute -top-[28px] ${side === "left" ? "-right-[86px] sm:-right-[90px]" : "-left-[86px] sm:-left-[90px]"} w-[80px] h-[80px] rounded-full border-2`}
          style={{ borderColor: "rgba(20,247,255,.45)", pointerEvents: "none" }}
        />
      </div>

      <motion.article
        variants={{
          on:  { y: -3, boxShadow: "0 0 0 1px rgba(20,247,255,.30), 0 22px 48px rgba(0,0,0,.58)" },
          off: { y:  0, boxShadow: "0 0 0 1px rgba(255,255,255,.05), 0 16px 32px rgba(0,0,0,.42)" },
        }}
        initial="off"
        animate={controls}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="relative rounded-xl border border-cyan-900/35 bg-[rgba(13,17,23,.52)] md:bg-[rgba(13,17,23,.62)] p-4 sm:p-5 backdrop-blur-[6px] text-slate-200 max-w-[540px]"
      >
        {e.date ? <div className="text-[11px] sm:text-xs text-cyan-300/80 mb-1">{e.date}</div> : null}
        <h3 className="text-[1.05rem] sm:text-[1.15rem] md:text-[1.2rem] font-black tracking-wide text-slate-100">{e.title}</h3>
        {e.eventTagline ? <div className="text-cyan-300 font-semibold text-[12px] sm:text-[13px] mb-1">{e.eventTagline}</div> : null}
        <p className="text-slate-300 text-[12.5px] sm:text-[13px] leading-relaxed">{e.description || e.eventDescription}</p>
      </motion.article>
    </div>
  );
}

/* Mobile device (sm): event content inside screen, hardware buttons */
function MobileDevice() {
  const [i, setI] = useState(0);
  const touch = useRef({ x: 0, dx: 0, active: false });
  const screenRef = useRef(null);

  const clamp = (v) => Math.max(0, Math.min(EVENTS.length - 1, v));
  const next = () => setI((v) => clamp(v + 1));
  const prev = () => setI((v) => clamp(v - 1));

  // Swipe
  useEffect(() => {
    const el = screenRef.current;
    if (!el) return;
    const start = (e) => { touch.current = { x: e.touches[0].clientX, dx: 0, active: true }; };
    const move  = (e) => { if (!touch.current.active) return; touch.current.dx = e.touches[0].clientX - touch.current.x; };
    const end   = () => { const { dx } = touch.current; touch.current.active = false; if (dx < -40) next(); else if (dx > 40) prev(); };
    el.addEventListener("touchstart", start, { passive: true });
    el.addEventListener("touchmove",  move,  { passive: true });
    el.addEventListener("touchend",   end,   { passive: true });
    return () => { el.removeEventListener("touchstart", start); el.removeEventListener("touchmove", move); el.removeEventListener("touchend", end); };
  }, []);

  const e = EVENTS[i];

  return (
    <section className="block md:hidden relative" style={{ background: "transparent", padding: "1.2rem 0 1.8rem" }}>
      <style jsx>{`
        .halo{
          position:absolute; left:50%; transform: translateX(-50%);
          bottom:-26px; width: 520px; height: 140px; pointer-events:none;
          background: radial-gradient(50% 60% at 50% 0%, rgba(20,247,255,.20), rgba(20,247,255,0) 70%);
          filter: blur(12px); opacity:.8; animation: breathe 4.5s ease-in-out infinite;
        }
        @keyframes breathe{ 0%,100%{ opacity:.62 } 50%{ opacity:.9 } }

        .device{
          position:relative; border-radius:20px;
          background: linear-gradient(180deg, #0c1118, #0a0f16 60%, #080d12);
          border:1px solid rgba(255,255,255,.09);
          box-shadow:
            inset 0 1px 0 rgba(255,255,255,.06),
            inset 0 -10px 22px rgba(0,0,0,.35),
            0 18px 38px rgba(0,0,0,.55);
        }
        .plate{
          position:absolute; left:50%; transform: translateX(-50%);
          top:-12px; padding:4px 10px; border-radius:10px;
          background: linear-gradient(180deg, #182029, #0e151c);
          border:1px solid rgba(255,255,255,.12);
          color:#bfefff; font-size:11px; letter-spacing:.06em;
          box-shadow: 0 6px 18px rgba(0,0,0,.5), inset 0 1px 0 rgba(255,255,255,.15);
        }
        .led{
          display:inline-block; width:6px; height:6px; border-radius:999px; margin-left:6px;
          background:${COLORS.neon1}; box-shadow: 0 0 10px ${COLORS.neon1};
          animation: led 2.6s ease-in-out infinite;
        }
        @keyframes led{ 0%,100%{ opacity:.6 } 50%{ opacity:1 } }

        .bezel{
          position:relative; margin:14px; border-radius:16px; overflow:hidden;
          background: #091118; border:1px solid rgba(255,255,255,.07);
          box-shadow: inset 0 0 40px rgba(0,0,0,.45);
        }
        .gridDots{
          position:absolute; inset:0; pointer-events:none; opacity:.18;
          background-image: radial-gradient(circle at 1px 1px, rgba(255,255,255,.65) 1px, transparent 1px);
          background-size: 22px 22px;
        }
        .scan{
          position:absolute; inset:0; pointer-events:none;
          background: repeating-linear-gradient(0deg, rgba(255,255,255,.035) 0px, rgba(255,255,255,.035) 1px, transparent 2px, transparent 3px);
          animation: scan 8s linear infinite;
        }
        @keyframes scan{ 0%{ transform: translateY(0) } 100%{ transform: translateY(-3px) } }

        .holo{
          position:absolute; inset:-40% -60%; pointer-events:none; mix-blend-mode: screen;
          background: radial-gradient(60% 80% at 0% 50%, rgba(20,247,255,.12), transparent 60%),
                      radial-gradient(60% 80% at 100% 50%, rgba(0,184,217,.12), transparent 60%);
          animation: pan 9s ease-in-out infinite alternate;
          filter: blur(14px);
        }
        @keyframes pan{ 0%{ transform: translate(-6%,0) } 100%{ transform: translate(6%,0) } }

        .glare{
          position:absolute; inset:0; pointer-events:none;
          background: linear-gradient(180deg, rgba(255,255,255,.08), rgba(255,255,255,0) 28%);
        }

        .knob{
          position:relative; display:flex; align-items:center; justify-content:center;
          width:46px; height:46px; border-radius:999px;
          background: radial-gradient(120% 120% at 30% 30%, #18222b, #0d141a);
          border:1px solid rgba(180,220,230,.25);
          box-shadow:
            inset 0 2px 4px rgba(0,0,0,.6),
            0 10px 24px rgba(0,0,0,.45);
          color:${COLORS.neon1};
          transition: transform .12s ease, box-shadow .12s ease, border-color .12s ease;
        }
        .knob:after{
          content:""; position:absolute; inset:-6px; border-radius:999px;
          border: 1px dashed rgba(180,220,230,.25);
        }
        .knob:hover{
          transform: translateY(-1px);
          border-color: rgba(20,247,255,.5);
          box-shadow: 0 0 0 1px rgba(20,247,255,.25), 0 16px 36px rgba(0,0,0,.55), inset 0 0 16px rgba(20,247,255,.22);
        }
        .ticks{ position:absolute; bottom:66px; left:0; right:0; display:flex; justify-content:center; gap:8px }
        .dot{ width:7px; height:7px; border-radius:999px; background: rgba(255,255,255,.28) }
        .dot.active{ background:${COLORS.neon1}; box-shadow: 0 0 10px ${COLORS.neon1} }
      `}</style>

      <div className="relative max-w-[760px] mx-auto px-3">
        <div className="halo" aria-hidden />

        {/* Device with title plate */}
        <div className="device">
          <div className="plate">Electra Events <span className="led" /></div>

          {/* Screen */}
          <div ref={screenRef} className="bezel">
            <div className="holo" aria-hidden />
            <div className="gridDots" aria-hidden />
            <div className="scan" aria-hidden />
            <div className="glare" aria-hidden />

            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10, scale: 0.994 }}
              animate={{ opacity: 1, y: 0, scale: 1, transition: { duration: 0.28, ease: "easeOut" } }}
              className="p-4"
            >
              <div className="rounded-lg border border-cyan-900/35 bg-[rgba(13,17,23,.62)] p-3 text-slate-200 shadow-[0_0_0_1px_rgba(255,255,255,.04),0_14px_28px_rgba(0,0,0,.45)]">
                {EVENTS[i].date ? <div className="text-[11px] text-cyan-300/80 mb-1">{EVENTS[i].date}</div> : null}
                <h3 className="text-[1.04rem] font-black tracking-wide text-slate-100">{EVENTS[i].title}</h3>
                {EVENTS[i].eventTagline ? <div className="text-cyan-300 font-semibold text-[12px] mb-1">{EVENTS[i].eventTagline}</div> : null}
                <p className="text-slate-300 text-[12.5px] leading-relaxed">{EVENTS[i].description || EVENTS[i].eventDescription}</p>
              </div>
            </motion.div>
          </div>

          {/* Knobs row */}
          <div className="flex items-center justify-between px-5 pb-4 pt-3">
            <button className="knob" onClick={() => setI((v) => Math.max(0, v - 1))} disabled={i === 0} aria-label="Previous">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M15 6l-6 6 6 6" stroke={COLORS.neon1} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </button>

            <div className="ticks">
              {EVENTS.map((_, k) => (<div key={k} className={`dot ${k === i ? "active" : ""}`} />))}
            </div>

            <button className="knob" onClick={() => setI((v) => Math.min(EVENTS.length - 1, v + 1))} disabled={i === EVENTS.length - 1} aria-label="Next">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M9 6l6 6-6 6" stroke={COLORS.neon1} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}


/* Desktop 3-column conduit (unchanged) */
function DesktopGrid() {
  const rootRef = useRef(null);
  const gridRef = useRef(null);
  const ticksRef = useRef(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const pulses = Array.from(root.querySelectorAll("[data-conduit-pulse]"));
    const nodes = Array.from(root.querySelectorAll("[data-node-index]"));
    const io = new IntersectionObserver((ents) => {
      ents.forEach((ent) => {
        if (!ent.isIntersecting) return;
        const idx = Number(ent.target.getAttribute("data-node-index")) || 0;
        const p = pulses[idx % pulses.length];
        if (!p) return; p.classList.remove("run"); p.offsetLeft; p.classList.add("run");
      });
    }, { threshold: 0.55 });
    nodes.forEach((n) => io.observe(n));
    return () => io.disconnect();
  }, []);

  useLayoutEffect(() => {
    const grid = gridRef.current;
    const ticks = ticksRef.current;
    if (!grid || !ticks) return;
    function positionTicks() {
      ticks.innerHTML = "";
      const cards = grid.querySelectorAll("[data-node-index]");
      const gridRect = grid.getBoundingClientRect();
      cards.forEach((card) => {
        const rect = card.getBoundingClientRect();
        const top = rect.top - gridRect.top + rect.height / 2;
        const el = document.createElement("div");
        el.className = "tick";
        el.style.top = `${top}px`;
        ticks.appendChild(el);
      });
    }
    positionTicks();
    const ro = new ResizeObserver(positionTicks);
    ro.observe(document.body);
    window.addEventListener("scroll", positionTicks, { passive: true });
    return () => { ro.disconnect(); window.removeEventListener("scroll", positionTicks); };
  }, []);

  return (
    <section ref={rootRef} className="hidden md:block relative overflow-hidden" style={{ background: "transparent", padding: "1.25rem 0 2rem" }}>
      <style jsx>{`
        .conduit {
          position:absolute; top:0; bottom:0; left:50%; width:4px; transform: translateX(-50%);
          background: linear-gradient(180deg, ${COLORS.neon1}, ${COLORS.neon2});
          box-shadow: 0 0 20px rgba(20,247,255,.6), 0 0 80px rgba(0,184,217,.35);
        }
        .conduit::before {
          content:""; position:absolute; left:50%; top:0; bottom:0; width: 110px; transform: translateX(-50%);
          background: radial-gradient(54px 60% at 50% 50%, rgba(20,247,255,.12), rgba(20,247,255,0) 70%);
          animation: throb 2.2s ease-in-out infinite; pointer-events:none;
        }
        @keyframes throb { 0%,100%{ opacity:.6 } 50%{ opacity:.95 } }

        .pulse { position:absolute; left:50%; width:12px; height:12px; border-radius:999px; transform: translateX(-50%);
                 background: ${COLORS.neon1}; filter: drop-shadow(0 0 12px ${COLORS.neon1}); opacity:0 }
        .pulse.run { animation: travel 1.8s cubic-bezier(.2,.6,.2,1) forwards }
        .pulse::after{ content:""; position:absolute; inset:-8px; border-radius:999px; border:2px solid rgba(255,51,102,.45); opacity:0 }
        .pulse.run::after{ animation: ring 1.2s ease-out forwards .2s }
        @keyframes travel{ 0%{top:0%;opacity:0} 10%{opacity:1} 90%{opacity:1} 100%{top:100%;opacity:0} }
        @keyframes ring{ 0%{ transform: scale(.7); opacity: .7 } 100%{ transform: scale(1.4); opacity: 0 } }

        .tick { position:absolute; left:50%; width:52px; height:2px; background: rgba(220,240,255,.35); transform: translateX(-50%); }

        .flicker { position:absolute; inset:0; pointer-events:none;
          background:
            radial-gradient(340px 120px at 12% 0%, rgba(20,247,255,.08), transparent 60%),
            radial-gradient(300px 120px at 88% 100%, rgba(0,184,217,.08), transparent 60%);
          mix-blend-mode: screen; opacity:.48; animation: hum 6s ease-in-out infinite; }
        @keyframes hum { 0%,100%{ opacity:.38 } 50%{ opacity:.6 } }

        .shimmer{ position:absolute; top:-20vh; bottom:-20vh; left:50%; width:240px; transform: translateX(-50%);
          background:
            radial-gradient(92px 60% at 50% 20%, rgba(20,247,255,.12), transparent 70%),
            radial-gradient(92px 60% at 50% 80%, rgba(0,184,217,.10), transparent 70%);
          filter: blur(12px); opacity:.40; pointer-events:none; transition: transform .25s ease, opacity .25s ease; }
      `}</style>

      <div className="flicker" aria-hidden />
      <div className="conduit" aria-hidden />
      <div className="shimmer" id="shimmer" aria-hidden />

      {Array.from({ length: Math.max(6, EVENTS.length) }).map((_, i) => (
        <div key={i} className="pulse" data-conduit-pulse />
      ))}

      <div className="absolute inset-0 pointer-events-none" ref={ticksRef} />

      <div className="relative mx-auto w-full max-w-[1100px] px-4">
        <h2 className="text-slate-100 font-black tracking-wide text-[clamp(1.05rem,3vw,1.8rem)] mb-2">Electra Energy Timeline</h2>
        <p className="text-slate-300/90 text-[14px] mb-6">Scroll to send charge through time — nodes discharge as they enter view.</p>

        <div className="grid grid-cols-[1fr_72px_1fr] gap-y-12" ref={gridRef}>
          {EVENTS.map((e, i) => (
            <div key={e.title + i} className="contents">
              <div>{i % 2 === 0 && <EventCard side="left" idx={i} e={e} />}</div>
              <div />
              <div>{i % 2 === 1 && <EventCard side="right" idx={i} e={e} />}</div>
              {i === EVENTS.length - 1 && EVENTS.length % 2 === 1 && (<><div /> <div /></>)}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* Root */
export default function ElectraEnergyTimeline() {
  // Optional: desktop shimmer parallax
  useEffect(() => {
    const el = document.getElementById("shimmer");
    if (!el) return;
    const onScroll = () => {
      const y = window.scrollY * 0.06;
      el.style.transform = `translateX(-50%) translateY(${y}px)`;
      const op = 0.30 + Math.min(0.28, Math.abs((window.scrollY % 600) - 300) / 1200);
      el.style.opacity = String(op);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <DesktopGrid />
      <MobileDevice />
    </>
  );
}
