import { useState } from "react";
import SkillChart from "../components/SkillChart";
import RecommendationCard from "../components/RecommendationCard";
import { getDashboard } from "../services/recommendationAPI";

const QUICK_SKILLS = [
  "Python","JavaScript","SQL","Machine Learning","React","AWS",
  "Docker","Data Analysis","Cybersecurity","Node.js","Java","Git",
];

export default function Dashboard() {
  const [skills, setSkills] = useState(new Set());
  const [targetRole, setTargetRole] = useState("");
  const [dashData, setDashData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function toggle(sk) {
    setSkills((prev) => {
      const next = new Set(prev);
      next.has(sk) ? next.delete(sk) : next.add(sk);
      return next;
    });
  }

  async function handleGenerate() {
    if (!skills.size) return alert("Select at least one skill.");
    setError("");
    setLoading(true);
    setDashData(null);
    try {
      const data = await getDashboard([...skills], [], targetRole);
      setDashData(data);
    } catch (err) {
      setError(err.response?.data?.detail || "Could not connect to backend.");
    }
    setLoading(false);
  }

  const db = dashData?.dashboard;
  const recs = dashData?.recommendations || [];

  return (
    <div style={s.page}>
      <h2 style={s.heading}>🏠 Dashboard</h2>
      <p style={s.sub}>Your personalised IT career overview.</p>

      {/* Skill picker */}
      <div style={s.card}>
        <h3 style={s.sectionTitle}>Quick skill select</h3>
        <div style={s.chipGrid}>
          {QUICK_SKILLS.map((sk) => (
            <span key={sk} onClick={() => toggle(sk)}
              style={{ ...s.chip, ...(skills.has(sk) ? s.chipActive : {}) }}>
              {sk}
            </span>
          ))}
        </div>
        <input
          placeholder="Target role (optional, e.g. Data Scientist)"
          value={targetRole}
          onChange={(e) => setTargetRole(e.target.value)}
          style={s.input}
        />
        <button onClick={handleGenerate} disabled={loading} style={s.btn}>
          {loading ? "Generating dashboard…" : "Generate Dashboard"}
        </button>
      </div>

      {error && <div style={s.error}>{error}</div>}

      {/* Summary stats */}
      {db && (
        <div style={s.statsRow}>
          <div style={s.stat}>
            <div style={s.statNum}>{db.top_match?.score}%</div>
            <div style={s.statLabel}>Top Match</div>
            <div style={{ fontSize: 12, color: "#534AB7" }}>{db.top_match?.title}</div>
          </div>
          <div style={s.stat}>
            <div style={s.statNum}>{db.skill_completion}%</div>
            <div style={s.statLabel}>Skill Completion</div>
          </div>
          <div style={s.stat}>
            <div style={s.statNum}>{db.skills_to_learn}</div>
            <div style={s.statLabel}>Skills to Learn</div>
          </div>
          <div style={s.stat}>
            <div style={s.statNum}>{db.total_careers_analyzed}</div>
            <div style={s.statLabel}>Careers Analyzed</div>
          </div>
        </div>
      )}

      {/* Charts */}
      {db?.charts && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1.5rem" }}>
          <div style={s.card}>
            <h4 style={{ marginBottom: 12 }}>Match Scores</h4>
            <SkillChart data={db.charts.match_scores} height={200} />
          </div>
          <div style={s.card}>
            <h4 style={{ marginBottom: 12 }}>Skill Coverage</h4>
            <SkillChart data={db.charts.skill_gap} height={200} />
          </div>
        </div>
      )}

      {/* Recommendations */}
      {recs.length > 0 && (
        <>
          <h3 style={{ margin: "0 0 0.75rem" }}>Top Career Matches</h3>
          {recs.map((rec, i) => (
            <RecommendationCard key={rec.onet_code} rec={rec} userSkills={[...skills]} index={i} />
          ))}
        </>
      )}
    </div>
  );
}

const s = {
  page: { maxWidth: 900, margin: "0 auto", padding: "2rem 1rem" },
  heading: { fontSize: "1.5rem", marginBottom: 4 },
  sub: { color: "#666", marginBottom: "1.5rem" },
  card: { background: "#fff", borderRadius: 12, padding: "1.25rem", marginBottom: "1.5rem", boxShadow: "0 1px 4px rgba(0,0,0,0.08)" },
  sectionTitle: { fontSize: "1rem", marginBottom: 10, color: "#333" },
  chipGrid: { display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 12 },
  chip: { fontSize: 12, padding: "5px 12px", borderRadius: 99, border: "1px solid #ccc", cursor: "pointer" },
  chipActive: { background: "#EEEDFE", color: "#534AB7", borderColor: "#534AB7" },
  input: { width: "100%", padding: "10px 12px", border: "1px solid #ddd", borderRadius: 8, fontSize: 14, marginBottom: 12, boxSizing: "border-box" },
  btn: { width: "100%", padding: 12, background: "#534AB7", color: "#fff", border: "none", borderRadius: 8, fontSize: 15, cursor: "pointer", fontWeight: 600 },
  error: { background: "#FEE2E2", borderLeft: "4px solid #EF4444", padding: "0.75rem 1rem", borderRadius: 8, margin: "1rem 0", fontSize: 14 },
  statsRow: { display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "1rem", marginBottom: "1.5rem" },
  stat: { background: "#fff", borderRadius: 12, padding: "1rem", textAlign: "center", boxShadow: "0 1px 4px rgba(0,0,0,0.08)" },
  statNum: { fontSize: 28, fontWeight: 700, color: "#534AB7" },
  statLabel: { fontSize: 12, color: "#666", marginTop: 2 },
};
