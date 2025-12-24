"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function PillarsElectraPremium() {
  const people = [
    {
      key: "hod",
      badge: "Head of Department",
      name: "Dr. Tanmoy Malakar",
      role: "Electrical Engineering Department",
      img: "https://res.cloudinary.com/dqa3ov76r/image/upload/v1729624869/favoritePhotos/ne7swirjwcqvydgnvjur.jpg",
      bio: `Dr. T. Malakar holds a B.E. (NIT Agartala), M.E. (Jadavpur University), and Ph.D. (NIT Silchar with Jadavpur). At NIT Silchar since 2005, he is currently Associate Professor in Electrical Engineering. His work spans power and systems with about 50 publications, and he serves as a reviewer for Elsevier, IEEE, Taylor & Francis, and Springer.`,
    },
    {
      key: "fic",
      badge: "Faculty In-Charge",
      name: "Dr. Vivekanandan S",
      role: "Electra Society",
      img: "https://res.cloudinary.com/dqa3ov76r/image/upload/v1728873552/favoritePhotos/ubcjix1n1fp3gv1uj1y3.png",
      bio: `Dr. Vivekanandan S earned B.E./M.E. degrees from Anna University and a Ph.D. from NITK (2019). After roles at NITK and REVA University, he joined NIT Silchar in 2022 as Assistant Professor. His research focuses on low-voltage dc–dc converters and low-power electronics for portable computing and PMICs.`,
    },
  ];

  const [open, setOpen] = useState(null);

  return (
    <section className="pillars">
      <div className="wrap">

        {/* ✅ ONLY HEADING — PREMIUM */}
        <motion.div
          className="sectionHead"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className="kicker">Leadership</span>
          <h2 >
            Pillars of Electra
          </h2>
        </motion.div>

        {/* CARDS */}
        <div className="grid">
          {people.map((p) => (
            <article className="card" key={p.key}>
              <span className="badge">{p.badge}</span>

              <div className="profile">
                <div className="photo">
                  <img src={p.img} alt={p.name} />
                </div>

                <div className="content">
                  <h3>{p.name}</h3>
                  <div className="role">{p.role}</div>

                  <AnimatePresence initial={false}>
                    <motion.p
                      key={open === p.key ? "open" : "closed"}
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.35, ease: "easeOut" }}
                      className="bio"
                    >
                      {open === p.key
                        ? p.bio
                        : p.bio.slice(0, 190) + "..."}
                    </motion.p>
                  </AnimatePresence>

                  <button
                    className="toggle"
                    onClick={() =>
                      setOpen(open === p.key ? null : p.key)
                    }
                  >
                    {open === p.key ? "Show less" : "Read more"}
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>

      {/* STYLES */}
      <style jsx>{`
        .pillars {
          background: radial-gradient(
              120% 80% at 50% 0%,
              rgba(255, 255, 255, 0.04),
              transparent 60%
            ),
            #000;
          padding: 9rem 6vw;
        }

        .wrap {
          max-width: 1200px;
          margin: 0 auto;
        }

        /* ===== HEADING SYSTEM (MATCHES ABOUT) ===== */
        .sectionHead {
          margin-bottom: 5rem;
        }

        .kicker {
          font-size: 0.7rem;
          letter-spacing: 0.28em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.35);
          margin-bottom: 1.2rem;
          display: block;
        }

        h2 {
            font-size: clamp(3rem, 10vw, 5rem);
          font-weight: 900;
          letter-spacing: -0.04em;
          line-height: 1.05;
          color: #fff;
          margin-bottom: 1rem;
        }

        .sectionHead h2 span {
          color: rgba(255,255,255,0.55);
        }

        /* ===== GRID ===== */
        .grid {
          display: grid;
          gap: 2.6rem;
        }

        @media (min-width: 900px) {
          .grid {
            grid-template-columns: 1fr 1fr;
          }
        }

        /* ===== CARD ===== */
        .card {
          background: linear-gradient(
            180deg,
            rgba(255,255,255,0.05),
            rgba(255,255,255,0.015)
          );
          border: 1px solid rgba(255,255,255,0.12);
          border-radius: 24px;
          padding: 1.7rem;
          box-shadow: 0 40px 90px rgba(0,0,0,0.7);
        }

        .badge {
          font-size: 0.7rem;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.45);
          margin-bottom: 1.3rem;
          display: block;
        }

        .profile {
          display: flex;
          gap: 1.6rem;
          flex-wrap: wrap;
        }

        .photo {
          width: 220px;
          border-radius: 16px;
          overflow: hidden;
          border: 1px solid rgba(255,255,255,0.15);
        }

        .photo img {
          width: 100%;
          display: block;
        }

        .content {
          flex: 1;
          min-width: 260px;
        }

        h3 {
          font-size: 1.35rem;
          font-weight: 800;
          color: #fff;
          margin: 0;
        }

        .role {
          margin: 0.35rem 0 1rem;
          color: rgba(255,255,255,0.6);
          font-size: 0.95rem;
        }

        .bio {
          font-size: 0.95rem;
          line-height: 1.75;
          color: rgba(255,255,255,0.72);
          overflow: hidden;
        }

        .toggle {
          margin-top: 0.8rem;
          background: none;
          border: none;
          padding: 0;
          font-size: 0.85rem;
          color: rgba(255,255,255,0.85);
          cursor: pointer;
        }

        .toggle:hover {
          text-decoration: underline;
        }
      `}</style>
    </section>
  );
}
