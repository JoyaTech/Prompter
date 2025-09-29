// FIX: Implemented file conversion and multi-modal request handling for RAG.
import { GoogleGenAI, Type, Part } from "@google/genai";
import { Mode, TargetModel, Language } from '../types';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable not set.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
const model = 'gemini-2.5-flash';

const responseSchema = {
    type: Type.OBJECT,
    properties: {
        refined_prompt: { type: Type.STRING },
        alignment_notes: { type: Type.STRING },
        topics: { type: Type.ARRAY, items: { type: Type.STRING } },
    },
    required: ["refined_prompt", "alignment_notes", "topics"],
};

export interface RefinedPromptResponse {
  refinedPrompt: string;
  alignmentNotes: string | null;
  topics: string[];
}

const fileToGenerativePart = (file: File): Promise<Part> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
            if (typeof reader.result !== 'string') {
                return reject(new Error("Failed to read file as Data URL."));
            }
            const [header, base64] = reader.result.split(';base64,');
            const mimeType = header.replace('data:', '');
            resolve({ inlineData: { data: base64, mimeType } });
        };
        reader.onerror = error => reject(error);
        reader.readAsDataURL(file);
    });
};

const getModelInstruction = (mode: Mode, targetModel: TargetModel, lang: Language): string => {
    const languageInstruction = lang === 'he' ? "The user is Hebrew speaking. Refine the prompt to be effective, but ensure the final prompt's language and content are in HEBREW." : "The user is English speaking. The final prompt's language and content must be in ENGLISH.";
    const targetModelInstruction = `CRITICAL: The final prompt must be optimized for the following target model: ${targetModel}. Adjust syntax, structure, and instructions accordingly.`;
    const modeInstruction = mode === 'deep'
        ? `Deep Analysis Mode: Your response MUST be a valid JSON object conforming to the schema.`
        : `Quick Refine Mode: Return ONLY the refined prompt text, with no preamble or explanations.`;

    return `You are an expert prompt engineering assistant. Your task is to refine a user's initial prompt to make it more effective.
    ${languageInstruction}
    ${targetModelInstruction}
    ${modeInstruction}`;
};

export const refinePrompt = async (
  originalPrompt: string,
  mode: Mode,
  targetModel: TargetModel,
  lang: Language,
  uploadedFile: File | null
): Promise<RefinedPromptResponse> => {
  try {
    const systemInstruction = getModelInstruction(mode, targetModel, lang);
    const contents: Part[] = [];
    let userPromptText = `Original prompt to refine: "${originalPrompt}"`;

    if (uploadedFile) {
        contents.push(await fileToGenerativePart(uploadedFile));
        userPromptText = `CRITICAL RAG CONTEXT: Use the attached file content as the primary data source for the refinement. NOW, ${userPromptText}`;
    }
    contents.push({ text: userPromptText });

    const response = await ai.models.generateContent({
        model: model,
        contents: contents,
        config: {
            systemInstruction,
            responseMimeType: "application/json",
            responseSchema,
        },
    });

    const text = response.text;
    const parsedJson = JSON.parse(text);

    return {
        refinedPrompt: parsedJson.refined_prompt || '',
        alignmentNotes: parsedJson.alignment_notes || null,
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