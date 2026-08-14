import { useEffect, useState } from "react";
import Layout from "../components/layout/Layout";
import MonthlyTrendChart from "../components/dashboard/MonthlyTrendChart";
import KpiCard from "../components/dashboard/KpiCard";
import Skeleton from "../components/common/Skeleton";
import {
  getSummary,
  getRunway,
  getMonthlyTrend,
} from "../services/analyticsService";
import { getBudgetStatus } from "../services/budgetService";
import { useAuth } from "../context/AuthContext";
import CountUp from "react-countup";
import AIInsights from "../components/dashboard/AIInsights";
import RunwayInsight from "../components/dashboard/RunwayInsight";

const riskMeta = {
  Low: {
    bg: "rgba(34,197,94,0.12)",
    border: "rgba(34,197,94,0.35)",
    text: "#22c55e",
    bar: "#22c55e",
  },
  Moderate: {
    bg: "rgba(245,158,11,0.12)",
    border: "rgba(245,158,11,0.35)",
    text: "#f59e0b",
    bar: "#f59e0b",
  },
  High: {
    bg: "rgba(239,68,68,0.12)",
    border: "rgba(239,68,68,0.35)",
    text: "#ef4444",
    bar: "#ef4444",
  },
  Critical: {
    bg: "rgba(239,68,68,0.15)",
    border: "rgba(239,68,68,0.45)",
    text: "#ef4444",
    bar: "#ef4444",
  },
};

const healthFromRisk = { Low: 91, Moderate: 68, High: 44, Critical: 21 };
const budgetBarColor = (pct) =>
  pct >= 90 ? "#ef4444" : pct >= 70 ? "#f59e0b" : "#22c55e";

function DashboardSkeleton() {
  return (
    <Layout>
      <div style={{ marginBottom: 24 }}>
        <Skeleton width={220} height={28} radius={8} />
        <Skeleton width={280} height={16} radius={6} style={{ marginTop: 8 }} />
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          gap: 14,
          marginBottom: 14,
        }}
      >
        <Skeleton height={120} radius={14} />
        <Skeleton height={120} radius={12} />
        <Skeleton height={120} radius={12} />
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
          gap: 14,
          marginBottom: 24,
        }}
      >
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} height={90} radius={12} />
        ))}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 14 }}>
        <Skeleton height={320} radius={14} />
        <Skeleton height={320} radius={14} />
      </div>
    </Layout>
  );
}

