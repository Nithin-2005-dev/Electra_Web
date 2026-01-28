"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { auth, db } from "../app/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

const NAV = [
  { href: "/", label: "Home" },
  { href: "/Gallery", label: "Gallery" },
  { href: "/Resources", label: "Resources" },
  { href: "/Team", label: "Team" },
];

export default function Header() {
  const pathname = usePathname();

  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);

  const [menuOpen, setMenuOpen] = useState(false);
  const [merchOpen, setMerchOpen] = useState(false);

  /* 🔐 AUTH + ROLE FETCH */
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      if (!firebaseUser) {
        setUser(null);
        setRole(null);
        return;
      }

      setUser(firebaseUser);

      try {
        const snap = await getDoc(
          doc(db, "users", firebaseUser.uid)
        );

        if (snap.exists()) {
          setRole(snap.data().role);
        } else {
          setRole(null);
        }
      } catch (err) {
        console.error("Role fetch failed", err);
        setRole(null);
      }
    });

    return () => unsub();
  }, []);

  return (
    <>
      {/* HEADER */}
      <header className="header">
        <div className="inner">
          <Link href="/" className="logo">
            <img
              src="https://res.cloudinary.com/dqa3ov76r/image/upload/v1766745932/dawnld1jgn6kzelqpg03.png"
              alt="Electra"
              className="logo-img"
            />
          </Link>

          {/* DESKTOP NAV */}
          <nav className="nav">
            {NAV.map((n) => (
              <Link
                key={n.href}
                href={n.href}
                className={`nav-link ${
                  pathname === n.href ? "active" : ""
                }`}
              >
                {n.label}
              </Link>
            ))}

            <div className="merch">
              <button
                className="nav-link merch-btn"
                onClick={() => setMerchOpen((v) => !v)}
              >
                Merch ▾
              </button>

              {merchOpen && (
                <div
                  className="dropdown"
                  onClick={() => setMerchOpen(false)}
                >
                  <Link href="/getyourmerch">Products</Link>
                  <Link href="/cart">Cart</Link>
                </div>
              )}
            </div>

            {user && (
              <Link
                href="/dashboard"
                className={`nav-link ${
                  pathname === "/dashboard" ? "active" : ""
                }`}
              >
                Dashboard
              </Link>
            )}

            {role === "admin" && (
              <Link href="/admin" className="nav-link">
                Admin
              </Link>
            )}
          </nav>

          {/* MOBILE MENU BUTTON */}
          <button
            className="menu-btn premium"
            onClick={() => setMenuOpen(true)}
            aria-label="Open menu"
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </header>

      {/* MOBILE MENU */}
      {menuOpen && (
        <div
          className="mobile-backdrop"
          onClick={() => setMenuOpen(false)}
        >
          <div
            className="mobile-sheet"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sheet-handle" />

            <div className="mobile-section">
              {NAV.map((n) => (
                <Link
                  key={n.href}
                  href={n.href}
                  className="mobile-item"
                  onClick={() => setMenuOpen(false)}
                >
                  {n.label}
                </Link>
              ))}

              {/* MERCH */}
              <div className="mobile-merch">
                <button
                  className="mobile-item merch-toggle"
                  onClick={() => setMerchOpen((v) => !v)}
                >
                  <span>Merch</span>
                  <span
                    className={`caret ${
                      merchOpen ? "open" : ""
                    }`}
                  >
                    ▾
                  </span>
                </button>

                {merchOpen && (
                  <div className="mobile-merch-items">
                    <Link
                      href="/getyourmerch"
                      onClick={() => setMenuOpen(false)}
                    >
                      Products
                    </Link>
                    <Link
                      href="/cart"
                      onClick={() => setMenuOpen(false)}
                    >
                      Cart
                    </Link>
                  </div>
                )}
              </div>
            </div>

            {user && (
              <div className="mobile-cta">
                <Link
                  href="/dashboard"
                  className="cta-btn"
                  onClick={() => setMenuOpen(false)}
                >
                  Dashboard
                </Link>
              </div>
            )}

            {role === "admin" && (
              <div className="mobile-cta">
                <Link
                  href="/admin"
                  className="cta-btn"
                  onClick={() => setMenuOpen(false)}
                >
                  Admin
                </Link>
              </div>
            )}
          </div>
        </div>
      )}

       <style jsx>{`
        * {
          box-sizing: border-box;
        }

        a {
          text-decoration: none;
        }

        /* HEADER */
        .header {
          position: fixed;
          top: 0;
          width: 100%;
          background: #000;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
          z-index: 100;
        }

        .inner {
          position: relative;
          max-width: 1200px;
          height: 64px;
          margin: auto;
          padding: 0 20px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .logo-img {
          height: 34px;
        }

        /* DESKTOP NAV */
        .nav {
          display: none;
          position: absolute;
          left: 50%;
          transform: translateX(-50%);
          gap: 28px;
          align-items: center;
        }

        .nav-link {
          font-size: 14px;
          color: #b5b5b5;
          cursor: pointer;
          position: relative;
          padding: 4px 0;
        }

        .nav-link.active {
          color: #fff;
        }

        .nav-link.active::after {
          content: "";
          position: absolute;
          left: 0;
          right: 0;
          bottom: -8px;
          height: 2px;
          background: #fff;
        }

        .merch {
          position: relative;
        }

        .dropdown {
          position: absolute;
          top: 38px;
          left: 0;
          background: #0b0b0b;
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 12px;
          padding: 10px;
          min-width: 160px;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        /* MOBILE MENU ICON */
        .menu-btn.premium {
          width: 36px;
          height: 36px;
          border-radius: 12px;
          background: rgba(255, 255, 255, 0.06);
          border: 1px solid rgba(255, 255, 255, 0.12);
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          gap: 4px;
        }

        .menu-btn.premium span {
          width: 16px;
          height: 2px;
          background: #fff;
          border-radius: 2px;
        }

         .mobile-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.65);
          backdrop-filter: blur(8px);
          z-index: 200;
          display: flex;
          align-items: flex-end;
          justify-content: center;
        }

        .mobile-sheet {
          width: 100%;
          max-width: 520px;
          background: linear-gradient(
            180deg,
            #0f0f0f,
            #090909
          );
          border-radius: 28px 28px 0 0;
          padding: 18px 22px 30px;
          animation: slideUp 0.25s ease-out;
        }

        @keyframes slideUp {
          from {
            transform: translateY(100%);
          }
          to {
            transform: translateY(0);
          }
        }

        .sheet-handle {
          width: 42px;
          height: 4px;
          background: rgba(255, 255, 255, 0.25);
          border-radius: 4px;
          margin: 0 auto 22px;
        }

        .mobile-section {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .mobile-item {
          padding: 18px;
          border-radius: 16px;
          font-size: 17px;
          text-align: center;
          color: #f3f4f6;
          background: rgba(255, 255, 255, 0.08);
        }

        .mobile-merch {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .merch-toggle {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .caret {
          transition: transform 0.25s ease;
        }

        .caret.open {
          transform: rotate(180deg);
        }

        .mobile-merch-items {
          margin-left: 12px;
          padding-left: 12px;
          border-left: 1px solid rgba(255, 255, 255, 0.12);
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .mobile-merch-items a {
          padding: 14px;
          border-radius: 12px;
          font-size: 15px;
          background: rgba(255, 255, 255, 0.04);
          color: #e5e7eb;
        }

        .mobile-cta {
          margin-top: 26px;
        }

        .cta-btn {
          display: block;
          padding: 18px;
          text-align: center;
          font-weight: 600;
          border-radius: 18px;
          background: #fff;
          color: #000;
        }

        @media (min-width: 1024px) {
          .nav {
            display: flex;
          }
          .menu-btn {
            display: none;
          }
        }
        /* 🔐 DESKTOP SAFETY LOCK */
        @media (min-width: 1024px) {
          .nav {
            display: flex;
          }

          .menu-btn,
          .menu-btn.premium {
            display: none !important;
          }

          .mobile-backdrop {
            display: none !important;
          }
        }
      `}</style>
    </>
  );
}



