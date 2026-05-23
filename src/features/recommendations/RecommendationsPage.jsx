import { ArrowRight, BriefcaseBusiness, TrendingUp } from "lucide-react";
import Panel from "../../components/ui/Panel";
import { getRecommendationsFromAnalysis } from "../../lib/analysisStorage";
import { recommendations } from "../../lib/mockData";

export default function RecommendationsPage() {
  const backendRecommendations = getRecommendationsFromAnalysis();
  const roles = backendRecommendations.length ? backendRecommendations : recommendations;

  return (
    <Panel title="Career Recommendation Cards">
      <div className="grid gap-5 lg:grid-cols-3">
        {roles.map((role, index) => (
          <article key={role.title} className="rounded-lg border border-white/10 bg-white/[0.04] p-5 transition hover:-translate-y-0.5 hover:border-accent/50">
            <div className="flex items-start justify-between gap-3">
              <span className="grid h-11 w-11 place-items-center rounded-lg bg-accent/10 text-accent">
                <BriefcaseBusiness size={20} />
              </span>
              <span className="rounded-full border border-accent/30 bg-accent/10 px-3 py-1 text-sm font-semibold text-accent">
                Rank {index + 1}
              </span>
            </div>
            <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-accent">
              <TrendingUp size={15} /> {role.match}% profile match
            </span>
            <h3 className="mt-3 text-xl font-semibold text-white">{role.title}</h3>
            <p className="mt-2 text-sm text-slate-400">{role.salary} | {role.demand} demand</p>
            <div className="mt-5 flex flex-wrap gap-2">
              {role.skills.slice(0, 6).map((skill) => (
                <span key={skill} className="rounded-full border border-white/10 bg-black/20 px-3 py-1 text-xs text-slate-300">{skill}</span>
              ))}
            </div>
            <button className="focus-ring mt-6 inline-flex items-center gap-2 rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-slate-950">
              View path <ArrowRight size={16} />
            </button>
          </article>
        ))}
      </div>
    </Panel>
  );
}
