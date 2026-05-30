const express = require("express");
const Transaction = require("../models/Transaction");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/summary", authMiddleware, async (req, res) => {
  try {
    const transactions = await Transaction.find({
      userId: req.userId,
    });

    let totalIncome = 0;
    let totalExpense = 0;

    for (const transaction of transactions) {
      if (transaction.type === "income") {
        totalIncome += transaction.amount;
      } else if (transaction.type === "expense") {
        totalExpense += transaction.amount;
      }
    }
    const balance = totalIncome - totalExpense;

    res.json({
      totalIncome,
      totalExpense,
      balance,
      transactionsCount: transactions.length,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
});

router.get("/categories", authMiddleware, async (req, res) => {
  try {
    const transactions = await Transaction.find({
      userId: req.userId,
      type: "expense",
    });

    const categoryData = {};

    for (const transaction of transactions) {
      const category = transaction.category;

      if (categoryData[category]) {
        categoryData[category] += transaction.amount;
      } else {
        categoryData[category] = transaction.amount;
      }
    }

    res.json(categoryData);
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
});

router.get("/highest-category", authMiddleware, async (req, res) => {
  try {
    const transactions = await Transaction.find({
      userId: req.userId,
      type: "expense",
    });

    const categoryData = {};

    for (const transaction of transactions) {
      const category = transaction.category;

      if (categoryData[category]) {
        categoryData[category] += transaction.amount;
      } else {
        categoryData[category] = transaction.amount;
      }
    }

    let highestCategory = null;
    let highestAmount = 0;

    for (const category in categoryData) {
      if (categoryData[category] > highestAmount) {
        highestAmount = categoryData[category];
        highestCategory = category;
      }
    }

    res.json({
      category: highestCategory,
      amount: highestAmount,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
});

router.get("/monthly-trend", authMiddleware, async (req, res) => {
  try {
    const transactions = await Transaction.find({
      userId: req.userId,
    });

    const monthlyData = {};

    for (const transaction of transactions) {
      const month = transaction.date.toLocaleString("default", {
        month: "short",
        year: "numeric",
      });

      if (!monthlyData[month]) {
        monthlyData[month] = {
          income: 0,
          expense: 0,
        };
      }

      if (transaction.type === "income") {
        monthlyData[month].income += transaction.amount;
      } else {
        monthlyData[month].expense += transaction.amount;
      }
    }

    res.json(monthlyData);
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
});

router.get("/runway", authMiddleware, async (req, res) => {
  const transactions = await Transaction.find({
    userId: req.userId,
  });

  let income = 0;
  let expense = 0;

  for (const transaction of transactions) {
    if (transaction.type === "income") {
      income += transaction.amount;
    } else {
      expense += transaction.amount;
    }
  }

  const balance = income - expense;

  if (transactions.length === 0) {
    return res.json({
      currentBalance: 0,
      averageDailyExpense: 0,
      estimatedDaysRemaining: 0,
    });
  }

  const oldest = transactions[0]?.date;

  const now = new Date();

  const days = Math.max(1, Math.ceil((now - oldest) / (1000 * 60 * 60 * 24)));

  const averageDailyExpense = expense / days;

  const runwayDays =
    balance > 0 && averageDailyExpense > 0 ? balance / averageDailyExpense : 0;
  let riskLevel;

  if (runwayDays === 0) {
    riskLevel = "Critical";
  } else if (runwayDays < 30) {
    riskLevel = "High";
  } else if (runwayDays < 60) {
    riskLevel = "Moderate";
  } else {
    riskLevel = "Low";
  }

  res.json({
    currentBalance: balance,

    averageDailyExpense: averageDailyExpense.toFixed(2),

    estimatedDaysRemaining: Math.floor(runwayDays),
    riskLevel: riskLevel,
  });
});

module.exports = router;
