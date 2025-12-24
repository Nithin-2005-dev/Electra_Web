"use client";

export default function ResourceCard({ item, onOpen }) {
  const hasFile = Boolean(item?.driveUrl || item?.link);

  return (
    <div className="rounded-xl bg-[#0b0f15] border border-white/10 p-4 hover:border-cyan-400/40 transition">
      <h3 className="text-white font-medium mb-1">
        {item.name || "Untitled Resource"}
      </h3>

      <p className="text-xs text-slate-400 mb-4 capitalize">
        {item.category}
      </p>

      <div className="flex justify-between items-center">
        <button
          onClick={() => {
            if (!hasFile) {
              alert(
                "This resource is currently unavailable.\n\nOur team is working to upload it soon."
              );
              return;
            }
            onOpen();
          }}
          className={`text-sm ${
            hasFile
              ? "text-cyan-300 hover:underline"
              : "text-slate-500 cursor-not-allowed"
          }`}
        >
          Open
        </button>

        {hasFile ? (
          <a
            href={item.driveUrl || item.link}
            target="_blank"
            rel="noreferrer"
            className="text-xs text-slate-400 hover:text-white"
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
  );
}
