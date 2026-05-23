import { useState } from "react";
import { getSkillGap, getLearningPath } from "../services/recommendationAPI";

const IT_ROLES = [
  "Software Developer","Data Scientist","Machine Learning Engineer",
  "DevOps Engineer","Cloud Architect","Cybersecurity Analyst",
  "Full Stack Developer","Backend Developer","Frontend Developer",
  "Data Engineer","AI Engineer","Mobile Developer","Database Administrator",
  "Network Engineer","Product Manager","QA Engineer","Embedded Systems Engineer",
];

export default function SkillGap() {
  const [skills, setSkills] = useState("");
  const [role, setRole] = useState("");
  const [gapData, setGapData] = useState(null);
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState("");
  const [error, setError] = useState("");

  async function handleAnalyze() {
    const skillList = skills.split(",").map((s) => s.trim()).filter(Boolean);
    if (!skillList.length || !role) return alert("Enter skills and select a role.");
    setError("");
    setGapData(null);
    setResources([]);
    setLoading("gap");
    try {
      const data = await getSkillGap(skillList, role);
      setGapData(data);
    } catch (err) {
      setError(err.response?.data?.detail || "Could not analyze skill gap.");
    }
    setLoading("");
  }

  async function handleLearning() {
    if (!gapData?.missing_skills?.length) return;
    setLoading("learn");
    try {
      const data = await getLearningPath(gapData.missing_skills.slice(0, 8), role);
      setResources(data.resources || []);
    } catch {
      setError("Could not load learning resources.");
    }
    setLoading("");
  }

  const pct = gapData?.completion_pct || 0;

  return (
    <div style={s.page}>
      <h2 style={s.heading}>📊 Skill Gap Analysis</h2>
      <p style={s.sub}>Enter your skills and a target IT role to see exactly what you need to learn.</p>

      <label style={s.label}>Your current skills (comma-separated)</label>
      <textarea
        value={skills}
        onChange={(e) => setSkills(e.target.value)}
        placeholder="Python, SQL, Machine Learning, Docker…"
        style={s.textarea}
        rows={3}
      />

      <label style={s.label}>Target role</label>
      <select value={role} onChange={(e) => setRole(e.target.value)} style={s.select}>
        <option value="">Select a role…</option>
        {IT_ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
      </select>

      <button onClick={handleAnalyze} disabled={loading === "gap"} style={s.btn}>
        {loading === "gap" ? "Analyzing…" : "Analyze Skill Gap"}
      </button>

      {error && <div style={s.error}>{error}</div>}

      {gapData && (
        <div style={s.resultBox}>
          <h3 style={{ marginBottom: 8 }}>Results for: {gapData.target_role}</h3>

          {/* Progress */}
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
            <div style={{ flex: 1 }}>
              <div style={s.bar}><div style={{ ...s.fill, width: `${pct}%` }} /></div>
            </div>
            <strong style={{ fontSize: 18, color: "#534AB7" }}>{pct}%</strong>
          </div>
          <p style={{ fontSize: 13, color: "#666", marginBottom: 12 }}>
            {gapData.matched_skills?.length} of {gapData.total_required} required skills matched
          </p>

          {/* Matched */}
          {gapData.matched_skills?.length > 0 && (
            <div style={{ marginBottom: 12 }}>
              <strong style={{ fontSize: 13 }}>✅ Skills you have</strong>
              <div style={{ marginTop: 6 }}>
                {gapData.matched_skills.map((sk) => (
                  <span key={sk} style={s.matchTag}>{sk}</span>
                ))}
              </div>
            </div>
          )}

          {/* Missing */}
          {gapData.missing_skills?.length > 0 && (
            <div style={{ marginBottom: 12 }}>
              <strong style={{ fontSize: 13 }}>📚 Skills to learn</strong>
              <div style={{ marginTop: 6 }}>
                {gapData.missing_skills.map((sk) => (
                  <span key={sk} style={s.gapTag}>{sk}</span>
                ))}
              </div>
            </div>
          )}

          <button onClick={handleLearning} disabled={loading === "learn"} style={{ ...s.btn, background: "#1D9E75" }}>
            {loading === "learn" ? "Loading resources…" : "📚 Get Free Learning Resources"}
          </button>
        </div>
      )}

      {resources.length > 0 && (
        <div style={{ ...s.resultBox, background: "#F0FDF4", borderColor: "#1D9E75" }}>
          <h3 style={{ marginBottom: 12 }}>📚 Learning Path for {role}</h3>
          {resources.map((r, i) => (
            <div key={i} style={{ padding: "8px 0", borderBottom: "1px solid #ddd", fontSize: 14 }}>
              <strong>{r.skill}</strong>
              <span style={{ color: "#534AB7" }}> — {r.resource}</span>
              <span style={{ color: "#666" }}> · {r.url_hint}</span>
              <span style={{ color: "#1D9E75", fontWeight: 500 }}> · ⏱ {r.time_estimate}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const s = {
  page: { maxWidth: 860, margin: "0 auto", padding: "2rem 1rem" },
  heading: { fontSize: "1.5rem", marginBottom: 4 },
  sub: { color: "#666", marginBottom: "1.5rem" },
  label: { display: "block", fontWeight: 600, fontSize: 13, marginBottom: 4 },
  textarea: { width: "100%", padding: "10px 12px", border: "1px solid #ddd", borderRadius: 8, fontSize: 14, marginBottom: 12, boxSizing: "border-box", resize: "vertical" },
  select: { width: "100%", padding: "10px 12px", border: "1px solid #ddd", borderRadius: 8, fontSize: 14, marginBottom: 12 },
  btn: { width: "100%", padding: 12, background: "#534AB7", color: "#fff", border: "none", borderRadius: 8, fontSize: 15, cursor: "pointer", fontWeight: 600, marginBottom: 8 },
  error: { background: "#FEE2E2", borderLeft: "4px solid #EF4444", padding: "0.75rem 1rem", borderRadius: 8, margin: "1rem 0", fontSize: 14 },
  resultBox: { background: "#EEF2FF", borderLeft: "4px solid #534AB7", padding: "1.25rem", borderRadius: 8, marginTop: "1.5rem" },
  bar: { height: 10, background: "#ddd", borderRadius: 5 },
  fill: { height: "100%", borderRadius: 5, background: "linear-gradient(90deg,#534AB7,#1D9E75)", transition: "width .5s" },
  matchTag: { fontSize: 11, background: "#E1F5EE", color: "#0F6E56", padding: "3px 8px", borderRadius: 99, display: "inline-block", margin: 2 },
  gapTag: { fontSize: 11, background: "#FAEEDA", color: "#854F0B", padding: "3px 8px", borderRadius: 99, display: "inline-block", margin: 2 },
};
