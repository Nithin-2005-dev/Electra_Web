"use client";

import { useEffect, useMemo, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../app/lib/firebase";
import MerchCard from "./MerchCard";

export default function MerchPage() {
  const [products, setProducts] = useState([]);
  const [filter, setFilter] = useState("all");
  const [openFilter, setOpenFilter] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDocs(collection(db, "products")).then((snap) => {
      setProducts(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
      setLoading(false);
    });
  }, []);


  /* ───────── FILTER + SORT (SAFE) ───────── */
  const filtered = useMemo(() => {
    let list = [...products];

    if (filter === "available") {
      list = list.filter((p) => p.available !== false);
    }

    if (filter === "sold") {
      list = list.filter((p) => p.available === false);
    }

    // available first
    list.sort((a, b) =>
      a.available === b.available ? 0 : a.available === false ? 1 : -1
    );

    return list;
  }, [products, filter]);

  const inStock = products.filter((p) => p.available !== false).length;
  const outStock = products.filter((p) => p.available === false).length;

  return (
    <main className="page">
      {/* ───────── HEADER ───────── */}
      <header className="header">
        <div />
        <h1>PRODUCTS</h1>
        <button className="filterBtn" onClick={() => setOpenFilter(true)}>
          FILTER
        </button>
      </header>

      <div className="layout">
        {/* DESKTOP FILTER */}
        <aside className="filters">
          <Filter
            label={`All (${products.length})`}
            active={filter === "all"}
            onClick={() => setFilter("all")}
          />
          <Filter
            label={`In stock (${inStock})`}
            active={filter === "available"}
            onClick={() => setFilter("available")}
          />
          <Filter
            label={`Out of stock (${outStock})`}
            active={filter === "sold"}
            onClick={() => setFilter("sold")}
          />
        </aside>

        {/* GRID */}
        <section className="grid">
          {loading
            ? Array.from({ length: 8 }).map((_, i) => (
                <SkeletonCard key={i} />
              ))
            : filtered.map((p) => (
                <MerchCard key={p.id} product={p} />
              ))}
        </section>
      </div>

      {/* OVERLAY */}
      <div
        className={`overlay ${openFilter ? "show" : ""}`}
        onClick={() => setOpenFilter(false)}
      />

      {/* MOBILE FILTER */}
      <aside className={`mobileFilter ${openFilter ? "open" : ""}`}>
        <div className="mobileHeader">
          <span>FILTER</span>
          <button onClick={() => setOpenFilter(false)}>✕</button>
        </div>

        <div className="mobileOptions">
          <Filter
            big
            label={`All (${products.length})`}
            active={filter === "all"}
            onClick={() => {
              setFilter("all");
              setOpenFilter(false);
            }}
          />
          <Filter
            big
            label={`In stock (${inStock})`}
            active={filter === "available"}
            onClick={() => {
              setFilter("available");
              setOpenFilter(false);
            }}
          />
          <Filter
            big
            label={`Out of stock (${outStock})`}
            active={filter === "sold"}
            onClick={() => {
              setFilter("sold");
              setOpenFilter(false);
            }}
          />
        </div>
      </aside>

      <style jsx>{`
      .mobileOptions{
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
      }
        .page {
          min-height: 100vh;
          background: radial-gradient(120% 80% at 50% 0%, #0b0b0b, #000);
          color: #e5e7eb;
        }

        /* HEADER FIXED */
        .header {
          display: grid;
          grid-template-columns: 1fr auto 1fr;
          align-items: center;
          padding: 3rem 2rem 2.2rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
        }

        .header h1 {
          text-align: center;
          font-size: 1.7rem;
          letter-spacing: 0.45em;
          font-weight: 600;
        }

        .filterBtn {
          justify-self: end;
          background: none;
          border: 1px solid rgba(255, 255, 255, 0.25);
          color: #fff;
          padding: 0.45rem 1rem;
          border-radius: 999px;
          font-size: 0.7rem;
          letter-spacing: 0.18em;
          display: none;
        }

        .layout {
          max-width: 1400px;
          margin: auto;
          padding: 3rem 2rem;
          display: grid;
          grid-template-columns: 220px 1fr;
          gap: 3rem;
        }

        .filters {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 2.4rem;
        }

        /* MOBILE */
        @media (max-width: 900px) {
          .layout {
            grid-template-columns: 1fr;
          }

          .filters {
            display: none;
          }

          .filterBtn {
            display: block;
          }
        }

        /* OVERLAY */
        .overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.45);
          opacity: 0;
          pointer-events: none;
          transition: opacity 0.3s ease;
          z-index: 80;
        }

        .overlay.show {
          opacity: 1;
          pointer-events: auto;
        }

        /* MOBILE SIDEBAR */
        .mobileFilter {
          position: fixed;
          top: 0;
          right: 0;
          width: 80%;
          max-width: 360px;
          height: 100%;
          background: linear-gradient(180deg, #0b0b0b, #000);
          border-left: 1px solid rgba(255, 255, 255, 0.08);
          transform: translateX(100%);
          transition: transform 0.35s cubic-bezier(0.22, 0.61, 0.36, 1);
          z-index: 90;
          padding: 2rem;
        }

        .mobileFilter.open {
          transform: translateX(0);
        }

        .mobileHeader {
          display: flex;
          justify-content: space-between;
          margin-bottom: 2rem;
        }

        .mobileHeader span {
          font-size: 0.8rem;
          letter-spacing: 0.35em;
        }
      `}</style>
    </main>
  );
}

/* FILTER */
function Filter({ label, active, onClick, big }) {
  return (
    <button className={`filter ${active ? "active" : ""} ${big ? "big" : ""}`} onClick={onClick}>
      {label}
      <style jsx>{`
        .filter {
          background: none;
          border: none;
          color: #9ca3af;
          font-size: 0.95rem;
          cursor: pointer;
          text-align: left;
        }
        .filter.big {
          font-size: 1.1rem;
        }
        .filter.active {
          color: #fff;
          font-weight: 600;
        }
      `}</style>
    </button>
  );
}

/* SKELETON */
function SkeletonCard() {
  return (
    <div className="skeleton">
      <div className="image" />
      <div className="text short" />
      <div className="text tiny" />
      <style jsx>{`
        .skeleton {
          border-radius: 26px;
          padding: 1rem;
          background: linear-gradient(180deg, #0e1111, #070808);
        }
        .image {
          aspect-ratio: 1 / 1.25;
          border-radius: 20px;
          background: linear-gradient(90deg, #111 25%, #1a1a1a 37%, #111 63%);
          background-size: 400% 100%;
          animation: shimmer 1.4s infinite;
          margin-bottom: 1rem;
        }
        .text {
          height: 10px;
          background: #1a1a1a;
          border-radius: 6px;
          margin: 0.4rem auto;
        }
        .short {
          width: 70%;
        }
        .tiny {
          width: 40%;
        }
        @keyframes shimmer {
          0% { background-position: 100% 0; }
          100% { background-position: 0 0; }
        }
      `}</style>
    </div>
  );
}
