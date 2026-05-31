import api from "./api";

export const getBudgets = () =>
  api.get("/budgets").then((r) => r.data);

export const getBudgetStatus = () =>
  api.get("/budgets/status").then((r) => r.data);

export const addBudget = (data) =>
  api.post("/budgets", data).then((r) => r.data);

export const deleteBudget = (id) =>
  api.delete(`/budgets/${id}`).then((r) => r.data);