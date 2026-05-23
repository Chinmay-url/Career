import { useEffect, useState } from "react";
import { ExternalLink } from "lucide-react";
import Badge from "../../components/ui/Badge";
import Panel from "../../components/ui/Panel";
import { careerApi } from "../../lib/api";
import { getPrimaryRecommendation } from "../../lib/analysisStorage";
import { roadmap } from "../../lib/mockData";

const fallbackResourceMap = {
  react: ["React Official Learn", "https://react.dev/learn", "Documentation"],
  javascript: ["JavaScript.info", "https://javascript.info/", "Tutorial"],
  python: ["freeCodeCamp Python Course", "https://www.freecodecamp.org/learn/scientific-computing-with-python/", "Course"],
  sql: ["Mode SQL Tutorial", "https://mode.com/sql-tutorial/", "Tutorial"],
  "machine learning": ["Google Machine Learning Crash Course", "https://developers.google.com/machine-learning/crash-course", "Course"],
  mlops: ["Made With ML MLOps", "https://madewithml.com/", "Course"],
  vector: ["Pinecone Learning Center", "https://www.pinecone.io/learn/", "Learning Path"],
  cloud: ["AWS Skill Builder", "https://skillbuilder.aws/", "Certification Prep"],
  aws: ["AWS Skill Builder", "https://skillbuilder.aws/", "Certification Prep"],
  fastapi: ["FastAPI Tutorial", "https://fastapi.tiangolo.com/tutorial/", "Documentation"],
};

function fallbackResourcesFor(skillGaps = []) {
  return skillGaps.slice(0, 6).map((skill, index) => {
    const key = Object.keys(fallbackResourceMap).find((name) => skill.toLowerCase().includes(name));
    const [resource, url, type] = fallbackResourceMap[key] ?? ["Coursera Career Academy", "https://www.coursera.org/career-academy", "Course"];

    return {
      skill,
      resource,
      url,
      type,
      time_estimate: index < 3 ? "1-2 weeks" : "2-3 weeks",
      priority: index < 3 ? "High" : "Medium",
      project: `Build a portfolio mini-project that demonstrates ${skill}.`,
      why: `This closes a required ${skill} gap for your selected career path.`,
    };
  });
}

export default function LearningRoadmapPage() {
  const primaryRole = getPrimaryRecommendation();
  const [resources, setResources] = useState([]);
  const [status, setStatus] = useState(primaryRole?.skillGap?.length ? "loading" : "idle");

  useEffect(() => {
    let isMounted = true;

    async function loadLearningPath() {
      if (!primaryRole?.skillGap?.length) {
        return;
      }

      setStatus("loading");

      try {
        const { data } = await careerApi.learningRoadmap({
          target_role: primaryRole.title,
          skill_gaps: primaryRole.skillGap,
        });

        if (isMounted) {
          setResources(data.resources?.length ? data.resources : fallbackResourcesFor(primaryRole.skillGap));
          setStatus("ready");
        }
      } catch {
        if (isMounted) {
          setResources(fallbackResourcesFor(primaryRole.skillGap));
          setStatus("fallback");
        }
      }
    }

    loadLearningPath();

    return () => {
      isMounted = false;
    };
  }, [primaryRole?.title]);

  if (!primaryRole?.skillGap?.length) {
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

  return (
    <Panel
      title={`Learning Roadmap for ${primaryRole.title}`}
      action={status === "loading" ? <span className="text-xs text-slate-400">Generating resources...</span> : <Badge>{status === "fallback" ? "Verified" : "AI Curated"}</Badge>}
    >
      <div className="grid gap-4 xl:grid-cols-2">
        {resources.map((item, index) => (
          <article key={`${item.skill}-${item.resource}`} className="rounded-lg border border-white/10 bg-white/[0.04] p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <span className="text-xs font-semibold uppercase tracking-[0.14em] text-accent">Step {index + 1}</span>
                <h3 className="mt-2 text-lg font-semibold text-white">{item.skill}</h3>
              </div>
              <Badge>{item.priority ?? (index < 3 ? "High" : "Medium")}</Badge>
            </div>

            <a
              className="focus-ring mt-4 inline-flex items-center gap-2 rounded-lg border border-accent/40 bg-accent/10 px-3 py-2 text-sm font-semibold text-accent hover:bg-accent/15"
              href={item.url}
              target="_blank"
              rel="noreferrer"
            >
              {item.resource}
              <ExternalLink size={15} />
            </a>

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <div className="rounded-lg border border-white/10 bg-black/20 p-3">
                <p className="text-xs uppercase tracking-[0.14em] text-slate-500">Type</p>
                <p className="mt-1 text-sm font-medium text-slate-200">{item.type ?? "Course"}</p>
              </div>
              <div className="rounded-lg border border-white/10 bg-black/20 p-3">
                <p className="text-xs uppercase tracking-[0.14em] text-slate-500">Time</p>
                <p className="mt-1 text-sm font-medium text-slate-200">{item.time_estimate ?? "1-2 weeks"}</p>
              </div>
            </div>

            <p className="mt-4 text-sm leading-6 text-slate-300">{item.why}</p>
            <p className="mt-3 rounded-lg border border-white/10 bg-black/20 p-3 text-sm leading-6 text-slate-300">
              <span className="font-semibold text-white">Project: </span>
              {item.project}
            </p>
          </article>
        ))}
      </div>
    </Panel>
  );
}
