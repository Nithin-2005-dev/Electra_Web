"use client";

export default function Loading() {
  return (
    <div
      id="electra-loading-overlay"
      className="em-overlay"
      role="status"
      aria-live="polite"
      aria-label="Electra is loading"
    >
      <style jsx global>{`
        html,
        body,
        #__next,
        #root {
          min-height: 100%;
          height: auto;
        }
      `}</style>

      <style jsx>{`
        :root {
          --c1: #14f7ff;
          --c2: #00b8d9;
          --panel: #0b1420;
        }

        /* Main overlay now in normal flow */
        .em-overlay {
          position: relative; /* Changed from fixed → relative */
          width: 100%;
          min-height: 100vh; /* Full screen height but in flow */
          display: grid;
          place-items: center;
          background: var(--panel);
          overflow: hidden;
          z-index: 10;
          pointer-events: none;
        }

        .stage {
          position: relative;
          width: clamp(160px, 28vw, 360px);
          aspect-ratio: 1;
          filter: drop-shadow(0 0 22px rgba(20, 247, 255, 0.35));
          z-index: 2;
        }

        .halo {
          position: absolute;
          inset: -18%;
          border-radius: 50%;
          background: radial-gradient(
              45% 45% at 50% 50%,
              rgba(20, 247, 255, 0.14),
              transparent 60%
            ),
            radial-gradient(
              70% 70% at 50% 70%,
              rgba(0, 184, 217, 0.1),
              transparent 70%
            );
          filter: blur(28px);
          animation: haloPulse 3.6s ease-in-out infinite;
          pointer-events: none;
        }

        .stator {
          position: absolute;
          inset: 0;
          border-radius: 50%;
          background: radial-gradient(
              closest-side,
              rgba(20, 247, 255, 0.18),
              transparent 68%
            ),
            conic-gradient(
              from 0deg,
              rgba(20, 247, 255, 0.22) 0 20deg,
              transparent 20deg 40deg,
              rgba(0, 184, 217, 0.22) 40deg 60deg,
              transparent 60deg 80deg,
              rgba(20, 247, 255, 0.22) 80deg 100deg,
              transparent 100deg 120deg,
              rgba(0, 184, 217, 0.22) 120deg 140deg,
              transparent 140deg 160deg,
              rgba(20, 247, 255, 0.22) 160deg 180deg,
              transparent 180deg 200deg,
              rgba(0, 184, 217, 0.22) 200deg 220deg,
              transparent 220deg 240deg,
              rgba(20, 247, 255, 0.22) 240deg 260deg,
              transparent 260deg 280deg,
              rgba(0, 184, 217, 0.22) 280deg 300deg,
              transparent 300deg 320deg,
              rgba(20, 247, 255, 0.22) 320deg 340deg,
              transparent 340deg 360deg
            );
          mask: radial-gradient(farthest-side, transparent 48%, #000 49%);
          animation: ripple 2.6s ease-in-out infinite;
        }

        .plasma {
          position: absolute;
          inset: 8%;
          border-radius: 50%;
          background: conic-gradient(
            from 0deg,
            rgba(20, 247, 255, 0) 0 20%,
            rgba(20, 247, 255, 0.25) 21% 23%,
            rgba(0, 184, 217, 0.18) 24% 26%,
            rgba(20, 247, 255, 0) 27% 100%
          );
          filter: blur(8px);
          animation: slowSpin 6s linear infinite reverse;
          opacity: 0.85;
          pointer-events: none;
        }

        .dots,
        .dots2 {
          position: absolute;
          inset: 0;
          border-radius: 50%;
          background: radial-gradient(
              2px 2px at 20% 30%,
              rgba(255, 255, 255, 0.35),
              transparent 60%
            ),
            radial-gradient(
              2px 2px at 70% 60%,
              rgba(255, 255, 255, 0.25),
              transparent 60%
            ),
            radial-gradient(
              2px 2px at 45% 80%,
              rgba(255, 255, 255, 0.2),
              transparent 60%
            ),
            radial-gradient(
              2px 2px at 85% 25%,
              rgba(255, 255, 255, 0.25),
              transparent 60%
            );
          mask: radial-gradient(farthest-side, transparent 30%, #000 31%);
          opacity: 0.25;
          animation: drift 7s ease-in-out infinite alternate;
          pointer-events: none;
        }

        .dots2 {
          animation-duration: 9s;
          opacity: 0.18;
        }

        .rotor {
          position: absolute;
          inset: 0;
          margin: auto;
          width: 56%;
          height: 56%;
          border-radius: 50%;
          background: radial-gradient(
              75% 75% at 50% 40%,
              rgba(255, 255, 255, 0.14),
              rgba(20, 247, 255, 0.18) 58%,
              var(--panel) 92%
            ),
            radial-gradient(
              60% 60% at 50% 70%,
              rgba(0, 184, 217, 0.12),
              transparent 70%
            );
          border: 1px solid rgba(141, 255, 255, 0.4);
          box-shadow: inset 0 0 32px rgba(0, 255, 255, 0.18);
          animation: spinup 1.1s cubic-bezier(0.65, 0, 0.35, 1) 0s 1,
            spin 1.05s linear infinite 1.1s;
        }

        .teeth {
          position: absolute;
          inset: 0;
          border-radius: 50%;
          background: conic-gradient(
            from 0deg,
            rgba(255, 255, 255, 0.24) 0 6deg,
            transparent 6deg 12deg
          );
          mask: radial-gradient(farthest-side, transparent 38%, #000 39%);
          animation: spin 1.05s linear infinite 1.1s;
        }

        .arc,
        .arcAfter {
          position: absolute;
          inset: 0;
          border-radius: 50%;
          mask: radial-gradient(farthest-side, transparent 62%, #000 63%);
          opacity: 0;
        }

        .arc {
          background: conic-gradient(
            from 90deg,
            transparent 0 78%,
            var(--c1) 78% 82%,
            transparent 82% 100%
          );
          filter: blur(1px);
          animation: arcFlash 1.2s ease-out 180ms 1,
            arcPulse 3.2s ease-in-out 1.6s infinite;
        }

        .arcAfter {
          background: conic-gradient(
            from 90deg,
            transparent 0 78%,
            rgba(20, 247, 255, 0.28) 78% 82%,
            transparent 82% 100%
          );
          filter: blur(6px);
          animation: arcAfter 1.4s ease-out 240ms 1,
            arcPulseSoft 4.2s ease-in-out 1.8s infinite;
        }

        .orbit {
          position: absolute;
          inset: 0;
          border-radius: 50%;
          pointer-events: none;
        }

        .orbit .e {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: radial-gradient(circle, #fff 0 40%, var(--c1) 60%, transparent 100%);
          box-shadow: 0 0 10px var(--c1), 0 0 18px var(--c2);
          transform: translate(-50%, -50%) rotate(0deg) translateX(var(--r));
        }

        .o1 {
          animation: orbit 3.6s linear infinite;
        }
        .o1 .e {
          --r: 34%;
        }
        .o2 {
          animation: orbit 5.2s linear infinite reverse;
        }
        .o2 .e {
          --r: 44%;
        }
        .o3 {
          animation: orbit 7.3s linear infinite;
        }
        .o3 .e {
          --r: 52%;
        }

        .brand {
          margin-top: clamp(10px, 2.2vh, 18px);
          text-align: center;
          font-weight: 900;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          font-size: clamp(12px, 1.9vw, 14px);
          background: linear-gradient(90deg, #a6faff, #eaffff, #a6faff);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          background-size: 200% 100%;
          animation: shine 2.6s ease-in-out infinite;
          text-shadow: 0 0 18px rgba(20, 247, 255, 0.35);
          z-index: 2;
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }
        @keyframes slowSpin {
          to {
            transform: rotate(360deg);
          }
        }
        @keyframes spinup {
          0% {
            transform: scale(0.84) rotate(0deg);
          }
          100% {
            transform: scale(1) rotate(360deg);
          }
        }
        @keyframes ripple {
          0%,
          100% {
            opacity: 0.55;
          }
          50% {
            opacity: 0.92;
          }
        }
        @keyframes haloPulse {
          0%,
          100% {
            opacity: 0.18;
            transform: scale(1);
          }
          50% {
            opacity: 0.28;
            transform: scale(1.04);
          }
        }
        @keyframes drift {
          0% {
            transform: rotate(0deg) scale(1);
          }
          100% {
            transform: rotate(12deg) scale(1.04);
          }
        }
        @keyframes arcFlash {
          0% {
            opacity: 0;
          }
          22% {
            opacity: 1;
          }
          100% {
            opacity: 0;
          }
        }
        @keyframes arcAfter {
          0% {
            opacity: 0;
          }
          26% {
            opacity: 0.7;
          }
          100% {
            opacity: 0;
          }
        }
        @keyframes arcPulse {
          0%,
          100% {
            opacity: 0.14;
          }
          50% {
            opacity: 0.3;
          }
        }
        @keyframes arcPulseSoft {
          0%,
          100% {
            opacity: 0.08;
          }
          50% {
            opacity: 0.18;
          }
        }
        @keyframes orbit {
          to {
            transform: rotate(360deg);
          }
        }
        @keyframes shine {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .halo,
          .stator,
          .plasma,
          .dots,
          .dots2,
          .rotor,
          .teeth,
          .arc,
          .arcAfter,
          .orbit,
          .brand {
            animation: none !important;
          }
        }
      `}</style>

      <div>
        <div className="stage" aria-hidden>
          <span className="halo" />
          <span className="stator" />
          <span className="plasma" />
          <span className="dots" />
          <span className="dots2" />
          <span className="rotor" />
          <span className="teeth" />
          <span className="arc" />
          <span className="arcAfter" />
          <span className="orbit o1">
            <span className="e" />
          </span>
          <span className="orbit o2">
            <span className="e" />
          </span>
          <span className="orbit o3">
            <span className="e" />
          </span>
        </div>
        <div className="brand">Electra • Loading</div>
      </div>
    </div>
  );
}
