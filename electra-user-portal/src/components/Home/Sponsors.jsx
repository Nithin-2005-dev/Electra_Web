"use client";

import React from "react";
import { CldImage } from "next-cloudinary";
import { sponsors } from "../../app/utils/sponsers";

export default function SponsorsSection() {
  return (
    <section className="sponsors">
      <div className="wrap">
        {/* Heading */}
        <div className="heading">
          <h2>Our Sponsors</h2>
          <p>
            Empowering innovation through long-term support and collaboration.
          </p>
        </div>

        {/* Sponsors Grid */}
        <div className="grid">
          {sponsors.length === 0 ? (
            <div className="empty">Sponsorship details coming soon.</div>
          ) : (
            sponsors.map((s, i) => (
              <a
                key={`${s.name}-${i}`}
                href={s.link || "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="card"
              >
                <div className="logo">
                  <CldImage
                    fill
                    alt={s.name}
                    src={s.logoPublicId}
                    className="img"
                    sizes="(max-width:768px) 40vw, 15vw"
                    format="auto"
                    quality="auto"
                  />
                </div>

                <h3>{s.name}</h3>

                <div className="meta">
                  <span>{s.event}</span>
                  <span>{s.year}</span>
                </div>
              </a>
            ))
          )}
        </div>
      </div>

      <style jsx>{`
        .sponsors {
          background: radial-gradient(
              120% 80% at 50% 0%,
              rgba(255, 255, 255, 0.05),
              transparent 60%
            ),
            #000;
          padding: 8rem 6vw;
        }

        .wrap_sponsers {
          max-width: 1150px;
          margin: 0 auto;
        }

        /* ===== Heading ===== */
        .heading {
          text-align: center;
          margin-bottom: 4.5rem;
        }

        .heading h2 {
          font-size: clamp(2.6rem, 5vw, 3.8rem);
          font-weight: 900;
          letter-spacing: -0.03em;
          color: #ffffff;
          margin-bottom: 0.8rem;
        }

        .heading p {
          color: #9ca3af;
          font-size: 1rem;
        }

        /* ===== Grid ===== */
        .grid {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 2.5rem;
        }

        /* ===== Card ===== */
        .card {
          width: 260px;
          padding: 2.2rem 1.8rem;
          border-radius: 26px;
          text-align: center;
          text-decoration: none;
          background: linear-gradient(
            180deg,
            rgba(255, 255, 255, 0.04),
            rgba(255, 255, 255, 0.015)
          );
          border: 1px solid rgba(255, 255, 255, 0.12);
          backdrop-filter: blur(10px);
          box-shadow: 0 30px 70px rgba(0, 0, 0, 0.6);
          transition: transform 0.35s ease, box-shadow 0.35s ease;
        }

        .card:hover {
          transform: translateY(-6px);
          box-shadow: 0 40px 90px rgba(0, 0, 0, 0.8);
        }

        /* ===== Logo ===== */
        .logo {
          position: relative;
          width: 110px;
          height: 110px;
          margin: 0 auto 1.4rem;
          border-radius: 16px;
          background: #0b0b0b;
          border: 1px solid rgba(255, 255, 255, 0.15);
        }

        .img {
          object-fit: contain;
          padding: 14px;
        }

        /* ===== Text ===== */
        .card h3 {
          color: #ffffff;
          font-size: 1.05rem;
          font-weight: 700;
          margin-bottom: 0.4rem;
        }

        .meta {
          font-size: 0.85rem;
          color: #9ca3af;
          display: flex;
          flex-direction: column;
          gap: 0.15rem;
        }

        .empty {
          color: #9ca3af;
          padding: 3rem 0;
        }

        @media (max-width: 768px) {
          .sponsors {
            padding: 6rem 6vw;
          }
        }
      `}</style>
    </section>
  );
}
