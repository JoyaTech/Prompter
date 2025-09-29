import { GoogleGenAI } from "@google/genai";

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable is not set.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Refines a user-provided prompt using the Gemini AI model.
 * @param originalPrompt The initial prompt from the user.
 * @param mode The refinement mode, either 'quick' or 'deep'.
 * @returns A promise that resolves to the refined prompt as a string.
 */
export async function refinePrompt(originalPrompt: string, mode: 'quick' | 'deep'): Promise<string> {
  if (!originalPrompt.trim()) {
    throw new Error("Prompt cannot be empty.");
  }

  try {
    const systemInstruction = `You are an expert in prompt engineering. Your task is to refine the user's input into a more powerful, precise, and effective prompt for a generative AI model.
You will be given a mode: 'Quick' or 'Deep'.
- If 'Quick Mode' is selected, the prompt should be concise and direct.
- If 'Deep Mode' is selected, the prompt should be more detailed, structured, and include safeguards (e.g., specifying output format, error handling).
Focus on clarity, specificity, and providing context. The output must be only the refined prompt, without any additional explanations, introductions, or pleasantries.
Do not wrap the output in quotes or code blocks.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Mode: ${mode.charAt(0).toUpperCase() + mode.slice(1)}.\nRefine this prompt: "${originalPrompt}"`,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.7,
        topP: 1,
        topK: 32,
      },
    });

    const refinedText = response.text;
    
    if (!refinedText) {
        throw new Error("Received an empty response from the AI.");
    }
    
    return refinedText.trim();
  } catch (error) {
    console.error("Error refining prompt:", error);
    if (error instanceof Error) {
        throw new Error(`Failed to communicate with the AI model: ${error.message}`);
    }
    throw new Error("An unknown error occurred while refining the prompt.");
  }
}