const cron = require("node-cron");
const User = require("../models/User");
const Budget = require("../models/Budget");
const Transaction = require("../models/Transaction");

const { sendBudgetAlert } = require("../services/emailService");

const startBudgetAlertJob = () => {
  cron.schedule("0 9 * * *", async () => {
    const users = await User.find();

    console.log(`Checking ${users.length} users`);

    for (const user of users) {
      console.log(user.email);

      const budgets = await Budget.find({
        userId: user._id,
      });

      console.log(`${user.email} has ${budgets.length} budgets`);

      for (const budget of budgets) {
        const transactions = await Transaction.find({
          userId: user._id,
          category: budget.category,
          type: "expense",
        });

        let spent = 0;

        for (const transaction of transactions) {
          spent += transaction.amount;
        }

        const usagePercent = (spent / budget.limit) * 100;

        if (usagePercent >= 90) {
          const now = new Date();

          const oneDay = 24 * 60 * 60 * 1000;

          const canSendAlert =
            !budget.lastAlertSent || now - budget.lastAlertSent > oneDay;

          if (canSendAlert) {
            await sendBudgetAlert(
              user.email,
              budget.category,
              spent,
              budget.limit,
            );

            budget.lastAlertSent = now;

            await budget.save();

            console.log(`Email sent to ${user.email}`);
          }
        }

        console.log(`${budget.category}: ₹${spent} / ₹${budget.limit}`);

        console.log(`Usage: ${usagePercent.toFixed(2)}%`);
      }
    }
  });
};

module.exports = startBudgetAlertJob;
