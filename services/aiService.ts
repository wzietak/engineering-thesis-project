import { GoogleGenAI } from "@google/genai";

const GEMINI_API_KEY = process.env.EXPO_PUBLIC_GEMINI_API_KEY as string;

const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

export async function generateSentence(targetLanguage: string, word: string) {
  const response = await ai.models.generateContent({
    model: "gemini-3.5-flash",
    contents: `You're a helpful language teacher. Provide natural, short example sentence for the given word in ${targetLanguage}. Respond ONLY with a valid JSON format with key 'sentence'. Word: ${word}`,
  });

  console.log(response.text as string);
  return JSON.parse(response.text as string);
}
