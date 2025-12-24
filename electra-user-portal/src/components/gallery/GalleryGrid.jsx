"use client";

import GalleryCard from "./GalleryCard";

export default function GalleryGrid({ images = [], filter, onOpen }) {
  // ✅ Absolute safety
  const safeImages = Array.isArray(images) ? images : [];

  const filtered =
    filter === "all"
      ? safeImages
      : safeImages.filter(
          (img) => img?.category?.toLowerCase() === filter.toLowerCase()
        );

  if (!filtered.length) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-20 text-center text-white/50">
        No images found.
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 pb-20 columns-1 sm:columns-2 lg:columns-3 gap-6 ">
      {filtered.map((img) => (
        <GalleryCard
          key={img.publicId}
          img={img}
          onOpen={onOpen}
        />
      ))}
    </div>
  );
}
