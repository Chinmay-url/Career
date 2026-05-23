const toneMap = {
  accent: "from-accent/20 to-accent/5 text-accent",
  sky: "from-sky-400/20 to-sky-400/5 text-sky-300",
  warning: "from-warning/20 to-warning/5 text-warning",
  violet: "from-violet-400/20 to-violet-400/5 text-violet-300",
};

export default function MetricCard({ label, value, change, tone = "accent" }) {
  return (
    <article className={`rounded-lg border border-line bg-gradient-to-br ${toneMap[tone] ?? toneMap.accent} p-5 shadow-soft`}>
      <p className="text-sm text-slate-300">{label}</p>
      <div className="mt-4 flex items-end justify-between gap-3">
        <strong className="text-3xl font-semibold text-white">{value}</strong>
        <span className="rounded-full border border-white/10 bg-black/20 px-2.5 py-1 text-xs font-semibold">{change}</span>
      </div>
    </article>
  );
}
