"use client";

import { useState } from "react";
import PdfViewer from "./PdfViewer";

export default function ResourceCard({ item }) {
  const hasFile = Boolean(item?.driveUrl || item?.link);
  const [openPdf, setOpenPdf] = useState(false);

  const fileUrl = item?.driveUrl || item?.link;

  return (
    <>
      <div
        className="
          group
          relative
          overflow-hidden
          rounded-2xl
          border border-white/10
          bg-gradient-to-b from-[#0e131c] to-[#070a10]
          p-5
          transition-all duration-300
          hover:border-cyan-400/40
          hover:shadow-[0_0_0_1px_rgba(34,211,238,0.25),0_18px_36px_rgba(0,0,0,0.7)]
          active:scale-[0.98]
        "
      >
        {/* Glow accent */}
        <span
          className="
            pointer-events-none
            absolute inset-0
            opacity-0
            group-hover:opacity-100
            transition
            bg-[radial-gradient(600px_circle_at_50%_-20%,rgba(34,211,238,0.12),transparent_45%)]
          "
        />

        {/* CONTENT */}
        <div className="relative z-10 flex flex-col h-full">
          {/* HEADER */}
          <div className="mb-4">
            <h3 className="text-white font-semibold text-sm leading-snug line-clamp-2">
              {item?.name || "Untitled Resource"}
            </h3>

            <p className="mt-1 text-xs uppercase tracking-wider text-slate-400">
              {item?.category || "Resource"}
            </p>
          </div>

          {/* SPACER */}
          <div className="flex-1" />

          {/* FOOTER */}
          <div className="flex items-center justify-between">
            {/* OPEN BUTTON */}
            <button
              onClick={() => {
                if (!hasFile) {
                  alert(
                    "This resource is currently unavailable.\n\nOur team is working to upload it soon."
                  );
                  return;
                }
                setOpenPdf(true);
              }}
              className={`
                text-sm font-medium
                ${
                  hasFile
                    ? "text-cyan-300 hover:text-cyan-200"
                    : "text-slate-500 cursor-not-allowed"
                }
                transition
              `}
            >
              Open →
            </button>

            {/* SECONDARY ACTION */}
            {hasFile ? (
              <a
                href={fileUrl}
                target="_blank"
                rel="noreferrer"
                className="
                  text-xs
                  text-slate-400
                  hover:text-white
                  transition
                "
              >
                New tab
              </a>
            ) : (
              <span className="text-xs text-slate-500">
                Coming soon
              </span>
            )}
          </div>
        </div>
      </div>

      {/* PDF MODAL */}
      {openPdf && (
        <PdfViewer
          item={item}
          onClose={() => setOpenPdf(false)}
        />
      )}
    </>
  );
}
