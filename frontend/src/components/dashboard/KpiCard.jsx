import CountUp from "react-countup";

export default function KpiCard({ label, value, sub, prefix = "", isCurrency = false, color }) {
  const numericValue = typeof value === "number" ? value : parseFloat(String(value).replace(/[^0-9.-]/g, "")) || 0;
  const isNegative = numericValue < 0;

  return (
    <div
      style={{
        background: "var(--surface)",
        border: `1px solid ${color ? `${color}33` : "var(--border)"}`,
        borderRadius: 12,
        padding: "18px 20px",
        transition: "transform 0.15s, box-shadow 0.15s",
        cursor: "default",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-2px)";
        e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.12)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "none";
      }}
    >
      <div style={{ fontSize: 12, color: "var(--muted)", marginBottom: 10 }}>{label}</div>
      <div style={{
        fontSize: 22,
        fontWeight: 700,
        color: color || (isNegative ? "#ef4444" : "var(--text)"),
        display: "flex",
        alignItems: "baseline",
        gap: 2,
      }}>
        {isCurrency && (
          <span style={{ fontSize: 14, fontWeight: 500 }}>
            {isNegative ? "-₹" : "₹"}
          </span>
        )}
        <CountUp
          end={Math.abs(numericValue)}
          duration={1.2}
          separator=","
          decimals={0}
          useEasing
        />
        {!isCurrency && prefix && <span style={{ fontSize: 14 }}>{prefix}</span>}
      </div>
      {sub && (
        <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 4 }}>{sub}</div>
      )}
    </div>
  );
}