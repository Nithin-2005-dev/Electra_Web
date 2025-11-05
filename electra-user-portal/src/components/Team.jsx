// src/components/team/TeamCardGroup.jsx
"use client";

import React, { useContext, useMemo, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { TeamStore } from "../app/store/TeamStore"; // ensure alias path is correct [web:95]
import { CldImage } from "next-cloudinary"; // Cloudinary renderer [web:61]
import { FaFacebook, FaInstagram, FaLinkedin } from "react-icons/fa";

export default function TeamCardGroup() {
  const { team = [], teamLoad, getTeamByYear } = useContext(TeamStore);

  // 1) Filter console state
  const yearRef = useRef(null);
  const [bootstrapped, setBootstrapped] = useState(false);

  // Default load
  useEffect(() => {
    if (!bootstrapped && typeof getTeamByYear === "function") {
      setBootstrapped(true);
      getTeamByYear("2025");
      if (yearRef.current) yearRef.current.value = "2025";
    }
  }, [bootstrapped, getTeamByYear]); // default fetch once [web:95]

  const setYear = (y) => {
    if (yearRef.current) yearRef.current.value = y;
    getTeamByYear?.(y);
  }; // change handler [web:95]

  // 2) Grouping + sorting (hierarchy)
  const norm = (s) => decodeURIComponent(String(s || "").toLowerCase().trim()); // normalize and decode %20 [web:95]

  const groups = useMemo(() => {
    const t = Array.isArray(team) ? team : [];
    const presidents = t.filter((e) => norm(e.position) === "president");
    const generals = t.filter((e) => norm(e.position) === "general secretary");
    const treasurers = t.filter((e) => norm(e.position) === "treasurer");

    const isVice = (p) => {
      const x = norm(p);
      return x === "vice president" || x === "vice-president" || x === "vp";
    };
    const isAssistGS = (p) => {
      const x = norm(p);
      return x === "assistant general secretary" || x === "assistant general seceretary" || x === "ags";
    };
    const viceAssist = t.filter((e) => isVice(e.position) || isAssistGS(e.position));

    const heads = t.filter((e) => norm(e.category) === "heads");
    const tech = t.filter((e) => norm(e.category) === "technical team");
    const exec = t.filter((e) => norm(e.category) === "executive team");

    const byPosAsc = (a, b) => String(a.position || "").localeCompare(String(b.position || ""), undefined, { sensitivity: "base" });
    const byPosDesc = (a, b) => String(b.position || "").localeCompare(String(a.position || ""), undefined, { sensitivity: "base" });

    viceAssist.sort(byPosDesc);
    heads.sort(byPosAsc);
    tech.sort(byPosDesc);
    exec.sort(byPosAsc);

    return {
      top: [...presidents, ...generals, ...treasurers],
      viceAssist,
      heads,
      tech,
      exec,
    };
  }, [team]); // stable hierarchy [web:95]

  return (
    <section className="relative px-[min(5vw,24px)]">
      {/* Holographic Year Filter Console */}
      <div className="mx-3 mt-6">
        <div className="relative max-w-[1280px] mx-auto border border-white/10 rounded-2xl p-3 lg:p-4 bg-[#071019]/60 backdrop-blur shadow-[0_20px_50px_rgba(0,0,0,.55)]">
          <span
            aria-hidden
            className="pointer-events-none absolute inset-0 rounded-2xl opacity-25 mix-blend-screen
                       [background-image:repeating-linear-gradient(to_bottom,rgba(20,247,255,.18)_0px,rgba(20,247,255,.18)_2px,transparent_3px,transparent_6px)]"
          />
          <span
            aria-hidden
            className="pointer-events-none absolute -inset-6 rounded-3xl blur-2xl opacity-30
                       bg-[radial-gradient(120%_80%_at_50%_0%,rgba(20,247,255,.20),transparent_60%),radial-gradient(100%_120%_at_70%_120%,rgba(168,85,247,.20),transparent_60%)]"
          />

          <div className="relative z-10 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-white text-2xl sm:text-3xl font-extrabold tracking-wide [text-shadow:_0_0rem_1rem_rgb(99_102_255_/_0.8)]">
              Meet Our Core Team
            </h2>

            {/* chips */}
            <div className="flex flex-wrap gap-2">
              {["2025","2024","2023","2022","2021","2020"].map((y) => (
                <button
                  key={y}
                  type="button"
                  onClick={() => setYear(y)}
                  className="relative px-3 py-1 rounded-full text-xs md:text-sm font-extrabold text-black
                             bg-gradient-to-r from-cyan-300 to-violet-400 hover:from-cyan-200 hover:to-violet-300
                             shadow-[0_0_20px_rgba(20,247,255,.25)]
                             after:content-[''] after:absolute after:inset-0 after:rounded-full after:ring-1 after:ring-white/20"
                >
                  {y}
                </button>
              ))}
            </div>

            {/* select (accessibility + keyboard) */}
            <div className="flex items-center gap-2">
              <label htmlFor="year-filter" className="sr-only">Select year</label>
              <select
                id="year-filter"
                ref={yearRef}
                defaultValue="2025"
                onChange={(e) => setYear(e.target.value)}
                className="bg-white/10 text-cyan-100 rounded-xl hover:bg-white/15 px-3 py-2 text-xs md:text-sm font-bold outline-none
                           ring-1 ring-white/10 focus:ring-2 focus:ring-cyan-300/50 backdrop-blur"
              >
                <option value="2025" className="bg-[#0a111a]">2025-2026</option>
                <option value="2024" className="bg-[#0a111a]">2024-2025</option>
                <option value="2023" className="bg-[#0a111a]">2023-2024</option>
                <option value="2022" className="bg-[#0a111a]">2022-2023</option>
                <option value="2021" className="bg-[#0a111a]">2021-2022</option>
                <option value="2020" className="bg-[#0a111a]">2020-2021</option>
                <option value="2019" className="bg-[#0a111a]">2019-2020</option>
                <option value="2018" className="bg-[#0a111a]">2018-2019</option>
                <option value="2017" className="bg-[#0a111a]">2017-2018</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Loading state */}
      {teamLoad && (
        <div className="p-6 text-center text-cyan-100">Loading team…</div>
      )}

      {/* Render groups */}
      {!teamLoad && (
        <>
          {/* Top trio */}
          <SectionWrap>
            {groups.top.map((m) => (
              <HoloCard key={m._id || m.publicId} ele={m} />
            ))}
          </SectionWrap>

          {/* Vice + Assistant */}
          {groups.viceAssist.length > 0 && (
            <>
              <Divider />
              <SectionWrap>
                {groups.viceAssist.map((m) => (
                  <HoloCard key={m._id || m.publicId} ele={m} />
                ))}
              </SectionWrap>
            </>
          )}

          {/* Heads */}
          {groups.heads.length > 0 && (
            <>
              <Divider label="Heads" />
              <SectionWrap>
                {groups.heads.map((m) => (
                  <HoloCard key={m._id || m.publicId} ele={m} />
                ))}
              </SectionWrap>
            </>
          )}

          {/* Technical */}
          {groups.tech.length > 0 && (
            <>
              <Divider label="Technical Team" />
              <SectionWrap>
                {groups.tech.map((m) => (
                  <HoloCard key={m._id || m.publicId} ele={m} />
                ))}
              </SectionWrap>
            </>
          )}

          {/* Executive */}
          {groups.exec.length > 0 && (
            <>
              <Divider label="Executive Team" />
              <SectionWrap>
                {groups.exec.map((m) => (
                  <HoloCard key={m._id || m.publicId} ele={m} />
                ))}
              </SectionWrap>
            </>
          )}
        </>
      )}
    </section>
  );
}

