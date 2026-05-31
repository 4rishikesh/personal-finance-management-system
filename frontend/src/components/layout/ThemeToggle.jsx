import { useTheme } from "../../context/ThemeContext";

export default function ThemeToggle() {
  const { darkMode, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      style={{
        padding: "7px 14px", borderRadius: 8, fontSize: 13,
        background: "transparent", border: "1px solid var(--border)",
        color: "var(--muted)", cursor: "pointer", transition: "all 0.15s",
      }}
    >
      {darkMode ? "☀ Light" : "☾ Dark"}
    </button>
  );
}