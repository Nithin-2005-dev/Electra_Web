"use client";

import { useState } from "react";

export default function PillarsElectraOne() {
  const data = {
    sectionTitle: "Pillars of Electra Society",
    head: {
      badge: "Head Of Department",
      name: "Dr. Tanmoy Malakar",
      role: "Electrical Engineering Department",
      img: "https://res.cloudinary.com/dqa3ov76r/image/upload/v1729624869/favoritePhotos/ne7swirjwcqvydgnvjur.jpg",
      bio: `Dr. T. Malakar holds a B.E. (NIT Agartala), M.E. (Jadavpur University), and Ph.D. (NIT Silchar with Jadavpur). At NIT Silchar since 2005, he is currently Associate Professor in Electrical Engineering. His work spans power and systems with about 50 publications, and he serves as a reviewer for Elsevier, IEEE, Taylor & Francis, and Springer.`,
    },
    fic: {
      badge: "Faculty In Charge",
      name: "Dr. Vivekanandan S",
      role: "Electra Society",
      img: "https://res.cloudinary.com/dqa3ov76r/image/upload/v1728873552/favoritePhotos/ubcjix1n1fp3gv1uj1y3.png",
      bio: `Dr. Vivekanandan S earned B.E./M.E. degrees from Anna University and a Ph.D. from NITK (2019). After roles at NITK and REVA University, he joined NIT Silchar in 2022 as Assistant Professor. His research focuses on low‑voltage dc–dc converters and low‑power electronics for portable computing and PMICs. He received TENCON 2018 Best Paper, is an IEEE member, and has editorial and organizing roles with IEEE/IET/Elsevier venues.`,
    },
  };

  const [open, setOpen] = useState({ head: false, fic: false });
  const allOpen = open.head && open.fic;

  const toggle = (key) => setOpen((s) => ({ ...s, [key]: !s[key] }));
  const setAll = (val) => setOpen({ head: val, fic: val });

  return (
    <section id="pillars-electra" className="pillars">
      <style jsx>{`
        :root{
          --primary:#00B8D9; --secondary:#14F7FF;
          --accent:#7CFFDF;
          --panel1:#0B1118; --panel2:#0A0F16; --edge:#142131;
          --textPrimary:#E6EEF5; --textMuted:#A7B2BC;
        }

        .pillars{ isolation:isolate; overflow:hidden; position:relative; }
        .wrap{ max-width:80rem; margin-inline:auto; padding:2.2rem 1rem 3.2rem; position:relative; }

        /* Magical ambient: aurora + circuit grid + drifting particles */
        .bg{
          position:absolute; inset:-12% -4% -10% -4%; pointer-events:none; z-index:-3;
          background: linear-gradient(180deg, var(--panel1), var(--panel2));
        }
        .aurora{
          position:absolute; inset:-30% -40% -20% -40%; z-index:-2; pointer-events:none; mix-blend-mode:screen;
          background:
            radial-gradient(40% 60% at 10% 10%, rgba(20,247,255,.12), transparent 60%),
            radial-gradient(30% 50% at 90% 85%, rgba(0,184,217,.10), transparent 60%),
            radial-gradient(20% 40% at 50% 50%, rgba(124,255,223,.08), transparent 70%);
          animation: floatXY 14s ease-in-out infinite alternate;
          filter: blur(22px);
        }
        @keyframes floatXY{ 0%{ transform: translate(-4%, -3%) } 100%{ transform: translate(4%, 3%) } }

        .grid{
          position:absolute; inset:0; z-index:-1; opacity:.2; pointer-events:none;
          background-image:
            linear-gradient(transparent 23px, rgba(255,255,255,.07) 24px),
            linear-gradient(90deg, transparent 23px, rgba(255,255,255,.07) 24px);
          background-size:24px 24px;
          mask-image: radial-gradient(120% 80% at 50% 30%, black 60%, transparent 100%);
        }

        .particles{
          position:absolute; inset:0; z-index:-1; pointer-events:none; opacity:.3;
          background:
            radial-gradient(2px 2px at 12% 18%, rgba(20,247,255,.75), transparent 60%),
            radial-gradient(2px 2px at 72% 42%, rgba(0,184,217,.7), transparent 60%),
            radial-gradient(2px 2px at 34% 78%, rgba(124,255,223,.7), transparent 60%);
          animation: twinkle 5.6s ease-in-out infinite alternate;
          filter: blur(.2px);
        }
        @keyframes twinkle{ 0%{ opacity:.18; transform: translateY(0) } 100%{ opacity:.45; transform: translateY(-4px) } }

        .head{
          display:flex; align-items:flex-end; justify-content:space-between; gap:.8rem; margin-bottom:1.2rem;
        }
        .title{
          margin:0; color:var(--textPrimary);
          font-size:clamp(1.25rem,2.8vw,1.9rem); font-weight:900; letter-spacing:.02em;
          text-shadow: 0 2px 18px rgba(20,247,255,.18);
        }
        .underline{ height:3px; width:8rem; border-radius:999px; overflow:hidden; background:rgba(255,255,255,.07); position:relative; }
        .underline:before{
          content:""; position:absolute; inset:0; width:36%; left:-36%;
          background:linear-gradient(90deg, rgba(0,184,217,.9), rgba(20,247,255,.9));
          animation: glint 2.6s linear infinite;
        }
        @keyframes glint{ 0%{ transform:translateX(0) } 100%{ transform:translateX(360%) } }

        .actions{ display:flex; gap:.6rem; flex-wrap:wrap; }
        .btn{
          display:inline-flex; align-items:center; gap:.5rem; padding:.46rem .7rem;
          border-radius:10px; border:1px solid rgba(255,255,255,.12);
          background:linear-gradient(180deg, rgba(255,255,255,.05), rgba(255,255,255,.03));
          color:var(--textPrimary); font-size:.84rem; cursor:pointer;
          transition:transform .08s ease, background .2s ease, box-shadow .2s ease, border-color .2s ease;
          box-shadow: inset 0 0 0 1px rgba(255,255,255,.04), 0 10px 24px rgba(0,0,0,.35);
        }
        .btn:hover{ border-color:rgba(20,247,255,.35); box-shadow: inset 0 0 14px rgba(20,247,255,.16), 0 14px 30px rgba(0,0,0,.45) }
        .btn:active{ transform:translateY(1px) }
        .btn-primary{ background:rgba(0,255,120,.08); border-color:rgba(0,255,120,.25); color:#0aff84 }

        .gridCards{ display:grid; gap:1.1rem; }
        @media (min-width:900px){ .gridCards{ grid-template-columns:1fr 1fr } }

        /* Card with conic glow border & breathing halo */
        .card{
          position:relative; border-radius:16px; overflow:hidden;
          background:linear-gradient(180deg, rgba(255,255,255,.035), rgba(255,255,255,.02));
          border:1px solid var(--edge);
          box-shadow: 0 0 0 1px rgba(255,255,255,.02) inset, 0 18px 40px rgba(0,0,0,.42);
          transform-style: preserve-3d;
        }
        .card:before{
          content:""; position:absolute; inset:-1px; border-radius:18px; z-index:-1; filter: blur(18px); opacity:.85;
          background:
            conic-gradient(from 0deg at 50% 50%, rgba(20,247,255,.18), rgba(0,184,217,.16), rgba(124,255,223,.16), rgba(20,247,255,.18));
          animation: spin 14s linear infinite;
        }
        @keyframes spin{ from{ transform:rotate(0) } to{ transform:rotate(360deg) } }
        .card:after{
          content:""; position:absolute; inset:-12% -8% -18% -8%; z-index:-2; pointer-events:none;
          background: radial-gradient(50% 60% at 50% 0%, rgba(20,247,255,.18), transparent 70%);
          filter: blur(18px); animation: breathe 5s ease-in-out infinite;
        }
        @keyframes breathe{ 0%,100%{ opacity:.55 } 50%{ opacity:.9 } }

        .inner{ padding:1.15rem; }

        .badge{
          display:inline-block; color:var(--textPrimary); font-weight:800; letter-spacing:.08em;
          text-transform:uppercase; font-size:.78rem; margin-bottom:.7rem;
          padding:.22rem .5rem; border-radius:999px; border:1px solid rgba(255,255,255,.12);
          background:linear-gradient(180deg, rgba(255,255,255,.05), rgba(255,255,255,.02));
          box-shadow: inset 0 0 10px rgba(20,247,255,.12);
        }

        .photoWrap{ display:flex; align-items:flex-start; gap:1rem; flex-wrap:wrap; }

        /* Photo with aurora ring + gentle tilt */
        .photo{
          width:220px; max-width:48vw; aspect-ratio:1/1.05; border-radius:14px; overflow:hidden; position:relative;
          border:1px solid rgba(255,255,255,.12); background:rgba(255,255,255,.04);
          box-shadow: inset 0 0 0 1px rgba(255,255,255,.06), 0 14px 28px rgba(0,0,0,.4);
          transform: perspective(800px) rotateX(0deg) rotateY(0deg); transition: transform .25s ease;
        }
        .photo:hover{ transform: perspective(800px) rotateX(2deg) rotateY(-2deg) }

        .ring{
          position:absolute; inset:-8%; border-radius:18px; pointer-events:none;
          background:conic-gradient(from 0deg, rgba(20,247,255,0) 0deg, rgba(20,247,255,.25) 90deg, rgba(0,184,217,.22) 180deg, rgba(255,255,255,0) 270deg);
          filter: blur(2px); animation: orbit 10s linear infinite; opacity:.8;
        }
        @keyframes orbit{ from{ transform:rotate(0) } to{ transform:rotate(360deg) } }
        .img{ width:100%; height:100%; object-fit:cover; display:block; }

        .content{ min-width:260px; flex:1 1 280px; }

        .name{
          margin:0; font-weight:900; font-size:clamp(1.06rem,2.2vw,1.38rem);
          background:linear-gradient(90deg, var(--primary), var(--secondary), var(--accent));
          -webkit-background-clip:text; background-clip:text; color:transparent;
          text-shadow: 0 0 12px rgba(20,247,255,.18);
        }
        .role{ margin:.2rem 0 .7rem 0; color:var(--textMuted); font-weight:600; }

        /* Collapsible bio with silky mask */
        .bioWrap{ position:relative; border-radius:10px; }
        .bio{
          color:var(--textMuted); line-height:1.72; font-size:clamp(.93rem,1.6vw,1.02rem); white-space:pre-wrap; margin:0;
          transition:max-height .45s ease, filter .3s ease; overflow:hidden;
        }
        .bioMask{
          content:""; position:absolute; left:0; right:0; bottom:0; height:3.6rem; pointer-events:none;
          background: linear-gradient(180deg, rgba(12,18,26,0), rgba(12,18,26,.7));
          border-bottom-left-radius:10px; border-bottom-right-radius:10px; opacity:1; transition:opacity .3s ease;
        }
        .bioOpen .bioMask{ opacity:0 }
        .bioOpen .bio{ overflow:visible }

        .toggle{ margin-top:.7rem; display:inline-flex; align-items:center; gap:.45rem }
        .toggle:before{
          content:""; width:10px; height:10px; border-radius:999px; background: rgba(20,247,255,.4);
          box-shadow: 0 0 10px rgba(20,247,255,.6); transition: transform .25s ease;
        }
        .bioOpen + .toggle:before{ transform: scale(1.15) }
      `}</style>

      <div className="wrap">
        <div className="bg" aria-hidden />
        <div className="aurora" aria-hidden />
        <div className="grid" aria-hidden />
        <div className="particles" aria-hidden />

        <div className="head">
          <div style={{ display: "flex", alignItems: "flex-end", gap: ".7rem" }}>
            <h2 className="title">{data.sectionTitle}</h2>
            <span className="underline" aria-hidden />
          </div>
          <div className="actions">
            <button className={`btn ${allOpen ? "btn-primary" : ""}`} onClick={() => setAll(!allOpen)}>
              {allOpen ? "Collapse all" : "Expand all"}
            </button>
          </div>
        </div>

        <div className="gridCards">
          {/* Head of Department */}
          <article className="card">
            <div className="inner">
              <div className="badge">{data.head.badge}</div>
              <div className="photoWrap">
                <div className="photo">
                  <img src={data.head.img} alt={data.head.name} className="img" />
                  <span className="ring" aria-hidden />
                </div>
                <div className="content">
                  <h3 className="name">{data.head.name}</h3>
                  <div className="role">{data.head.role}</div>

                  <div className={`bioWrap ${open.head ? "bioOpen" : ""}`}>
                    <p className="bio" style={{ maxHeight: open.head ? "1000px" : "9.5rem" }}>
                      {data.head.bio}
                    </p>
                    {!open.head && <span className="bioMask" aria-hidden />}
                  </div>

                  <button className="btn toggle" onClick={() => toggle("head")}>
                    {open.head ? "Show less" : "Read more"}
                  </button>
                </div>
              </div>
            </div>
          </article>

          {/* Faculty In‑Charge */}
          <article className="card">
            <div className="inner">
              <div className="badge">{data.fic.badge}</div>
              <div className="photoWrap">
                <div className="photo">
                  <img src={data.fic.img} alt={data.fic.name} className="img" />
                  <span className="ring" aria-hidden />
                </div>
                <div className="content">
                  <h3 className="name">{data.fic.name}</h3>
                  <div className="role">{data.fic.role}</div>

                  <div className={`bioWrap ${open.fic ? "bioOpen" : ""}`}>
                    <p className="bio" style={{ maxHeight: open.fic ? "1500px" : "9.5rem" }}>
                      {data.fic.bio}
                    </p>
                    {!open.fic && <span className="bioMask" aria-hidden />}
                  </div>

                  <button className="btn toggle" onClick={() => toggle("fic")}>
                    {open.fic ? "Show less" : "Read more"}
                  </button>
                </div>
              </div>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
