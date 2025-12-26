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

      {/* 🔒 ONLY THIS PART CHANGED */}
      {teamLoad && (
        <div className="p-6">
          <SkeletonGrid />
        </div>
      )}

      {!teamLoad && <TeamGroups team={team} />}
    </section>
  );
}

/* ───────── SKELETON UI (LOCAL ONLY) ───────── */

function SkeletonGrid() {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}

function SkeletonCard() {
  return (
    <div className="rounded-xl border border-white/10 bg-black/40 p-4">
      <div className="h-40 w-full rounded-lg bg-white/10 shimmer" />
      <div className="mt-4 h-4 w-3/4 rounded bg-white/10 shimmer" />
      <div className="mt-2 h-3 w-1/2 rounded bg-white/10 shimmer" />

      <style jsx>{`
        .shimmer {
          background-image: linear-gradient(
            90deg,
            rgba(255,255,255,0.06) 25%,
            rgba(255,255,255,0.12) 37%,
            rgba(255,255,255,0.06) 63%
          );
          background-size: 400% 100%;
          animation: shimmer 1.4s infinite;
        }

        @keyframes shimmer {
          0% { background-position: 100% 0; }
          100% { background-position: 0 0; }
        }
      `}</style>
    </div>
  );
}
