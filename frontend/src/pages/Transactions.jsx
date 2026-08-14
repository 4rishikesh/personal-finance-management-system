import { useEffect, useState } from "react";
import Layout from "../components/layout/Layout";
import {
  getTransactions,
  addTransaction,
  deleteTransaction,
} from "../services/transactionService";
import { categorizeTransaction } from "../services/geminiService";

const CATEGORIES = [
  "Food",
  "Travel",
  "Shopping",
  "Entertainment",
  "Health",
  "Education",
  "Salary",
  "Freelance",
  "Other",
];

export default function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    type: "expense",
    amount: "",
    category: "Food",
    note: "",
    account: "Cash",
  });
  const [saving, setSaving] = useState(false);

  const load = async () => {
    try {
      const data = await getTransactions();
      setTransactions(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await addTransaction({ ...form, amount: Number(form.amount) });
      setForm({
        type: "expense",
        amount: "",
        category: "Food",
        note: "",
        account: "Cash",
      });
      setShowForm(false);
      load();
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this transaction?")) return;
    try {
      await deleteTransaction(id);
      load();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <Layout>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 24,
        }}
      >
        <div>
          <h1
            style={{
              fontSize: 22,
              fontWeight: 600,
              color: "var(--text)",
              margin: 0,
            }}
          >
            Transactions
          </h1>
          <p style={{ fontSize: 14, color: "var(--muted)", marginTop: 4 }}>
            Manage your income and expenses
          </p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          style={{
            background: "#2563eb",
            color: "#fff",
            border: "none",
            borderRadius: 8,
            padding: "9px 18px",
            fontSize: 14,
            fontWeight: 500,
            cursor: "pointer",
          }}
        >
          + Add transaction
        </button>
      </div>

      {showForm && (
        <div
          style={{
            background: "var(--surface)",
            border: "1px solid var(--border)",
            borderRadius: 12,
            padding: 20,
            marginBottom: 20,
          }}
        >
          <div
            style={{
              fontSize: 14,
              fontWeight: 500,
              color: "var(--text)",
              marginBottom: 14,
            }}
          >
            New transaction
          </div>
          <form
            onSubmit={handleAdd}
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
              gap: 12,
            }}
          >
            <div>
              <label
                style={{
                  fontSize: 12,
                  color: "var(--muted)",
                  display: "block",
                  marginBottom: 5,
                }}
              >
                Type
              </label>
              <select
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value })}
                style={{
                  width: "100%",
                  background: "var(--bg)",
                  border: "1px solid var(--border)",
                  borderRadius: 7,
                  padding: "8px 10px",
                  color: "var(--text)",
                  fontSize: 13,
                }}
              >
                <option value="expense">Expense</option>
                <option value="income">Income</option>
              </select>
            </div>
            <div>
              <label
                style={{
                  fontSize: 12,
                  color: "var(--muted)",
                  display: "block",
                  marginBottom: 5,
                }}
              >
                Amount (₹)
              </label>
              <input
                type="number"
                required
                value={form.amount}
                onChange={(e) => setForm({ ...form, amount: e.target.value })}
                placeholder="0"
                style={{
                  width: "100%",
                  background: "var(--bg)",
                  border: "1px solid var(--border)",
                  borderRadius: 7,
                  padding: "8px 10px",
                  color: "var(--text)",
                  fontSize: 13,
                  boxSizing: "border-box",
                }}
              />
            </div>
            <div>
              <label
                style={{
                  fontSize: 12,
                  color: "var(--muted)",
                  display: "block",
                  marginBottom: 5,
                }}
              >
                Category
              </label>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                style={{
                  width: "100%",
                  background: "var(--bg)",
                  border: "1px solid var(--border)",
                  borderRadius: 7,
                  padding: "8px 10px",
                  color: "var(--text)",
                  fontSize: 13,
                }}
              >
                {CATEGORIES.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label
                style={{
                  fontSize: 12,
                  color: "var(--muted)",
                  display: "block",
                  marginBottom: 5,
                }}
              >
                Account
              </label>
              <input
                value={form.account}
                onChange={(e) => setForm({ ...form, account: e.target.value })}
                placeholder="Cash / UPI / Card"
                style={{
                  width: "100%",
                  background: "var(--bg)",
                  border: "1px solid var(--border)",
                  borderRadius: 7,
                  padding: "8px 10px",
                  color: "var(--text)",
                  fontSize: 13,
                  boxSizing: "border-box",
                }}
              />
            </div>
            <div>
              <input
                value={form.note}
                onChange={(e) => setForm({ ...form, note: e.target.value })}
                onBlur={async (e) => {
                  const note = e.target.value;

                  if (note.length > 2) {
                    try {
                      const suggested = await categorizeTransaction(note);

                      if (suggested) {
                        setForm((prev) => ({
                          ...prev,
                          category: suggested,
                        }));
                      }
                    } catch (error) {
                      console.error(error);
                    }
                  }
                }}
                placeholder="e.g. Swiggy order, Uber ride..."
                style={{
                  width: "100%",
                  background: "var(--bg)",
                  border: "1px solid var(--border)",
                  borderRadius: 7,
                  padding: "8px 10px",
                  color: "var(--text)",
                  fontSize: 13,
                  boxSizing: "border-box",
                }}
              />
            </div>
            <div style={{ display: "flex", alignItems: "flex-end", gap: 8 }}>
              <button
                type="submit"
                disabled={saving}
                style={{
                  flex: 1,
                  background: "#2563eb",
                  color: "#fff",
                  border: "none",
                  borderRadius: 7,
                  padding: "9px",
                  fontSize: 13,
                  cursor: "pointer",
                }}
              >
                {saving ? "Saving..." : "Save"}
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                style={{
                  flex: 1,
                  background: "transparent",
                  border: "1px solid var(--border)",
                  borderRadius: 7,
                  padding: "9px",
                  fontSize: 13,
                  color: "var(--muted)",
                  cursor: "pointer",
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div
        style={{
          background: "var(--surface)",
          border: "1px solid var(--border)",
          borderRadius: 12,
          overflow: "hidden",
        }}
      >
        {loading ? (
          <div
            style={{
              padding: 32,
              textAlign: "center",
              color: "var(--muted)",
              fontSize: 14,
            }}
          >
            Loading...
          </div>
        ) : transactions.length === 0 ? (
          <div
            style={{
              padding: 48,
              textAlign: "center",
              color: "var(--muted)",
              fontSize: 14,
            }}
          >
            No transactions yet. Add your first one above.
          </div>
        ) : (
          <div className="table-wrapper">
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                fontSize: 13,
              }}
            >
              <thead>
                <tr style={{ borderBottom: "1px solid var(--border)" }}>
                  {[
                    "Date",
                    "Type",
                    "Category",
                    "Account",
                    "Note",
                    "Amount",
                    "",
                  ].map((h) => (
                    <th
                      key={h}
                      style={{
                        padding: "12px 16px",
                        textAlign: "left",
                        color: "var(--muted)",
                        fontWeight: 500,
                        fontSize: 12,
                      }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {transactions.map((t) => (
                  <tr
                    key={t._id}
                    style={{ borderBottom: "1px solid var(--border)" }}
                  >
                    <td style={{ padding: "12px 16px", color: "var(--muted)" }}>
                      {new Date(t.date).toLocaleDateString()}
                    </td>
                    <td style={{ padding: "12px 16px" }}>
                      <span
                        style={{
                          background:
                            t.type === "income"
                              ? "rgba(34,197,94,0.12)"
                              : "rgba(239,68,68,0.12)",
                          color: t.type === "income" ? "#22c55e" : "#ef4444",
                          padding: "2px 8px",
                          borderRadius: 99,
                          fontSize: 11,
                        }}
                      >
                        {t.type}
                      </span>
                    </td>
                    <td style={{ padding: "12px 16px", color: "var(--text)" }}>
                      {t.category}
                    </td>
                    <td style={{ padding: "12px 16px", color: "var(--muted)" }}>
                      {t.account}
                    </td>
                    <td style={{ padding: "12px 16px", color: "var(--muted)" }}>
                      {t.note || "—"}
                    </td>
                    <td
                      style={{
                        padding: "12px 16px",
                        fontWeight: 500,
                        color: t.type === "income" ? "#22c55e" : "#ef4444",
                      }}
                    >
                      {t.type === "income" ? "+" : "-"}₹
                      {Number(t.amount).toLocaleString()}
                    </td>
                    <td style={{ padding: "12px 16px" }}>
                      <button
                        onClick={() => handleDelete(t._id)}
                        style={{
                          background: "transparent",
                          border: "none",
                          color: "var(--muted)",
                          cursor: "pointer",
                          fontSize: 16,
                        }}
                      >
                        ✕
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </Layout>
  );
}
