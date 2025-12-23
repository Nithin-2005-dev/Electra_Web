"use client";

import { useState } from "react";

export default function PillarsElectraPremium() {
  const data = {
    sectionTitle: "Pillars of Electra Society",
    head: {
      badge: "Head of Department",
      name: "Dr. Tanmoy Malakar",
      role: "Electrical Engineering Department",
      img: "https://res.cloudinary.com/dqa3ov76r/image/upload/v1729624869/favoritePhotos/ne7swirjwcqvydgnvjur.jpg",
      bio: `Dr. T. Malakar holds a B.E. (NIT Agartala), M.E. (Jadavpur University), and Ph.D. (NIT Silchar with Jadavpur). At NIT Silchar since 2005, he is currently Associate Professor in Electrical Engineering. His work spans power and systems with about 50 publications, and he serves as a reviewer for Elsevier, IEEE, Taylor & Francis, and Springer.`,
    },
    fic: {
      badge: "Faculty In-Charge",
      name: "Dr. Vivekanandan S",
      role: "Electra Society",
      img: "https://res.cloudinary.com/dqa3ov76r/image/upload/v1728873552/favoritePhotos/ubcjix1n1fp3gv1uj1y3.png",
      bio: `Dr. Vivekanandan S earned B.E./M.E. degrees from Anna University and a Ph.D. from NITK (2019). After roles at NITK and REVA University, he joined NIT Silchar in 2022 as Assistant Professor. His research focuses on low-voltage dc–dc converters and low-power electronics for portable computing and PMICs.`,
    },
  };

  const [open, setOpen] = useState({ head: false, fic: false });
  const toggle = (key) => setOpen((s) => ({ ...s, [key]: !s[key] }));

  return (
    <section className="pillars">
      <style jsx>{`
        .pillars {
          background: radial-gradient(
              120% 80% at 50% 0%,
              rgba(20, 247, 255, 0.06),
              transparent 60%
            ),
            #000;
          padding: 6rem 1rem;
        }

        .wrap {
          max-width: 1150px;
          margin: 0 auto;
        }

        .title {
          font-size: clamp(2.2rem, 4vw, 3rem);
          font-weight: 900;
          color: #fff;
          margin-bottom: 3rem;
          letter-spacing: -0.02em;
        }

        .grid {
          display: grid;
          gap: 2rem;
        }

        @media (min-width: 900px) {
          .grid {
            grid-template-columns: 1fr 1fr;
          }
        }

        .card {
          background: linear-gradient(
            180deg,
            rgba(255, 255, 255, 0.04),
            rgba(255, 255, 255, 0.015)
          );
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: 20px;
          padding: 1.5rem;
          box-shadow: 0 24px 60px rgba(0, 0, 0, 0.6);
        }

        .badge {
          display: inline-block;
          margin-bottom: 1rem;
          font-size: 0.72rem;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: #7df9ff;
        }

        .profile {
          display: flex;
          gap: 1.5rem;
          flex-wrap: wrap;
        }

        .photo {
          max-width: 240px;
          width: 100%;
          border-radius: 16px;
          background: radial-gradient(
            120% 120% at 50% 0%,
            #111,
            #000 70%
          );
          border: 1px solid rgba(255, 255, 255, 0.15);
          padding: 0.75rem;
        }

        .photo img {
          width: 100%;
          height: auto;
          object-fit: contain; /* 🔥 NO CROPPING */
          display: block;
          border-radius: 12px;
        }

        .content {
          flex: 1;
          min-width: 260px;
        }

        .name {
          font-size: 1.35rem;
          font-weight: 800;
          color: #fff;
          margin: 0;
        }

        .role {
          margin: 0.3rem 0 0.8rem;
          color: #9fb3c8;
          font-size: 0.95rem;
        }

        .bio {
          color: #b9c6d3;
          line-height: 1.7;
          font-size: 0.95rem;
          max-height: 9.5rem;
          overflow: hidden;
          transition: max-height 0.4s ease;
        }

        .bio.open {
          max-height: 1000px;
        }

        .toggle {
          margin-top: 0.8rem;
          background: none;
          border: none;
          color: #14f7ff;
          font-size: 0.85rem;
          cursor: pointer;
          padding: 0;
        }

        .toggle:hover {
          text-decoration: underline;
        }
      `}</style>

      <div className="wrap">
        <h2 className="title">{data.sectionTitle}</h2>

        <div className="grid">
          {[["head", data.head], ["fic", data.fic]].map(([key, person]) => (
            <article className="card" key={key}>
              <span className="badge">{person.badge}</span>

              <div className="profile">
                <div className="photo">
                  <img src={person.img} alt={person.name} />
                </div>

                <div className="content">
                  <h3 className="name">{person.name}</h3>
                  <div className="role">{person.role}</div>

                  <p className={`bio ${open[key] ? "open" : ""}`}>
                    {person.bio}
                  </p>

                  <button className="toggle" onClick={() => toggle(key)}>
                    {open[key] ? "Show less" : "Read more"}
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
