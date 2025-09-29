// FIX: Implemented the Gemini service to refine prompts using the Google GenAI SDK, following best practices.
import { GoogleGenAI, Type } from "@google/genai";

// FIX: Initialize the GoogleGenAI client with the API key from environment variables.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const model = 'gemini-2.5-flash';

// FIX: Define the response schema for the Gemini API call to ensure structured JSON output.
const responseSchema = {
    type: Type.OBJECT,
    properties: {
        refined_prompt: {
            type: Type.STRING,
            description: "The refined, improved version of the user's prompt. This should be clear, concise, and optimized for a large language model.",
        },
        alignment_notes: {
            type: Type.STRING,
            description: "A brief analysis of the prompt for any potential ethical or safety issues. If no issues are found, state 'No issues found.' Otherwise, describe the potential issue and how the refined prompt mitigates it.",
        },
        topics: {
            type: Type.ARRAY,
            items: {
                type: Type.STRING
            },
            description: "A list of 2-3 main topics or keywords present in the refined prompt."
        },
    },
    required: ["refined_prompt", "alignment_notes", "topics"],
};

export interface RefinedPromptResponse {
  refinedPrompt: string;
  alignmentNotes: string | null;
  topics: string[];
}

// FIX: Implement the refinePrompt function to call the Gemini API.
export const refinePrompt = async (prompt: string): Promise<RefinedPromptResponse> => {
    try {
        const systemInstruction = `You are an expert in prompt engineering for large language models. Your task is to refine a given user prompt to make it more effective, clear, and safe.
        1.  **Refine the Prompt:** Rewrite the user's prompt to be more specific, provide better context, and follow best practices for prompt design.
        2.  **Analyze Alignment:** Check the prompt for any ethical or safety concerns (e.g., hate speech, harmful content, bias).
        3.  **Identify Topics:** Extract the main topics from the prompt.
        4.  **Format Output:** Return the result strictly in the requested JSON format.`;

        const response = await ai.models.generateContent({
            model: model,
            contents: `Refine this prompt: "${prompt}"`,
            config: {
                systemInstruction,
                responseMimeType: "application/json",
                responseSchema,
            },
        });

        // FIX: Correctly access the response text per SDK guidelines.
        const text = response.text;
        const parsedJson = JSON.parse(text);

        return {
            refinedPrompt: parsedJson.refined_prompt || '',
            alignmentNotes: parsedJson.alignment_notes || 'No analysis provided.',
            topics: parsedJson.topics || [],
        };
    } catch (error) {
        console.error('Error refining prompt with Gemini API:', error);
        if (error instanceof Error) {
            throw new Error(`Failed to refine prompt: ${error.message}`);
        }
        throw new Error('An unknown error occurred while refining the prompt.');
    }
};
