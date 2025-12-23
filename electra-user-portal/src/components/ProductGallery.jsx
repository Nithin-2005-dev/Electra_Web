// components/ProductGallery.jsx
"use client";

import { useState } from "react";

export default function ProductGallery({ images = [] }) {
  const [index, setIndex] = useState(0);

  if (!images || images.length === 0) {
    return <div className="empty">No images</div>;
  }

  return (
    <div className="pg">
      <div className="mainImg" role="img" aria-label={`product image ${index + 1}`}>
        <img src={images[index]} alt={`Product image ${index + 1}`} />
      </div>

      <div className="thumbs" aria-hidden={false}>
        {images.map((src, i) => (
          <button
            key={`${src}#${i}`}
            className={`thumb ${i === index ? "active" : ""}`}
            onClick={() => setIndex(i)}
            aria-label={`show image ${i + 1}`}
          >
            <img src={src} alt={`Thumbnail ${i + 1}`} />
          </button>
        ))}
      </div>

      <style jsx>{`
        .pg {
          width: 100%;
        }

        /* main image container: keeps aspect ratio and clips overflow */
        .mainImg {
          width: 100%;
          aspect-ratio: 1 / 1.1; /* tweak for tall vs square shirts */
          border-radius: 14px;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0.01));
          box-shadow: 0 6px 28px rgba(0,0,0,0.6) inset;
        }

        .mainImg img {
          width: 100%;
          height: 100%;
          object-fit: contain; /* important — no overflow, no weird stretching */
          object-position: center;
          transition: transform 300ms ease;
          -webkit-backface-visibility: hidden;
        }

        .mainImg img:hover {
          transform: scale(1.03);
        }

        .thumbs {
          margin-top: 14px;
          display: flex;
          gap: 12px;
          align-items: center;
          flex-wrap: nowrap;
        }

        .thumb {
          width: 72px;
          height: 72px;
          padding: 6px;
          border-radius: 8px;
          background: transparent;
          border: 1px solid rgba(255,255,255,0.08);
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          justify-content: center;
        }

        .thumb img {
          max-width: 100%;
          max-height: 100%;
          object-fit: cover;
          display: block;
          border-radius: 6px;
        }

        .thumb.active {
          box-shadow: 0 0 0 3px rgba(20,200,255,0.08);
          border-color: rgba(20,200,255,0.35);
        }

        .thumb:focus {
          outline: none;
          box-shadow: 0 0 0 3px rgba(20,200,255,0.12);
        }

        @media (max-width: 900px) {
          .mainImg {
            aspect-ratio: 1 / 1.05;
          }
          .thumb {
            width: 56px;
            height: 56px;
          }
        }
      `}</style>
    </div>
  );
}
