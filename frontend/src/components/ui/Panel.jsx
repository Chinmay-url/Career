export default function Panel({ title, action, children, className = "" }) {
  return (
    <section className={`glass-panel rounded-lg p-5 ${className}`}>
      {(title || action) && (
        <div className="mb-5 flex items-center justify-between gap-3">
          {title && <h2 className="text-base font-semibold text-white">{title}</h2>}
          {action}
        </div>
      )}
      {children}
    </section>
  );
}
