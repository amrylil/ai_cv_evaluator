import { GoogleGenerativeAI } from "@google/generative-ai";

export async function callGemini(prompt: string) {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

  // Pilih model yang kamu gunakan
  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash", // atau gemini-1.5-flash, gemini-2.0-pro, dll
    systemInstruction: "You are an expert technical recruiter.",
  });

  const result = await model.generateContent(prompt);

  return result.response.text();
}
