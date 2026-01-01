"use client";

export default function Loading() {
  return (
    <div
      className="electra-loader"
      role="status"
      aria-live="polite"
      aria-label="Electra is loading"
    >
      <div className="content">
        <h1>Electra</h1>
        <span className="line" />
        <p>Preparing the experience</p>
      </div>

      <style jsx>{`
        .electra-loader {
          position: fixed;
          inset: 0;
          z-index: 9999;
          display: grid;
          place-items: center;
          background:
            radial-gradient(
              120% 80% at 50% 0%,
              rgba(255, 255, 255, 0.06),
              transparent 60%
            ),
            #000;
        }

        .content {
          text-align: center;
          animation: fadeIn 0.8s ease forwards;
        }

        h1 {
          font-size: clamp(3.2rem, 8vw, 6rem);
          font-weight: 900;
          letter-spacing: -0.02em;
          color: #fff;
          margin: 0;
        }

        .line {
          display: block;
          width: 64px;
          height: 2px;
          margin: 18px auto 14px;
          background: linear-gradient(
            90deg,
            transparent,
            #7dd3fc,
            transparent
          );
          animation: sweep 1.6s ease-in-out infinite;
        }

        p {
          font-size: 0.85rem;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: rgba(255, 255, 255, 0.55);
        }

        @keyframes sweep {
          0% {
            opacity: 0.3;
            transform: scaleX(0.4);
          }
          50% {
            opacity: 1;
            transform: scaleX(1);
          }
          100% {
            opacity: 0.3;
            transform: scaleX(0.4);
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .line {
            animation: none;
          }
          .content {
            animation: none;
          }
        }
      `}</style>
    </div>
  );
}
