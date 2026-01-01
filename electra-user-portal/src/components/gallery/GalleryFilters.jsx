"use client";

export default function GalleryFilters({ filter, setFilter }) {
  const items = ["all", "udvega", "powerSurge", "electraCup", "carvaan"];

  return (
    <div className="max-w-7xl mx-auto px-6 py-8 flex gap-3 flex-wrap">
      {items.map((item) => {
        const active = filter === item;
        return (
          <button
            key={item}
            onClick={() => setFilter(item)}
            className={`px-4 py-2 rounded-full text-sm font-semibold transition
              ${
                active
                  ? "bg-white text-black"
                  : "bg-white/10 text-white hover:bg-white/20"
              }`}
          >
            {item.toUpperCase()}
          </button>
        );
      })}
    </div>
  );
}
