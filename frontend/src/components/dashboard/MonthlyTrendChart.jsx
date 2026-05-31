import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from "recharts";

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: "var(--surface)",
      border: "1px solid var(--border)",
      borderRadius: 10,
      padding: "12px 16px",
      fontSize: 13,
      boxShadow: "0 4px 24px rgba(0,0,0,0.18)",
    }}>
      <p style={{ color: "var(--muted)", marginBottom: 8, fontWeight: 600, fontSize: 12 }}>{label}</p>
      {payload.map((p) => (
        <div key={p.name} style={{ display: "flex", alignItems: "center", gap: 8, margin: "4px 0" }}>
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: p.color }} />
          <span style={{ color: "var(--muted)", fontSize: 12 }}>
            {p.name === "income" ? "Income" : "Expense"}:
          </span>
          <span style={{ color: p.color, fontWeight: 600 }}>
            ₹{Number(p.value).toLocaleString()}
          </span>
        </div>
      ))}
    </div>
  );
};

const CustomLegend = ({ payload }) => (
  <div style={{ display: "flex", gap: 20, justifyContent: "flex-end", marginBottom: 8 }}>
    {payload?.map((p) => (
      <div key={p.value} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "var(--muted)" }}>
        <div style={{ width: 10, height: 3, borderRadius: 2, background: p.color }} />
        {p.value === "income" ? "Income" : "Expense"}
      </div>
    ))}
  </div>
);

export default function MonthlyTrendChart({ data }) {
  if (!data || data.length === 0) {
    return (
      <div style={{
        height: 240,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        color: "var(--muted)",
        gap: 8,
      }}>
        <div style={{ fontSize: 28 }}>📊</div>
        <div style={{ fontSize: 14 }}>No trend data yet</div>
        <div style={{ fontSize: 12 }}>Add income and expense transactions to see your trend</div>
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={240}>
      <AreaChart data={data} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
        <defs>
          <linearGradient id="incomeGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#22c55e" stopOpacity={0.25} />
            <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="expenseGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#ef4444" stopOpacity={0.25} />
            <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
          </linearGradient>
        </defs>

        <CartesianGrid
          strokeDasharray="3 3"
          stroke="var(--border)"
          vertical={false}
        />

        <XAxis
          dataKey="month"
          tick={{ fontSize: 11, fill: "var(--muted)" }}
          axisLine={false}
          tickLine={false}
          dy={8}
        />

        <YAxis
          tick={{ fontSize: 11, fill: "var(--muted)" }}
          axisLine={false}
          tickLine={false}
          tickFormatter={(v) =>
            v >= 1000 ? `₹${(v / 1000).toFixed(0)}k` : `₹${v}`
          }
        />

        <Tooltip content={<CustomTooltip />} />
        <Legend content={<CustomLegend />} />

        <Area
          type="monotone"
          dataKey="income"
          stroke="#22c55e"
          strokeWidth={2.5}
          fill="url(#incomeGrad)"
          dot={{ r: 4, fill: "#22c55e", strokeWidth: 0 }}
          activeDot={{ r: 6, fill: "#22c55e", strokeWidth: 0 }}
        />

        <Area
          type="monotone"
          dataKey="expense"
          stroke="#ef4444"
          strokeWidth={2.5}
          fill="url(#expenseGrad)"
          dot={{ r: 4, fill: "#ef4444", strokeWidth: 0 }}
          activeDot={{ r: 6, fill: "#ef4444", strokeWidth: 0 }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}