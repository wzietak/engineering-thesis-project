import { GoogleGenAI } from "@google/genai";

const GEMINI_API_KEY = process.env.EXPO_PUBLIC_GEMINI_API_KEY as string;

const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

function parseCleanJSON<T = any>(raw: string): T {
  const cleaned = raw
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/```\s*$/i, "")
    .trim();

  return JSON.parse(cleaned) as T;
}

export async function generateSentence(targetLanguage: string, word: string) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: `You're a strict and helpful language teacher. Analyze the input text provider by the user.
    Rule 1 (Gibberish): If the input word is a random string of characters and is meaningless, reject it. Return: {"isValid": false, "errorReason": "gibberish", "sentence": null}
    Rule 2 (Language): The input word MUST be in ${targetLanguage}. If it's in different language, reject it. Return: {"isValid": false, "errorReason": "wrong_language", "sentence": null}
    Rule 3 (Length): The input must be a single word or a short phrasal verb/idiom in ${targetLanguage} (max. 5 words). If the user inputs a full sentence or a long expression, reject it. Return: {"isValid": false, "errorReason": "wrong_length", "sentence": null}
    If the given input word/expression passes all the rules, provide natural, short example sentence for the given word in ${targetLanguage}. Return: {"isValid": true, "errorReason": null, "sentence": "..."}. Word: ${word}
    CRITICAL OUTPUT INSTRUCTIONS: 
    Return ONLY valid, raw JSON.
    DO NOT wrap the response in Markdown code blocks.
    Do not include any conversational text, greetings, notes, explanations or postscript.
    The response must start immediately with '{' and end with '}'.`,
    });
    return parseCleanJSON(response.text as string);

    // JSON.parse(response.text as string);
  } catch (error: any) {
    console.log("API ERROR: ", error);
    if (
      error.message.includes("429") ||
      error.message.includes("Quota exceeded")
    ) {
      throw new Error("quota_exceeded");
    } else {
      throw new Error("api_error");
    }
  }
}
