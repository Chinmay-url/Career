import Badge from "../../components/ui/Badge";
import Panel from "../../components/ui/Panel";
import { roadmap } from "../../lib/mockData";

export default function LearningRoadmapPage() {
  return (
    <Panel title="Learning Roadmap">
      <div className="relative space-y-4">
        {roadmap.map((item, index) => (
          <article key={item.step} className="grid gap-4 rounded-lg border border-white/10 bg-white/[0.04] p-4 sm:grid-cols-[4rem_10rem_1fr_auto] sm:items-center">
            <span className="grid h-10 w-10 place-items-center rounded-lg bg-accent/10 text-sm font-semibold text-accent">{index + 1}</span>
            <span className="text-sm font-semibold text-accent">{item.step}</span>
            <h3 className="font-semibold text-white">{item.title}</h3>
            <Badge>{item.status}</Badge>
          </article>
        ))}
      </div>
    </Panel>
  );
}
