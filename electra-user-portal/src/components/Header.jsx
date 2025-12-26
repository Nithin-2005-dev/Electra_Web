"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { auth } from "../app/lib/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";

const NAV = [
  { href: "/", label: "Home" },
  { href: "/Gallery", label: "Gallery" },
  { href: "/Resources", label: "Resources" },
  { href: "/Team", label: "Team" },
  { href: "/gotyourmerch", label: "Merch" },
];

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState(null);

  /* ---------- AUTH STATE ---------- */
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
    });
    return () => unsub();
  }, []);

  /* ---------- LOGOUT ---------- */
  const handleLogout = async () => {
    await signOut(auth);
    setOpen(false);
    router.push("/");
  };

  return (
    <>
      {/* ================= HEADER ================= */}
      <header className="header">
        <div className="inner">
          {/* LEFT — LOGO */}
          <Link href="/" className="">
            <img className="w-12" src="https://res.cloudinary.com/dqa3ov76r/image/upload/v1766745932/dawnld1jgn6kzelqpg03.png" alt="Logo" />
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

            {/* AUTH LINKS (DESKTOP) */}
            {!user && (
              <Link
                href="/auth/sign-in"
                className={pathname === "/auth/sign-in" ? "active" : ""}
              >
                Sign in
              </Link>
            )}

            {user && (
              <>
                <Link
                  href="/dashboard"
                  className={pathname === "/dashboard" ? "active" : ""}
                >
                  Dashboard
                </Link>
                <a onClick={handleLogout} style={{ cursor: "pointer" }}>
                  Sign out
                </a>
              </>
            )}
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

            {/* AUTH LINKS (MOBILE) */}
            {!user && (
              <Link
                href="/auth/sign-in"
                className={pathname === "/auth/sign-in" ? "active" : ""}
                onClick={() => setOpen(false)}
              >
                Sign in
              </Link>
            )}

            {user && (
              <>
                <Link
                  href="/dashboard"
                  className={pathname === "/dashboard" ? "active" : ""}
                  onClick={() => setOpen(false)}
                >
                  Dashboard
                </Link>
                <a onClick={handleLogout}>Sign out</a>
              </>
            )}
          </nav>
        </div>
      )}

      {/* ================= STYLES (UNCHANGED) ================= */}
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

        {/* .logo img {
          height: 2px;
          width: 2px;
        } */}

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
