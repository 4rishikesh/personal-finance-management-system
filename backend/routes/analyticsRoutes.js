const express = require("express");
const Transaction = require("../models/Transaction");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/summary", authMiddleware, async (req, res) => {
  try {
      const transactions = await Transaction.find({
         userId: req.userId
      });

      let totalIncome = 0;
      let totalExpense = 0;

      for(const transaction of transactions) {
         if(transaction.type === "income") {
            totalIncome += transaction.amount;
         }
         else if(transaction.type === "expense") {
            totalExpense += transaction.amount;
         }
      }
      const balance = totalIncome - totalExpense;
      
      res.json({
         totalIncome,
         totalExpense,
         balance,
         transactionsCount: transactions.length
      });

  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
});

router.get("/categories", authMiddleware, async (req, res) => {
  try {

    const transactions = await Transaction.find({
      userId: req.userId,
      type: "expense"
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
      error: error.message
    });
  }
}); 

router.get("/highest-category", authMiddleware, async (req, res) => {
   try{
      const transactions = await Transaction.find({
         userId: req.userId,
         type: "expense"
      });

      const categoryData = {};

      for(const transaction of transactions){
         const category = transaction.category;

         if(categoryData[category]) {
            categoryData[category] += transaction.amount;
         }
         else {
            categoryData[category] = transaction.amount;
         }
      }

      let highestCategory = null;
      let highestAmount = 0;

      for(const category in categoryData) {
         if(categoryData[category] > highestAmount) {
            highestAmount = categoryData[category];
            highestCategory = category;
         }
      }

      res.json({
         category: highestCategory,
         amount: highestAmount
      });
   } catch (error) {
      res.status(500).json({
         error: error.message
      });
   }
});

router.get("/monthly-trend", authMiddleware, async (req, res) => {
  try {

    const transactions = await Transaction.find({
      userId: req.userId
    });

    const monthlyData = {};

    for (const transaction of transactions) {

      const month = transaction.date.toLocaleString(
        "default",
        {
          month: "short",
          year: "numeric"
        }
      );

      if (!monthlyData[month]) {
        monthlyData[month] = {
          income: 0,
          expense: 0
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
      error: error.message
    });
  }
});

module.exports = router;

