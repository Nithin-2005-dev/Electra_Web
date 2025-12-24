"use client";

import { CldImage } from "next-cloudinary";

export default function GalleryLightbox({ image, onClose }) {
  return (
    <div
      className="fixed inset-0 z-[9999] bg-black/90 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <button
        className="absolute top-6 right-6 text-white text-2xl"
        onClick={onClose}
      >
        ✕
      </button>

      <div
        className="max-w-[90vw] max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <CldImage
          src={image.publicId}
          alt={image.category}
          width={2000}
          height={1200}
          className="max-w-full max-h-[90vh] object-contain"
          quality="auto"
          format="auto"
          priority
        />
      </div>
    </div>
  );
}
