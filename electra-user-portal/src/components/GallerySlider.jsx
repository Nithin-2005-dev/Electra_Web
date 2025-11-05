// src/components/GallerySlider.jsx
"use client";

import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import { CldImage, getCldImageUrl } from "next-cloudinary";
import { ImageProvider } from "../app/store/ImageStore";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Keyboard, A11y, EffectFade } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/effect-fade";

const MAX_POOL = 48;
const TOL = 0.12;
const AUTO_DELAY = 1800; // cadence for prefetch driver (not the visible delay)
const SPEED = 450;       // fade speed
const SCAN_TIMEOUT_MS = 3500;

export default function GallerySlider() {
  const { imgs } = useContext(ImageProvider);
  const [paused, setPaused] = useState(false);
  const [ready, setReady] = useState(false);
  const [filtered, setFiltered] = useState([]);
  const [containerAR, setContainerAR] = useState(16 / 9);
  const [arMap, setArMap] = useState({});
  const [scanned, setScanned] = useState(0);

  const frameRef = useRef(null);
  const timeoutRef = useRef(null);
  const swiperRef = useRef(null);
  const intervalRef = useRef(null);

  // Normalize + shuffle pool
  const pool = useMemo(() => {
    const list = Array.isArray(imgs) ? imgs : [];
    const norm = list
      .map((x, i) => ({
        id: x._id || x.id || String(i),
        publicId: x.publicId || x.public_id || x.url || x.src || "",
        tag: x.alt || x.category || "Electra",
      }))
      .filter((s) => typeof s.publicId === "string" && s.publicId.length > 0);

    const arr = norm.slice();
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr.slice(0, MAX_POOL);
  }, [imgs]);

  // Measure container AR
  useEffect(() => {
    const el = frameRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      const w = entry.contentRect.width || 1;
      const h = entry.contentRect.height || 1;
      setContainerAR(w / h);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Build absolute Cloudinary URLs
  const toUrl = (pubId) => {
    try {
      if (/^https?:\/\//i.test(pubId)) return pubId;
      return getCldImageUrl({ src: pubId, format: "auto", quality: "auto" });
    } catch {
      return pubId;
    }
  };

  const scanUrls = useMemo(() => pool.map((p) => toUrl(p.publicId)), [pool]);

  // Hidden scan for intrinsic AR
  const onScanLoad = (k) => (e) => {
    const w = e?.currentTarget?.naturalWidth || 0;
    const h = e?.currentTarget?.naturalHeight || 0;
    if (w && h) setArMap((m) => ({ ...m, [k]: w / h }));
    setScanned((n) => n + 1);
  };

  // Watchdog timeout
  useEffect(() => {
    if (!pool.length) return;
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setScanned(pool.length), SCAN_TIMEOUT_MS);
    return () => clearTimeout(timeoutRef.current);
  }, [pool.length]);

  // Prefilter once scanning completes
  useEffect(() => {
    if (!pool.length || scanned < pool.length) return;

    const withAR = pool
      .map((s, k) => ({ s, ar: arMap[k] }))
      .filter((x) => typeof x.ar === "number" && isFinite(x.ar));

    const sorted = withAR.sort(
      (a, b) => Math.abs(a.ar - containerAR) - Math.abs(b.ar - containerAR)
    );

    let chosen = sorted.filter((x) => Math.abs(x.ar - containerAR) / containerAR <= TOL);
    if (chosen.length < 6) chosen = sorted.filter((x) => Math.abs(x.ar - containerAR) / containerAR <= 0.2);

    const result = (chosen.length ? chosen : withAR.length ? withAR : pool.map((s) => ({ s, ar: null })))
      .map((x) => ({ ...x.s, _ar: x.ar || containerAR }));

    setFiltered(result);
    setReady(true);
  }, [scanned, pool, containerAR, arMap]);

  // Prefetch next and advance only after decode()
  const preloadNextAndAdvance = async () => {
    const sw = swiperRef.current;
    if (!sw || !filtered.length) return;
    const nextIndex = (sw.activeIndex + 1) % filtered.length;
    const next = filtered[nextIndex];
    const url = toUrl(next.publicId);
    try {
      const img = new Image();
      img.decoding = "async";
      img.loading = "eager";
      img.src = url;
      if (img.decode) await img.decode();
    } catch {
      // ignore decode errors; still move on
    }
    sw.slideTo(nextIndex, SPEED);
  };

  // Manual autoplay driver using prefetch
  useEffect(() => {
    if (!ready || !filtered.length) return;
    if (intervalRef.current) { clearInterval(intervalRef.current); intervalRef.current = null; }

    const tick = async () => {
      if (paused) return;
      await preloadNextAndAdvance();
    };

    intervalRef.current = setInterval(tick, AUTO_DELAY);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [ready, filtered.length, paused, AUTO_DELAY, SPEED]);

  return (
    <section className="e-gallery relative">
      <style jsx>{`
        :root {
          --bg: #0b1118;
          --edge: #152234;
          --ink: #eaf6ff;
          --neon: #14f7ff;
          --muted: #93a6b5;
          --pad: min(5vw, 24px);
        }
        .wrap { max-width: 1200px; margin: 0 auto; padding: var(--pad); position: relative; }
        .heading {
          text-align: center; font-size: clamp(1.8rem, 3vw, 2.6rem); color: var(--ink);
          font-weight: 800; text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 1rem; position: relative;
        }
        .heading::after {
          content: ""; display: block; width: 100px; height: 3px; margin: 0.5rem auto; background: var(--neon);
          border-radius: 2px; box-shadow: 0 0 12px var(--neon); animation: flicker 3s infinite;
        }
        @keyframes flicker { 0%,19%,21%,23%,25%,54%,56%,100%{opacity:1} 20%,24%,55%{opacity:.5} }
        .frame {
          position: relative; width: 100%; border-radius: 16px; overflow: hidden;
          background: radial-gradient(160% 140% at 50% -20%, rgba(20, 247, 255, 0.06), rgba(6, 12, 20, 0.92) 60%);
          border: 1px solid rgba(255,255,255,.06); box-shadow: 0 16px 40px rgba(0,0,0,.45), inset 0 0 0 1px rgba(255,255,255,.02);
        }
        .sideBar { position: absolute; top: 10%; bottom: 10%; width: 2px;
          background: linear-gradient(to bottom, transparent, var(--neon), transparent);
          box-shadow: 0 0 20px var(--neon); animation: pulse 2.5s infinite ease-in-out; }
        .leftBar { left: -10px; } .rightBar { right: -10px; }
        @keyframes pulse { 0%,100%{opacity:.4} 50%{opacity:1} }

        :global(.swiper) { width: 100%; }
        :global(.swiper-button-prev), :global(.swiper-button-next) { color: var(--neon); }

        .slideShell { position: relative; padding: clamp(6px, 1.2vw, 14px); display: flex; justify-content: center; }
        .box { width: 100%; max-height: 78vh; background: var(--bg); border-radius: 12px; position: relative;
               display: flex; align-items: center; justify-content: center; }
        .imgWrap { position: relative; width: 100%; aspect-ratio: var(--ar, 16/9); border-radius: inherit; overflow: hidden; }
        .img { object-fit: contain; object-position: center center; }
        .tag {
          position: absolute; left: clamp(12px, 1.6vw, 16px); bottom: clamp(12px, 1.6vw, 16px);
          padding: .42rem .72rem; border-radius: 999px; color: var(--ink); font-weight: 800; text-transform: uppercase;
          font-size: clamp(.7rem, 1.8vw, .84rem); background: rgba(10,16,24,.5); border:1px solid rgba(255,255,255,.14);
          backdrop-filter: blur(6px);
        }
      `}</style>

      {/* Hidden preload scan */}
      <div style={{ position: "absolute", width: 0, height: 0, overflow: "hidden", pointerEvents: "none" }}>
        {scanUrls.map((u, k) =>
          u ? (
            <img key={`scan-${k}`} src={u} alt="" onLoad={onScanLoad(k)} onError={() => setScanned((n) => n + 1)} />
          ) : (
            <span key={`skip-${k}`} />
          )
        )}
      </div>

      <div className="wrap">
        <h2 className="heading">Electra Gallery</h2>

        <div
          ref={frameRef}
          className="frame"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          <div className="sideBar leftBar"></div>
          <div className="sideBar rightBar"></div>

          {!ready ? (
            <div style={{ padding: "1.2rem", color: "var(--muted)" }}>Preparing images…</div>
          ) : (
            <Swiper
              modules={[Navigation, Keyboard, A11y, EffectFade]}
              onSwiper={(sw) => { swiperRef.current = sw; }}
              effect="fade"
              fadeEffect={{ crossFade: true }}
              speed={SPEED}
              slidesPerView={1}
              autoHeight
              navigation
              keyboard={{ enabled: true }}
              a11y={{ enabled: true }}
            >
              {filtered.map((p, k) => (
                <SwiperSlide key={`${p.id}-prefetch-${k}`}>
                  <div className="slideShell">
                    <div className="box">
                      <div className="imgWrap" style={{ "--ar": p._ar || containerAR }}>
                        <CldImage
                          fill
                          src={p.publicId}
                          alt={p.tag}
                          className="img"
                          sizes="100vw"
                          crop="fit"
                          quality="auto"
                          format="auto"
                          priority={k === 0}
                        />
                      </div>
                      <div className="tag">{p.tag}</div>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          )}
        </div>
      </div>
    </section>
  );
}