/* Layout helpers */
function SectionWrap({ children }) {
  return (
    <motion.div className="flex flex-wrap justify-center sm:justify-evenly items-center relative p-5 gap-3">
      {children}
    </motion.div>
  );
}
function Divider({ label }) {
  return (
    <>
      <hr className="sm:mx-10 mx-5 font-black" />
      {label && <p className="text-center m-2 text-lg sm:text-2xl font-black">{label}</p>}
    </>
  );
}

/* Inline custom hologram card */

function HoloCard({ ele }) {
  const [hover, setHover] = useState(false);
  const [px, setPx] = useState(0);
  const [py, setPy] = useState(0);

  // Seeded subtle base tilt
  const seed = (ele?._id || ele?.publicId || "x").length;
  const rx = ((seed % 5) - 2) * 0.5;
  const ry = ((seed % 7) - 3) * 0.6;

  const onMove = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    const cx = r.left + r.width / 2;
    const cy = r.top + r.height / 2;
    const dx = ((e.clientX ?? 0) - cx) / r.width;
    const dy = ((e.clientY ?? 0) - cy) / r.height;
    setPx(dx * 12);
    setPy(dy * 12);
  };

  return (
    <div
      className="relative group w-[82vw] md:w-[44vw] lg:w-[32vw] xl:w-[24vw] m-3"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onMouseMove={onMove}
      style={{ transform: `perspective(1100px) rotateX(${rx}deg) rotateY(${ry}deg)` }} // 3D card perspective
    >
      {/* Projector base glow */}
      <span
        aria-hidden
        className="pointer-events-none absolute -inset-x-10 bottom-[-22%] h-[44%] z-0 opacity-75 blur-2xl
                   bg-[radial-gradient(60%_80%_at_50%_0%,rgba(20,247,255,.35),transparent_70%),radial-gradient(40%_60%_at_58%_18%,rgba(168,85,247,.35),transparent_70%)]"
      />

      {/* Rotating conic gradient aura + gradient border via 1px padding */}
      <div className="relative z-10 rounded-2xl p-[1px] overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,.6)]">
        <span
          aria-hidden
          className="absolute -inset-6 rounded-[24px] opacity-30 blur-2xl
                     bg-[conic-gradient(from_0deg,#14f7ff_0%,#ff3366_40%,#14f7ff_80%,#14f7ff_100%)]
                     animate-[spin_8s_linear_infinite]"
        />
        <div className="relative rounded-2xl overflow-hidden bg-[#0a111a]/75 border border-slate-700/60 ring-1 ring-white/5">
          {/* Charged grid + scanline shimmer */}
          <span
            aria-hidden
            className={`pointer-events-none absolute inset-0 transition-opacity duration-300
                        [background-image:radial-gradient(circle_at_1px_1px,rgba(20,247,255,.5)_1px,transparent_1px)]
                        [background-size:22px_22px] ${hover ? "opacity-20" : "opacity-10"}`}
          />
          <span
            aria-hidden
            className={`pointer-events-none absolute inset-0 mix-blend-screen
                        [background-image:repeating-linear-gradient(to_bottom,rgba(20,247,255,.12)_0px,rgba(20,247,255,.12)_2px,transparent_3px,transparent_6px)]
                        ${hover ? "opacity-25" : "opacity-0"} transition-opacity duration-300`}
          />

          {/* Role header */}
          <div className="relative z-10 text-center font-black text-white capitalize py-2 bg-[#070F2B]/85">
            <span className={`${(ele?.position || "").length > 14 ? "text-xs" : "text-base"} ${hover ? "text-lg" : ""}`}>
              {ele?.position || ""}
            </span>
          </div>

          {/* Image stage with parallax translate */}
          <div
            className="relative w-full bg-[#071019]"
            style={{ transform: `translate3d(${px}px, ${py}px, 0)` }}
          >
            {/* Corner sparks */}
            <span aria-hidden className="absolute top-3 left-3 w-1.5 h-1.5 rounded-full bg-cyan-300/90 shadow-[0_0_12px_rgba(20,247,255,.9)]" />
            <span aria-hidden className="absolute top-3 right-3 w-1.5 h-1.5 rounded-full bg-pink-300/80 shadow-[0_0_10px_rgba(255,51,102,.9)]" />
            <span aria-hidden className="absolute bottom-3 left-3 w-1.5 h-1.5 rounded-full bg-cyan-300/70" />
            <span aria-hidden className="absolute bottom-3 right-3 w-1.5 h-1.5 rounded-full bg-cyan-300/70" />

            {ele?.publicId ? (
              <CldImage
                width="700"
                height="700"
                src={ele.publicId}
                alt={`${ele?.name || "member"} image`}
                className={`${hover ? "opacity-90" : "opacity-100"} object-contain h-[42vh] sm:h-[34vh] lg:h-[36vh] xl:h-[40vh] transition-opacity`}
                crop="fit"
                quality="auto"
                format="auto"
                sizes="(max-width: 768px) 90vw, (max-width: 1024px) 45vw, 30vw"
              />
            ) : (
              <div className="h-[42vh] sm:h-[34vh] lg:h-[36vh] xl:h-[40vh] grid place-items-center text-slate-400">
                No image
              </div>
            )}
          </div>

          {/* Name */}
          <div className="relative z-10 text-center font-extrabold text-white capitalize py-2">
            <span className={`${(ele?.name || "").length > 14 ? "text-base" : "text-lg"} ${hover ? "text-xl" : ""}`}>
              {ele?.name || ""}
            </span>
          </div>

          {/* Socials row */}
          <div className={`relative z-10 flex justify-evenly mx-2 pb-3 ${hover ? "-translate-y-1" : ""} transition-transform text-3xl`}>
            {ele?.insta && (
              <a href={ele.insta} target="_blank" rel="noreferrer" aria-label="Instagram"
                 className="text-[#FCAF45] hover:scale-125 transition-transform">
                <svg width="1em" height="1em" viewBox="0 0 24 24" fill="currentColor"><path d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5zm5 5a5 5 0 1 0 .001 10.001A5 5 0 0 0 12 7zm6.5-1a1.5 1.5 0 1 0 .001 3.001A1.5 1.5 0 0 0 18.5 6z"/></svg>
              </a>
            )}
            {ele?.fb && (
              <a href={ele.fb} target="_blank" rel="noreferrer" aria-label="Facebook"
                 className="text-[#6d9dfd] hover:scale-125 transition-transform">
                <svg width="1em" height="1em" viewBox="0 0 24 24" fill="currentColor"><path d="M22 12.07C22 6.48 17.52 2 11.93 2S2 6.48 2 12.07C2 17.1 5.66 21.22 10.44 22v-7.02H7.9v-2.9h2.54v-2.2c0-2.5 1.49-3.88 3.77-3.88 1.09 0 2.24.2 2.24.2v2.47h-1.26c-1.24 0-1.63.77-1.63 1.56v1.85h2.77l-.44 2.9h-2.33V22C18.34 21.22 22 17.1 22 12.07z"/></svg>
              </a>
            )}
            {(ele?.linkdin || ele?.linkedin) && (
              <a href={ele.linkdin || ele.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn"
                 className="text-[#0077B5] hover:scale-125 transition-transform">
                <svg width="1em" height="1em" viewBox="0 0 24 24" fill="currentColor"><path d="M6.94 6.5A2.44 2.44 0 1 1 4.5 4.06 2.44 2.44 0 0 1 6.94 6.5zM7 8.75H4v11h3v-11zM13 8.5c-2.04 0-3 .93-3 2.29V19.5h3v-6.23c0-.7.5-1.27 1.41-1.27 1.07 0 1.59.7 1.59 1.73v5.77h3v-6.2c0-2.9-1.55-4.25-3.63-4.25-1.66 0-2.65.91-3.04 1.61h-.05V8.75H13z"/></svg>
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Outer hover ring pulse */}
      <span
        aria-hidden
        className={`pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-cyan-300/10 transition
                    ${hover ? "ring-cyan-300/30 shadow-[0_0_40px_rgba(20,247,255,.25)]" : ""}`}
      />
    </div>
  );
}
