import { Link, NavLink } from "react-router-dom";
import {
  BarChart3,
  BookOpenCheck,
  BrainCircuit,
  FileUp,
  Gauge,
  GitCompare,
  Sparkles,
  Target,
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
    <aside className="fixed inset-y-0 left-0 z-30 hidden w-72 border-r border-white/10 bg-surface/95 px-4 py-5 backdrop-blur lg:block">
      <Link to="/dashboard" className="flex items-center gap-3 px-2">
        <span className="grid h-11 w-11 place-items-center rounded-lg bg-gradient-to-br from-accent to-amber-300 text-slate-950 shadow-soft">
          <Target size={21} />
        </span>
        <span>
          <span className="block text-base font-semibold text-white">CareerAI</span>
          <span className="text-xs text-slate-400">Career path intelligence</span>
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
                  ? "bg-white text-slate-950 shadow-soft"
                  : "text-slate-300 hover:bg-white/10 hover:text-white"
              }`
            }
          >
            <Icon size={18} />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="absolute inset-x-4 bottom-5 rounded-lg border border-accent/30 bg-accent/10 p-4">
        <p className="text-sm font-semibold text-white">Analysis Pipeline</p>
        <p className="mt-1 text-xs leading-5 text-slate-400">Upload resume, parse skills, compare career paths, and close gaps with roadmap actions.</p>
      </div>
    </aside>
  );
}
