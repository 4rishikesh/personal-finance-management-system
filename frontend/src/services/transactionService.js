import api from "./api";

export const getTransactions = () =>
  api.get("/transactions").then((r) => r.data);

export const addTransaction = (data) =>
  api.post("/transactions", data).then((r) => r.data);

export const deleteTransaction = (id) =>
  api.delete(`/transactions/${id}`).then((r) => r.data);