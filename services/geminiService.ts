import { GoogleGenAI } from "@google/genai";
import { Mode, TargetModel, Language } from '../types';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable is not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export type DeepModeResponse = {
    refined_prompt: string;
    alignment_notes: string;
    topics: string[];
};

const getModelInstruction = (mode: Mode, targetModel: TargetModel, lang: Language) => {
    const languageMap: Record<Language, string> = {
        en: 'English',
        he: 'Hebrew',
    };
    const targetLanguage = languageMap[lang] || 'English';

    let baseInstruction = `You are a world-class prompt engineering assistant named "FlowIt". Your task is to refine a user's initial prompt to make it more effective for a target AI model. The final output must be in ${targetLanguage}.`;

    const targetModelInstruction = `CRITICAL: The final prompt must be optimized for the following target model or tool: ${targetModel}. Adjust syntax, structure, and instructions accordingly.`;

    const modeInstruction = mode === 'deep'
    ? `
      Deep Analysis Mode: Your response MUST be a valid JSON object. Do not include any text outside of the JSON structure.
      The JSON object must conform to this exact schema. For the 'topics' field, identify 3-5 main subject areas of the refined prompt (e.g., 'Marketing', 'Code Generation', 'Customer Support', 'Data Analysis').
      {
        "refined_prompt": "The detailed, robust, and structured prompt text.",
        "alignment_notes": "A brief analysis of potential ethical issues, biases, or policy violations in the original prompt. If none, state 'No issues found'.",
        "topics": ["list", "of", "relevant", "subject", "tags"]
      }
    `
    : `
      Quick Refine Mode: Return ONLY the refined prompt text, with no preamble, explanations, or markdown formatting.
    `;

    return `${baseInstruction} ${targetModelInstruction} ${modeInstruction}`;
}

export const refinePrompt = async (
  originalPrompt: string,
  mode: Mode,
  targetModel: TargetModel,
  lang: Language
): Promise<string | DeepModeResponse> => {
  try {
    const systemInstruction = getModelInstruction(mode, targetModel, lang);
    const userPrompt = `Original prompt to refine: "${originalPrompt}"`;

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: userPrompt,
        config: {
            systemInstruction: systemInstruction,
            temperature: 0.7,
            topP: 0.9,
            topK: 50,
            ...(mode === 'deep' && { responseMimeType: "application/json" }),
        },
    });

    const responseText = response.text;
    if (!responseText) {
        throw new Error("Received an empty response from the AI.");
    }

    if (mode === 'deep') {
        try {
            const parsed = JSON.parse(responseText) as DeepModeResponse;
            if (!parsed.refined_prompt || typeof parsed.alignment_notes === 'undefined' || !Array.isArray(parsed.topics)) {
                 throw new Error("Deep Mode JSON missing required fields (refined_prompt, alignment_notes, or topics).");
            }
            return parsed;
        } catch(e) {
            console.error("Failed to parse JSON in deep mode:", responseText);
            throw new Error("Deep Mode failed to return a valid JSON structure. The model may have replied with text instead. Try Quick Mode.");
        }
    }

    return responseText.trim();

  } catch (error) {
    console.error("Error refining prompt:", error);
    if (error instanceof Error) {
        return `Error: Failed to refine prompt. ${error.message}`;
    }
    return "Error: An unknown error occurred while refining the prompt.";
  }
};