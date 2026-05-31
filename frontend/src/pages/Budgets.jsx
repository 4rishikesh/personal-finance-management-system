import { useEffect, useState } from "react";
import Layout from "../components/layout/Layout";
import { getBudgetStatus, addBudget, deleteBudget } from "../services/budgetService";

const CATEGORIES = ["Food", "Travel", "Shopping", "Entertainment", "Health", "Education", "Other"];

const barColor = (pct) => pct >= 90 ? "#ef4444" : pct >= 70 ? "#f59e0b" : "#22c55e";

export default function Budgets() {
  const [budgets, setBudgets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ category: "Food", limit: "" });
  const [saving, setSaving] = useState(false);

  const load = async () => {
    try {
      const data = await getBudgetStatus();
      setBudgets(Array.isArray(data) ? data : []);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await addBudget({ category: form.category, limit: Number(form.limit) });
      setForm({ category: "Food", limit: "" });
      setShowForm(false);
      load();
    } catch (e) { console.error(e); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this budget?")) return;
    try { await deleteBudget(id); load(); } catch (e) { console.error(e); }
  };

  return (
    <Layout>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 600, color: "var(--text)", margin: 0 }}>Budgets</h1>
          <p style={{ fontSize: 14, color: "var(--muted)", marginTop: 4 }}>Set spending limits per category</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} style={{ background: "#2563eb", color: "#fff", border: "none", borderRadius: 8, padding: "9px 18px", fontSize: 14, fontWeight: 500, cursor: "pointer" }}>
          + New budget
        </button>
      </div>

      {showForm && (
        <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12, padding: 20, marginBottom: 20 }}>
          <div style={{ fontSize: 14, fontWeight: 500, color: "var(--text)", marginBottom: 14 }}>New budget</div>
          <form onSubmit={handleAdd} style={{ display: "flex", gap: 12, alignItems: "flex-end" }}>
            <div>
              <label style={{ fontSize: 12, color: "var(--muted)", display: "block", marginBottom: 5 }}>Category</label>
              <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} style={{ background: "var(--bg)", border: "1px solid var(--border)", borderRadius: 7, padding: "8px 10px", color: "var(--text)", fontSize: 13 }}>
                {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label style={{ fontSize: 12, color: "var(--muted)", display: "block", marginBottom: 5 }}>Monthly limit (₹)</label>
              <input type="number" required value={form.limit} onChange={(e) => setForm({ ...form, limit: e.target.value })} placeholder="5000" style={{ background: "var(--bg)", border: "1px solid var(--border)", borderRadius: 7, padding: "8px 10px", color: "var(--text)", fontSize: 13, width: 140 }} />
            </div>
            <button type="submit" disabled={saving} style={{ background: "#2563eb", color: "#fff", border: "none", borderRadius: 7, padding: "9px 18px", fontSize: 13, cursor: "pointer" }}>
              {saving ? "Saving..." : "Save"}
            </button>
            <button type="button" onClick={() => setShowForm(false)} style={{ background: "transparent", border: "1px solid var(--border)", borderRadius: 7, padding: "9px 18px", fontSize: 13, color: "var(--muted)", cursor: "pointer" }}>
              Cancel
            </button>
          </form>
        </div>
      )}

      {loading ? (
        <div style={{ padding: 32, textAlign: "center", color: "var(--muted)", fontSize: 14 }}>Loading...</div>
      ) : budgets.length === 0 ? (
        <div style={{ padding: 48, textAlign: "center", color: "var(--muted)", fontSize: 14 }}>No budgets set yet.</div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 14 }}>
          {budgets.map((b) => {
            const pct = Math.min(100, Math.round((b.spent / b.limit) * 100));
            const color = barColor(pct);
            return (
              <div key={b._id} style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12, padding: "18px 20px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
                  <div>
                    <div style={{ fontSize: 15, fontWeight: 500, color: "var(--text)" }}>{b.category}</div>
                    <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 3 }}>
                      ₹{Number(b.spent).toLocaleString()} of ₹{Number(b.limit).toLocaleString()}
                    </div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <span style={{ fontSize: 15, fontWeight: 600, color }}>{pct}%</span>
                    <button onClick={() => handleDelete(b._id)} style={{ background: "transparent", border: "none", color: "var(--muted)", cursor: "pointer", fontSize: 15 }}>✕</button>
                  </div>
                </div>
                <div style={{ height: 6, background: "var(--border)", borderRadius: 99, overflow: "hidden" }}>
                  <div style={{ height: "100%", borderRadius: 99, background: color, width: `${pct}%`, transition: "width 0.6s" }} />
                </div>
                {pct >= 90 && (
                  <div style={{ marginTop: 10, fontSize: 12, color: "#ef4444" }}>⚠ Budget almost exhausted</div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </Layout>
  );
}