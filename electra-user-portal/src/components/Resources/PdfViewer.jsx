"use client";

export default function PdfViewer({ item, onClose }) {
  return (
    <div className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur flex items-center justify-center px-4">
      <div className="relative w-full max-w-5xl h-[85vh] bg-[#0a0f15] rounded-xl border border-cyan-400/30 overflow-hidden">
        <div className="flex justify-between items-center px-4 py-2 bg-[#0b1118] border-b border-white/10">
          <h3 className="text-cyan-200 text-sm truncate">
            {item.name}
          </h3>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white"
          >
            ✕
          </button>
        </div>

        <iframe
          src={item.driveUrl || item.link}
          className="w-full h-full bg-black"
          title={item.name}
        />
      </div>
    </div>
  );
}
