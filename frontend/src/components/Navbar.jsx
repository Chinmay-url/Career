import { Link, useLocation } from "react-router-dom";

const links = [
  { to: "/dashboard", label: "Dashboard" },
  { to: "/recommendations", label: "Recommendations" },
  { to: "/resume", label: "Resume" },
  { to: "/skill-gap", label: "Skill Gap" },
  { to: "/trends", label: "Trends" },
];

export default function Navbar() {
  const { pathname } = useLocation();

  function handleLogout() {
    localStorage.removeItem("token");
    window.location.href = "/login";
  }

  return (
    <nav style={styles.nav}>
      <Link to="/dashboard" style={styles.brand}>
        🎯 CareerAI
      </Link>
      <div style={styles.links}>
        {links.map((l) => (
          <Link
            key={l.to}
            to={l.to}
            style={{
              ...styles.link,
              ...(pathname === l.to ? styles.activeLink : {}),
            }}
          >
            {l.label}
          </Link>
        ))}
      </div>
      <button onClick={handleLogout} style={styles.logout}>
        Logout
      </button>
    </nav>
  );
}

const styles = {
  nav: {
    display: "flex",
    alignItems: "center",
    padding: "0 2rem",
    height: 56,
    background: "#1a1a2e",
    color: "#fff",
    gap: "1.5rem",
    position: "sticky",
    top: 0,
    zIndex: 100,
  },
  brand: {
    color: "#fff",
    textDecoration: "none",
    fontWeight: 700,
    fontSize: 18,
    marginRight: "auto",
  },
  links: { display: "flex", gap: "1rem" },
  link: {
    color: "#ccc",
    textDecoration: "none",
    fontSize: 14,
    padding: "4px 8px",
    borderRadius: 6,
  },
  activeLink: { color: "#fff", background: "#534AB7" },
  logout: {
    background: "none",
    border: "1px solid #555",
    color: "#ccc",
    padding: "4px 12px",
    borderRadius: 6,
    cursor: "pointer",
    fontSize: 13,
  },
};
