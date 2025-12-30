"use client";

import { useParams, useRouter } from "next/navigation";
import CategoryTabs from "../../../../../components/Resources/CategoryTabs";
import ResourceGrid from "../../../../../components/Resources/ResourceGrid";
import { useState } from "react";
import { ResourceStoreProvider } from "../../../../store/ResourceStore";
import ResourcesHeader from "../../../../../components/Resources/ResourcesHeader";

export default function SubjectResourcesPage() {
  const router = useRouter();
  const { semester, subject } = useParams();

  const [activeCategory, setActiveCategory] = useState("all");

  if (!semester || !subject) return null;

  return (
    <ResourceStoreProvider>
    <main className="min-h-screen bg-black text-white px-6 py-16">
    <ResourcesHeader/>
      {/* HEADER */}
      <header className="max-w-6xl mx-auto mb-10">

        <h1 className="text-2xl font-semibold">
          {decodeURIComponent(subject).toUpperCase()}
        </h1>

        <p className="text-slate-400 text-sm mt-1">
          Semester {semester}
        </p>
      </header>

      {/* CATEGORY TABS */}
      <section className="max-w-6xl mx-auto">
        <CategoryTabs
          active={activeCategory}
          onChange={setActiveCategory}
          onBack={() => router.push(`/resources/${semester}`)}
        />

        {/* RESOURCES */}
        <ResourceGrid
          semester={Number(semester)}
          subject={decodeURIComponent(subject)}
          category={activeCategory}
        />
      </section>
    </main>
    </ResourceStoreProvider>
  );
}
