import { useState } from "react";
import RecommendationCard from "../components/RecommendationCard";
import { getRecommendations } from "../services/recommendationAPI";

const SKILLS = [
  "Python","JavaScript","TypeScript","Java","C++","C#","Go","SQL","R",
  "React","Node.js","Vue.js","Angular","HTML","CSS","Next.js","GraphQL",
  "Machine Learning","Deep Learning","NLP","Computer Vision","TensorFlow",
  "PyTorch","Scikit-learn","Pandas","NumPy","Data Analysis","Statistics",
  "AWS","Azure","GCP","Docker","Kubernetes","CI/CD","Terraform","Linux","Git",
  "Cybersecurity","Networking","MongoDB","PostgreSQL","Redis","Spark","Tableau",
  "Agile","Scrum","Project Management",
];

export default function Recommendation() {
  const [selected, setSelected] = useState(new Set());
  const [interest, setInterest] = useState("");
  const [recs, setRecs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function toggle(skill) {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(skill) ? next.delete(skill) : next.add(skill);
      return next;
    });
  }

  async function handleSubmit() {
    if (!selected.size) return alert("Select at least one skill.");
    setError("");
    setLoading(true);
    setRecs([]);
    try {
      const interests = interest ? [interest] : [];
      const data = await getRecommendations([...selected], interests, 5);
      setRecs(data);
    } catch (err) {
      setError(err.response?.data?.detail || "Could not connect to backend.");
    }
    setLoading(false);
  }

  return (
    <div style={s.page}>
      <h2 style={s.heading}>🎯 Career Recommendations</h2>
      <p style={s.sub}>Select your skills and get matched to IT careers from the O*NET database.</p>

      <h3 style={s.sectionTitle}>Your Skills</h3>
      <div style={s.grid}>
        {SKILLS.map((sk) => (
          <span key={sk} onClick={() => toggle(sk)}
            style={{ ...s.chip, ...(selected.has(sk) ? s.chipActive : {}) }}>
            {sk}
          </span>
        ))}
      </div>

      <h3 style={s.sectionTitle}>Industry Interest</h3>
      <select value={interest} onChange={(e) => setInterest(e.target.value)} style={s.select}>
        <option value="">Any</option>
        {["Technology","Finance","Healthcare","Consulting","Government","Education","Engineering"].map((i) => (
          <option key={i} value={i}>{i}</option>
        ))}
      </select>

      <button onClick={handleSubmit} disabled={loading} style={s.btn}>
        {loading ? "Analyzing 879 IT careers…" : `Generate Recommendations (${selected.size} skills selected)`}
      </button>

      {error && <div style={s.error}>{error}</div>}

      {recs.length > 0 && (
        <>
          <h3 style={{ margin: "1.5rem 0 0.75rem" }}>
            Found {recs.length} career matches
          </h3>
          {recs.map((rec, i) => (
            <RecommendationCard key={rec.onet_code} rec={rec} userSkills={[...selected]} index={i} />
          ))}
        </>
      )}
    </div>
  );
}

const s = {
  page: { maxWidth: 860, margin: "0 auto", padding: "2rem 1rem" },
  heading: { fontSize: "1.5rem", marginBottom: 4 },
  sub: { color: "#666", marginBottom: "1.5rem" },
  sectionTitle: { fontSize: "1rem", margin: "1.25rem 0 0.5rem", color: "#333" },
  grid: { display: "flex", flexWrap: "wrap", gap: 8, marginBottom: "1rem" },
  chip: { fontSize: 12, padding: "5px 12px", borderRadius: 99, border: "1px solid #ccc", cursor: "pointer", transition: "all .15s" },
  chipActive: { background: "#EEEDFE", color: "#534AB7", borderColor: "#534AB7" },
  select: { width: "100%", padding: "8px 12px", border: "1px solid #ddd", borderRadius: 8, fontSize: 14, marginBottom: "1rem" },
  btn: { width: "100%", padding: 12, background: "#534AB7", color: "#fff", border: "none", borderRadius: 8, fontSize: 15, cursor: "pointer", fontWeight: 600 },
  error: { background: "#FEE2E2", borderLeft: "4px solid #EF4444", padding: "0.75rem 1rem", borderRadius: 8, margin: "1rem 0", fontSize: 14 },
};
