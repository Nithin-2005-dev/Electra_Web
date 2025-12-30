"use client";

import Link from "next/link";
import { SubjectData } from "../../app/utils/Subjects";

export default function SubjectGrid({ semester }) {
  if (!SubjectData) {
    return (
      <div className="py-20 text-center text-slate-400">
        Invalid semester selected.
      </div>
    );
  }

  const { title, totalCredits, subjects } = SubjectData[semester-1];

  return (
    <section className="max-w-6xl mx-auto">
      {/* ───── SEMESTER META ───── */}
      <div className="mb-10">
        <h2 className="text-xl md:text-2xl font-semibold text-white">
          Semester {semester}
        </h2>

        <p className="text-slate-400 mt-1 text-sm">
          {title}
        </p>

        <p className="text-xs text-slate-500 mt-1">
          Total Credits:{" "}
          <span className="text-slate-300 font-medium">
            {totalCredits}
          </span>
        </p>
      </div>

      {/* ───── SUBJECT GRID ───── */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {subjects.map((s) => (
          <Link
            key={s.code}
            href={`/Resources/${semester}/${encodeURIComponent(
              s.code.toLowerCase()
            )}`}
            className="
              group relative overflow-hidden
              rounded-2xl
              border border-white/10
              bg-gradient-to-b from-[#0e131c] to-[#070a10]
              p-5
              transition-all duration-300
              hover:border-cyan-400/40
              hover:shadow-[0_0_0_1px_rgba(34,211,238,0.25),0_18px_36px_rgba(0,0,0,0.7)]
              active:scale-[0.97]
            "
          >
            {/* Glow effect */}
            <span
              className="
                pointer-events-none absolute inset-0
                opacity-0 group-hover:opacity-100
                transition
                bg-[radial-gradient(600px_circle_at_50%_-20%,rgba(34,211,238,0.12),transparent_45%)]
              "
            />

            {/* Content */}
            <div className="relative z-10 flex flex-col gap-3">
              {/* Subject Name */}
              <h3 className="text-white font-semibold text-sm leading-snug">
                {s.name}
              </h3>

              {/* Subject Code — ✅ FIXED */}
              <p className="text-xs tracking-wider uppercase text-slate-400">
                {s.code.toLowerCase()}
              </p>

              {/* Meta row */}
              <div className="flex items-center justify-between mt-2">
                {/* Type badge */}
                <span
                  className={`
                    text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full
                    border
                    ${
                      s.type === "Lab"
                        ? "border-purple-400/30 text-purple-300"
                        : s.type === "Elective"
                        ? "border-amber-400/30 text-amber-300"
                        : s.type === "Project"
                        ? "border-pink-400/30 text-pink-300"
                        : "border-cyan-400/30 text-cyan-300"
                    }
                  `}
                >
                  {s.type}
                </span>

                {/* Credits */}
                <span className="text-xs text-slate-400">
                  {s.credits} Cr
                </span>
              </div>

              {/* CTA */}
              <span
                className="
                  mt-2 text-xs text-cyan-400/70
                  opacity-0 translate-y-1
                  transition-all duration-300
                  group-hover:opacity-100 group-hover:translate-y-0
                "
              >
                View resources →
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
