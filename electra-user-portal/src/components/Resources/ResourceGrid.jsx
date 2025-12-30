"use client";

import { useContext, useEffect } from "react";
import { ResourceStore } from "../../app/store/ResourceStore";
import ResourceCard from "./ResourceCard";

export default function ResourceGrid({
  semester,
  category,
  subject,
}) {
  const { getResources, data = [], resLoad } =
    useContext(ResourceStore);

  /* ───────── FETCH ───────── */
  useEffect(() => {
    if (!semester || !subject) return;
    getResources(semester, subject, category);
  }, [semester, subject, category, getResources]);

  /* ───────── LOADING (SKELETON) ───────── */
  if (resLoad) {
    return (
      <section className="relative">
        <div
          className="
            grid
            gap-6
            sm:grid-cols-2
            lg:grid-cols-3
            xl:grid-cols-4
          "
        >
          {Array.from({ length: 8 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      </section>
    );
  }

  /* ───────── EMPTY ───────── */
  if (!data.length) {
    return (
      <section className="py-28 text-center">
        <div className="max-w-md mx-auto">
          <p className="text-lg font-medium text-slate-200">
            No resources available
          </p>
          <p className="mt-2 text-sm text-slate-500 leading-relaxed">
            Notes, books, assignments or PYQs for this subject
            will appear here once uploaded by the team.
          </p>
        </div>
      </section>
    );
  }

  /* ───────── GRID ───────── */
  return (
    <section className="relative">
      <div className="absolute inset-x-0 -top-6 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      <div
        className="
          grid
          gap-6
          sm:grid-cols-2
          lg:grid-cols-3
          xl:grid-cols-4
        "
      >
        {data.map((item) => (
          <ResourceCard key={item._id} item={item} />
        ))}
      </div>
    </section>
  );
}

/* ───────────────── SKELETON CARD ───────────────── */

function SkeletonCard() {
  return (
    <div
      className="
        rounded-xl
        border border-white/10
        bg-[#0b0f15]
        p-4
        animate-pulse
      "
    >
      {/* Title */}
      <div className="h-4 w-3/4 rounded bg-white/10 mb-3" />

      {/* Category */}
      <div className="h-3 w-1/3 rounded bg-white/10 mb-6" />

      {/* Footer row */}
      <div className="flex justify-between items-center">
        <div className="h-3 w-16 rounded bg-white/10" />
        <div className="h-3 w-12 rounded bg-white/10" />
      </div>
    </div>
  );
}
