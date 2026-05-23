import { useEffect, useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { ArrowRight, CheckCircle2, FileSearch, TrendingUp } from "lucide-react";
import MetricCard from "../../components/ui/MetricCard";
import Panel from "../../components/ui/Panel";
import { careerApi } from "../../lib/api";
import { getParsedSkillsFromAnalysis, getRecommendationsFromAnalysis } from "../../lib/analysisStorage";
import { metrics, recommendations as mockRecommendations } from "../../lib/mockData";

const defaultRoles = ["Software Engineer", "Data Scientist", "Cloud Engineer"];

function formatNumber(value) {
  return typeof value === "number" ? value.toLocaleString() : "N/A";
}

function formatSalary(value) {
  return typeof value === "number" ? `$${Math.round(value).toLocaleString()}` : "N/A";
}

export default function DashboardPage() {
  const backendRecommendations = getRecommendationsFromAnalysis();
  const backendSkills = getParsedSkillsFromAnalysis();
  const roles = backendRecommendations.length ? backendRecommendations : mockRecommendations;
  const marketRoles = useMemo(() => {
    const recommendedRoles = backendRecommendations.map((role) => role.title).filter(Boolean).slice(0, 5);
    return recommendedRoles.length ? recommendedRoles : defaultRoles;
  }, [backendRecommendations]);
  const [marketData, setMarketData] = useState(null);
  const [marketStatus, setMarketStatus] = useState("loading");

  useEffect(() => {
    let isMounted = true;

    async function loadMarketSignals() {
      setMarketStatus("loading");

      try {
        const { data } = await careerApi.marketTrends({ roles: marketRoles, country: "us" });

        if (isMounted) {
          setMarketData(data);
          setMarketStatus("ready");
        }
      } catch {
        if (isMounted) {
          setMarketStatus("error");
        }
      }
    }

    loadMarketSignals();

    return () => {
      isMounted = false;
    };
  }, [marketRoles.join("|")]);

  const marketDetails = marketData?.details ?? [];
  const marketByRole = new Map(marketDetails.map((item) => [item.role, item]));
  const marketChartData = marketDetails.map((item) => ({
    role: item.role,
    openings: item.open_positions,
    salary: item.salary_avg ?? 0,
  }));
  const userSkillNames = backendSkills.map((skill) => skill.name);
  const topRoleSkills = roles[0]?.skills ?? [];
  const radarData = (topRoleSkills.length ? topRoleSkills : userSkillNames).slice(0, 8).map((skill) => {
    const matched = userSkillNames.some((userSkill) => {
      const user = userSkill.toLowerCase();
      const required = skill.toLowerCase();
      return user.includes(required) || required.includes(user);
    });

    return {
      skill,
      current: matched ? 90 : 25,
      target: 85,
    };
  });
  const totalOpenings = marketDetails.reduce((total, item) => total + (typeof item.open_positions === "number" ? item.open_positions : 0), 0);
  const hottestRole = marketDetails[0];
  const dashboardMetrics = backendRecommendations.length
    ? [
        { label: "Career Matches", value: String(backendRecommendations.length), change: "from resume", tone: "accent" },
        { label: "Parsed Skills", value: String(backendSkills.length), change: "LLM extracted", tone: "sky" },
        { label: "Open Positions", value: formatNumber(totalOpenings), change: "Adzuna live", tone: "warning" },
        { label: "Best Match", value: `${Math.round(backendRecommendations[0]?.match ?? 0)}%`, change: "profile fit", tone: "violet" },
      ]
    : metrics;

  return (
    <div className="space-y-6">
      <section className="subtle-grid overflow-hidden rounded-lg border border-white/10 bg-gradient-to-br from-white/10 via-panel to-surface p-6 shadow-soft">
        <div className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr] lg:items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-3 py-1 text-xs font-semibold text-accent">
              <TrendingUp size={14} />
              Resume intelligence active
            </div>
            <h2 className="mt-5 max-w-3xl text-3xl font-semibold leading-tight text-white sm:text-4xl">
              Convert resume signals into career paths, skill gaps, and targeted learning plans.
            </h2>
            <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-300">
              This workspace connects parsed resume skills with market demand, role fit, peer patterns, and certification recommendations.
            </p>
          </div>
          <div className="rounded-lg border border-white/10 bg-black/20 p-4">
            {["Resume parsed", "Skills mapped", "Career paths ranked", "Roadmap drafted"].map((step) => (
              <div key={step} className="flex items-center gap-3 border-b border-white/10 py-3 last:border-0">
                <CheckCircle2 className="text-accent" size={18} />
                <span className="text-sm font-medium text-slate-200">{step}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {dashboardMetrics.map((metric) => <MetricCard key={metric.label} {...metric} />)}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
        <Panel
          title="Market Demand Signals"
          action={<span className="rounded-full bg-accent/10 px-3 py-1 text-xs font-semibold text-accent">{marketStatus === "loading" ? "Fetching Adzuna..." : "Adzuna synced"}</span>}
        >
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={marketChartData}>
                <CartesianGrid stroke="#2b3548" strokeDasharray="3 3" />
                <XAxis dataKey="role" stroke="#94a3b8" tick={{ fontSize: 11 }} interval={0} angle={-12} textAnchor="end" height={70} />
                <YAxis yAxisId="left" stroke="#94a3b8" />
                <YAxis yAxisId="right" orientation="right" stroke="#94a3b8" />
                <Tooltip contentStyle={{ background: "#101827", border: "1px solid #2b3548", borderRadius: 8 }} />
                <Bar yAxisId="left" dataKey="openings" name="Open Positions" fill="#2dd4bf" radius={[6, 6, 0, 0]} />
                <Bar yAxisId="right" dataKey="salary" name="Avg Salary" fill="#f59e0b" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p className="mt-3 text-sm text-slate-400">
            {marketStatus === "error"
              ? "Live market data could not be refreshed. Open the Market Trends page to retry."
              : `Hottest role: ${hottestRole?.role ?? "loading"} (${formatNumber(hottestRole?.open_positions)} openings).`}
          </p>
        </Panel>

        <Panel
          title="Skill Fit Radar"
          action={<span className="rounded-full bg-warning/10 px-3 py-1 text-xs font-semibold text-warning">{roles[0]?.title ?? "Profile"}</span>}
        >
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData}>
                <PolarGrid stroke="#2b3548" />
                <PolarAngleAxis dataKey="skill" stroke="#cbd5e1" />
                <Radar dataKey="target" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.12} />
                <Radar dataKey="current" stroke="#2dd4bf" fill="#2dd4bf" fillOpacity={0.35} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
          <p className="mt-3 text-sm text-slate-400">
            Comparing your parsed resume skills against the required skills for the top recommended role.
          </p>
        </Panel>
      </div>

      <Panel title="Top Career Recommendations">
        <div className="grid gap-4 lg:grid-cols-3">
          {roles.slice(0, 3).map((role) => (
            <article key={role.title} className="rounded-lg border border-white/10 bg-white/[0.04] p-5 transition hover:-translate-y-0.5 hover:border-accent/50 hover:bg-white/[0.07]">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <FileSearch className="mb-3 text-accent" size={20} />
                  <h3 className="font-semibold text-white">{role.title}</h3>
                </div>
                <span className="rounded-full border border-accent/30 bg-accent/10 px-3 py-1 text-sm font-bold text-accent">{role.match}%</span>
              </div>
              <p className="mt-3 text-sm text-slate-400">
                {formatSalary(marketByRole.get(role.title)?.salary_avg) || role.salary} | {formatNumber(marketByRole.get(role.title)?.open_positions)} openings
              </p>
              <div className="mt-4">
                <ResponsiveContainer width="100%" height={84}>
                  <BarChart data={role.skills.slice(0, 5).map((skill, index) => ({ skill, value: 88 - index * 8 }))}>
                    <Bar dataKey="value" fill="#2dd4bf" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <button className="focus-ring mt-4 inline-flex items-center gap-2 text-sm font-semibold text-accent">
                Inspect path <ArrowRight size={16} />
              </button>
            </article>
          ))}
        </div>
      </Panel>
    </div>
  );
}
