const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  amount: {
    type: Number,
    required: true
  },

  type: {
    type: String,
    enum: ["income", "expense"],
    required: true
  },

  category: {
    type: String,
    required: true
  },

  account: {
    type: String,
    default: "Cash"
  },

  note: {
    type: String
  },

  date: {
    type: Date,
    default: Date.now
  }

});

module.exports = mongoose.model("Transaction", transactionSchema); 