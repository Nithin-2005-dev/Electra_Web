// src/components/resources/ResourcesFlow.jsx
"use client";

import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ResourceStore } from "../app/store/ResourceStore";
import { SubjectData } from "../app/utils/Subjects";

// Tiny glow dot for tabs
const ICON_FOR = () => (
  <span className="inline-block w-2 h-2 rounded-full bg-cyan-300 shadow-[0_0_8px_rgba(20,247,255,.9)] mr-2" />
);

export default function ResourcesFlow() {
  const { getResources, data = [], resLoad } = useContext(ResourceStore);

  const [stage, setStage] = useState("sem"); // "sem" | "subjects" | "resources"
  const [sem, setSem] = useState(null);
  const [subjectCode, setSubjectCode] = useState(null);
  const [active, setActive] = useState("all");
  const [tabs, setTabs] = useState([{ id: "all", label: "All" }]);

  const [pdf, setPdf] = useState({ open: false, src: "", title: "" });

  // Stable tabs source
  const semesterAllRef = useRef([]);

  // Latest store method
  const getResRef = useRef(getResources);
  useEffect(() => {
    getResRef.current = getResources;
  }, [getResources]); // keep latest ref [web:318]

  // Reset when moving up
  useEffect(() => {
    if (stage === "sem") {
      setSem(null);
      setSubjectCode(null);
      setActive("all");
      semesterAllRef.current = [];
    }
    if (stage === "subjects") {
      setSubjectCode(null);
      setActive("all");
    }
  }, [stage]); // clear downstream state when navigating up [web:318]

  // Fetch guard
  const lastKeyRef = useRef("");
  useEffect(() => {
    if (stage !== "resources" || !sem) return;
    const key = `${sem}|${active}`;
    if (lastKeyRef.current === key) return;
    lastKeyRef.current = key;
    const controller = new AbortController();
    getResRef.current?.(sem, active, controller.signal);
    return () => controller.abort();
  }, [stage, sem, active]); // avoid duplicate fetches [web:318]

  // Snapshot to build tabs
  useEffect(() => {
    if (stage !== "resources" || !sem) return;
    const arr = Array.isArray(data) ? data : [];
    if (active === "all" || semesterAllRef.current.__sem !== sem) {
      semesterAllRef.current = Object.assign([], arr, { __sem: sem });
    }
  }, [stage, sem, active, data]); // preserve full semester data [web:318]

  // Subjects
  const subjects = useMemo(() => {
    if (!sem) return [];
    const idx = Number(sem) - 1;
    return SubjectData?.[idx] || [];
  }, [sem]); // derived list [web:318]

  // Visible list
  const list = useMemo(() => (Array.isArray(data) ? data : []), [data]); // normalize [web:318]
  const visible = useMemo(() => {
    if (!subjectCode || active === "all") {
      return subjectCode ? list.filter((r) => String(r.subject) === String(subjectCode)) : list;
    }
    return list.filter((r) => String(r.subject) === String(subjectCode));
  }, [list, subjectCode, active]); // client filter [web:318]

  // Tabs
  useEffect(() => {
    if (stage !== "resources" || !sem) return;
    const source = semesterAllRef.current.__sem === sem ? semesterAllRef.current : (Array.isArray(data) ? data : []);
    const raw = Array.from(new Set(source.map((r) => r.category).filter(Boolean)));
    const pretty = (s) =>
      String(s).replace(/[_-]+/g, " ").replace(/\s+/g, " ").trim().replace(/\b\w/g, (m) => m.toUpperCase());
    const built = [{ id: "all", label: "All" }, ...raw.sort().map((c) => ({ id: c, label: pretty(c) }))];
    setTabs(built);
    if (!built.find((t) => t.id === active)) setActive("all");
  }, [stage, sem, data]); // stable set of category tabs [web:318]

  // Segmented control math for desktop grid indicator
  const cols =
    typeof window !== "undefined"
      ? window.innerWidth < 640
        ? 2
        : window.innerWidth < 1024
        ? 3
        : 6
      : 6;
  const activeIndex = Math.max(0, tabs.findIndex((t) => t.id === active));
  const leftPct = ((activeIndex % cols) * 100) / cols;
  const widthPct = 100 / cols;

  // Header helpers
  const canBack = stage !== "sem";
  const backTarget = stage === "resources" ? "subjects" : "sem";

  return (
    <section className="relative overflow-hidden">
  {/* 30% page tint */}
  <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 bg-black/30" />

  {/* Neon background (keep your existing layers below) */}
  <div aria-hidden className="pointer-events-none absolute inset-0 -z-20 bg-[linear-gradient(180deg,#070d14,#0b1118_35%,#0d1117_100%)]" />
  <span aria-hidden className="pointer-events-none absolute -inset-24 -z-20 blur-3xl opacity-35 bg-[radial-gradient(120%_80%_at_0%_0%,rgba(20,247,255,.22),transparent_60%),radial-gradient(120%_80%_at_100%_100%,rgba(255,51,102,.18),transparent_60%)]" />
  <span aria-hidden className="pointer-events-none absolute inset-0 -z-20 opacity-15 [background-image:radial-gradient(circle_at_1px_1px,rgba(255,255,255,.35)_1px,transparent_1px)] [background-size:36px_36px]" />
      <div className="max-w-[1280px] mx-auto px-[min(5vw,24px)] py-8">
     {/* Heading + Back (responsive) */}
<header className="mb-5">
  {/* Mobile: stacked center title, back in its own row on the right */}
  <div className="grid grid-cols-1 gap-3 sm:hidden">
    <div className="text-center">
      <h1 className="text-2xl font-extrabold tracking-wide text-[#e7faff] drop-shadow-[0_0_20px_rgba(20,247,255,.25)]">
        ⚡ Electra Knowledge Grid
      </h1>
      <div className="relative mx-auto mt-2 h-5 w-full max-w-[380px]">
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 520 24" fill="none" aria-hidden>
          <defs>
            <linearGradient id="glow" x1="0" x2="1">
              <stop offset="0%" stopColor="#14f7ff" />
              <stop offset="100%" stopColor="#ff3366" />
            </linearGradient>
            <filter id="blur" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="2" />
            </filter>
          </defs>
          <path d="M0 12 C40 2, 80 22, 120 12 S200 2, 240 12 S320 22, 360 12 S440 2, 480 12 S520 22, 560 12" stroke="url(#glow)" strokeWidth="2" className="animate-[pulse_2.8s_ease-in-out_infinite]" />
          <path d="M0 12 C40 2, 80 22, 120 12 S200 2, 240 12 S320 22, 360 12 S440 2, 480 12 S520 22, 560 12" stroke="#14f7ff" strokeOpacity="0.6" strokeWidth="6" filter="url(#blur)" />
        </svg>
      </div>
      {stage === "subjects" && sem && <p className="mt-2 text-cyan-200 text-sm">Semester {sem} — choose a subject</p>}
      {stage === "resources" && (
        <p className="mt-2 text-cyan-200 text-sm">
          {subjectCode === "all" ? "All Subjects" : `Subject ${subjectCode}`} — Semester {sem}
        </p>
      )}
    </div>
    <div className="flex justify-end">
      {stage !== "sem" && (
        <button
          type="button"
          onClick={() => setStage(stage === "resources" ? "subjects" : "sem")}
          className="rounded-md border border-cyan-400/30 px-3 py-2 text-cyan-200 hover:bg-cyan-400/10 transition text-sm"
        >
          ← Back
        </button>
      )}
    </div>
  </div>

  {/* ≥ sm: three-column layout ensures true centered title with right-aligned back */}
  <div className="hidden sm:grid grid-cols-[1fr_auto_1fr] items-center">
    <div className="justify-self-start" />
    <div className="justify-self-center text-center min-w-0">
      <h1 className="text-3xl md:text-4xl font-extrabold tracking-wide text-[#e7faff] drop-shadow-[0_0_20px_rgba(20,247,255,.25)]">
        ⚡ Electra Knowledge Grid
      </h1>
      <div className="relative mx-auto mt-2 h-6 w-full max-w-[520px]">
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 520 24" fill="none" aria-hidden>
          <defs>
            <linearGradient id="glow" x1="0" x2="1">
              <stop offset="0%" stopColor="#14f7ff" />
              <stop offset="100%" stopColor="#ff3366" />
            </linearGradient>
            <filter id="blur" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="2" />
            </filter>
          </defs>
          <path d="M0 12 C40 2, 80 22, 120 12 S200 2, 240 12 S320 22, 360 12 S440 2, 480 12 S520 22, 560 12" stroke="url(#glow)" strokeWidth="2" className="animate-[pulse_2.8s_ease-in-out_infinite]" />
          <path d="M0 12 C40 2, 80 22, 120 12 S200 2, 240 12 S320 22, 360 12 S440 2, 480 12 S520 22, 560 12" stroke="#14f7ff" strokeOpacity="0.6" strokeWidth="6" filter="url(#blur)" />
        </svg>
      </div>
      {stage === "subjects" && sem && <p className="mt-2 text-cyan-200">Semester {sem} — choose a subject</p>}
      {stage === "resources" && (
        <p className="mt-2 text-cyan-200">
          {subjectCode === "all" ? "All Subjects" : `Subject ${subjectCode}`} — Semester {sem}
        </p>
      )}
    </div>
    <div className="justify-self-end">
      {stage !== "sem" && (
        <button
          type="button"
          onClick={() => setStage(stage === "resources" ? "subjects" : "sem")}
          className="rounded-md border border-cyan-400/30 px-3 py-2 text-cyan-200 hover:bg-cyan-400/10 transition"
        >
          ← Back
        </button>
      )}
    </div>
  </div>
</header>


        {/* Stage 1 — Semesters */}
        {stage === "sem" && (
          <div className="mt-2">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 max-w-[980px] mx-auto">
              {Array.from({ length: 8 }).map((_, i) => {
                const s = String(i + 1);
                return (
                  <motion.button
                    key={s}
                    type="button"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      setSem(s);
                      setActive("all");
                      setStage("subjects");
                      setSubjectCode(null);
                      lastKeyRef.current = "";
                    }}
                    className="w-full rounded-2xl border border-cyan-400/25 bg-[#0e1420]/70 text-cyan-100 px-4 py-5 text-center shadow-[0_0_28px_rgba(20,247,255,.12)] hover:bg-[#0f1826]/70 transition"
                  >
                    Semester {s}
                  </motion.button>
                );
              })}
            </div>

            {/* Electra Oscilloscope — “magical” goal section */}
            <div className="mt-10">
              <ElectraScope />
            </div>
          </div>
        )}

        {/* Stage 2 — Subjects */}
        {stage === "subjects" && (
          <div className="mt-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {subjects.map((s) => (
                <motion.button
                  key={s.subjectCode}
                  type="button"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.985 }}
                  onClick={() => {
                    setSubjectCode(String(s.subjectCode));
                    setActive("all");
                    setStage("resources");
                    lastKeyRef.current = "";
                  }}
                  className="w-full rounded-2xl border border-cyan-400/15 bg-[#0e141d] text-cyan-100 px-4 py-4 text-left shadow-[0_0_20px_rgba(20,247,255,.10)] hover:bg-[#0f1826] transition"
                >
                  <span className="font-semibold">{s.subject}</span>
                  <span className="ml-2 text-xs text-slate-400">{s.subjectCode}</span>
                </motion.button>
              ))}
              <motion.button
                type="button"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.985 }}
                onClick={() => {
                  setSubjectCode("all");
                  setActive("all");
                  setStage("resources");
                  lastKeyRef.current = "";
                }}
                className="w-full rounded-2xl border border-cyan-400/25 bg-[#101825] text-[#14f7ff] px-4 py-4 text-left font-semibold shadow-[0_0_22px_rgba(20,247,255,.16)] hover:bg-[#122033] transition"
              >
                All Subjects in Sem {sem}
              </motion.button>
            </div>
            <div className="mt-10">
              <ElectraScope />
            </div>
          </div>
        )}

        {/* Stage 3 — Resources */}
        {stage === "resources" && (
          <div className="mt-2">
            {/* Responsive categories row: horizontal scroll on mobile, grid with indicator on desktop */}
            <div className="mx-auto w-full max-w-[980px] rounded-2xl border border-cyan-400/30 p-1 bg-[#0e1420]/60 backdrop-blur relative shadow-[0_0_24px_rgba(20,247,255,.12)]">
              <div
                className={`relative flex gap-1 overflow-x-auto no-scrollbar px-1 py-1
                [scroll-snap-type:x_mandatory] sm:grid sm:grid-cols-3 lg:grid-cols-6 sm:overflow-visible`}
              >
                <AnimatePresence initial={false}>
                  {typeof window !== "undefined" && window.innerWidth >= 640 && (
                    <motion.span
                      key={active}
                      layoutId="active-seg"
                      className="hidden sm:block absolute top-1 bottom-1 rounded-xl ring-1 ring-[#14f7ff]/40 bg-[#14f7ff]/10 shadow-[0_0_12px_#14f7ff]"
                      transition={{ type: "spring", stiffness: 500, damping: 42 }}
                      style={{ left: `${leftPct}%`, width: `${widthPct}%` }}
                    />
                  )}
                </AnimatePresence>

                {tabs.map((t) => {
                  const isActive = active === t.id;
                  return (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setActive(t.id)}
                      className={[
                        "relative z-10 rounded-xl px-3 py-2 text-xs md:text-sm font-bold transition select-none",
                        "border border-cyan-400/30 text-cyan-300 hover:bg-cyan-400/10 active:scale-95",
                        "shrink-0 scroll-snap-align-start",
                        isActive ? "text-[#14f7ff] border-[#14f7ff] shadow-[0_0_10px_#14f7ff]" : "",
                      ].join(" ")}
                    >
                      <ICON_FOR />
                      {t.label}
                    </button>
                  );
                })}
              </div>
              
            </div>

            {/* Grid */}
            <div className="mt-5 grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {resLoad && Array.from({ length: 8 }).map((_, i) => <CardSkeleton key={`sk-${i}`} />)}
              {!resLoad &&
                visible.map((r) => {
                  const kind = active === "all" ? (r.category || "docs") : active;
                  return (
                    <PowerCard
                      key={r._id || r.driveUrl || r.name}
                      item={r}
                      kind={kind}
                      onOpenPdf={(src, title) => setPdf({ open: true, src, title })}
                    />
                  );
                })}
              {!resLoad && visible.length === 0 && (
                <div className="col-span-full text-center text-slate-400 py-10">No resources found for this selection.</div>
              )}
            </div>
             <div className="mt-10">
              <ElectraScope />
            </div>
          </div>
        )}
      </div>

      {/* Full-screen PDF via portal (raw iframe + fallback) */}
      <ElectraPdfModal
        open={pdf.open}
        src={pdf.src}
        title={pdf.title}
        onRequestClose={() => setPdf({ open: false, src: "", title: "" })}
      />

      {/* global helpers */}
      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        @keyframes oscSweep { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
        @keyframes sparkPulse { 0%,100% { opacity:.4 } 50% { opacity:1 } }
      `}</style>
</section>
  );
}
function ElectraScope() {
  return (
    <div className="relative mx-auto max-w-[980px] rounded-3xl border border-cyan-400/20 bg-[#0b1118]/80 backdrop-blur p-6 overflow-hidden">
      {/* soft conic glow */}
      <span aria-hidden className="pointer-events-none absolute -inset-24 blur-3xl opacity-25 bg-[conic-gradient(from_0deg,#14f7ff_0%,#7a5cff_33%,#ff3366_66%,#14f7ff_100%)]" />
      {/* subtle grid */}
      <span aria-hidden className="pointer-events-none absolute inset-0 opacity-10 [background-image:radial-gradient(circle_at_1px_1px,rgba(255,255,255,.35)_1px,transparent_1px)] [background-size:28px_28px]" />

      <div className="grid items-center gap-6 md:grid-cols-[minmax(320px,560px)_1fr]">
        {/* scope screen */}
        <div className="relative mx-auto w-full max-w-[560px] rounded-2xl border border-cyan-400/25 bg-[#08121a]/90 shadow-[inset_0_0_30px_rgba(20,247,255,.08)] overflow-hidden">
          {/* screen micro-grid */}
          <div className="absolute inset-0 opacity-15 [background-image:radial-gradient(circle_at_1px_1px,rgba(255,255,255,.35)_1px,transparent_1px)] [background-size:22px_22px]" />
          {/* header strip */}
          <div className="relative z-10 flex items-center justify-between px-4 py-2 border-b border-cyan-400/20 bg-[#0c1520]/80">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-300 shadow-[0_0_8px_rgba(20,247,255,.9)]" />
              <span className="text-cyan-100 font-semibold">Electra Resources</span>
            </div>
            <span className="text-xs text-slate-400">v1.0</span>
          </div>

          {/* content */}
          <div className="relative z-10 p-4 md:p-5">
            <p className="text-slate-300 text-sm">
              Browse semester content, filter by category, and open materials in a focused viewer to speed up learning.
            </p>

            {/* radio/toggle group */}
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <ScopeRadio label="Categories" hint="All, Notes, Books, Pyp" />
              <ScopeRadio label="Subjects" hint="Per semester" />
              <ScopeRadio label="Preview" hint="In-page modal" />
              <ScopeRadio label="Open in tab" hint="Fallback option" />
            </div>
          </div>
        </div>

        {/* right copy */}
        <div className="relative">
          <h3 className="text-[#e7faff] text-xl font-bold">Electra Goal</h3>
          <p className="text-slate-300 mt-2">
            Learn faster with clear navigation and quick access to high‑quality notes, books, and past papers.
          </p>
          <p className="text-slate-400 mt-1">
            Use categories to focus, previews to scan, and new‑tab opens when a file blocks embedding.
          </p>
        </div>
      </div>
    </div>
  );
}

function ScopeRadio({ label, hint }) {
  return (
    <label className="flex items-center gap-3 rounded-xl border border-cyan-400/20 bg-[#0c1724]/70 px-3 py-2 cursor-default">
      <span className="relative inline-grid place-items-center w-4 h-4 rounded-full border border-cyan-400/50">
        <span className="w-2 h-2 rounded-full bg-[#14f7ff] shadow-[0_0_8px_rgba(20,247,255,.9)]" />
      </span>
      <span className="text-cyan-100 text-sm font-medium">{label}</span>
      <span className="ml-auto text-xs text-slate-400">{hint}</span>
    </label>
  );
}

function ScopePill({ text }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-[#0e1623]/70 px-2 py-1">
      <span className="w-1.5 h-1.5 rounded-full bg-cyan-300 shadow-[0_0_6px_rgba(20,247,255,.9)]" />
      {text}
    </span>
  );
}



/* ——— Full-screen portal modal (raw iframe + fallback) ——— */
function ElectraPdfModal({ open, src, title, onRequestClose }) {
  const [mounted, setMounted] = React.useState(false);
  const [loaded, setLoaded] = React.useState(false);
  const [failed, setFailed] = React.useState(false);
  const ref = React.useRef(null);
  const timerRef = React.useRef(null);

  React.useEffect(() => { setMounted(true); }, []); // client-only portal [web:249]

  // lock background scroll
  React.useEffect(() => {
    if (!open) return;
    const root = document.documentElement;
    const prev = root.style.overflow;
    root.style.overflow = "hidden";
    return () => { root.style.overflow = prev || ""; };
  }, [open]); // [web:324]

  // native dialog sync
  React.useEffect(() => {
    const dlg = ref.current;
    if (!dlg) return;
    try {
      if (open) { if (!dlg.open) dlg.showModal(); }
      else { if (dlg.open) dlg.close(); dlg.removeAttribute("open"); }
    } catch {
      try { if (open) dlg.setAttribute("open", ""); else dlg.removeAttribute("open"); } catch {}
    }
  }, [open]); // [web:249]

  // load state + timeout fallback
  React.useEffect(() => {
    if (!open) return;
    setLoaded(false);
    setFailed(false);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setFailed(true), 3500);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [open, src]); // [web:337]

  const forceClose = React.useCallback(() => {
    const dlg = ref.current;
    try { dlg?.close?.(); } catch {}
    try { dlg?.removeAttribute?.("open"); } catch {}
    onRequestClose?.();
  }, [onRequestClose]); // [web:249]

  // dialog cancel/close + ESC
  React.useEffect(() => {
    const dlg = ref.current;
    if (!dlg) return;
    const onCancel = (e) => { e.preventDefault(); forceClose(); };
    const onCloseEvt = () => forceClose();
    dlg.addEventListener("cancel", onCancel);
    dlg.addEventListener("close", onCloseEvt);
    return () => {
      dlg.removeEventListener("cancel", onCancel);
      dlg.removeEventListener("close", onCloseEvt);
    };
  }, [forceClose]); // [web:249]

  React.useEffect(() => {
    if (!open) return;
    const onKey = (e) => { if (e.key === "Escape") forceClose(); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, forceClose]); // [web:338]

  if (!mounted || !open) return null;

  return createPortal(
    <>
      <dialog
        ref={ref}
        aria-labelledby="electra-pdf-title"
        className="fixed inset-0 m-0 p-0 z-[2147483647] bg-transparent flex items-center justify-center"
      >
        {/* modal panel */}
        <div
          role="document"
  className={`relative z-[2147483647] w-[96vw] md:w-[86vw] max-w-[1100px] h-[86vh] rounded-2xl border border-cyan-400/25 bg-[#08121a]/95 backdrop-blur shadow-[0_30px_120px_rgba(0,0,0,.75)] overflow-hidden`}
        >
          {/* halo */}
          <span aria-hidden className="pointer-events-none absolute -inset-16 rounded-[36px] opacity-20 blur-3xl bg-[conic-gradient(from_0deg,#14f7ff_0%,#7a5cff_33%,#ff3366_66%,#14f7ff_100%)]" />

          {/* header */}
          <div className="relative z-10 flex items-center justify-between px-4 py-2 bg-[#0e1420]/85 border-b border-cyan-400/25">
            <div className="flex items-center gap-2">
              <span className="inline-block w-2 h-2 rounded-full bg-cyan-300 shadow-[0_0_8px_rgba(20,247,255,.9)]" />
              <h2 id="electra-pdf-title" className="text-cyan-100 font-semibold truncate max-w-[60vw]">{title || "Document"}</h2>
            </div>
            <div className="flex items-center gap-2">
              {!!src && (
                <a
                  href={src}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-md border border-[#14f7ff]/40 bg-[#14f7ff]/10 text-[#14f7ff] px-3 py-1 text-sm font-semibold hover:bg-[#14f7ff]/20 transition"
                >
                  Open in tab
                </a>
              )}
              <button
                type="button"
                onClick={forceClose}
                className="rounded-md border border-cyan-400/30 px-3 py-1 text-sm text-cyan-200 hover:bg-cyan-400/10 transition"
              >
                Close
              </button>
            </div>
          </div>

          {/* viewer */}
          <div className="relative z-10 h-[calc(86vh-44px)] p-3">
            <div className="absolute inset-3 rounded-xl border border-cyan-400/20 pointer-events-none" />
            <iframe
              title={title || "PDF"}
              src={src || "about:blank"}
              className="w-full h-full rounded-lg bg-[#091017] shadow-[inset_0_0_24px_rgba(20,247,255,.08)]"
              loading="lazy"
              onLoad={() => { setLoaded(true); if (timerRef.current) clearTimeout(timerRef.current); }}
            />
          </div>
        </div>
      </dialog>

      <style jsx global>{`
        dialog::backdrop { background: rgba(0,0,0,.75); backdrop-filter: blur(1px); }
        dialog[open] { position: fixed; inset: 0; z-index: 2147483647; }
      `}</style>
    </>,
    document.body
  );
}

/* ——— Shimmer skeleton ——— */
function CardSkeleton() {
  return (
    <div className="rounded-2xl border border-cyan-400/10 bg-[#0e141d] p-4">
      <div className="w-12 h-12 rounded-xl bg-cyan-400/10" />
      <div className="h-4 rounded mt-3 bg-gradient-to-r from-cyan-900/30 via-cyan-500/20 to-cyan-900/30 bg-[length:200%_100%] animate-[shimmer_1.6s_linear_infinite]" />
      <div className="h-3 rounded mt-2 w-5/6 bg-gradient-to-r from-cyan-900/30 via-cyan-500/20 to-cyan-900/30 bg-[length:200%_100%] animate-[shimmer_1.6s_linear_infinite]" />
      <div className="h-8 rounded mt-4 w-24 bg-gradient-to-r from-cyan-900/30 via-cyan-500/20 to-cyan-900/30 bg-[length:200%_100%] animate-[shimmer_1.6s_linear_infinite]" />
    </div>
  );
}

/* ——— 3D-tilt resource card ——— */
function PowerCard({ item, kind, onOpenPdf }) {
  const href = item?.driveUrl || item?.link || "";
  const title = item?.name || "Untitled Resource";

  return (
    <motion.div
      whileHover={{ y: -3, rotateX: 2, rotateY: -2 }}
      transition={{ type: "spring", stiffness: 300, damping: 22 }}
      className="relative rounded-2xl border border-cyan-400/10 bg-gradient-to-b from-[#0e141d] to-[#0a0f16] shadow-[0_0_20px_rgba(20,247,255,0.10)] overflow-hidden group"
    >
      <svg className="absolute top-0 left-0 w-full h-6" viewBox="0 0 100 6" preserveAspectRatio="none" aria-hidden>
        <defs>
          <linearGradient id="bus" x1="0" x2="1">
            <stop offset="0%" stopColor="#14f7ff" />
            <stop offset="100%" stopColor="#ff3366" />
          </linearGradient>
        </defs>
        <path
          d="M0 3 H100"
          stroke="url(#bus)"
          strokeWidth="1.5"
          strokeDasharray="8 6"
          className="[animation:busFlow_2.2s_linear_infinite] group-hover:[animation:busFlow_.8s_linear_infinite]"
        />
      </svg>

      <div className="p-3">
        <div className="flex items-center gap-3">
          <div className="shrink-0 grid place-items-center w-12 h-12 rounded-xl border border-cyan-400/20 bg-[#0f1720] shadow-[inset_0_0_10px_rgba(20,247,255,.15)]">
            <span className="w-2 h-2 rounded-full bg-cyan-300 shadow-[0_0_8px_rgba(20,247,255,.9)]" />
          </div>
          <div>
            <div className="text-cyan-200 font-bold">{title}</div>
            <div className="text-slate-400 text-xs capitalize">{String(kind || item?.category || "").replace(/[_-]+/g, " ")}</div>
          </div>
        </div>

        {item?.desc && <p className="mt-2 text-slate-400 text-sm">{item.desc}</p>}

        <div className="mt-3 flex items-center justify-between">
          <button
            type="button"
            onClick={() => href && onOpenPdf?.(href, title)} // accepts /file/d/<ID>/preview directly
            className="px-3 py-1 rounded-md border border-[#14f7ff]/40 bg-[#14f7ff]/10 text-[#14f7ff] font-semibold hover:bg-[#14f7ff]/20 transition"
          >
            Access ⚡
          </button>
          {href && (
            <a href={href} target="_blank" rel="noreferrer" className="text-xs text-slate-400 hover:text-slate-200 underline">
              Open in new tab
            </a>
          )}
        </div>
      </div>
    </motion.div>
  );
}
