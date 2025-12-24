"use client";

export default function SemesterGrid({ onSelect }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-4xl mx-auto">
      {Array.from({ length: 8 }).map((_, i) => (
        <button
          key={i}
          onClick={() => onSelect(i + 1)}
          className="rounded-xl bg-[#0b0f15] border border-white/10 py-6 text-white hover:border-cyan-400/40 transition"
        >
          Semester {i + 1}
        </button>
      ))}
    </div>
  );
}
