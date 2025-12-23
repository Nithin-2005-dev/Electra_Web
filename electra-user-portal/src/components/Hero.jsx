"use client";

import { useEffect, useRef } from "react";

export default function Hero() {
  const videoRef = useRef(null);

  useEffect(() => {
    const v = videoRef.current;
    if (v) v.play().catch(() => {});
  }, []);

  return (
    <section className="hero">
      {/* VIDEO */}
      <video
        ref={videoRef}
        src="/merch-drop.mp4"
        muted
        autoPlay
        loop
        playsInline
        className="video"
      />

      {/* AMBIENT LIGHT */}
      <div className="glow" />

      {/* OVERLAY */}
      <div className="overlay" />

      {/* GRAIN */}
      <div className="grain" />

      {/* CONTENT */}
      <div className="content">
        <span className="pill">ELECTRA SOCIETY</span>

        <h1 className="headline">
          Powering <span>Innovation</span>
          <br />
          Through <span>Engineering</span>
        </h1>

        <p>
          Official society of the Electrical Engineering Department,
          <br />
          NIT Silchar — where ideas become impact.
        </p>

        <div className="actions">
          <button className="primary">Explore Events</button>
          <button className="secondary">Join Electra</button>
        </div>
      </div>

      <style jsx>{`
        .hero {
          position: relative;
          min-height: 100vh;
          background: #000;
          overflow: hidden;
          display: flex;
          align-items: center;
          padding: 0 6vw;
        }

        /* VIDEO */
        .video {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          z-index: 0;
          filter: saturate(0.9) contrast(1.05);
        }

        /* MOVING GLOW (Framer-style) */
        .glow {
          position: absolute;
          width: 1200px;
          height: 1200px;
          background: radial-gradient(
            circle,
            rgba(20, 247, 255, 0.12),
            transparent 60%
          );
          top: -30%;
          left: -20%;
          animation: drift 16s ease-in-out infinite alternate;
          filter: blur(140px);
          z-index: 1;
        }

        @keyframes drift {
          0% {
            transform: translate(0, 0);
          }
          100% {
            transform: translate(25%, 20%);
          }
        }

        /* DARK OVERLAY */
        .overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            180deg,
            rgba(0, 0, 0, 0.55),
            rgba(0, 0, 0, 0.9)
          );
          z-index: 2;
        }

        /* FILM GRAIN */
        .grain {
          position: absolute;
          inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.03'/%3E%3C/svg%3E");
          pointer-events: none;
          z-index: 3;
        }

        /* CONTENT */
        .content {
          position: relative;
          z-index: 4;
          max-width: 820px;
          color: #fff;
          animation: fadeUp 1.1s ease-out both;
        }

        @keyframes fadeUp {
          from {
            opacity: 0;
            transform: translateY(26px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .pill {
          display: inline-block;
          margin-bottom: 1.1rem;
          padding: 0.45rem 0.95rem;
          font-size: 0.7rem;
          letter-spacing: 0.18em;
          border-radius: 999px;
          color: #7df9ff;
          border: 1px solid rgba(125, 249, 255, 0.35);
        }

        h1 {
          font-size: clamp(2.8rem, 6vw, 4.6rem);
          font-weight: 900;
          line-height: 1.05;
          letter-spacing: -0.04em;
          margin-bottom: 1.6rem;
        }

        h1 span {
          background: linear-gradient(90deg, #14f7ff, #00b8d9);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
        }

        p {
          font-size: 1.05rem;
          line-height: 1.6;
          color: #cfd8df;
          margin-bottom: 2.4rem;
        }

        .actions {
          display: flex;
          gap: 1.2rem;
          flex-wrap: wrap;
        }

        button {
          padding: 0.9rem 1.6rem;
          border-radius: 999px;
          font-size: 0.75rem;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .primary {
          background: #fff;
          color: #000;
          border: none;
        }

        .primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 30px rgba(0, 0, 0, 0.45);
        }

        .secondary {
          background: transparent;
          color: #fff;
          border: 1px solid rgba(255, 255, 255, 0.35);
        }

        .secondary:hover {
          border-color: #7df9ff;
          color: #7df9ff;
        }

        @media (prefers-reduced-motion: reduce) {
          .glow,
          .grain,
          .content {
            animation: none;
          }
        }
      `}</style>
    </section>
  );
}
