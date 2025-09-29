import { GoogleGenAI, GenerateContentResponse } from "@google/genai";

// FIX: Initialize GoogleGenAI with the apiKey in an object.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

const systemInstruction = `You are an expert in prompt engineering. Your task is to refine a user's initial prompt to make it more effective for a generative AI model.
When you receive a prompt, analyze it and rewrite it to be clearer, more specific, and better structured.
The refined prompt should:
- Have a clear and specific goal.
- Provide sufficient context.
- Specify the desired format for the output.
- Include constraints to guide the AI's response.
- Use clear and direct language.
Return ONLY the refined prompt, without any explanations or conversational text.`;

export async function* streamRefinePrompt(originalPrompt: string): AsyncGenerator<string> {
  if (!originalPrompt.trim()) {
    return;
  }

  try {
    // FIX: Use ai.models.generateContentStream instead of a deprecated method.
    const response = await ai.models.generateContentStream({
        // FIX: Use a recommended model 'gemini-2.5-flash'.
        model: "gemini-2.5-flash",
        // FIX: Use 'contents' property for the prompt.
        contents: originalPrompt,
        // FIX: Add systemInstruction to the 'config' object.
        config: {
          systemInstruction: systemInstruction,
        },
    });

    for await (const chunk of response) {
      // FIX: Access the generated text directly from the .text property of the chunk.
      yield chunk.text;
    }
  } catch (error) {
    console.error("Error streaming refined prompt:", error);
    throw new Error("Failed to connect to the generative AI service. Please check your API key and network connection.");
  }
}
