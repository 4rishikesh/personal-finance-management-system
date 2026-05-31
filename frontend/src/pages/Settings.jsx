import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/layout/Layout";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";

export default function Settings() {
  const { user, logout } = useAuth();
  const { darkMode, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [apiKey, setApiKey] = useState(() => localStorage.getItem("gemini-key") || "");
  const [saved, setSaved] = useState(false);

  const handleLogout = () => { logout(); navigate("/login"); };

  const saveKey = () => {
    localStorage.setItem("gemini-key", apiKey);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <Layout>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 22, fontWeight: 600, color: "var(--text)", margin: 0 }}>Settings</h1>
        <p style={{ fontSize: 14, color: "var(--muted)", marginTop: 4 }}>Manage your account preferences</p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 14, maxWidth: 520 }}>
        <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12, padding: "20px 24px" }}>
          <div style={{ fontSize: 14, fontWeight: 500, color: "var(--text)", marginBottom: 16 }}>Account</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10, fontSize: 13 }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: "var(--muted)" }}>Name</span>
              <span style={{ color: "var(--text)", fontWeight: 500 }}>{user?.name || "—"}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: "var(--muted)" }}>Email</span>
              <span style={{ color: "var(--text)" }}>{user?.email || "—"}</span>
            </div>
          </div>
        </div>

        <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12, padding: "20px 24px" }}>
          <div style={{ fontSize: 14, fontWeight: 500, color: "var(--text)", marginBottom: 16 }}>Appearance</div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <div style={{ fontSize: 13, color: "var(--text)" }}>Theme</div>
              <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 2 }}>{darkMode ? "Dark mode" : "Light mode"}</div>
            </div>
            <button onClick={toggleTheme} style={{ background: "transparent", border: "1px solid var(--border)", borderRadius: 8, padding: "7px 14px", fontSize: 13, color: "var(--muted)", cursor: "pointer" }}>
              Switch to {darkMode ? "light" : "dark"}
            </button>
          </div>
        </div>

        <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12, padding: "20px 24px" }}>
          <div style={{ fontSize: 14, fontWeight: 500, color: "var(--text)", marginBottom: 16 }}>Session</div>
          <button onClick={handleLogout} style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.25)", color: "#ef4444", borderRadius: 8, padding: "9px 18px", fontSize: 13, cursor: "pointer" }}>
            Sign out
          </button>
        </div>
      </div>
    </Layout>
  );
}