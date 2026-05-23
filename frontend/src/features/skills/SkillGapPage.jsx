import Badge from "../../components/ui/Badge";
import Panel from "../../components/ui/Panel";
import { getPrimaryRecommendation } from "../../lib/analysisStorage";
import { skillGaps } from "../../lib/mockData";

export default function SkillGapPage() {
  const primaryRole = getPrimaryRecommendation();
  const backendGaps = primaryRole?.skillGap?.map((skill, index) => ({
    skill,
    current: Math.max(20, 50 - index * 4),
    target: 80,
    priority: index < 3 ? "High" : "Medium",
  })) ?? [];
  const gaps = backendGaps.length ? backendGaps : skillGaps;

  return (
    <Panel title="Skill Gap Analysis">
      <div className="space-y-4">
        {gaps.map((gap) => (
          <article key={gap.skill} className="rounded-lg border border-white/10 bg-white/[0.04] p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h3 className="font-semibold text-white">{gap.skill}</h3>
                <p className="mt-1 text-sm text-slate-400">Required for your highest-fit target roles</p>
              </div>
              <Badge>{gap.priority}</Badge>
            </div>
            <div className="mt-4 grid gap-3 md:grid-cols-[1fr_auto] md:items-center">
              <div className="h-3 rounded-full bg-black/30">
                <div className="h-3 rounded-full bg-gradient-to-r from-danger via-warning to-accent" style={{ width: `${gap.current}%` }} />
              </div>
              <span className="text-sm text-slate-400">{gap.current}% current | {gap.target}% target</span>
            </div>
          </article>
        ))}
      </div>
    </Panel>
  );
}
