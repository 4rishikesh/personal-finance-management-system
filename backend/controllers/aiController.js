const { callOllama } = require("../services/ollamaService");

// POST /api/ai/insights
const getInsights = async (req, res) => {
  try {
    const financialData = req.body;

    const { summary, runway, budgetStatus } = financialData;

    const budgetLines = (budgetStatus || [])
      .map(
        (b) =>
          `${b.category}: spent ₹${b.spent} of ₹${b.limit} (${Math.round(
            (b.spent / b.limit) * 100
          )}%)`
      )
      .join("\n");

    const savingsRate =
      summary.totalIncome > 0
        ? Math.round(
            ((summary.totalIncome - summary.totalExpense) /
              summary.totalIncome) *
              100
          )
        : 0;

    const prompt = `You are a personal finance advisor. Analyze this financial data and return exactly 4 insights.

FINANCIAL DATA:
- Total Income: Rs ${summary.totalIncome}
- Total Expense: Rs ${summary.totalExpense}
- Current Balance: Rs ${summary.balance}
- Savings Rate: ${savingsRate}%
- Runway: ${runway.estimatedDaysRemaining} days
- Risk Level: ${runway.riskLevel}

BUDGET STATUS:
${budgetLines || "No budgets set"}

Return ONLY a JSON array, no explanation, no markdown, no code blocks:
[{"type":"warning","title":"Short title","message":"One specific actionable sentence."},{"type":"success","title":"Short title","message":"One specific actionable sentence."},{"type":"tip","title":"Short title","message":"One specific actionable sentence."},{"type":"alert","title":"Short title","message":"One specific actionable sentence."}]

Use types: warning, success, tip, alert. Base every message on the actual numbers.`;

    const raw = await callOllama(prompt);

    const match = raw.match(/\[[\s\S]*\]/);

    if (!match) {
      return res.status(500).json({
        error: "Could not parse AI response",
      });
    }

    const insights = JSON.parse(match[0]);

    res.json(insights);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: "Failed to generate insights",
    });
  }
};

// POST /api/ai/categorize
const categorize = async (req, res) => {
  try {
    const { note } = req.body;

    if (!note || note.length < 2) {
      return res.json({
        category: null,
      });
    }

    const prompt = `You are a transaction categorizer. Given a transaction description, return exactly one category.

Categories and examples:
- Food: Swiggy, Zomato, restaurant, cafe, groceries, meal, lunch, dinner, breakfast, McDonald's, pizza
- Travel: Uber, Ola, auto, cab, taxi, bus, train, flight, metro, petrol, fuel, Rapido
- Shopping: Amazon, Flipkart, clothes, shoes, mall, store, purchase
- Entertainment: Netflix, movie, game, concert, Spotify, YouTube Premium
- Health: doctor, medicine, pharmacy, hospital, gym, chemist
- Education: course, book, tuition, college, fee, Udemy, Coursera
- Salary: salary, stipend, paycheck, wages
- Freelance: freelance, project, client, consulting
- Other: anything that doesn't fit above

Transaction: "${note}"

Reply with ONLY one word from the list: Food, Travel, Shopping, Entertainment, Health, Education, Salary, Freelance, Other`;

    const raw = await callOllama(prompt);

    const valid = [
      "Food",
      "Travel",
      "Shopping",
      "Entertainment",
      "Health",
      "Education",
      "Salary",
      "Freelance",
      "Other",
    ];

    const category = valid.find((c) => raw.includes(c)) || null;

    res.json({
      category,
    });
  } catch (err) {
    console.error(err);

    res.json({
      category: null,
    });
  }
};

module.exports = {
  getInsights,
  categorize,
};