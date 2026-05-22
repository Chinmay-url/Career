import Panel from "../../components/ui/Panel";
import { parsedSkills } from "../../lib/mockData";

export default function ParsedSkillsPage() {
  return (
    <Panel title="Parsed Skills View">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {parsedSkills.map((skill) => (
          <article key={skill.name} className="rounded-lg border border-line bg-panel p-4">
            <div className="flex items-center justify-between gap-3">
              <h3 className="font-semibold text-white">{skill.name}</h3>
              <span className="text-xs text-slate-400">{skill.confidence}% confidence</span>
            </div>
            <p className="mt-2 text-sm text-slate-400">{skill.level}</p>
            <div className="mt-4 h-2 rounded-full bg-slate-800">
              <div className="h-2 rounded-full bg-accent" style={{ width: `${skill.confidence}%` }} />
            </div>
          </article>
        ))}
      </div>
    </Panel>
  );
}
