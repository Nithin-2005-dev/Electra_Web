import { ResourceStoreProvider } from "../../store/ResourceStore";
import SemesterGrid from "../../../components/Resources/SemesterGrid";
import ResourcesHeader from "../../../components/Resources/ResourcesHeader";

export default function ResourcesPage() {
  return (
    <main className="min-h-screen bg-black text-white px-6 py-16">
    <ResourcesHeader/>
      <ResourceStoreProvider>
        <header className="max-w-6xl mx-auto mb-12">
          <h1 className="text-3xl font-bold tracking-tight">
            Academic Resources
          </h1>
          <p className="text-white/60 mt-2">
            Select a semester to explore notes, books, and assignments
          </p>
        </header>

        <SemesterGrid />
      </ResourceStoreProvider>
    </main>
  );
}
