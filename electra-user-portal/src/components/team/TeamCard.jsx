"use client";

import { useState } from "react";
import { CldImage } from "next-cloudinary";
import { FaInstagram, FaLinkedinIn, FaFacebookF } from "react-icons/fa";

export default function TeamCard({ ele }) {
  const [hover, setHover] = useState(false);

  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className="
        relative w-full max-w-[360px]
        rounded-2xl bg-black
        border border-white/10
        overflow-hidden
        transition
        hover:border-cyan-400/30
      "
    >
      {/* subtle glow */}
      <span
        aria-hidden
        className={`
          pointer-events-none absolute inset-0
          transition-opacity duration-300
          ${hover ? "opacity-100" : "opacity-0"}
          bg-[radial-gradient(60%_40%_at_50%_0%,rgba(20,247,255,.12),transparent_70%)]
        `}
      />

      {/* ROLE */}
      <div className="relative z-10 px-4 pt-4 pb-2 text-center">
        <p className="text-xs tracking-[0.3em] uppercase text-cyan-400/80">
          {ele.position}
        </p>
      </div>

      {/* IMAGE */}
      <div className="relative z-10 px-4">
        <div className="rounded-xl overflow-hidden bg-[#0b1220]">
          {ele.publicId ? (
            <CldImage
              src={ele.publicId}
              width="600"
              height="600"
              crop="fit"
              quality="auto"
              format="auto"
              alt={ele.name}
              className="
                w-full h-[320px]
                object-contain
                transition-transform duration-300
                group-hover:scale-[1.02]
              "
            />
          ) : (
            <div className="h-[320px] grid place-items-center text-slate-500">
              No image
            </div>
          )}
        </div>
      </div>

      {/* NAME */}
      <div className="relative z-10 px-4 pt-4 pb-2 text-center">
        <h3 className="text-white text-lg font-semibold tracking-tight">
          {ele.name}
        </h3>
      </div>

      {/* SOCIALS */}
      {(ele.insta || ele.linkedin || ele.linkdin || ele.fb) && (
        <div
          className={`
            relative z-10
            flex justify-center gap-5
            pb-4
            transition-all duration-300
            ${hover ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"}
          `}
        >
          {ele.insta && (
            <a
              href={ele.insta}
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram"
              className="text-slate-400 hover:text-white transition"
            >
              <FaInstagram size={18} />
            </a>
          )}

          {(ele.linkedin || ele.linkdin) && (
            <a
              href={ele.linkedin || ele.linkdin}
              target="_blank"
              rel="noreferrer"
              aria-label="LinkedIn"
              className="text-slate-400 hover:text-white transition"
            >
              <FaLinkedinIn size={18} />
            </a>
          )}

          {ele.fb && (
            <a
              href={ele.fb}
              target="_blank"
              rel="noreferrer"
              aria-label="Facebook"
              className="text-slate-400 hover:text-white transition"
            >
              <FaFacebookF size={18} />
            </a>
          )}
        </div>
      )}
    </div>
  );
}
