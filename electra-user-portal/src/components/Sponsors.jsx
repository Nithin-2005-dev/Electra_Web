"use client";

import React from "react";
import { CldImage } from "next-cloudinary";
import { sponsors } from "../app/utils/sponsers";

export default function SponsorsSection() {
  return (
    <section className="relative py-16 overflow-hidden" id="sponsors">
      <div className="max-w-[1150px] mx-auto relative z-10 px-[min(6vw,24px)]">
        <div className="text-center mb-12">
          <h2 className="text-[#e7faff] text-3xl md:text-4xl font-extrabold tracking-wide uppercase drop-shadow-[0_0_20px_rgba(20,247,255,.4)]">
            Our Sponsors
          </h2>
          <p className="text-slate-400 mt-2 text-sm md:text-base">
            Empowering innovation through their unwavering support.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-10">
          {sponsors.length === 0 ? (
            <div className="text-center text-slate-400 py-8">
              Sponsorship details coming soon…
            </div>
          ) : (
            sponsors.map((s, i) => (
              <a
                key={`${s.name}-${i}`}
                href={s.link || "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="relative flex flex-col items-center rounded-[32px] border border-cyan-400/25 bg-transparent p-8 backdrop-blur-md shadow-[0_0_36px_rgba(20,247,255,.12)] hover:shadow-[0_0_50px_rgba(20,247,255,.25)] transition transform hover:scale-105"
              >
                <div className="relative w-[100px] h-[100px] rounded-md overflow-hidden border border-cyan-400/40 shadow-[0_0_25px_rgba(20,247,255,.35)]">
                  <CldImage
                    fill
                    alt={s.name}
                    src={s.logoPublicId}
                    className="object-contain p-4"
                    sizes="(max-width:768px) 40vw, 15vw"
                    format="auto"
                    quality="auto"
                  />
                </div>

                <h3 className="mt-6 text-[#eaf6ff] text-lg font-bold tracking-wide text-center">
                  {s.name}
                </h3>
                <p className="text-slate-400 text-xs mt-1 text-center flex flex-col items-center">
                  <span>{s.event}</span>
                  <span>{s.year}</span>
                </p>
              </a>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
