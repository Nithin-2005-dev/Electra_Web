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
  const [progress, setProgress] = useState(0);

  const btnRef = useRef(null);
  const firstLinkRef = useRef(null);

  /* ---------------- Scroll shadow ---------------- */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* ---------------- Scroll progress ---------------- */
  useEffect(() => {
    const onScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight =
        document.documentElement.scrollHeight -
        document.documentElement.clientHeight;
      setProgress(docHeight > 0 ? (scrollTop / docHeight) * 100 : 0);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [pathname]);

  /* ---------------- Lock body scroll (mobile) ---------------- */
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => (document.body.style.overflow = prev);
  }, [open]);

  /* ---------------- Escape key ---------------- */
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

  /* ---------------- Close on route change ---------------- */
  useEffect(() => setOpen(false), [pathname]);

  /* ---------------- Active route (robust) ---------------- */
  const isActive = (href) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header className={`header ${scrolled ? "scrolled" : ""}`}>
      {/* PROGRESS BAR (ABSOLUTE, NO LAYOUT IMPACT) */}
      <div className="progress">
        <span style={{ width: `${progress}%` }} />
      </div>

      <nav className="nav">
        {/* LOGO */}
        <Link href="/" className="logo flex justify-between gap-1 items-center">
          <div className="logo-badge">
            <img src="/logo.png" alt="Electra Logo" />
          </div>
          <span className="logo-text">Electra</span>
        </Link>

        {/* HAMBURGER */}
        <button
          ref={btnRef}
          className={`hamburger ${open ? "open" : ""}`}
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          <span />
          <span />
          <span />
        </button>

        {/* DESKTOP NAV */}
        <div className="nav-links">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={isActive(item.href) ? "active" : ""}
            >
              {item.label}
            </Link>
          ))}
        </div>
      </nav>

      {/* MOBILE MENU — CONDITIONALLY RENDERED (NO BLACK BOX) */}
      {open && (
        <div className="mobile">
          {NAV.map((item, i) => (
            <Link
              key={item.href}
              href={item.href}
              ref={i === 0 ? firstLinkRef : null}
              className={isActive(item.href) ? "active" : ""}
              style={{ transitionDelay: `${i * 60}ms` }}
            >
              {item.label}
            </Link>
          ))}
        </div>
      )}

      <style jsx>{`
        /* HEADER */
        .header {
          position: fixed;
          inset: 0 0 auto 0;
          z-index: 50;
          background: rgba(0, 0, 0, 0.55);
          backdrop-filter: blur(18px);
          transition: background 0.3s ease, box-shadow 0.3s ease;
        }

        .header.scrolled {
          background: rgba(0, 0, 0, 0.85);
          box-shadow: 0 16px 40px rgba(0, 0, 0, 0.75);
        }

        /* PROGRESS */
        .progress {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 2px;
          background: rgba(255, 255, 255, 0.06);
        }

        .progress span {
          display: block;
          height: 100%;
          background: linear-gradient(90deg, #14f7ff, #00b8d9);
          transition: width 0.15s ease-out;
        }

        .nav {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0.9rem 1.4rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        /* LOGO */
        .logo {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          text-decoration: none;
        }

        .logo-badge {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          border: 1px solid rgba(20, 247, 255, 0.6);
          box-shadow: 0 0 18px rgba(20, 247, 255, 0.35);
        }

        .logo-badge img {
          width: 100%;
          height: 100%;
          border-radius: 50%;
        }

        .logo-text {
          color: #fff;
          font-weight: 700;
          letter-spacing: 0.08em;
          font-size: 0.9rem;
        }

        /* DESKTOP NAV */
        .nav-links {
          display: none;
          gap: 1.2rem;
        }

        .nav-links a {
          position: relative;
          padding: 0.45rem 0.9rem;
          font-size: 0.7rem;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: #9aa7b2;
          text-decoration: none;
          transition: color 0.25s ease;
        }

        .nav-links a.active {
          color: #fff;
        }

        /* STRONG ACTIVE INDICATOR */
        .nav-links a.active::after {
          content: "";
          position: absolute;
          left: 12%;
          right: 12%;
          bottom: -8px;
          height: 2px;
          border-radius: 2px;
          background: linear-gradient(90deg, #14f7ff, #00b8d9);
          box-shadow: 0 0 12px rgba(20, 247, 255, 0.8);
        }

        /* HAMBURGER */
        .hamburger {
          width: 28px;
          height: 20px;
          position: relative;
          border: none;
          background: none;
          cursor: pointer;
        }

        .hamburger span {
          position: absolute;
          width: 100%;
          height: 2px;
          background: #fff;
          border-radius: 2px;
          transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .hamburger span:nth-child(1) { top: 0; }
        .hamburger span:nth-child(2) { top: 9px; }
        .hamburger span:nth-child(3) { bottom: 0; }

        .hamburger.open span:nth-child(1) {
          transform: rotate(45deg);
          top: 9px;
        }

        .hamburger.open span:nth-child(2) {
          opacity: 0;
        }

        .hamburger.open span:nth-child(3) {
          transform: rotate(-45deg);
          bottom: 9px;
        }

        /* MOBILE MENU */
        .mobile {
          background: rgba(0, 0, 0, 0.95);
          backdrop-filter: blur(22px);
          padding: 1.8rem;
          display: flex;
          flex-direction: column;
          gap: 1.4rem;
        }

        .mobile a {
          opacity: 0;
          transform: translateY(8px);
          animation: slideIn 0.35s ease forwards;
          color: #9aa7b2;
          font-size: 1rem;
          letter-spacing: 0.14em;
          text-decoration: none;
        }

        .mobile a.active {
          color: #fff;
          text-shadow: 0 0 14px rgba(20, 247, 255, 0.6);
        }

        @keyframes slideIn {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @media (min-width: 1024px) {
          .hamburger { display: none; }
          .nav-links { display: flex; }
          .mobile { display: none; }
        }
      `}</style>
    </header>
  );
}
