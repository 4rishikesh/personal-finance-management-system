import api from "./api";

export const getGeminiInsights = async (financialData) => {
  try {
    const { data } = await api.post("/ai/insights", financialData);
    return data;
  } catch (err) {
    console.error(err);
    throw new Error("Failed to generate AI insights");
  }
};

export const categorizeTransaction = async (note) => {
  if (!note || note.length < 2) return null;

  try {
    const { data } = await api.post("/ai/categorize", {
      note,
    });

    return data.category;
  } catch (err) {
    console.error(err);
    return null;
  }
};

// const OLLAMA_URL = "http://localhost:11434/api/generate";

// const callOllama = async (prompt) => {
//   const res = await fetch(OLLAMA_URL, {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify({
//       model: "llama3",
//       prompt,
//       stream: false,
//       options: { temperature: 0.7, num_predict: 800 },
//     }),
//   });

//   if (!res.ok)
//     throw new Error(
//       `Ollama error: ${res.status}. Make sure Ollama is running: ollama serve`,
//     );
//   const data = await res.json();
//   return data.response?.trim() || "";
// };

// export const getGeminiInsights = async (financialData) => {
//   const { summary, runway, budgetStatus } = financialData;

//   const budgetLines = (budgetStatus || [])
//     .map(
//       (b) =>
//         `${b.category}: spent ₹${b.spent} of ₹${b.limit} (${Math.round((b.spent / b.limit) * 100)}%)`,
//     )
//     .join("\n");

//   const savingsRate =
//     summary.totalIncome > 0
//       ? Math.round(
//           ((summary.totalIncome - summary.totalExpense) / summary.totalIncome) *
//             100,
//         )
//       : 0;

//   const prompt = `You are a personal finance advisor. Analyze this financial data and return exactly 4 insights.

// FINANCIAL DATA:
// - Total Income: Rs ${summary.totalIncome}
// - Total Expense: Rs ${summary.totalExpense}
// - Current Balance: Rs ${summary.balance}
// - Savings Rate: ${savingsRate}%
// - Runway: ${runway.estimatedDaysRemaining} days
// - Risk Level: ${runway.riskLevel}

// BUDGET STATUS:
// ${budgetLines || "No budgets set"}

// Return ONLY a JSON array, no explanation, no markdown, no code blocks:
// [{"type":"warning","title":"Short title","message":"One specific actionable sentence."},{"type":"success","title":"Short title","message":"One specific actionable sentence."},{"type":"tip","title":"Short title","message":"One specific actionable sentence."},{"type":"alert","title":"Short title","message":"One specific actionable sentence."}]

// Use types: warning, success, tip, alert. Base every message on the actual numbers.`;

//   const raw = await callOllama(prompt);

//   // Extract JSON array from response robustly
//   const match = raw.match(/\[[\s\S]*\]/);
//   if (!match) throw new Error("Could not parse AI response");
//   return JSON.parse(match[0]);
// };

// export const categorizeTransaction = async (note) => {
//   if (!note || note.length < 2) return null;

//   const prompt = `You are a transaction categorizer. Given a transaction description, return exactly one category.

// Categories and examples:
// - Food: Swiggy, Zomato, restaurant, cafe, groceries, meal, lunch, dinner, breakfast, McDonald's, pizza
// - Travel: Uber, Ola, auto, cab, taxi, bus, train, flight, metro, petrol, fuel, Rapido
// - Shopping: Amazon, Flipkart, clothes, shoes, mall, store, purchase
// - Entertainment: Netflix, movie, game, concert, Spotify, YouTube Premium
// - Health: doctor, medicine, pharmacy, hospital, gym, chemist
// - Education: course, book, tuition, college, fee, Udemy, Coursera
// - Salary: salary, stipend, paycheck, wages
// - Freelance: freelance, project, client, consulting
// - Other: anything that doesn't fit above

// Transaction: "${note}"

// Reply with ONLY one word from the list: Food, Travel, Shopping, Entertainment, Health, Education, Salary, Freelance, Other`;

//   try {
//     const raw = await callOllama(prompt);
//     const valid = [
//       "Food",
//       "Travel",
//       "Shopping",
//       "Entertainment",
//       "Health",
//       "Education",
//       "Salary",
//       "Freelance",
//       "Other",
//     ];
//     const found = valid.find((c) => raw.includes(c));
//     return found || null;
//   } catch {
//     return null;
//   }
// };

