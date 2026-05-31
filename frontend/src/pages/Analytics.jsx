import { useEffect, useState } from "react";
import Layout from "../components/layout/Layout";
import MonthlyTrendChart from "../components/dashboard/MonthlyTrendChart";
import {
  getSummary,
  getMonthlyTrend,
  getCategories,
} from "../services/analyticsService";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

const PIE_COLORS = [
  "#2563eb",
  "#22c55e",
  "#f59e0b",
  "#ef4444",
  "#8b5cf6",
  "#06b6d4",
  "#ec4899",
];

export default function Analytics() {
  const [summary, setSummary] = useState(null);
  const [trendData, setTrendData] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [s, trend, cats] = await Promise.all([
          getSummary(),
          getMonthlyTrend(),
          getCategories(),
        ]);
        setSummary(s);
        setTrendData(
          Object.entries(trend).map(([month, v]) => ({
            month,
            income: v.income,
            expense: v.expense,
          })),
        );
        setCategories(
          Object.entries(cats).map(([name, value], i) => ({
            name,
            value,
            color: PIE_COLORS[i % PIE_COLORS.length],
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

  if (loading)
    return (
      <Layout>
        <div style={{ padding: 32, color: "var(--muted)" }}>Loading...</div>
      </Layout>
    );

  const s = summary || { totalIncome: 0, totalExpense: 0, balance: 0 };
  const savingsRate =
    s.totalIncome > 0
      ? Math.round(((s.totalIncome - s.totalExpense) / s.totalIncome) * 100)
      : 0;

  return (
    <Layout>
      <div style={{ marginBottom: 24 }}>
        <h1
          style={{
            fontSize: 22,
            fontWeight: 600,
            color: "var(--text)",
            margin: 0,
          }}
        >
          Analytics
        </h1>
        <p style={{ fontSize: 14, color: "var(--muted)", marginTop: 4 }}>
          Deep dive into your spending patterns
        </p>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 14,
          marginBottom: 24,
        }}
      >
        {[
          { label: "Total income", val: `₹${s.totalIncome.toLocaleString()}` },
          {
            label: "Total expense",
            val: `₹${s.totalExpense.toLocaleString()}`,
          },
          { label: "Savings rate", val: `${savingsRate}%` },
        ].map((k) => (
          <div
            key={k.label}
            style={{
              background: "var(--surface)",
              border: "1px solid var(--border)",
              borderRadius: 12,
              padding: "18px 20px",
            }}
          >
            <div
              style={{ fontSize: 12, color: "var(--muted)", marginBottom: 8 }}
            >
              {k.label}
            </div>
            <div
              style={{ fontSize: 22, fontWeight: 600, color: "var(--text)" }}
            >
              {k.val}
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "3fr 2fr", gap: 14 }}>
        <div
          style={{
            background: "var(--surface)",
            border: "1px solid var(--border)",
            borderRadius: 12,
            padding: "20px 24px",
          }}
        >
          <div
            style={{
              fontSize: 15,
              fontWeight: 500,
              color: "var(--text)",
              marginBottom: 16,
            }}
          >
            Monthly income vs expense
          </div>
          <MonthlyTrendChart data={trendData} />
        </div>

        <div
          style={{
            background: "var(--surface)",
            border: "1px solid var(--border)",
            borderRadius: 12,
            padding: "20px 24px",
          }}
        >
          <div
            style={{
              fontSize: 15,
              fontWeight: 500,
              color: "var(--text)",
              marginBottom: 16,
            }}
          >
            Expense by category
          </div>
          {categories.length === 0 ? (
            <div
              style={{
                padding: 32,
                textAlign: "center",
                color: "var(--muted)",
                fontSize: 13,
              }}
            >
              No expense data yet.
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie
                  data={categories}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  paddingAngle={2}
                >
                  {categories.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(v) => `₹${Number(v).toLocaleString()}`}
                  contentStyle={{
                    background: "var(--surface)",
                    border: "1px solid var(--border)",
                    borderRadius: 10,
                    fontSize: 13,
                    color: "var(--text)",
                  }}
                />
                <Legend
                  iconType="circle"
                  iconSize={8}
                  wrapperStyle={{ fontSize: 12, color: "var(--muted)" }}
                />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </Layout>
  );
}
