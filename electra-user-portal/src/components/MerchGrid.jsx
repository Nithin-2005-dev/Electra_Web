"use client";

import { useEffect, useMemo, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../app/lib/firebase";
import MerchCard from "../components/MerchCard";

export default function MerchPage() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    getDocs(collection(db, "products")).then((snap) => {
      setProducts(
        snap.docs.map((d) => ({
          id: d.id,
          ...d.data(),
        }))
      );
    });
  }, []);

  /* 🔒 SORT: AVAILABLE FIRST, SOLD OUT LAST */
  const sortedProducts = useMemo(() => {
    return [...products].sort((a, b) => {
      if (a.available === b.available) return 0;
      return a.available ? -1 : 1;
    });
  }, [products]);

  return (
    <main className="wrap">
      <h1 className="title">Merch</h1>

      <section className="grid">
        {sortedProducts.map((p) => (
          <MerchCard key={p.id} product={p} />
        ))}
      </section>

      <style jsx>{`
        .wrap {
          min-height: 100vh;
          background: #000;
          padding: 3rem 2rem;
        }

        .title {
          color: #e5e7eb;
          font-size: 1.2rem;
          letter-spacing: 0.25em;
          text-transform: uppercase;
          margin-bottom: 2.5rem;
          text-align: center;
        }

        .grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 2.2rem;
        }
      `}</style>
    </main>
  );
}
