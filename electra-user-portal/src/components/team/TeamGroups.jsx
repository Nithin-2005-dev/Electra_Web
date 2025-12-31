"use client";

import { useMemo } from "react";
import TeamSection from "./TeamSection";
import TeamCard from "./TeamCard";

export default function TeamGroups({ team }) {
  const norm = (s) =>
    decodeURIComponent(String(s || "").toLowerCase().trim());

  const groups = useMemo(() => {
    const t = Array.isArray(team) ? team : [];

    const presidents = t.filter((e) => norm(e.position) === "president");
    const generals = t.filter(
      (e) => norm(e.position) === "general secretary"
    );
    const treasurers = t.filter((e) => norm(e.position) === "treasurer");

    const viceAssist = t.filter((e) =>
      [
        "vice president",
        "vp",
        "assistant general secretary",
        "assistant general seceretary",
        "ags",
      ].includes(norm(e.position))
    );

    const heads = t.filter((e) => norm(e.category) === "heads");
    const tech = t.filter((e) => norm(e.category) === "technical team");
    const exec = t.filter((e) => norm(e.category) === "executive team");

    tech.sort(
      (a, b) =>
        a.position.localeCompare(b.position) ||
        a.name.localeCompare(b.name)
    );
    exec.sort(
      (a, b) =>
        a.position.localeCompare(b.position) ||
        a.name.localeCompare(b.name)
    );

    return {
      top: [...presidents, ...generals, ...treasurers],
      viceAssist,
      heads,
      tech,
      exec,
    };
  }, [team]);

  const hasAnyTeam =
    groups.top.length ||
    groups.viceAssist.length ||
    groups.heads.length ||
    groups.tech.length ||
    groups.exec.length;

  /* ───────── EMPTY STATE ───────── */
  if (!hasAnyTeam) {
    return (
      <div className="py-32 text-center">
        <p className="text-slate-400 text-sm uppercase tracking-widest mb-3">
          Team information unavailable
        </p>
        <h2 className="text-xl md:text-2xl font-semibold text-white">
          Team details will be announced soon
        </h2>
        <p className="text-slate-500 mt-3 max-w-md mx-auto">
          We are currently organizing the Electra Society team structure.
          Please check back later.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-28">
      {/* ───────── CORE LEADERSHIP (SPOTLIGHT) ───────── */}
      {groups.top.length > 0 && (
        <TeamSection
          eyebrow="Leadership"
          title="Core Committee"
          subtitle="Guiding vision and administration of Electra Society"
          variant="hero"
          gridClass="grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10"
        >
          {groups.top.map((m) => (
            <TeamCard
              key={m._id || m.publicId}
              ele={m}
              spotlight
            />
          ))}
        </TeamSection>
      )}

      {/* ───────── VICE & ASSISTANTS ───────── */}
      {groups.viceAssist.length > 0 && (
        <TeamSection
          eyebrow="Support"
          title="Vice Presidents & Assistants"
          subtitle="Bridging leadership and execution"
        >
          {groups.viceAssist.map((m) => (
            <TeamCard key={m._id || m.publicId} ele={m} />
          ))}
        </TeamSection>
      )}

      {/* ───────── HEADS ───────── */}
      {groups.heads.length > 0 && (
        <TeamSection
          eyebrow="Management"
          title="Domain Heads"
          subtitle="Overseeing technical and operational verticals"
        >
          {groups.heads.map((m) => (
            <TeamCard key={m._id || m.publicId} ele={m} />
          ))}
        </TeamSection>
      )}

      {/* ───────── TECH TEAM ───────── */}
      {groups.tech.length > 0 && (
        <TeamSection
          eyebrow="Engineering"
          title="Technical Team"
          subtitle="Building systems, platforms, and innovations"
        >
          {groups.tech.map((m) => (
            <TeamCard key={m._id || m.publicId} ele={m} />
          ))}
        </TeamSection>
      )}

      {/* ───────── EXEC TEAM ───────── */}
      {groups.exec.length > 0 && (
        <TeamSection
          eyebrow="Operations"
          title="Executive Team"
          subtitle="Execution, coordination, and outreach"
        >
          {groups.exec.map((m) => (
            <TeamCard key={m._id || m.publicId} ele={m} />
          ))}
        </TeamSection>
      )}
    </div>
  );
}
