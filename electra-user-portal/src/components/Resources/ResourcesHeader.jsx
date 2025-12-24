"use client";

export default function ResourcesHeader({ stage, semester, subject }) {
  return (
    <header className="text-center mb-12">
      <h1 className="text-3xl md:text-4xl font-extrabold text-white">
        Electra Knowledge Grid
      </h1>

      <p className="text-slate-400 mt-2">
        {stage === "semester" && "Choose your semester"}
        {stage === "subject" && `Semester ${semester} — Select subject`}
        {stage === "category" && `Semester ${semester} • ${subject}`}
      </p>
    </header>
  );
}
