export default function LoadingScreen({ overlay, text }) {
  return (
    <main className={overlay ? "checkout-loading" : "loading"}>
      <div className="loader-wrap">
        <span className="spinner" />
        <p className="label">{text || "Loading product…"}</p>
      </div>

      <style jsx>{`
        /* BASE */
        .loading,
        .checkout-loading {
          min-height: 100vh;
          display: grid;
          place-items: center;
          background: radial-gradient(
            120% 80% at 50% 0%,
            #0b0f15,
            #000
          );
          color: #9ca3af;
          z-index: ${overlay ? 100 : "auto"};
        }

        .checkout-loading {
          position: fixed;
          inset: 0;
          backdrop-filter: blur(6px);
        }

        /* WRAPPER */
        .loader-wrap {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.9rem;
          animation: fadeIn 0.4s ease-out forwards;
        }

        /* SPINNER */
        .spinner {
          width: 42px;
          height: 42px;
          border-radius: 50%;
          border: 3px solid rgba(255,255,255,0.12);
          border-top-color: #22d3ee;
          animation: spin 0.85s linear infinite;
        }

        /* TEXT */
        .label {
          font-size: 0.8rem;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: #9ca3af;
        }

        /* ANIMATIONS */
        @keyframes spin {
          to {
            transform: rotate(360deg);
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
      `}</style>
    </main>
  );
}
