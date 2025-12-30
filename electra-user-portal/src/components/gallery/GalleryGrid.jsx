"use client";

import { useEffect, useMemo, useRef } from "react";
import GalleryCard from "./GalleryCard";

/* ───────── CONFIG ───────── */
const PX_PER_SECOND_DESKTOP = 26; // premium pace
const PX_PER_SECOND_MOBILE = 18;  // slower for touch comfort

export default function GalleryGrid({ images = [], filter = "all", onOpen }) {
  const safeImages = Array.isArray(images) ? images : [];

  const filtered = useMemo(() => {
    if (filter === "all") return safeImages;
    return safeImages.filter(
      (img) => img?.category?.toLowerCase() === filter.toLowerCase()
    );
  }, [safeImages, filter]);

  const columnCount = 3;

  const columns = useMemo(() => {
    const cols = Array.from({ length: columnCount }, () => []);
    filtered.forEach((img, i) => {
      cols[i % columnCount].push(img);
    });
    return cols;
  }, [filtered]);

  if (!filtered.length) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-20 text-center text-white/50">
        No images found.
      </div>
    );
  }

  return (
    <section className="gallery-wrap">
      {columns.map((col, i) => (
        <GalleryColumn
          key={i}
          images={col}
          direction={i % 2 ? "down" : "up"}
          onOpen={onOpen}
        />
      ))}

      <style jsx>{`
        .gallery-wrap {
          max-width: 1400px;
          margin: 0 auto;
          padding: 0 1.5rem 5rem;
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.5rem;
          overflow: hidden;
        }

        @media (max-width: 1024px) {
          .gallery-wrap {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 640px) {
          .gallery-wrap {
            grid-template-columns: repeat(2, 1fr);
            gap: 1rem;
          }
        }
      `}</style>
    </section>
  );
}

/* ───────────────── COLUMN ───────────────── */

function GalleryColumn({ images, direction, onOpen }) {
  const ref = useRef(null);

  /* ───────── DYNAMIC SPEED ───────── */
  useEffect(() => {
    if (!ref.current) return;

    const isMobile = window.matchMedia("(max-width: 640px)").matches;
    const speed = isMobile
      ? PX_PER_SECOND_MOBILE
      : PX_PER_SECOND_DESKTOP;

    // total height of ONE loop (because we duplicate images)
    const totalHeight = ref.current.scrollHeight / 2;

    const duration = totalHeight / speed;

    ref.current.style.animationDuration = `${duration}s`;
  }, [images]);

  /* ───────── PAUSE CONTROL ───────── */
  const pause = () => {
    ref.current?.style.setProperty("--play-state", "paused");
  };

  const resume = () => {
    ref.current?.style.setProperty("--play-state", "running");
  };

  return (
    <div
      ref={ref}
      className={`gallery-col ${direction}`}
      onMouseEnter={pause}
      onMouseLeave={resume}
      onTouchStart={pause}
      onTouchEnd={resume}
    >
      {[...images, ...images].map((img, idx) => (
        <GalleryCard
          key={`${img.publicId}-${idx}`}
          img={img}
          onOpen={onOpen}
        />
      ))}

      <style jsx>{`
        .gallery-col {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;

          animation-timing-function: linear;
          animation-iteration-count: infinite;
          animation-play-state: var(--play-state, running);
          will-change: transform;
        }

        .gallery-col.up {
          animation-name: scrollUp;
        }

        .gallery-col.down {
          animation-name: scrollDown;
        }

        @keyframes scrollUp {
          from {
            transform: translateY(0);
          }
          to {
            transform: translateY(-50%);
          }
        }

        @keyframes scrollDown {
          from {
            transform: translateY(-50%);
          }
          to {
            transform: translateY(0);
          }
        }

        @media (max-width: 640px) {
          .gallery-col {
            gap: 1rem;
          }
        }
      `}</style>
    </div>
  );
}
