import api from "./api";

export const getSummary = () =>
  api.get("/analytics/summary").then((r) => r.data);

export const getRunway = () =>
  api.get("/analytics/runway").then((r) => r.data);

export const getMonthlyTrend = () =>
  api.get("/analytics/monthly-trend").then((r) => r.data);

export const getCategories = () =>
  api.get("/analytics/categories").then((r) => r.data);