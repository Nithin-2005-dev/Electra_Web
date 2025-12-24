"use client";

import { useState } from "react";
import ResourcesHeader from "./ResourcesHeader";
import SemesterGrid from "./SemesterGrid";
import SubjectGrid from "./SubjectGrid";
import CategoryTabs from "./CategoryTabs";
import ResourceGrid from "./ResourceGrid";
import PdfViewer from "./PdfViewer";

export default function KnowledgeGrid() {
  const [stage, setStage] = useState("semester"); // semester | subject | category
  const [semester, setSemester] = useState(null);
  const [subject, setSubject] = useState(null);
  const [activeCategory, setActiveCategory] = useState("all");
  const [pdf, setPdf] = useState(null);

  return (
    <section className="px-6 py-16">
      <ResourcesHeader stage={stage} semester={semester} subject={subject} />

      {stage === "semester" && (
        <SemesterGrid
          onSelect={(s) => {
            setSemester(s);
            setStage("subject");
          }}
        />
      )}

      {stage === "subject" && (
        <SubjectGrid
          semester={semester}
          onBack={() => setStage("semester")}
          onSelect={(sub) => {
            setSubject(sub);
            setStage("category");
          }}
        />
      )}

      {stage === "category" && (
        <>
          <CategoryTabs
            active={activeCategory}
            onChange={setActiveCategory}
            onBack={() => setStage("subject")}
          />

      <ResourceGrid
  category={activeCategory}
  semester={semester}
  subject={subject}
  onOpenPdf={(item) => setPdf(item)}
/>


        </>
      )}

      {pdf && (
        <PdfViewer
          item={pdf}
          onClose={() => setPdf(null)}
        />
      )}
    </section>
  );
}
