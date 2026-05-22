const styles = {
  High: "border-danger/40 bg-danger/10 text-red-200",
  Medium: "border-warning/40 bg-warning/10 text-amber-200",
  Low: "border-accent/40 bg-accent/10 text-teal-200",
  Done: "border-accent/40 bg-accent/10 text-teal-200",
  "In Progress": "border-sky-400/40 bg-sky-400/10 text-sky-200",
  Next: "border-warning/40 bg-warning/10 text-amber-200",
  Planned: "border-slate-500/40 bg-slate-500/10 text-slate-200",
};

export default function Badge({ children }) {
  return (
    <span className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${styles[children] ?? styles.Low}`}>
      {children}
    </span>
  );
}
