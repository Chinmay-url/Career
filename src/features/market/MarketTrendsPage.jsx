import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import Panel from "../../components/ui/Panel";
import { marketTrendData } from "../../lib/mockData";

export default function MarketTrendsPage() {
  return (
    <Panel
      title="Market Trend Analysis"
      action={<span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold text-slate-300">Adzuna/O*NET ready</span>}
    >
      <div className="mb-5 grid gap-3 sm:grid-cols-3">
        {[
          ["AI roles", "+47%", "Fastest growth"],
          ["Data roles", "+31%", "Stable demand"],
          ["Frontend roles", "+18%", "Selective hiring"],
        ].map(([label, value, note]) => (
          <article key={label} className="rounded-lg border border-white/10 bg-white/[0.04] p-4">
            <p className="text-xs uppercase tracking-[0.14em] text-slate-500">{label}</p>
            <p className="mt-2 text-2xl font-semibold text-white">{value}</p>
            <p className="mt-1 text-sm text-slate-400">{note}</p>
          </article>
        ))}
      </div>
      <div className="h-[28rem]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={marketTrendData}>
            <defs>
              <linearGradient id="aiDemand" x1="0" x2="0" y1="0" y2="1">
                <stop offset="5%" stopColor="#2dd4bf" stopOpacity={0.45} />
                <stop offset="95%" stopColor="#2dd4bf" stopOpacity={0.04} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="#2b3548" strokeDasharray="3 3" />
            <XAxis dataKey="month" stroke="#94a3b8" />
            <YAxis stroke="#94a3b8" />
            <Tooltip contentStyle={{ background: "#101827", border: "1px solid #2b3548", borderRadius: 8 }} />
            <Area type="monotone" dataKey="ai" stroke="#2dd4bf" fill="url(#aiDemand)" strokeWidth={3} />
            <Area type="monotone" dataKey="data" stroke="#38bdf8" fill="#38bdf820" strokeWidth={3} />
            <Area type="monotone" dataKey="frontend" stroke="#f59e0b" fill="#f59e0b18" strokeWidth={3} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Panel>
  );
}
