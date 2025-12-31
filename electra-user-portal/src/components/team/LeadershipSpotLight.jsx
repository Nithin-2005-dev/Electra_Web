"use client";

import TeamCard from "./TeamCard";

export default function LeadershipSpotlight({ members = [] }) {
  if (!members.length) return null;

  return (
    <section className="relative mb-32">
      {/* subtle glow */}
      <div className="absolute inset-0 -z-10 blur-3xl opacity-30 bg-gradient-to-r from-cyan-500/20 via-transparent to-purple-500/20" />

      {/* Header */}
      <div className="text-center mb-14">
        <p className="text-xs uppercase tracking-[0.3em] text-cyan-400/70 mb-3">
          Leadership
        </p>
        <h2 className="text-3xl md:text-4xl font-extrabold text-white">
          Core Committee
        </h2>
        <p className="text-slate-400 mt-3 max-w-xl mx-auto">
          The individuals responsible for vision, strategy, and execution of
          Electra Society.
        </p>
      </div>

      {/* Spotlight */}
      <div className="flex flex-wrap justify-center gap-10">
        {members.map((m) => (
          <div
            key={m._id || m.publicId}
            className="
              w-[260px] sm:w-[280px]
              scale-[1.03]
              hover:scale-[1.06]
              transition-transform duration-300
            "
          >
            <TeamCard ele={m} spotlight />
          </div>
        ))}
      </div>
    </section>
  );
}
