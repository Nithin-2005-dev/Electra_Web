"use client";

import { useParams } from "next/navigation";
import SubjectGrid from "../../../../components/Resources/SubjectGrid";
import { ResourceStoreProvider } from "../../../store/ResourceStore";
import ResourcesHeader from "../../../../components/Resources/ResourcesHeader";

export default function SemesterPage() {
  const { semester } = useParams();

  return (
    <main className="min-h-screen bg-black text-white px-6 py-16">
    <ResourcesHeader/>
      <ResourceStoreProvider>
        <SubjectGrid semester={semester} />
      </ResourceStoreProvider>
    </main>
  );
}
