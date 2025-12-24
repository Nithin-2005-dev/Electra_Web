"use client";

import { useContext, useEffect } from "react";
import { ResourceStore } from "../../app/store/ResourceStore";
import ResourceCard from "./ResourceCard";

export default function ResourceGrid({
  category,
  semester,
  subject,
  onOpenPdf,
}) {
  const { getResources, data = [], resLoad } = useContext(ResourceStore);

  /* 🔥 FETCH LOGIC — THIS WAS MISSING */
  useEffect(() => {
    if (!semester || !subject) return;

    // category === "all" → backend should handle
    getResources(semester, category);
  }, [semester, category, subject, getResources]);

  /* Loading state */
  if (resLoad) {
    return (
      <div className="py-20 text-center text-slate-400">
        Loading resources…
      </div>
    );
  }

  /* Empty state (professional message) */
  if (!data.length) {
    return (
      <div className="py-20 text-center">
        <p className="text-slate-300 font-medium">
          No resources available yet
        </p>
        <p className="text-slate-500 text-sm mt-1">
          Materials for this subject will be added soon.
        </p>
      </div>
    );
  }

  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {data.map((item) => (
        <ResourceCard
          key={item._id || item.name}
          item={item}
          onOpen={() => onOpenPdf(item)}
        />
      ))}
    </div>
  );
}
