// src/components/team/CoreCircuit.jsx
"use client";

import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import { TeamStore } from "../app/store/TeamStore";
import { motion, AnimatePresence } from "framer-motion";
import { CldImage } from "next-cloudinary";
import { FaLinkedin, FaGithub, FaXTwitter } from "react-icons/fa6";

const FILTERS = [
  { id: "all", label: "All" },
  { id: "president", label: "President" },
  { id: "general secretary", label: "General Secretary" },
  { id: "treasurer", label: "Treasurer" },
  { id: "vice president", label: "Vice President" },
  { id: "assistant general secretary", label: "Assistant GS" },
  { id: "heads", label: "Heads" },
  { id: "technical team", label: "Technical Team" },
  { id: "executive team", label: "Executive Team" },
];

export default function CoreTeam() {
  const { team = [], teamLoad, getTeamByYear } = useContext(TeamStore);
  const [active, setActive] = useState("all");
  const [boot, setBoot] = useState(false);
  const segRef = useRef(null);

  useEffect(() => {
    if (!boot && typeof getTeamByYear === "function") {
      setBoot(true);
      getTeamByYear("2025");
    }
  }, [boot, getTeamByYear]); // default fetch [web:95]

  const norm = (s) => decodeURIComponent(String(s || "").toLowerCase().trim()); // decode %20 and normalize [web:95]

  const filtered = useMemo(() => {
    const list = Array.isArray(team) ? team.filter((m) => m && (m.publicId || m.img)) : [];
    if (active === "all") return list;

    // Position-based filters
    if (["president", "general secretary", "treasurer", "vice president", "assistant general secretary"].includes(active)) {
      // include typo/alias for Assistant GS
      return list.filter((m) => {
        const p = norm(m.position);
        if (active === "assistant general secretary") {
          return p === "assistant general secretary" || p === "assistant general seceretary" || p === "ags";
        }
        if (active === "vice president") {
          return p === "vice president" || p === "vice-president" || p === "vp";
        }
        return p === active;
      });
    }

    // Category-based filters
    if (["heads", "technical team", "executive team"].includes(active)) {
      return list.filter((m) => norm(m.category) === active);
    }

    return list;
  }, [team, active]); // compute filter [web:95]

  // Compute columns for active pill math
  const cols = typeof window !== "undefined" && window.innerWidth < 768 ? 3 : 5; // split filters across rows on small screens

  return (
    <section className="relative bg-[#0b1118]">
      <div className="max-w-[1280px] mx-auto px-[min(5vw,24px)] py-8">
        {/* Heading */}
        <div className="relative text-center mb-6">
          <h1 className="text-3xl md:text-4xl font-extrabold text-[#e0e0e0] tracking-wide">
            ⚡ The Core Circuit
          </h1>
          <p className="mt-2 text-slate-300">
            Every spark in Electra comes from the minds behind the current.
          </p>
          <div className="relative mx-auto mt-4 h-6 w-full max-w-[520px]">
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 520 24" fill="none">
              <defs>
                <linearGradient id="glow" x1="0" x2="1">
                  <stop offset="0%" stopColor="#14f7ff" />
                  <stop offset="100%" stopColor="#ff3366" />
                </linearGradient>
                <filter id="blur" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation="2" />
                </filter>
              </defs>
              <path d="M0 12 C40 2, 80 22, 120 12 S200 2, 240 12 S320 22, 360 12 S440 2, 480 12 S520 22, 560 12"
                    stroke="url(#glow)" strokeWidth="2" fill="none" className="animate-[pulse_2.8s_ease-in-out_infinite]" />
              <path d="M0 12 C40 2, 80 22, 120 12 S200 2, 240 12 S320 22, 360 12 S440 2, 480 12 S520 22, 560 12"
                    stroke="#14f7ff" strokeOpacity="0.6" strokeWidth="6" filter="url(#blur)" fill="none" />
            </svg>
          </div>
        </div>

        {/* Segmented filter with sliding glow */}
        <div ref={segRef} className="relative mx-auto w-full max-w-[980px] rounded-2xl border border-cyan-400/30 p-1 bg-[#0e1420]/60 backdrop-blur">
          <div className="grid grid-cols-3 md:grid-cols-5 gap-1 relative">
            <AnimatePresence initial={false}>
              <motion.span
                key={active}
                layoutId="active-role"
                className="absolute top-1 bottom-1 rounded-xl bg-cyan-400/15 ring-1 ring-cyan-300/40"
                transition={{ type: "spring", stiffness: 400, damping: 40 }}
                style={{
                  left: `${(FILTERS.findIndex((f) => f.id === active) % cols) * (100 / cols)}%`,
                  width: `${100 / cols}%`,
                }}
              />
            </AnimatePresence>
            {FILTERS.map((f) => {
              const isActive = active === f.id;
              return (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setActive(f.id)}
                  className={[
                    "relative z-10 rounded-xl px-3 py-2 text-xs md:text-sm font-bold transition will-change-transform",
                    "border border-cyan-400/50 text-cyan-300 hover:bg-cyan-400/20",
                    isActive ? "scale-[1.02] text-[#0b1118] bg-cyan-300" : "",
                  ].join(" ")}
                >
                  {f.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Cards grid */}
        <div className="mt-6 grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {teamLoad && Array.from({ length: 8 }).map((_, i) => <Skeleton key={i} />)}
          {!teamLoad && filtered.map((m) => <Card key={m._id || m.publicId} m={m} />)}
          {!teamLoad && filtered.length === 0 && (
            <div className="col-span-full text-center text-slate-400 py-10">
              No members match this filter yet.
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

/* Hologram card with avatar ring */
function Card({ m }) {
  const [hover, setHover] = useState(false);
  const name = m.name || "";
  const role = m.position || m.role || "";
  const src = m.publicId || m.img;

  return (
    <div
      className={`relative rounded-2xl border border-cyan-400/10 bg-gradient-to-b from-[#0e1420] to-[#081018]
                  shadow-[0_0_20px_rgba(20,247,255,0.12)] overflow-hidden transition
                  ${hover ? "scale-[1.03] shadow-[0_0_30px_rgba(20,247,255,0.3)]" : ""}`}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <div
        aria-hidden
        className={`absolute inset-0 opacity-10 transition-[opacity,transform] duration-500
                    [background-image:radial-gradient(circle_at_1px_1px,rgba(20,247,255,.6)_1px,transparent_1px)]
                    [background-size:22px_22px]
                    ${hover ? "opacity-20 scale-105" : ""}`}
      />
      <div className="relative pt-5 pb-2 grid place-items-center">
        <div className="relative w-28 h-28">
          <svg className="absolute inset-0" viewBox="0 0 120 120">
            <defs>
              <linearGradient id="ring" x1="0" x2="1">
                <stop offset="0%" stopColor="#14f7ff" />
                <stop offset="100%" stopColor="#ff3366" />
              </linearGradient>
            </defs>
            <circle cx="60" cy="60" r="52" stroke="url(#ring)" strokeWidth="3" fill="none" opacity="0.7" />
            <circle cx="60" cy="60" r="52" stroke="#14f7ff" strokeWidth="3" fill="none" strokeDasharray="12 10" className="animate-[spin_6s_linear_infinite]" opacity="0.6" />
          </svg>
          <div className="absolute inset-[8px] rounded-full overflow-hidden bg-[#0b1118]">
            {src ? (
              <CldImage
                width="256" height="256" src={src}
                alt={`${name} avatar`}
                className="object-cover w-full h-full"
                crop="fit" quality="auto" format="auto"
              />
            ) : (
              <div className="w-full h-full grid place-items-center text-slate-500">No photo</div>
            )}
          </div>
        </div>
      </div>
      <div className="px-4 pb-4 text-center">
        <div className="text-[#14f7ff] font-bold text-lg">{name}</div>
        <div className="text-slate-400 text-sm">{role}</div>
        <div className="mt-2 flex items-center justify-center gap-3">
          {m.linkedin && <a href={m.linkedin} target="_blank" rel="noreferrer" className="text-cyan-300 hover:text-cyan-200 transition"><FaLinkedin /></a>}
          {m.github && <a href={m.github} target="_blank" rel="noreferrer" className="text-cyan-300 hover:text-cyan-200 transition"><FaGithub /></a>}
          {m.twitter && <a href={m.twitter} target="_blank" rel="noreferrer" className="text-cyan-300 hover:text-cyan-200 transition"><FaXTwitter /></a>}
        </div>
      </div>
    </div>
  );
}

/* Skeleton loader card */
function Skeleton() {
  return (
    <div className="rounded-2xl border border-cyan-400/10 bg-[#0e1420] p-4 animate-pulse">
      <div className="mx-auto w-28 h-28 rounded-full bg-cyan-400/10" />
      <div className="h-4 bg-cyan-400/10 rounded mt-4" />
      <div className="h-3 bg-cyan-400/10 rounded mt-2 w-1/2 mx-auto" />
    </div>
  );
}
