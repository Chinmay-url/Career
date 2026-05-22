import { Link, NavLink } from "react-router-dom";
import {
  BarChart3,
  BookOpenCheck,
  BrainCircuit,
  FileUp,
  Gauge,
  GitCompare,
  Sparkles,
  UserRound,
} from "lucide-react";

const navItems = [
  { to: "/dashboard", label: "Dashboard", icon: Gauge },
  { to: "/resume", label: "Resume Upload", icon: FileUp },
  { to: "/skills", label: "Parsed Skills", icon: BrainCircuit },
  { to: "/recommendations", label: "Recommendations", icon: Sparkles },
  { to: "/skill-gap", label: "Skill Gap", icon: GitCompare },
  { to: "/market-trends", label: "Market Trends", icon: BarChart3 },
  { to: "/roadmap", label: "Roadmap", icon: BookOpenCheck },
];

export default function Sidebar() {
  return (
    <aside className="fixed inset-y-0 left-0 z-30 hidden w-72 border-r border-line bg-surface/95 px-4 py-5 lg:block">
      <Link to="/dashboard" className="flex items-center gap-3 px-2">
        <span className="grid h-10 w-10 place-items-center rounded-lg bg-accent text-slate-950">
          <UserRound size={20} />
        </span>
        <span>
          <span className="block text-sm font-semibold text-white">CareerAI</span>
          <span className="text-xs text-slate-400">Path Intelligence</span>
        </span>
      </Link>

      <nav className="mt-8 space-y-1">
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                isActive
                  ? "bg-accent text-slate-950"
                  : "text-slate-300 hover:bg-panel hover:text-white"
              }`
            }
          >
            <Icon size={18} />
            {label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
