import { useState } from "react";
import { getGeminiInsights } from "../../services/geminiService";

const typeStyle = {
  warning: { bg: "rgba(245,158,11,0.1)",  border: "rgba(245,158,11,0.25)", text: "#f59e0b", icon: "⚠️" },
  alert:   { bg: "rgba(239,68,68,0.1)",   border: "rgba(239,68,68,0.25)",  text: "#ef4444", icon: "🚨" },
  success: { bg: "rgba(34,197,94,0.1)",   border: "rgba(34,197,94,0.25)",  text: "#22c55e", icon: "✅" },
  tip:     { bg: "rgba(37,99,235,0.1)",   border: "rgba(37,99,235,0.25)",  text: "#60a5fa", icon: "💡" },
};

function InsightCard({ insight, delay }) {
  const s = typeStyle[insight.type] || typeStyle.tip;
  return (
    <div style={{
      background: s.bg,
      border: `1px solid ${s.border}`,
      borderRadius: 12,
      padding: "16px 18px",
      animation: `fadeIn 0.4s ease ${delay}s both`,
      transition: "transform 0.15s, box-shadow 0.15s",
      cursor: "default",
    }}
    onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 6px 20px rgba(0,0,0,0.12)"; }}
    onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 8 }}>
        <span style={{ fontSize: 15 }}>{s.icon}</span>
        <span style={{ fontSize: 12, fontWeight: 600, color: s.text, letterSpacing: "0.01em" }}>
          {insight.title}
        </span>
      </div>
      <p style={{ fontSize: 12.5, color: "var(--muted)", margin: 0, lineHeight: 1.65 }}>
        {insight.message}
      </p>
    </div>
  );
}

function LoadingState() {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
      {[0, 1, 2, 3].map((i) => (
        <div key={i} style={{
          borderRadius: 12, padding: "16px 18px",
          background: "var(--bg)", border: "1px solid var(--border)",
          animation: "pulse 1.5s ease infinite",
        }}>
          <div style={{ width: 80, height: 11, background: "var(--border)", borderRadius: 4, marginBottom: 10 }} />
          <div style={{ width: "100%", height: 10, background: "var(--border)", borderRadius: 4, marginBottom: 6 }} />
          <div style={{ width: "75%", height: 10, background: "var(--border)", borderRadius: 4 }} />
        </div>
      ))}
    </div>
  );
}

export default function AIInsights({ financialData }) {
  const [insights, setInsights] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  const generate = async () => {
    setLoading(true);
    setError("");
    setInsights([]);
    try {
      const result = await getGeminiInsights(financialData);
      setInsights(result);
      setDone(true);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      background: "var(--surface)",
      border: "1px solid var(--border)",
      borderRadius: 16,
      padding: "24px",
      marginTop: 14,
    }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
        <div>
          <div style={{ fontSize: 15, fontWeight: 600, color: "var(--text)", display: "flex", alignItems: "center", gap: 8 }}>
            ✨ AI Financial Insights
            <span style={{
              fontSize: 10, background: "rgba(124,58,237,0.15)", color: "#a78bfa",
              padding: "2px 8px", borderRadius: 99,
              border: "1px solid rgba(124,58,237,0.3)", fontWeight: 500,
            }}>
              Llama 3 · Local AI
            </span>
          </div>
          <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 3 }}>
            {done
              ? "Analysis based on your actual financial data"
              : "Click to get personalized recommendations from local AI"}
          </div>
        </div>

        <button
          onClick={generate}
          disabled={loading}
          style={{
            background: loading
              ? "var(--border)"
              : done
              ? "linear-gradient(135deg, #059669, #047857)"
              : "linear-gradient(135deg, #7c3aed, #2563eb)",
            color: "#fff",
            border: "none",
            borderRadius: 9,
            padding: "9px 18px",
            fontSize: 13,
            fontWeight: 500,
            cursor: loading ? "not-allowed" : "pointer",
            opacity: loading ? 0.8 : 1,
            transition: "all 0.2s",
            whiteSpace: "nowrap",
            display: "flex",
            alignItems: "center",
            gap: 6,
          }}
        >
          {loading ? (
            <>
              <span style={{ display: "inline-block", animation: "spin 1s linear infinite" }}>⟳</span>
              Analyzing...
            </>
          ) : done ? (
            "↺ Refresh"
          ) : (
            "Generate Insights"
          )}
        </button>
      </div>

      {/* States */}
      {!loading && !done && !error && (
        <div style={{
          textAlign: "center", padding: "36px 20px",
          border: "1px dashed var(--border)", borderRadius: 12,
          color: "var(--muted)",
        }}>
          <div style={{ fontSize: 36, marginBottom: 10 }}>🤖</div>
          <div style={{ fontSize: 14, fontWeight: 500, color: "var(--text)", marginBottom: 6 }}>
            Local AI ready
          </div>
          <div style={{ fontSize: 13 }}>
            Powered by Ollama running on your machine — no internet, no API key, completely free.
          </div>
        </div>
      )}

      {loading && <LoadingState />}

      {error && (
        <div style={{
          color: "#ef4444", fontSize: 13,
          padding: "14px 16px",
          background: "rgba(239,68,68,0.08)",
          borderRadius: 10,
          border: "1px solid rgba(239,68,68,0.2)",
          lineHeight: 1.6,
        }}>
          <strong>Error:</strong> {error}
          <div style={{ marginTop: 8, fontSize: 12, color: "var(--muted)" }}>
            Make sure Ollama is running: open a terminal and run <code style={{ background: "var(--bg)", padding: "1px 6px", borderRadius: 4 }}>ollama serve</code>
          </div>
        </div>
      )}

      {!loading && insights.length > 0 && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          {insights.map((insight, i) => (
            <InsightCard key={i} insight={insight} delay={i * 0.08} />
          ))}
        </div>
      )}
    </div>
  );
}