import { Bell, LogOut, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { logoutFromBackend } from "../../features/auth/authService";
import { clearAuthSession, getAuthUser } from "../../features/auth/authStorage";

export default function Topbar() {
  const navigate = useNavigate();
  const user = getAuthUser();

  async function handleLogout() {
    try {
      await logoutFromBackend();
    } finally {
      clearAuthSession();
      navigate("/login", { replace: true });
    }
  }

  return (
    <header className="sticky top-0 z-20 border-b border-white/10 bg-canvas/80 backdrop-blur-xl">
      <div className="mx-auto flex min-h-20 max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">AI Career Path Recommender</p>
          <h1 className="mt-1 text-xl font-semibold text-white">Career Intelligence Workspace</h1>
        </div>
        <div className="hidden min-w-80 items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 md:flex">
          <Search size={16} className="text-slate-500" />
          <input className="w-full bg-transparent text-sm outline-none placeholder:text-slate-500" placeholder="Search roles, skills, courses" />
        </div>
        <div className="flex items-center gap-2">
          <button className="focus-ring hidden h-10 w-10 place-items-center rounded-lg border border-white/10 bg-white/5 text-slate-300 hover:bg-white/10 sm:grid" aria-label="Notifications">
            <Bell size={18} />
          </button>
          <div className="hidden rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-right md:block">
            <p className="text-xs font-semibold text-white">{user?.name ?? "Demo User"}</p>
            <p className="text-xs text-slate-500">{user?.email ?? "demo@careerai.app"}</p>
          </div>
          <button
            className="focus-ring grid h-10 w-10 place-items-center rounded-lg border border-white/10 bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white"
            onClick={handleLogout}
            aria-label="Logout"
          >
            <LogOut size={18} />
          </button>
        </div>
      </div>
    </header>
  );
}
