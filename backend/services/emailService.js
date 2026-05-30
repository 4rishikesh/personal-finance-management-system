const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

const sendBudgetAlert = async (
  email,
  category,
  spent,
  limit
) => {

  const info = await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: `Budget Alert - ${category}`,
    text: `
Budget Warning

Category: ${category}

Spent: ₹${spent}
Budget Limit: ₹${limit}

You are close to your budget limit.
Please review your spending.
`
  });

  console.log(info.response);
};

module.exports = {
  transporter,
  sendBudgetAlert
};