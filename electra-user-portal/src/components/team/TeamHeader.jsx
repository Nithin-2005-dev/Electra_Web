"use client";

export default function TeamHeader({ yearRef, setYear }) {
  const YEARS = ["2025", "2024", "2023", "2022", "2021", "2020"];

  return (
    <section className="relative max-w-7xl mx-auto px-6 pt-20 pb-10">
      {/* subtle divider */}
      <span className="absolute top-0 left-6 right-6 h-px bg-white/5" />

      <div className="flex flex-col gap-6">

        {/* TITLE ROW */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
          <div>
            <p className="text-xs tracking-[0.35em] text-cyan-400/70 uppercase mb-3">
              Team
            </p>

            <h1 className="text-white text-4xl sm:text-5xl font-extrabold tracking-tight leading-tight">
              Electra Core Team
            </h1>

            <p className="mt-4 max-w-2xl text-slate-400 text-base">
              Leadership and contributors shaping innovation, culture,
              and real-world impact at Electra.
            </p>
          </div>

          {/* YEAR SELECT (desktop) */}
          <div className="hidden sm:block">
            <select
              ref={yearRef}
              defaultValue="2025"
              onChange={(e) => setYear(e.target.value)}
              className="
                bg-transparent
                text-white
                border border-white/15
                rounded-full
                px-5 py-2
                text-sm font-medium
                hover:border-cyan-400/50
                focus:outline-none focus:border-cyan-400
                transition
              "
            >
              <option value="2025" className="bg-black">2025–26</option>
              <option value="2024" className="bg-black">2024–25</option>
              <option value="2023" className="bg-black">2023–24</option>
              <option value="2022" className="bg-black">2022–23</option>
              <option value="2021" className="bg-black">2021–22</option>
              <option value="2020" className="bg-black">2020–21</option>
            </select>
          </div>
        </div>

        {/* YEAR PILLS */}
        <div className="flex flex-wrap gap-3 pt-4">
          {YEARS.map((y) => (
            <button
              key={y}
              onClick={() => {
                if (yearRef.current) yearRef.current.value = y;
                setYear(y);
              }}
              className="
                px-5 py-2
                rounded-full
                text-sm font-medium
                text-slate-300
                border border-white/10
                hover:text-white
                hover:border-cyan-400/40
                transition
              "
            >
              {y}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
