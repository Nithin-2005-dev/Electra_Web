"use client";

export default function Hero() {
  return (
    <section className="hero">
      {/* BACKGROUND VIDEO */}
      <video
        className="video"
        src="/merch-drop.mp4"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
      />

      {/* OVERLAY */}
      <div className="overlay" />

      {/* CONTENT */}
      <div className="content">
        <h1>
          <span className="script">Electra</span>
          <span className="block">SOCIETY</span>
        </h1>

        <p className="subtitle">
          Official society of the Electrical Engineering Department.
          <br />
          NIT Silchar — where ideas become impact.
        </p>

        <div className="actions">
          <button className="primary">Explore events</button>
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
          justify-content: center;
        }

        /* VIDEO (lowest layer) */
        .video {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          z-index: 0;
          filter: brightness(0.7) contrast(1.05);
        }

        /* DARK OVERLAY */
        .overlay {
          position: absolute;
          inset: 0;
          background: radial-gradient(
              1200px 600px at 60% 20%,
              rgba(255, 255, 255, 0.12),
              transparent 60%
            ),
            linear-gradient(
              180deg,
              rgba(0, 0, 0, 0.35),
              rgba(0, 0, 0, 0.9)
            );
          z-index: 1;
          pointer-events: none;
        }

        /* CONTENT */
        .content {
          position: relative;
          z-index: 2;
          text-align: center;
          max-width: 1100px;
          padding: 0 20px;
          color: #fff;
        }

        h1 {
          margin: 0;
          line-height: 1;
        }

        /* SCRIPT WORD */
        .script {
          display: block;
          font-family: "Playfair Display", serif;
          font-style: italic;
          font-weight: 400;
          font-size: clamp(5.2rem, 10vw, 7.4rem);
          line-height: 1;
          transform: translateY(0.6rem);
          position: relative;
          z-index: 2;
        }

        /* MASSIVE WORD */
        .block {
          display: block;
          font-family: "Inter", system-ui, sans-serif;
          font-weight: 900;
          letter-spacing: -0.04em;
          font-size: clamp(6rem, 13vw, 9.5rem);
          line-height: 1;
          position: relative;
          z-index: 1;
        }

        .subtitle {
          margin-top: 2.2rem;
          font-size: 1.15rem;
          line-height: 1.6;
          color: rgba(255, 255, 255, 0.65);
        }

        .actions {
          margin-top: 3rem;
          display: flex;
          gap: 1rem;
          justify-content: center;
          flex-wrap: wrap;
        }

        button {
          border-radius: 999px;
          padding: 0.9rem 1.8rem;
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
          transform: translateY(-1px);
        }

        .secondary {
          background: transparent;
          color: #fff;
          border: 1px solid rgba(255, 255, 255, 0.25);
        }

        .secondary:hover {
          border-color: rgba(255, 255, 255, 0.6);
        }

        @media (max-width: 768px) {
          .block {
            font-size: clamp(4.8rem, 16vw, 6.8rem);
          }
        }
      `}</style>
    </section>
  );
}
