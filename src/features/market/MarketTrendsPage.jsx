import { useEffect, useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { ExternalLink } from "lucide-react";
import Panel from "../../components/ui/Panel";
import { careerApi } from "../../lib/api";
import { getRecommendationsFromAnalysis } from "../../lib/analysisStorage";

const defaultRoles = ["Software Engineer", "Data Scientist", "Cloud Engineer"];

function formatNumber(value) {
  return typeof value === "number" ? value.toLocaleString() : "N/A";
}

function formatSalary(value) {
  return typeof value === "number" ? `$${Math.round(value).toLocaleString()}` : "N/A";
}

export default function MarketTrendsPage() {
  const recommendations = getRecommendationsFromAnalysis();
  const roles = useMemo(() => {
    const recommendedRoles = recommendations.map((role) => role.title).filter(Boolean).slice(0, 5);
    return recommendedRoles.length ? recommendedRoles : defaultRoles;
  }, [recommendations]);

  const [trendData, setTrendData] = useState(null);
  const [skillsData, setSkillsData] = useState([]);
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function loadMarketData() {
      setStatus("loading");
      setError("");

      try {
        const [trendsResponse, skillsResponse] = await Promise.allSettled([
          careerApi.marketTrends({ roles, country: "us" }),
          careerApi.trendingSkills({ roles }),
        ]);

        if (isMounted) {
          if (trendsResponse.status === "fulfilled") {
            setTrendData(trendsResponse.value.data);
            setStatus("ready");
          } else {
            setError(trendsResponse.reason?.response?.data?.detail ?? "Could not fetch live Adzuna market data.");
            setStatus("error");
          }

          if (skillsResponse.status === "fulfilled") {
            setSkillsData(skillsResponse.value.data.trending_skills ?? []);
          } else {
            setSkillsData([]);
          }
        }
      } catch (caughtError) {
        if (isMounted) {
          setError(caughtError?.response?.data?.detail ?? "Could not fetch live Adzuna market data.");
          setStatus("error");
        }
      }
    }

    loadMarketData();

    return () => {
      isMounted = false;
    };
  }, [roles.join("|")]);

  const details = trendData?.details ?? [];
  const chartData = details.map((item) => ({
    role: item.role,
    openings: item.open_positions,
    salary: item.salary_avg ?? 0,
  }));
  const hottestRole = details[0];
  const bestSalary = [...details].sort((a, b) => (b.salary_avg ?? 0) - (a.salary_avg ?? 0))[0];
  const totalOpenings = details.reduce((total, item) => total + (typeof item.open_positions === "number" ? item.open_positions : 0), 0);

  return (
    <Panel
      title="Live Market Trend Analysis"
      action={<span className="rounded-full border border-accent/30 bg-accent/10 px-3 py-1 text-xs font-semibold text-accent">{status === "loading" ? "Fetching Adzuna..." : "Adzuna live data"}</span>}
    >
      {error && (
        <p className="mb-5 rounded-lg border border-danger/40 bg-danger/10 px-4 py-3 text-sm text-red-200">
          {error}
        </p>
      )}

      <div className="mb-5 grid gap-3 sm:grid-cols-3">
        {[
          ["Roles compared", roles.length, roles.join(", ")],
          ["Open positions", formatNumber(totalOpenings), "Across compared roles"],
          ["Highest salary", formatSalary(bestSalary?.salary_avg), bestSalary?.role ?? "Pending"],
        ].map(([label, value, note]) => (
          <article key={label} className="rounded-lg border border-white/10 bg-white/[0.04] p-4">
            <p className="text-xs uppercase tracking-[0.14em] text-slate-500">{label}</p>
            <p className="mt-2 text-2xl font-semibold text-white">{value}</p>
            <p className="mt-1 truncate text-sm text-slate-400">{note}</p>
          </article>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.4fr_0.8fr]">
        <div className="h-[28rem] rounded-lg border border-white/10 bg-black/15 p-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
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

        <div className="space-y-4">
          <article className="rounded-lg border border-white/10 bg-white/[0.04] p-4">
            <p className="text-xs uppercase tracking-[0.14em] text-slate-500">Hottest Role</p>
            <h3 className="mt-2 text-lg font-semibold text-white">{hottestRole?.role ?? "Loading..."}</h3>
            <p className="mt-1 text-sm text-slate-400">{formatNumber(hottestRole?.open_positions)} open positions</p>
          </article>

          <article className="rounded-lg border border-white/10 bg-white/[0.04] p-4">
            <p className="text-xs uppercase tracking-[0.14em] text-slate-500">Trending Skills</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {(skillsData.length ? skillsData : [{ skill: "Fetching skills", mentions: 0 }]).slice(0, 10).map((item) => (
                <span key={item.skill} className="rounded-full border border-white/10 bg-black/20 px-3 py-1 text-xs text-slate-300">
                  {item.skill}{item.mentions ? ` · ${item.mentions}` : ""}
                </span>
              ))}
            </div>
          </article>

          <article className="rounded-lg border border-white/10 bg-white/[0.04] p-4">
            <p className="text-xs uppercase tracking-[0.14em] text-slate-500">Sample Listings</p>
            <div className="mt-3 space-y-3">
              {(hottestRole?.sample_jobs ?? []).slice(0, 3).map((job) => (
                <a key={job.url ?? job.title} href={job.url} target="_blank" rel="noreferrer" className="block rounded-lg border border-white/10 bg-black/20 p-3 text-sm text-slate-300 hover:border-accent/40">
                  <span className="flex items-start justify-between gap-3">
                    <span>
                      <span className="block font-semibold text-white">{job.title}</span>
                      <span className="mt-1 block text-xs text-slate-500">{job.company} · {job.location}</span>
                    </span>
                    <ExternalLink size={15} className="text-accent" />
                  </span>
                </a>
              ))}
              {!hottestRole?.sample_jobs?.length && <p className="text-sm text-slate-400">Listings will appear when Adzuna returns role samples.</p>}
            </div>
          </article>
        </div>
      </div>
    </Panel>
  );
}
