const Groq = require("groq-sdk");

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY, timeout: 30000 });

const getAIResponse = async (messages) => {
  const completion = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages,
    max_tokens: 1024,
  });
  return completion.choices[0].message.content;
};

module.exports = { getAIResponse };
