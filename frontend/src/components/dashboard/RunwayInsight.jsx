export default function RunwayInsight({ summary, runway, budgetStatus }) {
  const avgDaily = Number(runway.averageDailyExpense);
  const balance = summary.balance;
  const days = runway.estimatedDaysRemaining;

  // Find the highest overspent budget
  const worstBudget = budgetStatus
    .filter((b) => b.spent > 0)
    .sort((a, b) => (b.spent / b.limit) - (a.spent / a.limit))[0];

  // Calculate: if user reduces top category by 20%, how many days gained?
  const potentialSaving = worstBudget ? Math.round(worstBudget.spent * 0.2) : 0;
  const newDailySpend = avgDaily > 0 ? Math.max(1, avgDaily - potentialSaving / 30) : 0;
  const newRunway = newDailySpend > 0 && balance > 0 ? Math.floor(balance / newDailySpend) : 0;
  const daysGained = Math.max(0, newRunway - days);

  const riskColor = {
    Low: "#22c55e", Moderate: "#f59e0b", High: "#ef4444", Critical: "#ef4444",
  }[runway.riskLevel] || "#ef4444";

  const riskBg = {
    Low: "rgba(34,197,94,0.08)", Moderate: "rgba(245,158,11,0.08)",
    High: "rgba(239,68,68,0.08)", Critical: "rgba(239,68,68,0.1)",
  }[runway.riskLevel] || "rgba(239,68,68,0.1)";

  return (
    <div style={{
      background: "var(--surface)",
      border: `1px solid var(--border)`,
      borderRadius: 16,
      padding: "24px",
      marginTop: 14,
      position: "relative",
      overflow: "hidden",
    }}>

      <div style={{ fontSize: 15, fontWeight: 600, color: "var(--text)", marginBottom: 20, display: "flex", alignItems: "center", gap: 8 }}>
        Financial Runway
      </div>

      {/* Main metrics row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))", gap: 14, marginBottom: 20 }}>
        {[
          { label: "Current Balance", value: `₹${Math.abs(balance).toLocaleString()}`, color: balance >= 0 ? "#22c55e" : "#ef4444" },
          { label: "Avg. Daily Spend", value: `₹${Math.round(avgDaily).toLocaleString()}`, color: "var(--text)" },
          { label: "Estimated Runway", value: days === 0 ? "0 days" : `${days} days`, color: riskColor },
        ].map((m) => (
          <div key={m.label} style={{
            background: "var(--bg)", border: "1px solid var(--border)",
            borderRadius: 12, padding: "14px 16px",
          }}>
            <div style={{ fontSize: 11, color: "var(--muted)", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.05em" }}>
              {m.label}
            </div>
            <div style={{ fontSize: 20, fontWeight: 700, color: m.color }}>
              {m.value}
            </div>
          </div>
        ))}
      </div>

      {/* Runway progress bar */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "var(--muted)", marginBottom: 6 }}>
          <span>Runway health</span>
          <span style={{ color: riskColor, fontWeight: 600 }}>{runway.riskLevel} Risk</span>
        </div>
        <div style={{ height: 8, background: "var(--border)", borderRadius: 99, overflow: "hidden" }}>
          <div style={{
            height: "100%", borderRadius: 99,
            background: `linear-gradient(90deg, ${riskColor}, ${riskColor}88)`,
            width: `${Math.min(100, (days / 90) * 100)}%`,
            transition: "width 1.2s ease",
            boxShadow: `0 0 10px ${riskColor}44`,
          }} />
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "var(--muted)", marginTop: 4 }}>
          <span>0 days</span>
          <span>30 days</span>
          <span>60 days</span>
          <span>90+ days</span>
        </div>
      </div>

      {/* AI Recommendation box */}
      {worstBudget && avgDaily > 0 && (
        <div style={{
          background: "rgba(37,99,235,0.08)",
          border: "1px solid rgba(37,99,235,0.2)",
          borderRadius: 12,
          padding: "16px 18px",
        }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: "#60a5fa", marginBottom: 10, display: "flex", alignItems: "center", gap: 6 }}>
            Runway Recommendation
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div>
              <div style={{ fontSize: 11, color: "var(--muted)", marginBottom: 4 }}>If you reduce</div>
              <div style={{ fontSize: 13, color: "var(--text)", fontWeight: 500 }}>
                {worstBudget.category} spending by 20%
              </div>
              <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 2 }}>
                Save ~₹{potentialSaving.toLocaleString()}/month
              </div>
            </div>

            <div style={{ borderLeft: "1px solid var(--border)", paddingLeft: 12 }}>
              <div style={{ fontSize: 11, color: "var(--muted)", marginBottom: 4 }}>You gain</div>
              <div style={{ fontSize: 20, fontWeight: 700, color: "#22c55e" }}>
                +{daysGained} days
              </div>
              <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 2 }}>
                Extended runway
              </div>
            </div>
          </div>

          {balance <= 0 && (
            <div style={{ marginTop: 12, fontSize: 12, color: "#f59e0b", padding: "8px 12px", background: "rgba(245,158,11,0.08)", borderRadius: 8 }}>
              Your balance is negative. Add income transactions to track runway accurately.
            </div>
          )}
        </div>
      )}

      {/* No budget warning */}
      {budgetStatus.length === 0 && (
        <div style={{ fontSize: 12, color: "var(--muted)", textAlign: "center", padding: "12px", border: "1px dashed var(--border)", borderRadius: 10 }}>
          Set budgets to get personalized runway recommendations
        </div>
      )}
    </div>
  );
}