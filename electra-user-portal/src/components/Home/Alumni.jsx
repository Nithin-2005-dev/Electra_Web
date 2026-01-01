"use client";

import React, { useEffect, useRef } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { CldImage } from "next-cloudinary";
import { alumni } from "../../app/utils/alumni";

export default function AlumniEmbla() {
  const autoplayRef = useRef(
    Autoplay({
      delay: 3200,
      stopOnInteraction: false,
      stopOnMouseEnter: true,
    })
  );

  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      loop: true,
      align: "start",
      containScroll: "trimSnaps",
    },
    [autoplayRef.current]
  );

  useEffect(() => {
    if (!emblaApi) return;
    const reset = () => autoplayRef.current.reset();
    emblaApi.on("pointerUp", reset);
    emblaApi.on("select", reset);
    emblaApi.on("reInit", reset);
    return () => {
      emblaApi.off("pointerUp", reset);
      emblaApi.off("select", reset);
      emblaApi.off("reInit", reset);
    };
  }, [emblaApi]);

  return (
    <section className="alumni-section">
      <div className="container">
        {/* ===== AluminuHeader ===== */}
        <div className="AluminuHeader">
          <span className="eyebrow">ALUMNI</span>
          <h2 className="title">
            Our{" "}
            <span className="">
              Alumni
            </span>
          </h2>
          <p className="subtitle">
            Shaping industries, advancing research, and mentoring the next generation.
          </p>
        </div>

        {/* ===== CAROUSEL ===== */}
        <div className="embla">
          <div className="embla__viewport" ref={emblaRef}>
            <div className="embla__container">
              {alumni.map((alum, i) => (
                <div className="embla__slide" key={i}>
                  <article className="alumni-card">
                    <div className="image-frame">
                      <CldImage
                        fill
                        src={alum.imagePublicId}
                        alt={alum.name}
                        className="image"
                        quality="auto"
                        format="auto"
                        draggable={false}
                      />
                      <div className="image-fade" />
                    </div>

                    <div className="card-body">
                      <h3>{alum.name}</h3>
                      <p>{alum.jobTitle}</p>
                    </div>
                  </article>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ===== STYLES ===== */}
      <style jsx global>{`
        .alumni-section {
          background: #000;
          padding: 7rem 0 6.5rem;
        }

        .container {
          max-width: 1150px;
          margin: 0 auto;
          padding: 0 6vw;
        }

        /* ===== AluminuHeader ===== */
        .AluminuHeader {
          margin-bottom: 3.5rem;
          max-width: 720px;
        }

        .eyebrow {
          display: block;
          font-size: 0.72rem;
          letter-spacing: 0.28em;
          color: #9aa4b2;
          margin-bottom: 0.6rem;
        }

        .title {
          font-size: clamp(2.6rem, 5vw, 3.9rem);
          font-weight: 900;
          letter-spacing: -0.03em;
          color: #f9fbff;
          margin-bottom: 1rem;
        }

        .accent {
          background: linear-gradient(
            180deg,
            #9ee7ff 0%,
            #6fd3ff 100%
          );
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .subtitle {
          font-size: 1.05rem;
          color: #a8b3c2;
          line-height: 1.6;
        }

        /* ===== EMBLA ===== */
        .embla__viewport {
          overflow: hidden;
          width: 100%;
          cursor: grab;
          touch-action: pan-y pinch-zoom;
        }

        .embla__container {
          display: flex;
          gap: 20px;
        }

        .embla__slide {
          flex: 0 0 100%;
        }

        @media (min-width: 640px) {
          .embla__slide {
            flex: 0 0 50%;
          }
        }

        @media (min-width: 1024px) {
          .embla__slide {
            flex: 0 0 33.3333%;
          }
        }

        /* ===== CARD ===== */
        .alumni-card {
          background: linear-gradient(
            180deg,
            rgba(16, 16, 16, 0.95),
            rgba(6, 6, 6, 0.9)
          );
          border-radius: 22px;
          overflow: hidden;
          border: 1px solid rgba(255, 255, 255, 0.06);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.6);
          transition: transform 0.35s ease, box-shadow 0.35s ease;
        }

        .alumni-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 30px 70px rgba(0, 0, 0, 0.75);
        }

        .image-frame {
          position: relative;
          height: 280px;
          background: radial-gradient(
            120% 120% at 50% 0%,
            rgba(30, 30, 30, 0.9),
            #000 70%
          );
          overflow: hidden;
        }

        .image {
          object-fit: contain;
          padding: 12px;
          transition: transform 0.6s ease;
        }

        .alumni-card:hover .image {
          transform: scale(1.03);
        }

        .image-fade {
          position: absolute;
          inset: auto 0 0 0;
          height: 70px;
          background: linear-gradient(to bottom, transparent, #000);
          pointer-events: none;
        }

        .card-body {
          padding: 1.6rem 1.6rem 2rem;
          text-align: center;
        }

        .card-body h3 {
          font-size: 1.2rem;
          font-weight: 800;
          color: #fff;
          margin-bottom: 0.4rem;
        }

        .card-body p {
          font-size: 0.95rem;
          color: #a8c7d6;
          line-height: 1.4;
        }
      `}</style>
    </section>
  );
}
