const toneMap = {
  accent: "text-accent",
  sky: "text-sky-300",
  warning: "text-warning",
  violet: "text-violet-300",
};

export default function MetricCard({ label, value, change, tone = "accent" }) {
  return (
    <article className="rounded-lg border border-line bg-surface p-5">
      <p className="text-sm text-slate-400">{label}</p>
      <div className="mt-3 flex items-end justify-between gap-3">
        <strong className="text-3xl font-semibold text-white">{value}</strong>
        <span className={`text-xs font-semibold ${toneMap[tone] ?? toneMap.accent}`}>{change}</span>
      </div>
    </article>
  );
}
