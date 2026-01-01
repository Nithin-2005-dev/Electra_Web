"use client";

import { useContext, useMemo } from "react";
import { ImageProvider } from "../../app/store/ImageStore";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade, Keyboard } from "swiper/modules";
import { CldImage } from "next-cloudinary";

import "swiper/css";
import "swiper/css/effect-fade";

export default function GalleryHeroSlider() {
  const { imgs } = useContext(ImageProvider);

  /**
   * HERO SLIDE SELECTION STRATEGY
   * - Ensure visual diversity
   * - Max 2 images per category
   * - Cap total slides to 8
   * - Safe on first render
   */
  const slides = useMemo(() => {
    if (!Array.isArray(imgs)) return [];

    // Group by category (fallback prevents undefined bucket)
    const grouped = imgs.reduce((acc, img) => {
      if (!img?.publicId) return acc;
      const key = img.category || "other";
      if (!acc[key]) acc[key] = [];
      acc[key].push(img);
      return acc;
    }, {});

    // Take up to 2 from each category
    const diversified = Object.values(grouped).flatMap((group) =>
      group.slice(0, 2)
    );

    // Final hero cap
    return diversified.slice(0, 8);
  }, [imgs]);

  // Nothing to show → render nothing (no layout shift)
  if (!slides.length) return null;

  return (
    <section className="relative h-[90vh] w-full overflow-hidden bg-black">
      {/* subtle background wash */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0
                   bg-[radial-gradient(120%_80%_at_50%_0%,rgba(20,247,255,.10),transparent_60%)]"
      />

      <Swiper
        modules={[Autoplay, EffectFade, Keyboard]}
        effect="fade"
        fadeEffect={{ crossFade: true }}
        speed={900}
        autoplay={{
          delay: 4200,
          disableOnInteraction: false,
        }}
        keyboard={{ enabled: true }}
        slidesPerView={1}
        className="relative z-10 h-full"
      >
        {slides.map((pic, i) => (
          <SwiperSlide key={pic._id || pic.publicId}>
            <div className="relative h-full w-full flex items-center justify-center">
              {/* IMAGE */}
              <CldImage
                fill
                src={pic.publicId}
                alt={pic.category || "Electra Gallery"}
                className="object-contain"
                priority={i === 0}
                quality="auto"
                format="auto"
              />

              {/* cinematic overlay */}
              <div
                className="pointer-events-none absolute inset-0
                           bg-gradient-to-t from-black/70 via-black/20 to-black/70"
              />

              {/* caption */}
              <div className="absolute bottom-12 left-1/2 -translate-x-1/2 text-center">
                <span className="block text-xs tracking-[0.3em] text-cyan-300 uppercase mb-2">
                  Electra Society
                </span>
                <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
                  {pic.category || "Moments from Electra"}
                  {pic.year && (
                    <span className="text-white/50"> · {pic.year}</span>
                  )}
                </h2>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* bottom divider */}
      <div
        className="absolute bottom-0 inset-x-0 h-px
                   bg-gradient-to-r from-transparent via-white/20 to-transparent"
      />
    </section>
  );
}
