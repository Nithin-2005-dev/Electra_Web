"use client";

import MerchCard from "./MerchCard";
const PRODUCTS = [
  {
    id: 1,
    name: "Water On The Rocks",
    price: "Sold out",
    frontImage: "https://spankersindia.com/cdn/shop/files/back_nbg.png?v=1764075361&width=990",
    backImage: "https://spankersindia.com/cdn/shop/files/front_nbg.png?v=1764075361&width=990",
    slug: "water-on-the-rocks",
  },
  {
    id: 2,
    name: "Potter Tee",
    price: "Sold out",
    frontImage: "https://spankersindia.com/cdn/shop/files/WEB_NBG_W_d_BACK.png?v=1740389789&width=990",
    backImage: "https://spankersindia.com/cdn/shop/files/WEB_NBG_W_d_FRONT.png?v=1740389789&width=990",
    slug: "potter",
  },
];
export default function PreviousMerch() {
  return (
    <section className="previousMerch">
      <h2>Our previous Merch</h2>

      <div className="grid">
        {PRODUCTS.map((product) => (
          <MerchCard key={product.slug} product={product} />
        ))}
      </div>

      <style jsx>{`
        .previousMerch {
          padding: 5rem 4rem 6rem;
          background: linear-gradient(180deg, var(--bg-primary), var(--bg-secondary));
          color: var(--text-primary);
        }

        h2 {
          font-size: 1.4rem;
          font-weight: 500;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          margin-bottom: 3rem;
          color: #cfd8e3;
        }

        .grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 2.5rem;
        }

        @media (max-width: 768px) {
          .previousMerch {
            padding: 3rem 1.5rem 4rem;
          }
        }
      `}</style>
    </section>
  );
}
