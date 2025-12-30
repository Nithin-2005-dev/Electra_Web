"use client";

import { useParams, usePathname } from "next/navigation";

export default function ResourcesHeader() {
  const params = useParams();
  const pathname = usePathname();

  const semester = params?.semester;
  const subject = params?.subject;

  const isRoot = pathname === "/Resources";
  const isSemester = semester && !subject;
  const isSubject = semester && subject;

  return (
    <header className="relative mb-16 text-center overflow-hidden">
      {/* TOP AMBIENT GLOW */}
      <div
        aria-hidden
        className="
          pointer-events-none
          absolute -top-32 left-1/2 -translate-x-1/2
          h-64 w-[640px]
          bg-[radial-gradient(circle_at_center,rgba(34,211,238,0.14),transparent_60%)]
          blur-2xl
        "
      />

      {/* SUBTLE DIVIDER */}
      <div className="absolute inset-x-0 -top-6 h-px bg-gradient-to-r from-transparent via-cyan-400/20 to-transparent" />

      {/* EYEBROW */}
      <p className="relative z-10 text-[11px] uppercase tracking-[0.35em] text-cyan-400/70 mb-4">
        Academic Resources
      </p>

      {/* TITLE */}
      <h1 className="relative z-10 text-3xl md:text-4xl font-extrabold text-white tracking-tight">
        Electra Knowledge Grid
      </h1>

      {/* CONTEXT / BREADCRUMB */}
      <div className="relative z-10 mt-4 flex justify-center">
        <div
          className="
            inline-flex items-center gap-2
            rounded-full
            border border-white/10
            bg-white/[0.02]
            px-4 py-2
            text-sm text-slate-400
            backdrop-blur
          "
        >
          {isRoot && (
            <>
              <span className="text-slate-500">Select a semester</span>
              <span className="text-slate-600">•</span>
              <span>Notes · Books · Assignments · PYQs</span>
            </>
          )}

          {isSemester && (
            <>
              <span className="text-slate-500">Semester</span>
              <span className="font-medium text-white">{semester}</span>
              <span className="text-slate-600">→</span>
              <span>Select subject</span>
            </>
          )}

          {isSubject && (
            <>
              <span className="text-slate-500">Semester</span>
              <span className="font-medium text-white">{semester}</span>
              <span className="text-slate-600">→</span>
              <span className="font-medium text-white">
                {decodeURIComponent(subject).toUpperCase()}
              </span>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
