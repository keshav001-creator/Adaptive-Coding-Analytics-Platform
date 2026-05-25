const {GoogleGenAI}= require("@google/genai");
require('dotenv').config();


const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
});

async function generateResponse(prompt) {
  const response = await ai.models.generateContent({
    model: "gemini-3.5-flash",
    contents: prompt,
  });
  return response.text;
}

module.exports = generateResponse;