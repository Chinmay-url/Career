import { useState } from "react";
import api from "../services/api";

export default function Login() {
  const [mode, setMode] = useState("login"); // "login" | "register"
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const endpoint = mode === "login" ? "/api/auth/login" : "/api/auth/register";
      const payload = mode === "login"
        ? { email: form.email, password: form.password }
        : { name: form.name, email: form.email, password: form.password };

      const res = await api.post(endpoint, payload);
      localStorage.setItem("token", res.data.access_token);
      window.location.href = "/dashboard";
    } catch (err) {
      setError(err.response?.data?.detail || "Something went wrong.");
    }
    setLoading(false);
  }

  return (
    <div style={s.page}>
      <div style={s.card}>
        <h1 style={{ marginBottom: 4 }}>🎯 CareerAI</h1>
        <p style={{ color: "#666", marginBottom: 24 }}>AI-powered career path recommender</p>

        <div style={s.tabs}>
          {["login", "register"].map((m) => (
            <button key={m} onClick={() => setMode(m)}
              style={{ ...s.tab, ...(mode === m ? s.activeTab : {}) }}>
              {m === "login" ? "Sign In" : "Sign Up"}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit}>
          {mode === "register" && (
            <input style={s.input} placeholder="Full name" value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          )}
          <input style={s.input} type="email" placeholder="Email" value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })} required />
          <input style={s.input} type="password" placeholder="Password" value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })} required />

          {error && <p style={{ color: "#EF4444", fontSize: 13, marginBottom: 8 }}>{error}</p>}

          <button type="submit" disabled={loading} style={s.btn}>
            {loading ? "Please wait…" : mode === "login" ? "Sign In" : "Create Account"}
          </button>
        </form>

        <p style={{ fontSize: 12, color: "#888", marginTop: 16, textAlign: "center" }}>
          Or{" "}
          <a href="/" style={{ color: "#534AB7" }}>
            continue without account
          </a>
        </p>
      </div>
    </div>
  );
}

const s = {
  page: { minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f8f9fa" },
  card: { background: "#fff", borderRadius: 16, padding: "2rem", width: "100%", maxWidth: 400, boxShadow: "0 4px 24px rgba(0,0,0,0.08)" },
  tabs: { display: "flex", marginBottom: 20, borderBottom: "2px solid #eee" },
  tab: { flex: 1, padding: "8px 0", border: "none", background: "none", cursor: "pointer", fontSize: 14, borderBottom: "3px solid transparent", marginBottom: -2 },
  activeTab: { borderBottomColor: "#534AB7", color: "#534AB7", fontWeight: 600 },
  input: { width: "100%", padding: "10px 12px", border: "1px solid #ddd", borderRadius: 8, fontSize: 14, marginBottom: 12, boxSizing: "border-box" },
  btn: { width: "100%", padding: "12px", background: "#534AB7", color: "#fff", border: "none", borderRadius: 8, fontSize: 15, cursor: "pointer", fontWeight: 600 },
};
