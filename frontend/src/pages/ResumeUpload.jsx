import { useState } from "react";
import UploadBox from "../components/UploadBox";
import RecommendationCard from "../components/RecommendationCard";
import { uploadResume } from "../services/resumeAPI";

export default function ResumeUpload() {
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState(null);
  const [recs, setRecs] = useState([]);
  const [error, setError] = useState("");

  async function handleFile(file) {
    setError("");
    setLoading(true);
    setProfile(null);
    setRecs([]);
    try {
      const data = await uploadResume(file);
      setProfile(data.parsed_profile);
      setRecs(data.recommendations || []);
    } catch (err) {
      setError(err.response?.data?.detail || "Upload failed. Check the backend is running.");
    }
    setLoading(false);
  }

  return (
    <div style={s.page}>
      <h2 style={s.heading}>📄 Resume Upload</h2>
      <p style={s.sub}>Upload your PDF resume — Groq LLM extracts your skills and matches you to IT careers.</p>

      <UploadBox onFile={handleFile} loading={loading} />

      {error && <div style={s.error}>{error}</div>}

      {profile && (
        <div style={s.profileBox}>
          <strong>✅ Resume parsed successfully</strong>
          <div style={s.grid}>
            <div><span style={s.label}>Name</span>{profile.name}</div>
            <div><span style={s.label}>Role</span>{profile.current_role}</div>
            <div><span style={s.label}>Experience</span>{profile.experience_years} years</div>
            <div><span style={s.label}>Education</span>{profile.education}</div>
          </div>
          <div style={{ marginTop: 8 }}>
            <span style={s.label}>Skills ({profile.skills?.length})</span>
            {(profile.skills || []).map((sk) => (
              <span key={sk} style={s.chip}>{sk}</span>
            ))}
          </div>
        </div>
      )}

      {recs.length > 0 && (
        <>
          <h3 style={{ margin: "1.5rem 0 0.75rem" }}>
            🎯 {recs.length} Career Matches
          </h3>
          {recs.map((rec, i) => (
            <RecommendationCard key={rec.onet_code} rec={rec} userSkills={profile?.skills || []} index={i} />
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
  error: { background: "#FEE2E2", borderLeft: "4px solid #EF4444", padding: "0.75rem 1rem", borderRadius: 8, margin: "1rem 0", fontSize: 14 },
  profileBox: { background: "#EEF2FF", borderLeft: "4px solid #534AB7", padding: "1rem 1.25rem", borderRadius: 8, margin: "1.5rem 0", fontSize: 14 },
  grid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4px 16px", margin: "8px 0" },
  label: { fontWeight: 600, marginRight: 6 },
  chip: { fontSize: 11, background: "#EEEDFE", color: "#534AB7", padding: "3px 10px", borderRadius: 99, display: "inline-block", margin: 2 },
};