export default function Dashboard() {
  const { user } = useAuth();
  const [summary, setSummary] = useState(null);
  const [runway, setRunway] = useState(null);
  const [trendData, setTrendData] = useState([]);
  const [budgetStatus, setBudgetStatus] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [s, r, trend, bs] = await Promise.all([
          getSummary(),
          getRunway(),
          getMonthlyTrend(),
          getBudgetStatus(),
        ]);
        setSummary(s);
        setRunway(r);
        setBudgetStatus(Array.isArray(bs) ? bs : []);
        setTrendData(
          Object.entries(trend).map(([month, v]) => ({
            month,
            income: v.income,
            expense: v.expense,
          })),
        );
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) return <DashboardSkeleton />;

  const s = summary || {
    totalIncome: 0,
    totalExpense: 0,
    balance: 0,
    transactionsCount: 0,
  };
  const rw = runway || {
    estimatedDaysRemaining: 0,
    riskLevel: "Critical",
    averageDailyExpense: 0,
  };
  const risk = riskMeta[rw.riskLevel] || riskMeta.Critical;
  const score = healthFromRisk[rw.riskLevel] ?? 50;
  const savings = s.totalIncome - s.totalExpense;
  const runwayPct = Math.min(100, (rw.estimatedDaysRemaining / 90) * 100);

  return (
    <Layout>
      {/* Greeting */}
      <div style={{ marginBottom: 24 }} className="fade-in">
        <h1
          style={{
            fontSize: 22,
            fontWeight: 600,
            color: "var(--text)",
            margin: 0,
          }}
        >
          Welcome back{user?.name ? `, ${user.name}` : ""}
        </h1>
        <p style={{ fontSize: 14, color: "var(--muted)", marginTop: 4 }}>
          Here's a live overview of your finances.
        </p>
      </div>

      {/* Hero row */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "2fr 1fr 1fr",
          gap: 14,
          marginBottom: 14,
        }}
        className="fade-in"
      >
        {/* Balance hero */}
        <div
          style={{
            background:
              s.balance >= 0
                ? "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)"
                : "linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)",
            borderRadius: 16,
            padding: "28px 32px",
            position: "relative",
            overflow: "hidden",
            transition: "transform 0.15s, box-shadow 0.15s",
            cursor: "default",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-2px)";
            e.currentTarget.style.boxShadow =
              "0 12px 32px rgba(37,99,235,0.35)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = "none";
          }}
        >
          {/* Decorative circle */}
          <div
            style={{
              position: "absolute",
              right: -30,
              top: -30,
              width: 140,
              height: 140,
              borderRadius: "50%",
              background: "rgba(255,255,255,0.06)",
            }}
          />
          <div
            style={{
              position: "absolute",
              right: 40,
              bottom: -40,
              width: 100,
              height: 100,
              borderRadius: "50%",
              background: "rgba(255,255,255,0.04)",
            }}
          />

          <div
            style={{
              fontSize: 12,
              color: "rgba(255,255,255,0.7)",
              marginBottom: 12,
              letterSpacing: "0.05em",
              textTransform: "uppercase",
            }}
          >
            Current Balance
          </div>
          <div
            style={{
              fontSize: 38,
              fontWeight: 700,
              color: "#fff",
              display: "flex",
              alignItems: "baseline",
              gap: 4,
            }}
          >
            <span style={{ fontSize: 20, fontWeight: 500 }}>
              {s.balance < 0 ? "-₹" : "₹"}
            </span>
            <CountUp
              end={Math.abs(s.balance)}
              duration={1.4}
              separator=","
              useEasing
            />
          </div>
          <div
            style={{
              fontSize: 12,
              color: "rgba(255,255,255,0.6)",
              marginTop: 10,
            }}
          >
            {s.balance >= 0
              ? "Available funds"
              : "Spending exceeds income — add income transactions"}
          </div>
        </div>

        <KpiCard
          label="Total Income"
          value={s.totalIncome}
          isCurrency
          color="#22c55e"
          sub="All time"
        />
        <KpiCard
          label="Total Expense"
          value={s.totalExpense}
          isCurrency
          color="#ef4444"
          sub="All time"
        />
      </div>

      {/* Stats row */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4,1fr)",
          gap: 14,
          marginBottom: 24,
        }}
        className="fade-in"
      >
        <KpiCard
          label="Runway"
          value={rw.estimatedDaysRemaining}
          prefix=" days"
          sub="Estimated"
          color={risk.text}
        />
        <KpiCard
          label="Savings"
          value={Math.abs(savings)}
          isCurrency
          color={savings >= 0 ? undefined : "#ef4444"}
          sub={savings >= 0 ? "Surplus" : "Deficit"}
        />
        <KpiCard
          label="Avg. Daily Spend"
          value={Math.round(Number(rw.averageDailyExpense))}
          isCurrency
          sub="Per day"
        />
        <KpiCard
          label="Transactions"
          value={s.transactionsCount}
          sub="Total recorded"
        />
      </div>

      {/* Bottom row */}
      <div
        style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 14 }}
        className="fade-in"
      >
        {/* Runway Insight */}
        <RunwayInsight summary={s} runway={rw} budgetStatus={budgetStatus} />
        {/* Chart */}
        <div
          style={{
            background: "var(--surface)",
            border: "1px solid var(--border)",
            borderRadius: 16,
            padding: "24px 24px 16px",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              marginBottom: 20,
            }}
          >
            <div>
              <div
                style={{ fontSize: 15, fontWeight: 600, color: "var(--text)" }}
              >
                Monthly Trend
              </div>
              <div
                style={{ fontSize: 12, color: "var(--muted)", marginTop: 2 }}
              >
                Income vs expenses over time
              </div>
            </div>
            <div style={{ display: "flex", gap: 12 }}>
              {[
                { label: "Income", color: "#22c55e" },
                { label: "Expense", color: "#ef4444" },
              ].map((l) => (
                <div
                  key={l.label}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 5,
                    fontSize: 12,
                    color: "var(--muted)",
                  }}
                >
                  <div
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      background: l.color,
                    }}
                  />
                  {l.label}
                </div>
              ))}
            </div>
          </div>
          <MonthlyTrendChart data={trendData} />
        </div>

        {/* Financial Health */}
        <div
          style={{
            background: "var(--surface)",
            border: "1px solid var(--border)",
            borderRadius: 16,
            padding: "24px",
            display: "flex",
            flexDirection: "column",
            gap: 20,
          }}
        >
          <div style={{ fontSize: 15, fontWeight: 600, color: "var(--text)" }}>
            Financial Health
          </div>

          {/* Score circle */}
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div
              style={{
                width: 72,
                height: 72,
                borderRadius: "50%",
                border: `4px solid ${risk.text}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                boxShadow: `0 0 20px ${risk.text}33`,
              }}
            >
              <span style={{ fontSize: 22, fontWeight: 700, color: risk.text }}>
                <CountUp end={score} duration={1.5} useEasing />
              </span>
            </div>
            <div>
              <div
                style={{ fontSize: 13, color: "var(--text)", fontWeight: 500 }}
              >
                Health Score
              </div>
              <div
                style={{ fontSize: 12, color: "var(--muted)", marginTop: 2 }}
              >
                out of 100
              </div>
              <span
                style={{
                  display: "inline-block",
                  marginTop: 6,
                  background: risk.bg,
                  border: `1px solid ${risk.border}`,
                  color: risk.text,
                  fontSize: 11,
                  padding: "2px 10px",
                  borderRadius: 99,
                }}
              >
                {rw.riskLevel} Risk
              </span>
            </div>
          </div>

          {/* Runway bar */}
          <div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: 12,
                marginBottom: 6,
              }}
            >
              <span style={{ color: "var(--muted)" }}>Runway estimate</span>
              <span style={{ color: risk.text, fontWeight: 600 }}>
                {rw.estimatedDaysRemaining} days
              </span>
            </div>
            <div
              style={{
                height: 6,
                background: "var(--border)",
                borderRadius: 99,
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  height: "100%",
                  borderRadius: 99,
                  background: risk.bar,
                  width: `${runwayPct}%`,
                  transition: "width 1s ease",
                  boxShadow: `0 0 8px ${risk.bar}66`,
                }}
              />
            </div>
          </div>

          {/* Budget breakdown */}
          {budgetStatus.length > 0 && (
            <div>
              <div
                style={{
                  fontSize: 12,
                  color: "var(--muted)",
                  marginBottom: 10,
                  fontWeight: 500,
                }}
              >
                Budget Status
              </div>
              {budgetStatus.slice(0, 4).map((b) => {
                const pct = Math.min(
                  100,
                  Math.round((b.spent / b.limit) * 100),
                );
                const col = budgetBarColor(pct);
                return (
                  <div key={b.category} style={{ marginBottom: 10 }}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        fontSize: 12,
                        marginBottom: 4,
                      }}
                    >
                      <span style={{ color: "var(--text)" }}>{b.category}</span>
                      <span style={{ color: col, fontWeight: 600 }}>
                        {pct}%
                      </span>
                    </div>
                    <div
                      style={{
                        height: 5,
                        background: "var(--border)",
                        borderRadius: 99,
                        overflow: "hidden",
                      }}
                    >
                      <div
                        style={{
                          height: "100%",
                          borderRadius: 99,
                          background: col,
                          width: `${pct}%`,
                          transition: "width 0.8s ease",
                          boxShadow: pct >= 90 ? `0 0 6px ${col}88` : "none",
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Quick insight */}
          <div
            style={{
              background: "var(--bg)",
              border: "1px solid var(--border)",
              borderRadius: 10,
              padding: "10px 14px",
              fontSize: 12,
              color: "var(--muted)",
              lineHeight: 1.5,
            }}
          >
            {" "}
            {savings >= 0
              ? `You're saving ₹${savings.toLocaleString()} - keep it up!`
              : `Add income entries to track your savings rate accurately.`}
          </div>
        </div>
      </div>
      {/* AI Insights */}
      <AIInsights
        financialData={{
          summary: s,
          runway: rw,
          budgetStatus,
          categories: {},
        }}
      />
    </Layout>
  );
}
