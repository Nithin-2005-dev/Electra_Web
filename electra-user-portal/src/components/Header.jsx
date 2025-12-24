"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const NAV = [
  { href: "/", label: "Home" },
  { href: "/Gallery", label: "Gallery" },
  { href: "/Resources", label: "Resources" },
  { href: "/Team", label: "Team" },
  { href: "/gotyourmerch", label: "Merch" },
];

export default function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* ================= HEADER ================= */}
      <header className="header">
        <div className="inner">
          {/* LEFT — LOGO */}
          <Link href="/" className="logo">
            <img src="/logo.png" alt="Logo" />
          </Link>

          {/* CENTER — DESKTOP NAV */}
          <nav className="nav">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={pathname === item.href ? "active" : ""}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* RIGHT — 2-LINE MENU */}
          <button
            className="menu"
            onClick={() => setOpen(true)}
            aria-label="Open menu"
          >
            <span />
            <span />
          </button>
        </div>
      </header>

      {/* ================= MOBILE OVERLAY ================= */}
      {open && (
        <div className="overlay">
          <div className="overlay-header">
            <img src="/logo.png" alt="Logo" />
            <button
              className="close"
              onClick={() => setOpen(false)}
              aria-label="Close menu"
            >
              ✕
            </button>
          </div>

          <nav className="overlay-nav">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={pathname === item.href ? "active" : ""}
                onClick={() => setOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      )}

      <style jsx>{`
        /* ================= HEADER ================= */
        .header {
          position: fixed;
          top: 0;
          width: 100%;
          z-index: 100;
          background: #000;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
        }

        .inner {
          height: 64px;
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 20px;

          display: grid;
          grid-template-columns: auto 1fr auto;
          align-items: center;
        }

        /* ================= LOGO ================= */
        .logo img {
          height: 28px;
          width: auto;
        }

        /* ================= DESKTOP NAV ================= */
        .nav {
          display: none;
          justify-self: center;
          gap: 32px;
        }

        .nav a {
          color: #b5b5b5;
          font-size: 14px;
          text-decoration: none;
          position: relative;
          padding: 4px 0;
        }

        .nav a.active {
          color: #ffffff;
        }

        .nav a.active::after {
          content: "";
          position: absolute;
          left: 0;
          right: 0;
          bottom: -8px;
          height: 2px;
          background: #ffffff;
        }

        /* ================= 2-LINE MENU ================= */
        .menu {
          width: 22px;
          height: 14px;
          background: none;
          border: none;
          cursor: pointer;
          position: relative;
          justify-self: end;
        }

        .menu span {
          position: absolute;
          left: 0;
          width: 100%;
          height: 2px;
          background: #ffffff;
        }

        .menu span:nth-child(1) {
          top: 0;
        }

        .menu span:nth-child(2) {
          bottom: 0;
        }

        /* ================= MOBILE OVERLAY ================= */
        .overlay {
          position: fixed;
          inset: 0;
          background: #000;
          z-index: 200;
          display: flex;
          flex-direction: column;
        }

        .overlay-header {
          height: 64px;
          padding: 0 20px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
        }

        .overlay-header img {
          height: 28px;
        }

        .close {
          font-size: 22px;
          color: white;
          background: none;
          border: none;
          cursor: pointer;
        }

        .overlay-nav {
          padding: 32px 20px;
          display: flex;
          flex-direction: column;
          gap: 28px;
        }

        .overlay-nav a {
          color: #b5b5b5;
          font-size: 18px;
          text-decoration: none;
        }

        .overlay-nav a.active {
          color: #ffffff;
          font-weight: 500;
        }

        /* ================= BREAKPOINT ================= */
        @media (min-width: 1024px) {
          .nav {
            display: flex;
          }
          .menu {
            display: none;
          }
        }
      `}</style>
    </>
  );
}
