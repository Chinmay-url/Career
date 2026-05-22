import { ArrowRight } from "lucide-react";
import Panel from "../../components/ui/Panel";
import { recommendations } from "../../lib/mockData";

export default function RecommendationsPage() {
  return (
    <Panel title="Career Recommendation Cards">
      <div className="grid gap-5 lg:grid-cols-3">
        {recommendations.map((role) => (
          <article key={role.title} className="rounded-lg border border-line bg-panel p-5">
            <span className="text-sm font-semibold text-accent">{role.match}% match</span>
            <h3 className="mt-3 text-xl font-semibold text-white">{role.title}</h3>
            <p className="mt-2 text-sm text-slate-400">{role.salary} · {role.demand} demand</p>
            <div className="mt-5 flex flex-wrap gap-2">
              {role.skills.map((skill) => (
                <span key={skill} className="rounded-full border border-line bg-surface px-3 py-1 text-xs text-slate-300">{skill}</span>
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
