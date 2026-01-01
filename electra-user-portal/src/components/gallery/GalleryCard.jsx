"use client";

import { CldImage } from "next-cloudinary";

export default function GalleryCard({ img, onOpen }) {
  return (
    <div
      className="mb-6 break-inside-avoid cursor-zoom-in group"
      onClick={() => onOpen(img)}
    >
      <div className="rounded-xl overflow-hidden bg-black border border-white/10">
        <CldImage
          src={img.publicId}
          alt={img.category}
          width={600}
          height={800}
          className="w-full h-auto object-contain transition-transform duration-300 group-hover:scale-[1.02]"
          quality="auto"
          format="auto"
        />
      </div>
    </div>
  );
}
