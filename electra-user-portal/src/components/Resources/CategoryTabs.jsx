"use client";

export default function CategoryTabs({ active, onChange, onBack }) {
  const tabs = ["all", "notes", "books", "assignments"];

  return (
    <>
      <button
        onClick={onBack}
        className="mb-4 text-cyan-300 text-sm hover:underline"
      >
        ← Back
      </button>

      <div className="flex gap-2 mb-6 overflow-x-auto">
        {tabs.map((t) => (
          <button
            key={t}
            onClick={() => onChange(t)}
            className={`px-4 py-2 rounded-full text-sm border transition ${
              active === t
                ? "bg-cyan-400/20 text-cyan-300 border-cyan-400/40"
                : "border-white/10 text-slate-400 hover:border-cyan-400/30"
            }`}
          >
            {t.toUpperCase()}
          </button>
        ))}
      </div>
    </>
  );
}
