// const OLLAMA_URL =
//   process.env.OLLAMA_URL || "http://localhost:11434/api/generate";

// const callOllama = async (prompt) => {
//   const response = await fetch(OLLAMA_URL, {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify({
//       model: "llama3",
//       prompt,
//       stream: false,
//       options: {
//         temperature: 0.7,
//         num_predict: 800,
//       },
//     }),
//   });

//   if (!response.ok) {
//     throw new Error("Ollama request failed");
//   }

//   const data = await response.json();

//   return data.response?.trim() || "";
// };

// module.exports = { callOllama };

// const OLLAMA_URL =
//   process.env.OLLAMA_URL || "https://ollama.com/api/generate";

// const callOllama = async (prompt) => {
//   const response = await fetch(OLLAMA_URL, {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//       Authorization: `Bearer ${process.env.OLLAMA_API_KEY}`,
//     },
//     body: JSON.stringify({
//       model: "gpt-oss:120b",
//       prompt,
//       stream: false,
//       options: {
//         temperature: 0.7,
//         num_predict: 800,
//       },
//     }),
//   });

//   if (!response.ok) {
//     const errorText = await response.text();
//     console.error("Ollama error:", response.status, errorText);
//     throw new Error(`Ollama request failed: ${response.status}`);
//   }

//   const data = await response.json();

//   return data.response?.trim() || "";
// };

// module.exports = { callOllama };

const OLLAMA_URL =
  process.env.OLLAMA_URL || "https://ollama.com/api/generate";

const callOllama = async (prompt) => {
  try {
    const response = await fetch(OLLAMA_URL, {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OLLAMA_API_KEY}`,
      },

      body: JSON.stringify({
        model: "gpt-oss:120b",
        prompt,
        stream: false,
        options: {
          temperature: 0.7,
          num_predict: 800,
        },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();

      console.error("========== OLLAMA ERROR ==========");
      console.error("Status:", response.status);
      console.error("Response:", errorText);
      console.error("URL:", OLLAMA_URL);
      console.error("API key exists:", !!process.env.OLLAMA_API_KEY);
      console.error("===================================");

      throw new Error(`Ollama request failed: ${response.status}`);
    }

    const data = await response.json();

    console.log("Ollama response received successfully");

    return data.response?.trim() || "";
  } catch (error) {
    console.error("Ollama service error:", error.message);
    throw error;
  }
};

module.exports = {
  callOllama,
};