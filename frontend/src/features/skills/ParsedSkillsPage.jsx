import Panel from "../../components/ui/Panel";
import { getParsedSkillsFromAnalysis } from "../../lib/analysisStorage";
import { parsedSkills } from "../../lib/mockData";

export default function ParsedSkillsPage() {
  const backendSkills = getParsedSkillsFromAnalysis();
  const skills = backendSkills.length ? backendSkills : parsedSkills;

  return (
    <Panel title="Parsed Skills View">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {skills.map((skill) => (
          <article key={skill.name} className="rounded-lg border border-white/10 bg-white/[0.04] p-5">
            <div className="flex items-center justify-between gap-3">
              <h3 className="font-semibold text-white">{skill.name}</h3>
              <span className="rounded-full border border-white/10 bg-black/20 px-2.5 py-1 text-xs text-slate-300">{skill.confidence}% confidence</span>
            </div>
            <p className="mt-3 text-sm text-slate-400">{skill.level} proficiency signal</p>
            <div className="mt-5 h-2.5 rounded-full bg-black/30">
              <div className="h-2.5 rounded-full bg-gradient-to-r from-accent to-amber-300" style={{ width: `${skill.confidence}%` }} />
            </div>
          </article>
        ))}
      </div>
    </Panel>
  );
}
