import { useState } from "react";
import { getCareerAdvice, getSkillGap, getLearningPath } from "../services/recommendationAPI";

export default function RecommendationCard({ rec, userSkills, index }) {
  const [advice, setAdvice] = useState("");
  const [gapData, setGapData] = useState(null);
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState("");

  const pct = Math.round(rec.match_score || 0);
  const color = index === 0 ? "#534AB7" : "#1D9E75";
  const circumference = 2 * Math.PI * 26;
  const dash = (pct / 100) * circumference;

  async function handleAdvice() {
    setLoading("advice");
    try {
      const text = await getCareerAdvice(rec.title, userSkills, rec.skill_gap || []);
      setAdvice(text);
    } catch {
      setAdvice("Could not load advice. Try again.");
    }
    setLoading("");
  }

  async function handleGap() {
    setLoading("gap");
    try {
      const data = await getSkillGap(userSkills, rec.title);
      setGapData(data);
    } catch {
      setGapData({ error: "Could not load skill gap." });
    }
    setLoading("");
  }

  async function handleLearning() {
    if (!gapData?.missing_skills?.length) return;
    setLoading("learn");
    try {
      const data = await getLearningPath(gapData.missing_skills.slice(0, 8), rec.title);
      setResources(data.resources || []);
    } catch {
      setResources([]);
    }
    setLoading("");
  }

  return (
    <div style={s.card}>
      {/* Score ring */}
      <svg width={64} height={64} viewBox="0 0 64 64" style={{ flexShrink: 0 }}>
        <circle cx={32} cy={32} r={26} fill={index === 0 ? "#EEEDFE" : "#f5f5f5"} stroke="#eee" strokeWidth={5} />
        <circle cx={32} cy={32} r={26} fill="none" stroke={color} strokeWidth={5}
          strokeDasharray={`${dash} ${circumference}`} strokeDashoffset={circumference * 0.25}
          strokeLinecap="round" style={{ transform: "rotate(-90deg)", transformOrigin: "center" }} />
        <text x={32} y={37} textAnchor="middle" fontSize={13} fontWeight={600} fill="#333">{pct}%</text>
      </svg>

      <div style={{ flex: 1 }}>
        <strong style={{ fontSize: 16 }}>{rec.title}</strong>
        <div style={{ fontSize: 11, color: "#999", marginBottom: 4 }}>O*NET: {rec.onet_code}</div>
        <p style={{ fontSize: 12, color: "#666", marginBottom: 8 }}>
          {(rec.description || "").slice(0, 130)}{rec.description?.length > 130 ? "…" : ""}
        </p>

        {/* Progress bar */}
        <div style={s.bar}><div style={{ ...s.fill, width: `${pct}%` }} /></div>

        {/* Tags */}
        <div style={{ marginTop: 8 }}>
          {(rec.matched_skills || []).slice(0, 3).map((sk) => (
            <span key={sk} style={s.matchTag}>✓ {sk}</span>
          ))}
          {(rec.skill_gap || []).slice(0, 4).map((sk) => (
            <span key={sk} style={s.gapTag}>+ {sk}</span>
          ))}
        </div>

        {/* Action buttons */}
        <div style={{ display: "flex", gap: 8, marginTop: 10, flexWrap: "wrap" }}>
          <button onClick={handleAdvice} disabled={loading === "advice"} style={s.btn("#534AB7")}>
            {loading === "advice" ? "…" : "💡 AI Advice"}
          </button>
          <button onClick={handleGap} disabled={loading === "gap"} style={s.btn("#1D9E75")}>
            {loading === "gap" ? "…" : "📊 Skill Gap"}
          </button>
        </div>

        {/* Advice block */}
        {advice && (
          <div style={s.adviceBox}>
            {advice.split("\n").map((line, i) => <p key={i} style={{ margin: "2px 0" }}>{line}</p>)}
          </div>
        )}

        {/* Gap block */}
        {gapData && !gapData.error && (
          <div style={{ ...s.adviceBox, background: "#EEF2FF", borderColor: "#534AB7" }}>
            <strong>Skill Gap — {gapData.target_role}</strong>
            <div style={s.bar}><div style={{ ...s.fill, width: `${gapData.completion_pct || 0}%` }} /></div>
            <p style={{ fontSize: 12, margin: "4px 0" }}>
              {gapData.completion_pct}% ready · {gapData.matched_skills?.length} matched · {gapData.missing_skills?.length} to learn
            </p>
            <div>
              {(gapData.missing_skills || []).slice(0, 8).map((sk) => (
                <span key={sk} style={s.gapTag}>+ {sk}</span>
              ))}
            </div>
            {gapData.missing_skills?.length > 0 && (
              <button onClick={handleLearning} disabled={loading === "learn"} style={{ ...s.btn("#534AB7"), marginTop: 8 }}>
                {loading === "learn" ? "…" : "📚 Get Learning Resources"}
              </button>
            )}
          </div>
        )}

        {/* Learning resources */}
        {resources.length > 0 && (
          <div style={{ ...s.adviceBox, background: "#F0FDF4", borderColor: "#1D9E75" }}>
            <strong>📚 Learning Path</strong>
            {resources.map((r, i) => (
              <div key={i} style={{ padding: "6px 0", borderBottom: "1px solid #ddd", fontSize: 13 }}>
                <strong>{r.skill}</strong> — {r.resource}
                <span style={{ color: "#666" }}> · {r.url_hint}</span>
                <span style={{ color: "#1D9E75" }}> · ⏱ {r.time_estimate}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

const s = {
  card: {
    background: "#fff", borderRadius: 12, padding: "1.25rem",
    marginBottom: "1rem", boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
    display: "flex", gap: "1rem",
  },
  bar: { height: 6, background: "#eee", borderRadius: 3, margin: "6px 0" },
  fill: { height: "100%", borderRadius: 3, background: "linear-gradient(90deg,#534AB7,#1D9E75)", transition: "width .5s" },
  matchTag: { fontSize: 11, background: "#E1F5EE", color: "#0F6E56", padding: "3px 8px", borderRadius: 99, display: "inline-block", margin: 2 },
  gapTag: { fontSize: 11, background: "#FAEEDA", color: "#854F0B", padding: "3px 8px", borderRadius: 99, display: "inline-block", margin: 2 },
  adviceBox: { background: "#E1F5EE", borderLeft: "4px solid #1D9E75", padding: "0.75rem 1rem", borderRadius: 8, marginTop: 10, fontSize: 13, lineHeight: 1.7 },
  btn: (color) => ({
    fontSize: 12, padding: "5px 14px", borderRadius: 6,
    border: `1px solid ${color}`, color, background: "none", cursor: "pointer",
  }),
};
