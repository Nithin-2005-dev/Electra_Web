"use client";
import MerchCard from "./MerchCard";

const PRODUCTS = [
  {
    id: 1,
    name: "Water On The Rocks",
    price: "₹1,190",
    frontImage:
      "https://spankersindia.com/cdn/shop/files/back_nbg.png?v=1764075361&width=990",
    backImage:
      "https://spankersindia.com/cdn/shop/files/front_nbg.png?v=1764075361&width=990",
    slug: "water-on-the-rocks",
  },
  {
    id: 2,
    name: "Potter Tee",
    price: "₹1,290",
    frontImage:
      "https://spankersindia.com/cdn/shop/files/WEB_NBG_W_d_BACK.png?v=1740389789&width=990",
    backImage:
      "https://spankersindia.com/cdn/shop/files/WEB_NBG_W_d_FRONT.png?v=1740389789&width=990",
    slug: "potter",
  },
];

export default function MerchGrid() {
  return (
    <section className="merchSection">
      <h2>Currently Available Merch</h2>

      <div className="grid">
        {PRODUCTS.map((p) => (
          <MerchCard key={p.id} product={p} />
        ))}
      </div>

      <style jsx>{`
        .merchSection {
          padding: 5rem 3rem 6rem;
          background: linear-gradient(180deg, var(--bg-primary), var(--bg-secondary));
          color: var(--text-primary);
        }

        h2 {
          font-size: 1.4rem;
          font-weight: 500;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          margin-bottom: 3.5rem;
          color: #cfd8e3;
        }

        .grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 3rem;
        }

        @media (max-width: 768px) {
          .merchSection {
            padding: 3rem 1.5rem 4rem;
          }

          h2 {
            font-size: 1.2rem;
            margin-bottom: 2.5rem;
          }
        }
      `}</style>
    </section>
  );
}
