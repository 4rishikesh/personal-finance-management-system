const express = require("express");
const Budget = require("../models/Budget");
const authMiddleware = require("../middleware/authMiddleware");
const Transaction = require("../models/Transaction");
const transporter = require("../services/emailService");
const router = express.Router();


router.post("/", authMiddleware, async (req, res) => {
  try {

    const { category, limit } = req.body;

    const budget = new Budget({
      userId: req.userId,
      category,
      limit
    });

    await budget.save();

    res.status(201).json(budget);

  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
});

router.get("/", authMiddleware, async (req, res) => {
  try {

    const budgets = await Budget.find({
      userId: req.userId
    });

    res.json(budgets);

  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
});

router.get("/status", authMiddleware, async (req, res) => {
  try {

    const budgets = await Budget.find({
      userId: req.userId
    });

    const result = [];

    for (const budget of budgets) {

      const transactions = await Transaction.find({
        userId: req.userId,
        category: budget.category,
        type: "expense"
      });

      let spent = 0;

      for (const transaction of transactions) {
        spent += transaction.amount;
      }

      const remaining = budget.limit - spent;

      const usagePercent = (
        (spent / budget.limit) * 100
      ).toFixed(2);

      result.push({
        category: budget.category,
        limit: budget.limit,
        spent,
        remaining,
        usagePercent
      });
    }

    res.json(result);

  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
});

router.get("/alerts", authMiddleware, async (req, res) => {
  try {

    const budgets = await Budget.find({
      userId: req.userId
    });

    const alerts = [];

    for (const budget of budgets) {

      const transactions = await Transaction.find({
        userId: req.userId,
        category: budget.category,
        type: "expense"
      });

      let spent = 0;

      for (const transaction of transactions) {
        spent += transaction.amount;
      }

      const usagePercent =
        (spent / budget.limit) * 100;

      if (usagePercent >= 90) {

        alerts.push({
          category: budget.category,
          severity: "critical",
          usagePercent: usagePercent.toFixed(2),
          message: `${budget.category} budget is almost exhausted`
        });

      } else if (usagePercent >= 75) {

        alerts.push({
          category: budget.category,
          severity: "warning",
          usagePercent: usagePercent.toFixed(2),
          message: `${budget.category} budget is nearing its limit`
        });

      }
    }

    res.json(alerts);

  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
});

router.get("/test-email", async (req, res) => {
  try {

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      subject: "Finance Manager Test",
      text: "Email service is working successfully."
    });

    res.json({
      message: "Email sent successfully"
    });

  } catch (error) {

    res.status(500).json({
      error: error.message
    });

  }
});

module.exports = router;