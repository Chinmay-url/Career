import { Bell, Search } from "lucide-react";

export default function Topbar() {
  return (
    <header className="sticky top-0 z-20 border-b border-line bg-canvas/85 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-accent">AI Career Path Recommender</p>
          <h1 className="text-lg font-semibold text-white">Career Intelligence Workspace</h1>
        </div>
        <div className="hidden min-w-72 items-center gap-2 rounded-lg border border-line bg-surface px-3 py-2 md:flex">
          <Search size={16} className="text-slate-500" />
          <input className="w-full bg-transparent text-sm outline-none placeholder:text-slate-500" placeholder="Search roles, skills, courses" />
        </div>
        <button className="focus-ring grid h-10 w-10 place-items-center rounded-lg border border-line bg-surface text-slate-300">
          <Bell size={18} />
        </button>
      </div>
    </header>
  );
}
