// src/components/GallerySectionOne.jsx
"use client";

import React, { useContext, useMemo, useState, useEffect, useCallback } from "react";
import { ImageProvider } from "../app/store/ImageStore";
import { CldImage, getCldImageUrl } from "next-cloudinary";
import { saveAs } from "file-saver";

/* Lightweight in‑view observer for lazy activation */
function useInView(options = { root: null, rootMargin: "200px 0px", threshold: 0.01 }) {
  const [inView, setInView] = useState(false);
  const ref = React.useRef(null);
  useEffect(() => {
    if (!ref.current || inView) return;
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setInView(true);
        obs.disconnect();
      }
    }, options);
    obs.observe(ref.current);
    return () => obs.disconnect();
  }, [inView, options]);
  return { ref, inView };
}

/* Holographic skeleton card */
function HoloCardSkeleton() {
  return (
    <div className="relative rounded-xl overflow-hidden bg-[#0a111a]/70 border border-slate-700/60 shadow-[0_20px_60px_rgba(0,0,0,.6)] ring-1 ring-white/5">
      {/* projector base glow */}
      <span
        aria-hidden
        className={`pointer-events-none absolute -inset-x-10 bottom-[-20%] h-[42%] z-0 opacity-60 blur-2xl
                    bg-[radial-gradient(60%_80%_at_50%_0%,rgba(20,247,255,.28),transparent_70%),radial-gradient(40%_60%_at_58%_18%,rgba(168,85,247,.28),transparent_70%)]`}
      />
      {/* image stage placeholder */}
      <div className="relative w-full bg-[#071019]" style={{ aspectRatio: "5 / 6" }}>
        <div className="absolute inset-0 rounded-md bg-gradient-to-b from-cyan-400/10 via-cyan-300/5 to-transparent" />
        <div className="absolute inset-0 overflow-hidden">
          <div className="h-full w-[55%] translate-x-[-80%] animate-[shimmer_1.6s_linear_infinite] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        </div>
      </div>
      {/* footer bar placeholder */}
      <div className="border-t border-white/10 bg-[#08131f]/85 px-3 py-2">
        <div className="h-3 w-40 rounded bg-white/10" />
        <div className="mt-2 flex gap-2">
          <div className="h-7 w-20 rounded-md bg-white/10" />
          <div className="h-7 w-20 rounded-md bg-white/10" />
        </div>
      </div>
      <style jsx global>{`
        @keyframes shimmer { 0% { transform: translateX(-80%); } 100% { transform: translateX(160%); } }
      `}</style>
    </div>
  );
}

