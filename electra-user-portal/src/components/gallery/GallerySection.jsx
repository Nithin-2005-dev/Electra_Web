"use client";

import { useContext, useMemo, useState } from "react";
import { ImageProvider } from "../../app/store/ImageStore";

import GalleryHeroSlider from "./GalleryHeroSlider";
import GalleryFilters from "./GalleryFilters";
import GalleryGrid from "./GalleryGrid";
import GalleryLightbox from "./GalleryLightbox";

/* ---------------------------------------------
   Premium skeleton components
--------------------------------------------- */

function HeroSkeleton() {
  return (
    <div className="relative h-[60vh] w-full overflow-hidden bg-black">
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent animate-pulse" />
    </div>
  );
}

function FiltersSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-8 flex gap-3 flex-wrap">
      {Array.from({ length: 5 }).map((_, i) => (
        <div
          key={i}
          className="h-9 w-24 rounded-full bg-white/10 animate-pulse"
        />
      ))}
    </div>
  );
}

function GridSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-6 pb-20 columns-1 sm:columns-2 lg:columns-3 gap-6">
      {Array.from({ length: 9 }).map((_, i) => (
        <div
          key={i}
          className="mb-6 break-inside-avoid rounded-xl overflow-hidden bg-white/5 animate-pulse"
          style={{ height: `${220 + (i % 3) * 80}px` }}
        />
      ))}
    </div>
  );
}

export default function GallerySection() {
  const { imgs, loading } = useContext(ImageProvider);

  const [filter, setFilter] = useState("all");
  const [activeImage, setActiveImage] = useState(null);

  /* --------------------------------------------------
     1️⃣ Normalize data
  -------------------------------------------------- */
  const images = useMemo(() => {
    return Array.isArray(imgs) ? imgs : [];
  }, [imgs]);

  /* --------------------------------------------------
     2️⃣ Sort: Year → createdAt → uploadedAt
  -------------------------------------------------- */
  const sortedImages = useMemo(() => {
    return [...images].sort((a, b) => {
      const yearA = Number(a?.year) || 0;
      const yearB = Number(b?.year) || 0;

      if (yearA !== yearB) return yearB - yearA;

      if (a?.createdAt && b?.createdAt) {
        return new Date(b.createdAt) - new Date(a.createdAt);
      }

      if (a?.uploadedAt && b?.uploadedAt) {
        return new Date(b.uploadedAt) - new Date(a.uploadedAt);
      }

      return 0;
    });
  }, [images]);

  /* --------------------------------------------------
     3️⃣ Premium loading state
  -------------------------------------------------- */
  if (loading) {
    return (
      <>
        <HeroSkeleton />
        <FiltersSkeleton />
        <GridSkeleton />
      </>
    );
  }

  /* --------------------------------------------------
     4️⃣ Render actual content
  -------------------------------------------------- */
  return (
    <>
      <GalleryHeroSlider images={sortedImages.slice(0, 8)} />

      <GalleryFilters filter={filter} setFilter={setFilter} />

      <GalleryGrid
        images={sortedImages}
        filter={filter}
        onOpen={setActiveImage}
      />

      {activeImage && (
        <GalleryLightbox
          image={activeImage}
          onClose={() => setActiveImage(null)}
        />
      )}
    </>
  );
}
