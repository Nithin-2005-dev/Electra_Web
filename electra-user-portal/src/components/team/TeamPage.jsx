"use client";

import { useContext, useEffect, useRef, useState } from "react";
import { TeamStore } from "../../app/store/TeamStore";
import TeamHeader from "./TeamHeader";
import TeamGroups from "./TeamGroups";

export default function TeamPage() {
  const { team = [], teamLoad, getTeamByYear } = useContext(TeamStore);

  const yearRef = useRef(null);
  const [bootstrapped, setBootstrapped] = useState(false);

  // ✅ SAME bootstrap logic
  useEffect(() => {
    if (!bootstrapped && typeof getTeamByYear === "function") {
      setBootstrapped(true);
      getTeamByYear("2025");
      if (yearRef.current) yearRef.current.value = "2025";
    }
  }, [bootstrapped, getTeamByYear]);

  const setYear = (y) => {
    if (yearRef.current) yearRef.current.value = y;
    getTeamByYear?.(y);
  };

  return (
    <section className="relative px-[min(5vw,24px)]">
      <TeamHeader yearRef={yearRef} setYear={setYear} />

      {teamLoad && (
        <div className="p-6 text-center text-cyan-100">
          Loading team…
        </div>
      )}

      {!teamLoad && <TeamGroups team={team} />}
    </section>
  );
}
