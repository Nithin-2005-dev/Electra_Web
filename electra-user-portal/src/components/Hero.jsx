// src/components/HeroElectraExecutive.jsx
"use client";

export default function HeroElectraExecutive() {
  return (
    <section id="hero" aria-labelledby="hero-heading" className="relative">
      <style jsx>{`
        :root{
          --primary:#00B8D9; --secondary:#14F7FF;
          --textPrimary:#E0E0E0; --textMuted:#9E9E9E;
        }

        /* Container: clip both axes to prevent any scrollbars from deco layers */
        #hero{ isolation:isolate; overflow:hidden; }
        .wrap{ max-width:80rem; margin-inline:auto; padding:6.75rem 1rem 4.75rem; position:relative; }
        @media (min-width:768px){ .wrap{ padding:7.75rem 1rem 5.25rem } }

        /* Ambient glow field (kept inside hero; moved via transform only) */
        .field, .field2{
          position:absolute; inset:0; pointer-events:none; z-index:-1;
          filter:blur(22px); opacity:.45;
          background:
            radial-gradient(520px 220px at 24% 34%, rgba(20,247,255,.12), transparent 60%),
            radial-gradient(520px 220px at 76% 66%, rgba(0,184,217,.10), transparent 60%);
          transform: translate3d(0,0,0) scale(1.08);
          will-change: transform;
          animation: fieldFloat 22s ease-in-out infinite alternate;
          contain: paint; /* ensure painting is contained */
        }
        .field2{
          opacity:.28; filter:blur(28px);
          background:
            radial-gradient(520px 220px at 34% 70%, rgba(20,247,255,.09), transparent 60%),
            radial-gradient(520px 220px at 80% 28%, rgba(0,184,217,.08), transparent 60%);
          transform: translate3d(0,0,0) scale(1.1);
          animation: fieldFloat2 28s ease-in-out infinite alternate;
        }

        /* Accent cap */
        .cap{ height:.7rem; width:.25rem; border-radius:.375rem; background:var(--secondary);
          box-shadow:0 0 8px rgba(20,247,255,.6); margin-bottom:.9rem;
        }

        /* Title system */
        .title{
          margin:0; color:var(--textPrimary); font-weight:900; letter-spacing:-0.02em;
          font-size:clamp(1.45rem,3.1vw,2.25rem); line-height:1.06;
        }
        .kicker{
          display:block; color:var(--textMuted);
          font-weight:600; letter-spacing:.08em; text-transform:uppercase;
          font-size:clamp(.68rem,1.3vw,.8rem);
        }
        .headline{ display:block; margin-top:.4rem; position:relative; }

        /* Dual gradient + subtle chroma edge */
        .chromatic{
          background: linear-gradient(90deg, var(--primary), var(--secondary));
          -webkit-background-clip:text; background-clip:text; color:transparent;
          text-shadow:
            0 0 0 rgba(20,247,255,0),
            .6px 0 rgba(20,247,255,.14),
            -0.6px 0 rgba(0,184,217,.12);
          animation: chromaPulse 6s ease-in-out infinite;
        }

        /* Specular highlight sweep (kept inside headline box) */
        .specular{
          position:absolute; inset:0; pointer-events:none; mix-blend-mode:screen; overflow:hidden;
        }
        .specular:before{
          content:""; position:absolute; top:-30%; left:-25%; width:42%; height:160%;
          background: linear-gradient(112deg, rgba(255,255,255,0) 0%, rgba(255,255,255,.28) 45%, rgba(255,255,255,0) 100%);
          filter: blur(8px); transform: rotate(5deg);
          animation: specSweep 3.6s linear infinite;
        }

        .tag{
          margin-top:.8rem; color:var(--textMuted);
          max-width:48rem; font-size:clamp(.92rem,1.6vw,1.06rem); line-height:1.58;
        }

        /* Overflow-safe underline rail using a fixed-width glint */
        .rail{
          margin-top:1rem;
          position:relative;
          height:2px;
          width:min(44ch, 70vw);
          max-width:100%;
          border-radius:999px;
          background:rgba(255,255,255,.06);
          overflow:hidden; /* clip shimmer inside */
        }
        .rail::before{
          content:"";
          position:absolute; top:0; bottom:0;
          width:28%;
          left:-28%;
          background: linear-gradient(90deg, rgba(0,184,217,0), rgba(0,184,217,.5), rgba(20,247,255,.5), rgba(20,247,255,0));
          animation: glint 2.4s linear infinite;
        }

        /* Animations (transform-only so they don't affect layout size) */
        @keyframes fieldFloat{ 0%{ transform:translate3d(0,0,0) scale(1.08) } 100%{ transform:translate3d(10px,10px,0) scale(1.08) } }
        @keyframes fieldFloat2{ 0%{ transform:translate3d(0,0,0) scale(1.1) } 100%{ transform:translate3d(-10px,8px,0) scale(1.1) } }
        @keyframes chromaPulse{
          0%,100%{ filter:none }
          50%{ filter:saturate(112%) contrast(104%) drop-shadow(0 0 10px rgba(20,247,255,.28)) }
        }
        @keyframes specSweep{ 0%{ transform:translate3d(0,0,0) rotate(5deg) } 100%{ transform:translate3d(230%,0,0) rotate(5deg) } }
        @keyframes glint{ 0%{ transform: translateX(0) } 100%{ transform: translateX(460%) } }

        /* Motion preferences */
        @media (prefers-reduced-motion: reduce){
          .field,.field2{ display:none !important; }
          .specular:before,.chromatic{ animation:none !important }
          .rail::before{ animation:none !important }
        }
      `}</style>

      <div className="wrap">
        <div className="field" aria-hidden />
        <div className="field2" aria-hidden />

        <div className="cap" aria-hidden />

        <h1 id="hero-heading" className="title">
          <span className="kicker">Electra Society</span>
          <span className="headline">
            <span className="chromatic">Powering Innovation & Excellence</span>
            <span className="specular" aria-hidden />
          </span>
        </h1>

        <p className="tag">
          Official society of the Electrical Engineering Department, NIT Silchar — uniting research, projects, and events to turn ideas into engineered impact.
        </p>

        <div className="rail" aria-hidden />
      </div>
    </section>
  );
}
