// services/geminiService.ts
import { GoogleGenAI } from "@google/genai";
import { Language, Mode } from "../types";

// FIX: Initialize GoogleGenAI with a named apiKey parameter as per the guidelines.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

const getSystemInstruction = (lang: Language, mode: Mode): string => {
  const isHebrew = lang === 'he';
  const languageInstruction = isHebrew 
    ? "The user's prompt is in Hebrew. Your refined prompt must also be in Hebrew." 
    : "The user's prompt is in English. Your refined prompt must also be in English.";

  const modeInstruction = mode === 'deep' 
    ? `
      Deep Analysis Mode:
      1.  Identify the user's core goal.
      2.  Deconstruct the prompt into key components (e.g., role, task, context, constraints, format).
      3.  Rewrite the prompt to be explicit, structured, and comprehensive. Use clear headings or sections if appropriate.
      4.  Incorporate best practices for prompt engineering, such as providing examples (if applicable), defining the desired tone, and specifying the output format.
      5.  The result should be a detailed, robust prompt that minimizes ambiguity.
    `
    : `
      Quick Refine Mode:
      1.  Identify the user's core goal.
      2.  Clarify any ambiguous language.
      3.  Make the prompt more concise and direct without losing essential details.
      4.  Ensure the key instruction is clear and prominent.
      5.  The result should be a polished, straightforward version of the user's original prompt.
    `;
  
  return `You are an expert prompt engineering assistant. Your task is to refine a user's initial prompt to make it more effective for a large language model.
    Do not respond to the user's prompt. Only refine the prompt itself.
    Return ONLY the refined prompt text, with no preamble, explanations, or markdown formatting.
    ${languageInstruction}
    ${modeInstruction}
  `;
};

export const refinePrompt = async (
  prompt: string,
  lang: Language,
  mode: Mode
): Promise<string> => {
  if (!prompt.trim()) {
    throw new Error("Prompt cannot be empty.");
  }

  try {
    // FIX: Use ai.models.generateContent as per the guidelines.
    // FIX: Use 'gemini-2.5-flash' model as per the guidelines.
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
            systemInstruction: getSystemInstruction(lang, mode),
            // Use a moderate temperature for creative but controlled refinement.
            temperature: 0.7,
        }
    });

    // FIX: Access the response text directly from the `.text` property.
    const refinedText = response.text;

    if (!refinedText) {
        throw new Error("Failed to get a response from the model.");
    }
    
    return refinedText.trim();
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new Error("Failed to refine prompt. Please check your API key and try again.");
  }
};
