import { GoogleGenAI } from "@google/genai";

if (!process.env.API_KEY) {
  // In this environment, we assume the API key is provided.
  // A real-world application should handle this more gracefully.
  console.warn("API_KEY environment variable not found. App may not function correctly.");
}

// FIX: Initialize GoogleGenAI directly with process.env.API_KEY as per guidelines.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });
const model = "gemini-2.5-flash";

const systemInstruction = `You are an expert in prompt engineering.
Your task is to take a user's prompt and improve it.
Make it more specific, clear, and effective for generating the best possible response from an AI model.
Return only the improved prompt, without any additional text, explanation, or markdown formatting.
Just the raw, improved text.`;

export async function* improvePromptStream(prompt: string): AsyncGenerator<string> {
  try {
    const result = await ai.models.generateContentStream({
      model: model,
      contents: prompt,
      config: {
          systemInstruction: systemInstruction,
      }
    });

    for await (const chunk of result) {
      // It's possible for a chunk to have no text, so we guard against that.
      if (chunk.text) {
        yield chunk.text;
      }
    }
  } catch (error) {
    console.error("Error generating content:", error);
    throw new Error("Failed to get response from Gemini API. Please check your API key and network connection.");
  }
}
