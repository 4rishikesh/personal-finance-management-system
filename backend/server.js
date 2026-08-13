// const express = require("express");
// const cors = require("cors");
// require("dotenv").config();
// const connectDB = require("./config/db");
// const authRoutes = require("./routes/authRoutes");
// const transactionRoutes = require("./routes/transactionRoutes");
// const analyticsRoutes = require("./routes/analyticsRoutes");
// const budgetRoutes = require("./routes/budgetRoutes");
// const aiRoutes = require("./routes/aiRoutes");
// const startBudgetAlertJob =
//   require("./jobs/budgetAlertJob");

// const app = express();

// connectDB();

// startBudgetAlertJob();
// // Middleware
// app.use(cors());
// app.use(express.json());

// app.use("/api/auth", authRoutes);
// app.use("/api/transactions", transactionRoutes);
// app.use("/api/analytics", analyticsRoutes);
// app.use("/api/budgets", budgetRoutes);
// app.use("/api/ai", aiRoutes);

// // Test API
// app.get("/", (req, res) => {
//   res.send("Finance Manager API is running");
// });

// // Server port
// const PORT = process.env.PORT || 5000;

// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });


//Changes for deployment and production environment

const express = require("express");
const cors = require("cors");
require("dotenv").config();
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const transactionRoutes = require("./routes/transactionRoutes");
const analyticsRoutes = require("./routes/analyticsRoutes");
const budgetRoutes = require("./routes/budgetRoutes");
const aiRoutes = require("./routes/aiRoutes");
const startBudgetAlertJob = require("./jobs/budgetAlertJob");

const app = express();

connectDB();
if (process.env.NODE_ENV !== "production") {
  startBudgetAlertJob();
}

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:4173",
      process.env.FRONTEND_URL,
    ].filter(Boolean),
    credentials: true,
  }),
);

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/budgets", budgetRoutes);
app.use("/api/ai", aiRoutes);

app.get("/", (req, res) => {
  res.send("FinanceFlow API is running");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
