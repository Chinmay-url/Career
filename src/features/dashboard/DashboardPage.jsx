import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import MetricCard from "../../components/ui/MetricCard";
import Panel from "../../components/ui/Panel";
import { marketTrendData, metrics, recommendations, skillRadar } from "../../lib/mockData";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric) => <MetricCard key={metric.label} {...metric} />)}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
        <Panel title="Market Demand Signals">
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={marketTrendData}>
                <CartesianGrid stroke="#283245" strokeDasharray="3 3" />
                <XAxis dataKey="month" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip contentStyle={{ background: "#111827", border: "1px solid #283245" }} />
                <Line type="monotone" dataKey="ai" stroke="#2dd4bf" strokeWidth={3} />
                <Line type="monotone" dataKey="data" stroke="#38bdf8" strokeWidth={3} />
                <Line type="monotone" dataKey="frontend" stroke="#a78bfa" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Panel>

        <Panel title="Skill Fit Radar">
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={skillRadar}>
                <PolarGrid stroke="#283245" />
                <PolarAngleAxis dataKey="skill" stroke="#cbd5e1" />
                <Radar dataKey="target" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.12} />
                <Radar dataKey="current" stroke="#2dd4bf" fill="#2dd4bf" fillOpacity={0.35} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </Panel>
      </div>

      <Panel title="Top Career Recommendations">
        <div className="grid gap-4 lg:grid-cols-3">
          {recommendations.map((role) => (
            <article key={role.title} className="rounded-lg border border-line bg-panel p-4">
              <div className="flex items-start justify-between gap-3">
                <h3 className="font-semibold text-white">{role.title}</h3>
                <span className="text-sm font-bold text-accent">{role.match}%</span>
              </div>
              <p className="mt-2 text-sm text-slate-400">{role.salary} · {role.demand} demand</p>
              <div className="mt-4">
                <ResponsiveContainer width="100%" height={84}>
                  <BarChart data={role.skills.map((skill, index) => ({ skill, value: 88 - index * 8 }))}>
                    <Bar dataKey="value" fill="#2dd4bf" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </article>
          ))}
        </div>
      </Panel>
    </div>
  );
}
