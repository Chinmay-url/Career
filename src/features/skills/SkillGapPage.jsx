import Badge from "../../components/ui/Badge";
import Panel from "../../components/ui/Panel";
import { skillGaps } from "../../lib/mockData";

export default function SkillGapPage() {
  return (
    <Panel title="Skill Gap Analysis">
      <div className="space-y-4">
        {skillGaps.map((gap) => (
          <article key={gap.skill} className="rounded-lg border border-line bg-panel p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h3 className="font-semibold text-white">{gap.skill}</h3>
              <Badge>{gap.priority}</Badge>
            </div>
            <div className="mt-4 grid gap-3 md:grid-cols-[1fr_auto] md:items-center">
              <div className="h-3 rounded-full bg-slate-800">
                <div className="h-3 rounded-full bg-accent" style={{ width: `${gap.current}%` }} />
              </div>
              <span className="text-sm text-slate-400">{gap.current}% current · {gap.target}% target</span>
            </div>
          </article>
        ))}
      </div>
    </Panel>
  );
}
