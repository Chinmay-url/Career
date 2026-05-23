import { useState } from "react";
import TrendChart from "../components/TrendChart";
import { getJobTrends } from "../services/trendsAPI";

const DEFAULT_ROLES = [
  "Software Developer","Data Scientist","DevOps Engineer",
  "Cloud Architect","Cybersecurity Analyst","Machine Learning Engineer",
];

export default function Trends() {
  const [role, setRole] = useState("");
  const [trendData, setTrendData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Static fallback chart data (shown before any search)
  const staticLabels = ["Software Dev","Data Scientist","DevOps","Cloud Arch","Cybersecurity","ML Engineer"];
  const staticValues = [52400, 41200, 38900, 29700, 35100, 31500];

  async function handleSearch() {
    const query = role.trim();
    if (!query) return alert("Enter a role to search.");
    setError("");
    setLoading(true);
    setTrendData(null);
    try {
      const data = await getJobTrends(query);
      setTrendData(data);
    } catch (err) {
      setError(err.response?.data?.detail || "Could not fetch trends. Check Adzuna API keys.");
    }
    setLoading(false);
  }

  return (
    <div style={s.page}>
      <h2 style={s.heading}>📈 Job Market Trends</h2>
      <p style={s.sub}>Search live job postings via Adzuna API for any IT role.</p>

      <div style={{ display: "flex", gap: 8, marginBottom: "1.5rem" }}>
        <input
          value={role}
          onChange={(e) => setRole(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          placeholder="e.g. Data Scientist, DevOps Engineer…"
          style={s.input}
        />
        <button onClick={handleSearch} disabled={loading} style={s.btn}>
          {loading ? "…" : "Search"}
        </button>
      </div>

      {/* Quick role buttons */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: "1.5rem" }}>
        {DEFAULT_ROLES.map((r) => (
          <button key={r} onClick={() => { setRole(r); }}
            style={{ fontSize: 12, padding: "5px 12px", borderRadius: 99, border: "1px solid #ccc", background: "none", cursor: "pointer" }}>
            {r}
          </button>
        ))}
      </div>

      {error && <div style={s.error}>{error}</div>}

      {/* Live result */}
      {trendData && (
        <div style={s.card}>
          <h3 style={{ marginBottom: 4 }}>{trendData.job_title}</h3>
          <p style={{ fontSize: 24, fontWeight: 700, color: "#534AB7", marginBottom: 12 }}>
            {typeof trendData.open_positions === "number"
              ? trendData.open_positions.toLocaleString()
              : trendData.open_positions}{" "}
            <span style={{ fontSize: 14, fontWeight: 400, color: "#666" }}>open positions</span>
          </p>

          {trendData.sample_jobs?.length > 0 && (
            <>
              <h4 style={{ marginBottom: 8 }}>Sample Listings</h4>
              {trendData.sample_jobs.map((job, i) => (
                <div key={i} style={s.jobRow}>
                  <strong>{job.title}</strong>
                  <span style={{ color: "#666" }}> · {job.company}</span>
                  <span style={{ color: "#888", fontSize: 12 }}> · {job.location}</span>
                  {job.salary_min && (
                    <span style={{ color: "#1D9E75", fontSize: 12 }}>
                      {" "}· ${Math.round(job.salary_min / 1000)}k–${Math.round(job.salary_max / 1000)}k
                    </span>
                  )}
                </div>
              ))}
            </>
          )}
        </div>
      )}

      {/* Static overview chart */}
      <div style={s.card}>
        <h3 style={{ marginBottom: 12 }}>IT Job Demand Overview</h3>
        <TrendChart labels={staticLabels} values={staticValues} label="Open Positions" />
      </div>

      {/* Salary chart */}
      <div style={s.card}>
        <h3 style={{ marginBottom: 12 }}>Average Salaries ($k/year)</h3>
        <TrendChart
          labels={["Cloud Arch","AI/ML Eng","Product Mgr","DevOps","Data Scientist","Data Eng"]}
          values={[145, 130, 120, 118, 115, 112]}
          label="Avg Salary ($k)"
        />
      </div>
    </div>
  );
}

const s = {
  page: { maxWidth: 860, margin: "0 auto", padding: "2rem 1rem" },
  heading: { fontSize: "1.5rem", marginBottom: 4 },
  sub: { color: "#666", marginBottom: "1.5rem" },
  input: { flex: 1, padding: "10px 12px", border: "1px solid #ddd", borderRadius: 8, fontSize: 14 },
  btn: { padding: "10px 20px", background: "#534AB7", color: "#fff", border: "none", borderRadius: 8, fontSize: 14, cursor: "pointer", fontWeight: 600 },
  error: { background: "#FEE2E2", borderLeft: "4px solid #EF4444", padding: "0.75rem 1rem", borderRadius: 8, margin: "1rem 0", fontSize: 14 },
  card: { background: "#fff", borderRadius: 12, padding: "1.25rem", marginBottom: "1.5rem", boxShadow: "0 1px 4px rgba(0,0,0,0.08)" },
  jobRow: { padding: "6px 0", borderBottom: "1px solid #f0f0f0", fontSize: 14 },
};
