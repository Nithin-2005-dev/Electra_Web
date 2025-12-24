"use client";

import { SubjectData } from "../../app/utils/Subjects";

export default function SubjectGrid({ semester, onSelect, onBack }) {
  const subjects = SubjectData[semester - 1] || [];

  return (
    <>
      <button
        onClick={onBack}
        className="mb-6 text-cyan-300 text-sm hover:underline"
      >
        ← Back
      </button>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {subjects.map((s) => (
          <button
            key={s.subjectCode}
            onClick={() => onSelect(s.subject)}
            className="rounded-xl bg-[#0b0f15] border border-white/10 p-4 text-left hover:border-cyan-400/40 transition"
          >
            <h3 className="text-white font-medium">{s.subject}</h3>
            <p className="text-xs text-slate-400">{s.subjectCode}</p>
          </button>
        ))}
      </div>
    </>
  );
}
