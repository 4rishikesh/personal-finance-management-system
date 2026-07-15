const OLLAMA_URL =
  process.env.OLLAMA_URL || "http://localhost:11434/api/generate";

const callOllama = async (prompt) => {
  const response = await fetch(OLLAMA_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "llama3",
      prompt,
      stream: false,
      options: {
        temperature: 0.7,
        num_predict: 800,
      },
    }),
  });

  if (!response.ok) {
    throw new Error("Ollama request failed");
  }

  const data = await response.json();

  return data.response?.trim() || "";
};

module.exports = { callOllama };