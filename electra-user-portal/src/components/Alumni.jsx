// src/components/AlumniEmbla.jsx
"use client";
import React, { useEffect, useRef } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { CldImage } from "next-cloudinary";
import { alumni } from "../app/utils/alumni";

export default function AlumniEmbla() {
  // Keep a stable autoplay instance so it can be controlled
  const autoplayRef = useRef(
    Autoplay({
      delay: 3400,
      stopOnInteraction: false,     // do NOT stop permanently on touch/click
      stopOnMouseEnter: true,       // pause on hover, resume on leave
    })
  );

  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      loop: true,
      align: "start",
      containScroll: "trimSnaps",
      slidesToScroll: 1,
    },
    [autoplayRef.current]           // official plugin pattern
  );

  useEffect(() => {
    if (!emblaApi) return;
    const onUserInteract = () => autoplayRef.current.reset(); // resume after any interaction
    emblaApi.on("pointerUp", onUserInteract);
    emblaApi.on("select", onUserInteract);
    emblaApi.on("reInit", onUserInteract);
    return () => {
      emblaApi.off("pointerUp", onUserInteract);
      emblaApi.off("select", onUserInteract);
      emblaApi.off("reInit", onUserInteract);
    };
  }, [emblaApi]);

  return (
    <section className="relative py-16 sm:py-20">
      <div className="max-w-[1150px] mx-auto px-3 sm:px-4">
        <h2 className="text-[#e7faff] text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-wide uppercase mb-10 sm:mb-14 drop-shadow-[0_0_28px_rgba(20,247,255,.5)] text-center">
          Our Alumni
        </h2>

        <div className="embla relative">
          {/* Ambient particles (pointer-events: none so touch drag reaches Embla) */}
          <div aria-hidden className="pointer-events-none absolute inset-0 z-0 magic-particles" />

          <div className="embla__viewport relative z-10" ref={emblaRef}>
            <div className="embla__container">
              {alumni.map((alum, i) => (
                <div className="embla__slide" key={i}>
                  <article className="magic-card group select-none">
                    <span aria-hidden className="magic-card__border" />
                    <span aria-hidden className="magic-card__depth" />
                    <span aria-hidden className="magic-card__bgflow" />

                    {/* Centered, padded banner with rounded frame */}
                    <div className="px-4 pt-4 sm:px-5 sm:pt-5">
                      <div className="relative w-full h-[200px] sm:h-[220px] bg-[#0f1724]/85 rounded-xl sm:rounded-2xl overflow-hidden flex items-center justify-center shadow-[0_0_22px_rgba(0,255,255,0.12)] ring-1 ring-cyan-300/15">
                        <CldImage
                          fill
                          alt={alum.name}
                          src={alum.imagePublicId}
                          className="object-contain transition-transform duration-600 ease-out group-hover:scale-[1.035]"
                          sizes="(max-width:640px) 100vw, (max-width:1024px) 50vw, 33vw"
                          quality="auto"
                          format="auto"
                          draggable={false}             // prevents browser image drag ghost
                        />
                        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-14 bg-gradient-to-b from-transparent to-[#0d1829]/80" />
                        <span aria-hidden className="magic-card__sheen" />
                      </div>
                    </div>

                    {/* Body */}
                    <div className="flex-1 flex flex-col items-center text-center px-5 sm:px-6 py-5 sm:py-6">
                      <h3 className="text-[18px] sm:text-[20px] md:text-2xl font-extrabold leading-snug bg-clip-text text-transparent bg-gradient-to-r from-cyan-100 via-cyan-200 to-sky-300 drop-shadow-[0_0_14px_rgba(0,255,255,0.22)]">
                        {alum.name}
                      </h3>
                      <p className="mt-2 text-[13px] sm:text-[15px] md:text-base text-slate-300/95 leading-snug line-clamp-3">
                        {alum.jobTitle}
                      </p>
                    </div>
                  </article>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Embla sizing + improved touch UX + magical styles */}
      <style jsx global>{`
        /* Embla: 1/2/3/4 per view, live re-measure */
        .embla { position: relative; }
        .embla__viewport {
          overflow: hidden; width: 100%;
          touch-action: pan-y pinch-zoom; /* allow horizontal drag + vertical page scroll */
          cursor: grab;
        }
        .embla__viewport.is-dragging { cursor: grabbing; }
        .embla__container {
          display: flex; gap: 16px; align-items: stretch; touch-action: manipulation;
        }
        .embla__slide { flex: 0 0 100%; min-width: 0; display: flex; }
        @media (min-width: 640px) { .embla__slide { flex: 0 0 50%; } }
        @media (min-width: 1024px) { .embla__slide { flex: 0 0 33.3333%; } }
        @media (min-width: 1440px) { .embla__slide { flex: 0 0 25%; } }

        /* Particles (non-interactive) */
        .magic-particles {
          pointer-events: none;
          background-image:
            radial-gradient(2px 2px at 8% 20%, rgba(20,247,255,0.35) 50%, transparent 51%),
            radial-gradient(2px 2px at 80% 75%, rgba(120,220,255,0.28) 50%, transparent 51%),
            radial-gradient(1.6px 1.6px at 40% 55%, rgba(180,220,255,0.22) 50%, transparent 51%),
            radial-gradient(1.8px 1.8px at 60% 30%, rgba(90,255,255,0.26) 50%, transparent 51%);
          background-repeat: no-repeat;
          animation: particles-float 9s ease-in-out infinite alternate;
          opacity: 0.28; filter: drop-shadow(0 0 6px rgba(20,247,255,0.5));
        }
        @keyframes particles-float {
          0% { transform: translateY(0px); opacity: .18; }
          100% { transform: translateY(-6px); opacity: .34; }
        }

        /* Magical card */
        .magic-card {
          position: relative; width: 100%;
          border-radius: 1.25rem; overflow: hidden;
          display: grid; grid-template-rows: auto 1fr; min-height: 360px;
          background:
            radial-gradient(800px 400px at -10% -20%, rgba(20,247,255,0.06), transparent 60%),
            radial-gradient(900px 500px at 110% 120%, rgba(80,180,255,0.06), transparent 60%),
            linear-gradient(135deg, rgba(16,22,38,0.94), rgba(13,24,41,0.64) 60%, rgba(13,24,41,0.38));
          border: 1px solid rgba(141, 255, 255, 0.22);
          box-shadow: inset 0 0 30px rgba(0,255,255,0.06), 0 12px 28px rgba(0, 0, 0, 0.45);
          transform: translateZ(0);
          transition: transform .25s ease, box-shadow .35s ease, border-color .35s ease;
        }
        .magic-card:hover {
          box-shadow: inset 0 0 40px rgba(0,255,255,0.08), 0 18px 36px rgba(0, 0, 0, 0.5);
          border-color: rgba(141, 255, 255, 0.3);
        }
        .magic-card__border {
          position: absolute; inset: -1px; border-radius: 1.3rem;
          background: conic-gradient(from 0deg, rgba(20,247,255,0.55), rgba(99,232,255,0.45), rgba(16,180,255,0.4), rgba(20,247,255,0.55));
          filter: blur(14px); opacity: 0.22; animation: border-spin 9s linear infinite;
          mask: radial-gradient(transparent 0, transparent 98%, black 99%); pointer-events: none; content: "";
        }
        .magic-card__depth {
          position: absolute; inset: 60% -15% -20% -15%;
          background: radial-gradient(60% 100% at 50% 0%, rgba(20,247,255,0.22), transparent 70%);
          filter: blur(22px); opacity: 0.35; pointer-events: none; content: "";
        }
        .magic-card__bgflow {
          position: absolute; inset: 0; pointer-events: none; z-index: 0; opacity: .18;
          background: radial-gradient(60% 80% at 30% 0%, rgba(98,255,248,0.25), transparent 60%), radial-gradient(50% 80% at 80% 120%, rgba(118,175,255,0.18), transparent 60%);
          animation: drift 14s ease-in-out infinite alternate; content: "";
        }
        .magic-card__sheen {
          position: absolute; top: 0; bottom: 0; left: -40%; width: 36%;
          background: linear-gradient(100deg, transparent 0%, rgba(255,255,255,0.18) 45%, transparent 90%);
          transform: skewX(-12deg); filter: blur(2px); opacity: 0; animation: none; content: "";
        }
        .magic-card:hover .magic-card__sheen { animation: sheen 1100ms ease-out forwards; }

        @keyframes border-spin { to { transform: rotate(360deg); } }
        @keyframes drift { 0% { transform: translate3d(-2%, 0, 0) scale(1); } 100% { transform: translate3d(2%, -1%, 0) scale(1.02); } }
        @keyframes sheen { 0% { left: -40%; opacity: 0; } 20% { opacity: .55; } 100% { left: 110%; opacity: 0; } }
      `}</style>
    </section>
  );
}
