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
  { href: "/gotyourmerch", label: "Merch" },
];

export default function Header() {
  const pathname = usePathname() || "/";
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const btnRef = useRef(null);
  const firstLinkRef = useRef(null);

  /* Scroll shadow */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* Lock body scroll on mobile */
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => (document.body.style.overflow = prev);
  }, [open]);

  /* Focus + Escape */
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

  /* Close menu on route change */
  useEffect(() => setOpen(false), [pathname]);

  return (
    <header
      className={[
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        "bg-surface/70 backdrop-blur-xl supports-[backdrop-filter]:bg-surface/50",
        "border-b border-white/10",
      ].join(" ")}
      style={{
        boxShadow: scrolled
          ? "0 10px 30px rgba(0,0,0,0.45)"
          : "0 0 0 rgba(0,0,0,0)",
      }}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-3 sm:px-4 py-2 sm:py-3">
        {/* Logo */}
        <Link
          href="/"
          className="group flex items-center gap-2 transition-transform duration-300 hover:scale-[1.02]"
        >
          <span className="h-2.5 w-2.5 rounded-full bg-primary shadow-[0_0_14px_rgba(20,247,255,0.7)]" />
          <span className="text-sm sm:text-base md:text-lg font-semibold text-textPrimary tracking-tight">
            Electra
          </span>
        </Link>

        {/* Hamburger */}
        <button
          ref={btnRef}
          className="lg:hidden inline-flex h-10 w-10 items-center justify-center rounded-md text-textMuted hover:text-textPrimary focus:outline-none focus:ring-2 focus:ring-primary"
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

        {/* Desktop Nav */}
        <div className="hidden lg:flex items-center gap-2 xl:gap-4">
          {NAV.map((item) => {
            const current = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={current ? "page" : undefined}
                className={[
                  "group relative px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-300",
                  current
                    ? "text-textPrimary bg-white/5 shadow-[0_0_12px_rgba(20,247,255,0.35)]"
                    : "text-textMuted hover:text-textPrimary",
                ].join(" ")}
              >
                <span className="relative z-10">{item.label}</span>

                {/* Animated underline */}
                <span
                  className={[
                    "absolute left-1/2 bottom-0 h-[2px] w-0 -translate-x-1/2",
                    "bg-gradient-to-r from-primary via-accent to-secondary",
                    "transition-all duration-300",
                    current ? "w-full" : "group-hover:w-full",
                  ].join(" ")}
                />

                {current && (
                  <span
                    aria-hidden
                    className="absolute inset-0 rounded-md ring-1 ring-primary/40"
                  />
                )}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Mobile Menu */}
      <div
        className={[
          "lg:hidden absolute left-0 right-0 top-full z-40",
          "transition-all duration-300 ease-out",
          open
            ? "opacity-100 translate-y-0 scale-100 pointer-events-auto"
            : "opacity-0 -translate-y-2 scale-[0.98] pointer-events-none",
        ].join(" ")}
      >
        <div className="px-3">
          <div className="mt-2 rounded-2xl border border-white/10 bg-surface/95 backdrop-blur shadow-[0_20px_40px_rgba(0,0,0,.35)]">
            <div className="py-2">
              {NAV.map((item, i) => {
                const current = pathname === item.href;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    ref={i === 0 ? firstLinkRef : undefined}
                    aria-current={current ? "page" : undefined}
                    className={[
                      "block rounded-md px-4 py-2.5 text-base transition",
                      "focus:outline-none focus:ring-2 focus:ring-primary",
                      current
                        ? "text-textPrimary bg-white/10 ring-1 ring-primary/40"
                        : "text-textMuted hover:text-textPrimary",
                    ].join(" ")}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
