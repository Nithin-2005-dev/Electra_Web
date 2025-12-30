"use client";

import { useRouter } from "next/navigation";

export default function SemesterGrid() {
  const router = useRouter();

  return (
    <section className="max-w-6xl mx-auto px-2">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, i) => {
          const semester = i + 1;

          return (
            <button
              key={semester}
              onClick={() => router.push(`/Resources/${semester}`)}
              className="
                group relative overflow-hidden
                rounded-2xl
                border border-white/10
                bg-[#0b0f15]
                px-5 py-8
                text-left
                transition-all duration-300 ease-[cubic-bezier(.22,1,.36,1)]
                hover:border-cyan-400/40
                hover:translate-y-[-2px]
                hover:shadow-[0_12px_40px_rgba(0,0,0,0.65)]
                active:translate-y-[0px]
                focus:outline-none
                focus-visible:ring-2
                focus-visible:ring-cyan-400/60
              "
            >
              {/* subtle top accent */}
              <div
                className="
                  absolute inset-x-0 top-0 h-px
                  bg-gradient-to-r from-transparent via-cyan-400/30 to-transparent
                  opacity-0 group-hover:opacity-100 transition
                "
              />

              {/* background depth */}
              <div
                className="
                  absolute inset-0
                  bg-gradient-to-b from-white/[0.03] to-transparent
                  opacity-0 group-hover:opacity-100 transition
                "
              />

              {/* content */}
              <div className="relative z-10 flex flex-col gap-3">
                <span className="text-[11px] tracking-[0.3em] uppercase text-slate-500">
                  Semester
                </span>

                <span className="text-3xl font-semibold text-white leading-none">
                  {semester}
                </span>

                <span className="text-xs text-slate-400">
                  Notes · Books · Assignments · pyqs
                </span>

                <span
                  className="
                    mt-3 inline-flex items-center gap-1
                    text-xs font-medium
                    text-cyan-400
                    opacity-0
                    translate-y-1
                    transition-all duration-300
                    group-hover:opacity-100
                    group-hover:translate-y-0
                  "
                >
                  Explore resources
                  <span className="text-cyan-400/70">→</span>
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}
