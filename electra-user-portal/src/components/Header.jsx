// src/components/Header.jsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const NAV = [
  { href: "/", label: "Home" },
  { href: "/Gallery", label: "Gallery" },
  { href: "/Resources", label: "Resources" },
  { href: "/Team", label: "Team" },
  { href: "/Merch", label: "Merch" },
  // { href: "/Join", label: "Join Us", cta: true },
];

export default function Header() {
  const pathname = usePathname() || "/";
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [progress, setProgress] = useState(0);
  const [routePct, setRoutePct] = useState(0);
  const [routeActive, setRouteActive] = useState(false);
  const btnRef = useRef(null);
  const firstLinkRef = useRef(null);

  // Scroll progress
  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement;
      const pct = (h.scrollTop / Math.max(1, h.scrollHeight - h.clientHeight)) * 100;
      setProgress(pct);
      setScrolled(window.scrollY > 8);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock body scroll on mobile menu
  useEffect(() => {
    const body = document.body;
    if (open) {
      const prev = body.style.overflow;
      body.style.overflow = "hidden";
      return () => (body.style.overflow = prev || "");
    }
  }, [open]);

  // Focus management
  useEffect(() => {
    if (!open) return;
    firstLinkRef.current?.focus();
    const onKey = (e) => {
      if (e.key === "Escape") {
        setOpen(false);
        btnRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  // Close on route change
  useEffect(() => setOpen(false), [pathname]);

  // Page load progress
  useEffect(() => {
    if (typeof window === "undefined") return;
    let done = false;
    setRouteActive(true);
    setRoutePct(5);

    const ramp = setInterval(() => {
      setRoutePct((p) => (p < 90 ? p + (90 - p) * 0.05 : p));
    }, 120);

    const root = document.querySelector("main") || document.body;
    const imgs = Array.from(root.querySelectorAll("img"));
    const total = imgs.length;
    let loaded = imgs.filter((i) => i.complete).length;

    const update = () => {
      if (done) return;
      if (total > 0) {
        const mapped = 10 + (loaded / total) * 85;
        setRoutePct((p) => Math.max(p, Math.min(95, mapped)));
      }
    };

    const listeners = [];
    imgs.forEach((img) => {
      if (img.complete) return;
      const onDone = () => {
        loaded++;
        update();
        img.removeEventListener("load", onDone);
        img.removeEventListener("error", onDone);
      };
      img.addEventListener("load", onDone, { once: true });
      img.addEventListener("error", onDone, { once: true });
      listeners.push([img, onDone]);
    });

    const finish = () => {
      if (done) return;
      done = true;
      clearInterval(ramp);
      setRoutePct(100);
      setTimeout(() => {
        setRouteActive(false);
        setRoutePct(0);
      }, 400);
    };

    const finCheck = setInterval(() => {
      if (loaded >= total) finish();
    }, 150);

    const hardCap = setTimeout(finish, 6000);

    update();
    if (total === 0) finish();

    return () => {
      done = true;
      clearInterval(ramp);
      clearInterval(finCheck);
      clearTimeout(hardCap);
      listeners.forEach(([img, fn]) => {
        img.removeEventListener("load", fn);
        img.removeEventListener("error", fn);
      });
    };
  }, [pathname]);

  return (
    <header
      className={[
        "fixed inset-x-0 top-0 z-50 transition-all duration-200",
        "bg-surface/80 backdrop-blur supports-[backdrop-filter]:bg-surface/60 border-b border-white/10",
        scrolled ? "py-1 sm:py-2" : "py-2 sm:py-3 md:py-4",
      ].join(" ")}
    >
      {/* Top scroll progress */}
      <span aria-hidden className="absolute inset-x-0 top-0 h-[2px] bg-white/0">
        <span
          className="block h-full bg-gradient-to-r from-primary via-secondary to-primary transition-[width] duration-200"
          style={{ width: `${progress}%` }}
        />
      </span>

      {/* Navbar container */}
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-2 sm:px-3 md:px-4">
        {/* Logo */}
        <Link href="/" className="group flex min-w-0 items-center gap-1 sm:gap-2 shrink-0">
          <span className="h-2 w-2 rounded-full bg-primary shadow-[0_0_12px_theme(colors.glow)] motion-safe:animate-pulse" />
          <span className="truncate text-sm sm:text-base md:text-lg font-semibold text-textPrimary tracking-tight">
            Electra
          </span>
        </Link>

        {/* Hamburger button */}
        <button
          ref={btnRef}
          className="lg:hidden inline-flex h-10 w-10 items-center justify-center rounded-md text-textMuted hover:text-textPrimary focus:outline-none focus:ring-2 focus:ring-primary shrink-0"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {open ? (
            <svg width="26" height="26" viewBox="0 0 24 24">
              <path stroke="currentColor" strokeWidth="2" strokeLinecap="round" d="M6 6l12 12M6 18L18 6" />
            </svg>
          ) : (
            <svg width="26" height="26" viewBox="0 0 24 24">
              <path stroke="currentColor" strokeWidth="2" strokeLinecap="round" d="M4 7h16M4 12h16M4 17h16" />
            </svg>
          )}
        </button>

        {/* Desktop links */}
        <div className="hidden lg:flex items-center gap-4 xl:gap-8">
          {NAV.slice(0, 5).map((item) => {
            const current = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={current ? "page" : undefined}
                className="group relative text-sm text-textMuted hover:text-textPrimary transition"
              >
                {item.label}
                <span
                  className={[
                    "absolute -bottom-1 left-0 h-0.5 w-0 bg-gradient-to-r from-primary to-secondary transition-all duration-200",
                    current ? "w-full" : "group-hover:w-full",
                  ].join(" ")}
                />
              </Link>
            );
          })}

          {/* <Link
            href="/join"
            className="relative overflow-hidden rounded-md bg-primary px-3 sm:px-4 py-2 text-sm font-semibold text-background hover:bg-secondary transition group/cta"
          >
            <span className="relative z-10">Join Us</span>
            <span
              aria-hidden
              className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-200 group-hover/cta:opacity-100"
              style={{
                background:
                  "radial-gradient(160px circle at var(--x,50%) var(--y,50%), rgba(20,247,255,0.35), transparent 60%)",
              }}
            />
          </Link> */}
        </div>
      </nav>

      {/* Mobile dropdown */}
      <div
        className={[
          "lg:hidden absolute left-0 right-0 top-full z-40 transition-all duration-200",
          open
            ? "opacity-100 translate-y-0 pointer-events-auto visible"
            : "opacity-0 -translate-y-2 pointer-events-none invisible",
        ].join(" ")}
      >
        <div className="w-full">
          <div className="px-2 sm:px-3">
            <div className="mt-2 rounded-2xl border border-white/10 bg-surface/95 backdrop-blur shadow-[0_20px_40px_rgba(0,0,0,.35)] max-h-[85svh] overflow-y-auto">
              {/* <div className="sticky top-0 z-10 flex items-center justify-between px-3 py-2 border-b border-white/10 bg-surface/95">
                <span className="text-textPrimary text-sm font-semibold">Menu</span>
                <Link
                  href="/join"
                  className="rounded-md bg-primary px-3 py-1.5 text-sm font-semibold text-background hover:bg-secondary transition"
                >
                  Join Us
                </Link>
              </div> */}
              <div className="py-1">
                {NAV.map((item, i) => {
                  const current = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      ref={i === 0 ? firstLinkRef : undefined}
                      aria-current={current ? "page" : undefined}
                      className={[
                        "block rounded-md px-4 py-2.5 text-base outline-none focus:ring-2 focus:ring-primary",
                        item.cta
                          ? "bg-primary text-background font-semibold hover:bg-secondary"
                          : "text-textMuted hover:text-textPrimary",
                      ].join(" ")}
                    >
                      {item.label}
                    </Link>
                  );
                })}
              </div>
              <div className="h-[max(env(safe-area-inset-bottom),10px)]" />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom loading bar */}
      <div aria-hidden className="absolute inset-x-0 bottom-0 h-[3px] bg-white/0 overflow-hidden">
        <div
          className={[
            "h-full origin-left transition-[width,opacity] duration-200",
            routeActive ? "opacity-100" : "opacity-0",
            "bg-gradient-to-r from-cyan-400 via-fuchsia-400 to-cyan-400",
          ].join(" ")}
          style={{ width: `${routePct}%` }}
        />
      </div>
    </header>
  );
} 