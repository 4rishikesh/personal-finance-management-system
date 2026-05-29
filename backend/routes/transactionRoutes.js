const express = require("express");
const Transaction = require("../models/Transaction");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Add transaction
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { amount, type, category, account, note } = req.body;

    const transaction = new Transaction({
      userId: req.userId,
      amount,
      type,
      category,
      account,
      note
    });

    await transaction.save();

    res.status(201).json(transaction);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all transactions
router.get("/", authMiddleware, async (req, res) => {
  try {

    const transactions = await Transaction.find({
      userId: req.userId
    }).sort({ date: -1 });

    res.json(transactions);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update transaction
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const {amount, type, category, account, note} = req.body;
    const transaction = await Transaction.findOneAndUpdate(
      { 
        _id: req.params.id, 
        userId: req.userId 
      },
      { 
        amount, 
        type, 
        category, 
        account, 
        note 
      },
      {
        new: true
      }
    );

    if(!transaction) {
      return res.status(404).json({
        message: "Transaction not found"
      });
  }
  res.json(transaction);
  
  } catch (error) {
    res.status(500).json({ 
      error: error.message 
    }); 
  }
});

router.delete("/:id", authMiddleware, async (req, res) => {
  try{
    const transaction = await Transaction.findOneAndDelete({
      _id: req.params.id,
      userId: req.userId
    });

    if(!transaction) {
      return res.status(404).json({
        message: "Transaction not found"
      });
    }

    res.json({
      message: "Transaction deleted successfully"
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;