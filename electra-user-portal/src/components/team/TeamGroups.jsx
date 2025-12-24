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
    const generals = t.filter((e) => norm(e.position) === "general secretary");
    const treasurers = t.filter((e) => norm(e.position) === "treasurer");

    const viceAssist = t.filter((e) =>
      ["vice president", "vp", "assistant general secretary","assistant general seceretary", "ags"].includes(
        norm(e.position)
      )
    );

    const heads = t.filter((e) => norm(e.category) === "heads");
    const tech = t.filter((e) => norm(e.category) === "technical team");
    const exec = t.filter((e) => norm(e.category) === "executive team");

    return {
      top: [...presidents, ...generals, ...treasurers],
      viceAssist,
      heads,
      tech,
      exec,
    };
  }, [team]);

  return (
    <>
      <TeamSection>
        {groups.top.map((m) => (
          <TeamCard key={m._id || m.publicId} ele={m} />
        ))}
      </TeamSection>

      <TeamSection title="Vice & Assistants">
        {groups.viceAssist.map((m) => (
          <TeamCard key={m._id || m.publicId} ele={m} />
        ))}
      </TeamSection>

      <TeamSection title="Heads">
        {groups.heads.map((m) => (
          <TeamCard key={m._id || m.publicId} ele={m} />
        ))}
      </TeamSection>

      <TeamSection title="Technical Team">
        {groups.tech.map((m) => (
          <TeamCard key={m._id || m.publicId} ele={m} />
        ))}
      </TeamSection>

      <TeamSection title="Executive Team">
        {groups.exec.map((m) => (
          <TeamCard key={m._id || m.publicId} ele={m} />
        ))}
      </TeamSection>
    </>
  );
}