export default function GallerySectionOne() {
  const { imgs, loading, setCurrentEventFilter, currentEventFilter } = useContext(ImageProvider);

  const photos = useMemo(() => {
    const list = Array.isArray(imgs) ? imgs : [];
    return list.filter((p) => p && p.publicId);
  }, [imgs]);

  const filtered = useMemo(() => {
    if (!currentEventFilter || currentEventFilter === "all") return photos;
    const key = String(currentEventFilter).toLowerCase();
    return photos.filter((p) => String(p.category || "").toLowerCase() === key);
  }, [photos, currentEventFilter]);

  const setChip = (v) => setCurrentEventFilter?.(v);

  return (
    <section className="relative overflow-hidden">
      {/* global starfield + energy gradient */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10
                   [background-image:radial-gradient(circle_at_1px_1px,rgba(255,255,255,.25)_1px,transparent_1px)]
                   [background-size:40px_40px] opacity-10"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -inset-40 -z-10 blur-3xl opacity-40
                   bg-[radial-gradient(100%_100%_at_0%_0%,rgba(20,247,255,.18),transparent_60%),radial-gradient(100%_100%_at_100%_100%,rgba(168,85,247,.18),transparent_60%)]"
      />

      <div className="max-w-[1280px] mx-auto px-[min(5vw,24px)]">
        {/* Holographic Filter Console */}
        {!loading && (
          <div className="my-5 mx-3 relative">
            <div className="relative flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 border border-white/10 rounded-2xl p-3 lg:p-4 shadow-[0_20px_50px_rgba(0,0,0,.55)] bg-[#071019]/60 backdrop-blur">
              {/* scanline */}
              <span
                aria-hidden
                className="pointer-events-none absolute inset-0 rounded-2xl opacity-25 mix-blend-screen
                           [background-image:repeating-linear-gradient(to_bottom,rgba(20,247,255,.18)_0px,rgba(20,247,255,.18)_2px,transparent_3px,transparent_6px)]"
              />
              {/* aura */}
              <span
                aria-hidden
                className="pointer-events-none absolute -inset-6 rounded-3xl blur-2xl opacity-30
                           bg-[radial-gradient(120%_80%_at_50%_0%,rgba(20,247,255,.20),transparent_60%),radial-gradient(100%_120%_at_70%_120%,rgba(168,85,247,.20),transparent_60%)]"
              />
              {/* title + chips */}
              <div className="relative z-10 flex-1">
                <div className="flex items-center gap-2">
                  <span className="inline-block w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-[0_0_12px_rgba(20,247,255,.9)]" />
                  <h3 className="text-cyan-100 text-lg md:text-xl lg:text-2xl font-extrabold tracking-wide">
                    Electra Gallery
                  </h3>
                </div>
                <div className="mt-2 flex flex-wrap gap-2">
                  {[
                    { v: "all", label: "All" },
                    { v: "udvega", label: "Udvega" },
                    { v: "powerSurge", label: "Power Surge" },
                    { v: "electraCup", label: "Electra Cup" },
                    { v: "carvaan", label: "Carvaan" },
                  ].map((c) => {
                    const active = (currentEventFilter || "all") === c.v;
                    return (
                      <button
                        key={c.v}
                        type="button"
                        onClick={() => setChip(c.v)}
                        className={`relative px-3 py-1 rounded-full text-xs md:text-sm font-extrabold transition
                          ${active
                            ? "text-black bg-gradient-to-r from-cyan-300 to-violet-400 shadow-[0_0_20px_rgba(20,247,255,.25)]"
                            : "text-cyan-200 bg-[#0a1420]/60 hover:bg-[#0f1b2a] border border-white/10"
                          }
                          after:content-[''] after:absolute after:inset-0 after:rounded-full after:ring-1 after:ring-white/10`}
                      >
                        {c.label}
                      </button>
                    );
                  })}
                </div>
              </div>
              {/* select */}
              <div className="relative z-10 flex items-center gap-2">
                <label htmlFor="electra-filter" className="sr-only">Choose event</label>
                <select
                  id="electra-filter"
                  className="bg-white/10 text-cyan-100 rounded-xl hover:bg-white/15 px-3 py-2 text-xs md:text-sm lg:text-base font-bold outline-none
                             ring-1 ring-white/10 focus:ring-2 focus:ring-cyan-300/50 backdrop-blur"
                  defaultValue={currentEventFilter || "all"}
                  onChange={(e) => setCurrentEventFilter?.(e.target.value)}
                >
                  <option value="all" className="bg-[#0a111a]">All Events</option>
                  <option value="udvega" className="bg-[#0a111a]">Udvega</option>
                  <option value="powerSurge" className="bg-[#0a111a]">Power surge</option>
                  <option value="electraCup" className="bg-[#0a111a]">Electra cup</option>
                  <option value="carvaan" className="bg-[#0a111a]">Carvaan</option>
                  <option value="Orientation" className="bg-[#0a111a]">Orientation</option>
                  <option value="Teachers Day" className="bg-[#0a111a]">Teachers Day</option>
                  <option value="Off the Hook" className="bg-[#0a111a]">Off the hook</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Holographic masonry container */}
        <div className="relative border border-slate-600/50 rounded-2xl bg-[#05090f] shadow-[0_16px_36px_rgba(0,0,0,.55)] p-2 sm:p-3 lg:p-4 overflow-hidden">
          {/* particle field */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 z-0 opacity-18
                       [background-image:radial-gradient(circle_at_1px_1px,rgba(20,247,255,.25)_1px,transparent_1px)]
                       [background-size:36px_36px]"
          />
          {/* energy gradient sweep */}
          <div
            aria-hidden
            className="pointer-events-none absolute -inset-24 z-0 opacity-25 blur-3xl
                       bg-[radial-gradient(120%_100%_at_50%_120%,rgba(168,85,247,.25),transparent_60%),radial-gradient(100%_120%_at_50%_-10%,rgba(20,247,255,.18),transparent_60%)]"
          />

          {/* masonry */}
          <div className="relative z-10 [column-gap:20px] columns-1 sm:columns-2 lg:columns-3">
            {filtered.map((pic) => (
              <div key={pic._id || pic.publicId} className="break-inside-avoid mb-[20px]">
                <HoloCard pic={pic} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* Holographic card with lazy load, fade-in, scanlines, and lightbox */
function HoloCard({ pic }) {
  const [open, setOpen] = useState(false);
  const [decoded, setDecoded] = useState(false);
  const { ref, inView } = useInView();

  const safeName = `${(pic.category || "Electra").replace(/\s+/g, "-")}-${pic.year || "year"}-${(pic.publicId || "").split("/").pop() || "image"}.jpg`;
  const dlUrl = useMemo(
    () =>
      getCldImageUrl({
        width: 1920,
        height: 1200,
        src: pic.publicId,
        format: "auto",
        quality: "auto",
      }),
    [pic.publicId]
  );

  const onKey = useCallback((e) => e.key === "Escape" && setOpen(false), []);
  useEffect(() => {
    if (!open) return;
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onKey]);

  // seeded 3D tilt
  const s = (pic._id || pic.publicId || "x").length;
  const rx = ((s % 5) - 2) * 0.5;
  const ry = ((s % 7) - 3) * 0.7;

  // pointer parallax
  const [px, setPx] = useState(0), [py, setPy] = useState(0);
  const onMove = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    const cx = r.left + r.width / 2;
    const cy = r.top + r.height / 2;
    const dx = (e.clientX - cx) / r.width;
    const dy = (e.clientY - cy) / r.height;
    setPx(dx * 10);
    setPy(dy * 10);
  };

  // shadow flicker
  const [flicker, setFlicker] = useState(false);
  useEffect(() => {
    let t;
    const loop = () => {
      setFlicker((v) => !v);
      t = setTimeout(loop, 900 + Math.random() * 1200);
    };
    loop();
    return () => clearTimeout(t);
  }, []);

  // Until in view, render skeleton only (no image cost)
  if (!inView) {
    return (
      <div
        ref={ref}
        className="relative group transition-transform duration-300 ease-out hover:-translate-y-1 perspective-[1200px]"
        style={{ transform: `perspective(1100px) rotateX(${rx}deg) rotateY(${ry}deg)` }}
        onMouseMove={onMove}
      >
        <HoloCardSkeleton />
        <span
          aria-hidden
          className={`pointer-events-none absolute -inset-2 rounded-xl transition-shadow duration-300
                      ${flicker ? "shadow-[0_28px_90px_rgba(20,247,255,.18)]" : "shadow-[0_22px_70px_rgba(168,85,247,.16)]"}`}
        />
      </div>
    );
  }

  return (
    <>
      <div
        ref={ref}
        className="relative group transition-transform duration-300 ease-out hover:-translate-y-1 perspective-[1200px]"
        style={{ transform: `perspective(1100px) rotateX(${rx}deg) rotateY(${ry}deg)` }}
        onMouseMove={onMove}
      >
        {/* projector base glow */}
        <span
          aria-hidden
          className={`pointer-events-none absolute -inset-x-10 bottom-[-20%] h-[42%] z-0 opacity-75 blur-2xl
                      bg-[radial-gradient(60%_80%_at_50%_0%,rgba(20,247,255,.35),transparent_70%),radial-gradient(40%_60%_at_58%_18%,rgba(168,85,247,.35),transparent_70%)]`}
        />

        <div
          className={`relative z-10 rounded-xl overflow-hidden bg-[#0a111a]/70 border border-slate-700/60 shadow-[0_20px_60px_rgba(0,0,0,.6)] ring-1 ring-white/5
                      transition-opacity duration-500 ${decoded ? "opacity-100" : "opacity-0"}`}
          style={{ transform: `translate3d(${px}px, ${py}px, 0)` }}
        >
          {/* scanline shimmer */}
          <span
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300
                       bg-[linear-gradient(170deg,transparent_0%,rgba(20,247,255,.08)_22%,transparent_50%,rgba(168,85,247,.08)_72%,transparent_100%)]"
          />
          {/* energy ring */}
          <span
            aria-hidden
            className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-cyan-300/10 group-hover:ring-cyan-300/20"
          />

          {/* image stage */}
          <div className="relative w-full bg-[#071019]" style={{ aspectRatio: "5 / 6" }}>
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_140%_at_50%_-10%,rgba(20,247,255,.12),transparent_60%)]"
            />
            <CldImage
              fill
              src={pic.publicId}
              alt={`${pic.category || "Electra"}${pic.year ? `/${pic.year}` : ""}`}
              sizes="(max-width: 768px) 90vw, (max-width: 1024px) 45vw, 30vw"
              className="object-contain"
              crop="fit"
              quality="auto"
              format="auto"
              loading="lazy"
              onLoad={() => setDecoded(true)}
            />
            {/* parallax spark */}
            <span
              aria-hidden
              className="pointer-events-none absolute left-6 top-6 w-1.5 h-1.5 rounded-full bg-cyan-300/90 shadow-[0_0_12px_rgba(20,247,255,.9)]"
              style={{ transform: `translate3d(${px * 0.3}px, ${py * 0.3}px, 0)` }}
            />
          </div>

          {/* overlay */}
          <div
            className="absolute inset-x-0 bottom-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300
                       bg-[#08131f]/85 backdrop-blur border-t border-white/10"
          >
            <div className="flex items-center justify-between px-3 py-2 text-[11px] md:text-xs lg:text-sm text-cyan-100">
              <div className="font-extrabold tracking-wide">
                {(pic.category || "Electra")}{pic.year ? ` · ${pic.year}` : ""}
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setOpen(true)}
                  className="relative px-3 py-1 rounded-md text-black font-extrabold
                             bg-gradient-to-r from-cyan-300 to-violet-400 hover:from-cyan-200 hover:to-violet-300
                             shadow-[0_0_20px_rgba(20,247,255,.25)]
                             after:content-[''] after:absolute after:inset-0 after:rounded-md after:ring-1 after:ring-white/20"
                  aria-label="Open full photo"
                  title="Open full photo"
                >
                  Project
                </button>
                <button
                  type="button"
                  onClick={() => saveAs(dlUrl, safeName)}
                  className="relative px-3 py-1 rounded-md text-black font-extrabold
                             bg-gradient-to-r from-violet-400 to-cyan-300 hover:from-violet-300 hover:to-cyan-200
                             shadow-[0_0_20px_rgba(168,85,247,.25)]
                             after:content-[''] after:absolute after:inset-0 after:rounded-md after:ring-1 after:ring-white/20"
                  aria-label="Download image"
                  title="Download image"
                >
                  Capture
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* flicker shadow */}
        <span
          aria-hidden
          className={`pointer-events-none absolute -inset-2 rounded-xl transition-shadow duration-300
                      ${flicker ? "shadow-[0_28px_90px_rgba(20,247,255,.18)]" : "shadow-[0_22px_70px_rgba(168,85,247,.16)]"}`}
        />
      </div>

      {/* Lightbox */}
      {open && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-sm flex items-center justify-center p-3"
          onClick={() => setOpen(false)}
        >
          <div
            className="relative w-full max-w=[92vw] md:max-w-[80vw] lg:max-w-[70vw] max-h-[90vh] rounded-2xl border border-slate-700 bg-[#090f16] shadow-[0_40px_120px_rgba(0,0,0,.7)] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-4 py-2 border-b border-white/10 bg-[#0a1420]">
              <span className="text-slate-200 text-xs md:text-sm font-bold">
                {(pic.category || "Electra")}{pic.year ? ` · ${pic.year}` : ""}
              </span>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => saveAs(dlUrl, safeName)}
                  className="relative px-3 py-1 rounded-md text-black text-xs md:text-sm font-extrabold
                             bg-gradient-to-r from-cyan-300 to-violet-400 hover:from-cyan-200 hover:to-violet-300
                             shadow-[0_0_20px_rgba(20,247,255,.25)]
                             after:content-[''] after:absolute after:inset-0 after:rounded-md after:ring-1 after:ring-white/20"
                >
                  Download
                </button>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="relative px-3 py-1 rounded-md text-black text-xs md:text-sm font-extrabold
                             bg-gradient-to-r from-violet-400 to-cyan-300 hover:from-violet-300 hover:to-cyan-200
                             shadow-[0_0_20px_rgba(168,85,247,.25)]
                             after:content-[''] after:absolute after:inset-0 after:rounded-md after:ring-1 after:ring-white/20"
                  aria-label="Close"
                >
                  Close
                </button>
              </div>
            </div>

            <div className="relative w-full h-[calc(90vh-96px)]">
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 opacity-20 mix-blend-screen
                           [background-image:repeating-linear-gradient( to bottom, rgba(20,247,255,.12)_0px, rgba(20,247,255,.12)_2px, transparent_3px, transparent_6px )]"
              />
              <span
                aria-hidden
                className="pointer-events-none absolute -inset-[10%] blur-2xl opacity-30
                           bg-[radial-gradient(55%_60%_at_50%_0%,rgba(20,247,255,.22),transparent_70%),radial-gradient(40%_50%_at_55%_15%,rgba(168,85,247,.20),transparent_70%)]"
              />
              <CldImage
                fill
                src={pic.publicId}
                alt={`${pic.category || "Electra"}${pic.year ? `/${pic.year}` : ""}`}
                className="object-contain"
                sizes="100vw"
                crop="fit"
                quality="auto"
                format="auto"
                priority
              />
            </div>

            <span
              aria-hidden
              className={`pointer-events-none absolute -inset-x-12 bottom-[-20%] h-[38%] opacity-70 blur-2xl
                          bg-[radial-gradient(60%_80%_at_50%_0%,rgba(20,247,255,.35),transparent_70%),radial-gradient(40%_60%_at_58%_18%,rgba(168,85,247,.35),transparent_70%)]`}
            />
          </div>
        </div>
      )}
    </>
  );
}
