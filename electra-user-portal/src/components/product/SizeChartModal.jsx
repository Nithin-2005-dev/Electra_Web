import { useEffect, useState } from "react";

export default function SizeChartModal({ image, onClose }) {
  const [loading, setLoading] = useState(!!image);
  const [error, setError] = useState(false);

  useEffect(() => {
    setLoading(!!image);
    setError(false);
  }, [image]);

  return (
    <div className="modal" onClick={onClose}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <button className="close" onClick={onClose}>
          ✕
        </button>

        {!image && (
          <div className="unavailable">
            Size chart is unavailable for this product.
          </div>
        )}

        {image && (
          <>
            {loading && (
              <div className="loader">
                <span className="spinner" />
                Loading size chart…
              </div>
            )}
            {!error && (
              <img
                src={image}
                alt="Size chart"
                onLoad={() => setLoading(false)}
                onError={() => {
                  setLoading(false);
                  setError(true);
                }}
                style={{ display: loading ? "none" : "block" }}
              />
            )}
            {error && (
              <div className="unavailable">
                Size chart is unavailable for this product.
              </div>
            )}
          </>
        )}
      </div>

      <style jsx>{`
        .modal {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.7);
          display: grid;
          place-items: center;
          z-index: 9999;
        }

        .modal-box {
          position: relative;
          background: #0b0b0b;
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 16px;
          padding: 1.5rem;
          max-width: min(90vw, 720px);
        }

        .close {
          position: absolute;
          top: 10px;
          right: 12px;
          background: transparent;
          color: #fff;
          border: none;
          font-size: 1.1rem;
          cursor: pointer;
        }

        img {
          max-width: 100%;
          height: auto;
          display: block;
          border-radius: 10px;
        }

        .loader {
          display: inline-flex;
          align-items: center;
          gap: 0.6rem;
          padding: 0.6rem 0.9rem;
          border-radius: 999px;
          border: 1px solid rgba(255, 255, 255, 0.12);
          background: rgba(255, 255, 255, 0.04);
          color: #e5e7eb;
          font-size: 0.85rem;
          margin: 0.5rem 0 0.8rem;
        }

        .spinner {
          width: 14px;
          height: 14px;
          border-radius: 999px;
          border: 2px solid rgba(255, 255, 255, 0.2);
          border-top-color: #22d3ee;
          animation: spin 0.8s linear infinite;
        }

        .unavailable {
          color: #fca5a5;
          background: rgba(248, 113, 113, 0.08);
          border: 1px solid rgba(248, 113, 113, 0.3);
          padding: 0.8rem 1rem;
          border-radius: 12px;
          font-size: 0.9rem;
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
}
