// src/components/BackgroundElectric.jsx
"use client";

import { useEffect, useRef } from "react";

export default function BackgroundElectric() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true, desynchronized: true });

    // Tunables (balanced for smoothness + pop)
    const SPEED = 0.4;
    const TARGET_FPS = 48;
    const BASE_AMP = 0.075;
    const GRID_ALPHA = 0.03;
    const GLOW_ALPHA = 0.45;
    const WAVE_POINTS = 520;
    const SPARK_INTERVAL = [1100, 2000];
    const DPR = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
    const reduce =
      window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches || false;

    // Interaction state (smoothed)
    let scrollPhase = 0;
    let scrollAmpBoost = 0;
    let px = 0.5, py = 0.5, pEnergy = 0;

    function size() {
      const w = window.innerWidth;
      const h = window.innerHeight;
      canvas.style.width = w + "px";
      canvas.style.height = h + "px";
      canvas.width = Math.floor(w * DPR);
      canvas.height = Math.floor(h * DPR);
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    }
    size();
    const onResize = () => { size(); if (reduce) drawStatic(0.42); };
    window.addEventListener("resize", onResize, { passive: true });

    // Lightweight neon stroke (semi‑transparent)
    function neon(line = 1.1, blur = 5, a = 0.55) {
      const w = canvas.clientWidth;
      const g = ctx.createLinearGradient(0, 0, w, 0);
      g.addColorStop(0, "rgb(20 247 255 / 50%)");
      g.addColorStop(1, "rgb(0 184 217 / 50%)");
      ctx.lineWidth = line;
      ctx.lineJoin = "round";
      ctx.lineCap = "round";
      ctx.strokeStyle = g;
      ctx.globalAlpha = a;
      ctx.shadowColor = "rgb(20 247 255 / 30%)";
      ctx.shadowBlur = blur; // keep blur modest for perf
    }

    function drawGrid() {
      const w = canvas.clientWidth, h = canvas.clientHeight;
      ctx.clearRect(0, 0, w, h); // prevent alpha buildup
      ctx.beginPath();
      ctx.lineWidth = 1;
      ctx.shadowBlur = 0;
      ctx.strokeStyle = `rgb(255 255 255 / ${GRID_ALPHA * 100}%)`;
      const cell = 24;
      for (let x = 0; x < w; x += cell) { ctx.moveTo(x + 0.5, 0); ctx.lineTo(x + 0.5, h); }
      for (let y = 0; y < h; y += cell) { ctx.moveTo(0, y + 0.5); ctx.lineTo(w, y + 0.5); }
      ctx.stroke();
    }

    function strokeWave(t) {
      const w = canvas.clientWidth, h = canvas.clientHeight, mid = h * 0.52;

      const dist = Math.hypot(px - 0.5, (py - 0.52) * 1.1);
      const pBoost = Math.max(0, 0.055 - dist * 0.055) * pEnergy;
      const AMP = BASE_AMP + scrollAmpBoost * 0.04 + pBoost;
      const phase = t * 0.5 * SPEED + scrollPhase + (px - 0.5) * 0.25;

      const step = w / WAVE_POINTS;

      // Base wave
      neon(1.1, 5, 0.5);
      ctx.beginPath();
      for (let i = 0; i <= WAVE_POINTS; i++) {
        const n = i / WAVE_POINTS;
        const y =
          Math.sin((n * 2 + phase) * Math.PI * 2) * h * AMP +
          Math.sin((n * 8.5 - t * 0.9 * SPEED) * Math.PI * 2) * h * (AMP * 0.3);
        const x = Math.round(i * step);
        const yy = Math.round(mid + y);
        i === 0 ? ctx.moveTo(x, yy) : ctx.lineTo(x, yy);
      }
      ctx.stroke();

      // Harmonic
      ctx.globalAlpha = 0.28;
      neon(0.9, 4, 0.28);
      ctx.beginPath();
      for (let i = 0; i <= WAVE_POINTS; i++) {
        const n = i / WAVE_POINTS;
        const y = Math.sin((n * 13.5 + phase * 1.05) * Math.PI * 2) * h * (AMP * 0.18);
        const x = Math.round(i * step);
        const yy = Math.round(mid + y);
        i === 0 ? ctx.moveTo(x, yy) : ctx.lineTo(x, yy);
      }
      ctx.stroke();
      ctx.globalAlpha = 1;
    }

    // Points (cheap interactivity)
    const pts = [];
    function seedPoints() {
      pts.length = 0;
      const w = canvas.clientWidth, h = canvas.clientHeight;
      const count = Math.max(14, Math.min(28, Math.floor((w * h) / 52000)));
      for (let i = 0; i < count; i++) {
        pts.push({ x: Math.random() * w, y: Math.random() * h, p: Math.random(), v: 0.28 + Math.random() * 0.35 });
      }
    }
    seedPoints();

    function drawPoints(t) {
      ctx.save();
      ctx.shadowBlur = 7;
      ctx.fillStyle = "rgb(20 247 255 / 42%)";
      const w = canvas.clientWidth, h = canvas.clientHeight;
      for (const q of pts) {
        const dx = (q.x / w) - px, dy = (q.y / h) - py;
        const near = Math.max(0, 1 - Math.hypot(dx, dy) * 2.0);
        const r = 1 + near * 0.9 + Math.sin(t * q.v + q.p) * 0.25;
        ctx.beginPath();
        ctx.arc(Math.round(q.x), Math.round(q.y), r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }

    // Brighter two‑pass shock with additive blending
    let nextShock =
      Date.now() +
      (SPARK_INTERVAL[0] +
        Math.random() * (SPARK_INTERVAL[1] - SPARK_INTERVAL[0])) / SPEED;

    function maybeShock() {
      const now = Date.now();
      if (now < nextShock) return;
      const w = canvas.clientWidth, h = canvas.clientHeight;
      const a = { x: Math.random() * w, y: h * (0.25 + Math.random() * 0.5) };
      const b = { x: Math.random() * w, y: h * (0.25 + Math.random() * 0.5) };

      // Precompute jagged points
      const seg = 10;
      const pts = [{ x: a.x, y: a.y }];
      for (let i = 1; i <= seg; i++) {
        const t = i / seg;
        const x = a.x + (b.x - a.x) * t + (Math.random() - 0.5) * 14;
        const y = a.y + (b.y - a.y) * t + (Math.random() - 0.5) * 12;
        pts.push({ x, y });
      }

      // 1) Bright white core
      ctx.save();
      ctx.globalCompositeOperation = "lighter"; // additive for luminance
      ctx.shadowBlur = 10;
      ctx.shadowColor = "rgb(255 255 255 / 75%)";
      ctx.strokeStyle = "rgb(255 255 255 / 85%)";
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      ctx.moveTo(Math.round(pts[0].x), Math.round(pts[0].y));
      for (let i = 1; i < pts.length; i++) {
        ctx.lineTo(Math.round(pts[i].x), Math.round(pts[i].y));
      }
      ctx.stroke();
      ctx.restore();

      // 2) Cyan glow pass
      ctx.save();
      ctx.globalCompositeOperation = "lighter";
      ctx.shadowBlur = 18;
      ctx.shadowColor = "rgb(20 247 255 / 70%)";
      ctx.strokeStyle = "rgb(0 184 217 / 55%)";
      ctx.lineWidth = 2.2;
      ctx.beginPath();
      ctx.moveTo(Math.round(pts[0].x), Math.round(pts[0].y));
      for (let i = 1; i < pts.length; i++) {
        ctx.lineTo(Math.round(pts[i].x), Math.round(pts[i].y));
      }
      ctx.stroke();
      ctx.restore();

      // Reset compositing
      ctx.globalCompositeOperation = "source-over"; // back to normal

      nextShock =
        now +
        (SPARK_INTERVAL[0] +
          Math.random() * (SPARK_INTERVAL[1] - SPARK_INTERVAL[0])) / SPEED;
    }

    // Frame gating
    let raf = 0;
    let then = performance.now();
    const fpsInterval = 1000 / TARGET_FPS;

    function frame(now) {
      const elapsed = now - then;
      if (elapsed > fpsInterval) {
        then = now - (elapsed % fpsInterval);
        const t = now / 1000;
        drawGrid();
        strokeWave(t);
        drawPoints(t);
        maybeShock();
      }
      raf = requestAnimationFrame(frame); // smooth timing
    }

    function drawStatic(seed = 0.42) {
      drawGrid();
      strokeWave(seed);
      drawPoints(seed);
    }

    // Interactivity (passive + smoothed)
    function onScroll() {
      const el = document.documentElement;
      const r = Math.min(1, Math.max(0, el.scrollTop / Math.max(1, el.scrollHeight - el.clientHeight)));
      scrollPhase = r * 1.0;
      scrollAmpBoost = r;
    }
    function onMove(e) {
      const rect = canvas.getBoundingClientRect();
      const tx = (e.clientX - rect.left) / rect.width;
      const ty = (e.clientY - rect.top) / rect.height;
      px += (tx - px) * 0.15; // simple lerp
      py += (ty - py) * 0.15;
      pEnergy += (1 - pEnergy) * 0.12;
    }
    function onLeave() { pEnergy *= 0.85; }

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerleave", onLeave, { passive: true });

    if (reduce) {
      drawStatic(0.42);
    } else {
      raf = requestAnimationFrame(frame);
    }

    return () => {
      window.removeEventListener("resize", onResize);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerleave", onLeave);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div aria-hidden className="fixed inset-0 -z-10 pointer-events-none">
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
    </div>
  );
}
