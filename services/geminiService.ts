import { GoogleGenAI, GenerateContentResponse, Type } from "@google/genai";
import { TemplateFields } from '../types';

// Per instructions, API key must be from process.env.API_KEY
if (!process.env.API_KEY) {
    // In a real app, you might want to show a more user-friendly error
    // but for this context, throwing an error is sufficient.
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Generates content using the Gemini model.
 * @param prompt The text prompt to send to the model.
 * @returns The generated content response.
 */
export const generateContent = async (prompt: string): Promise<GenerateContentResponse> => {
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
        });
        return response;
    } catch (error) {
        console.error("Error generating content:", error);
        throw new Error("Failed to generate content from Gemini API.");
    }
};

/**
 * Constructs a detailed prompt from a template.
 * @param fields The structured prompt fields.
 * @param additionalInstructions Any extra freeform instructions.
 * @returns A formatted prompt string.
 */
export const constructPromptFromTemplate = (fields: TemplateFields, additionalInstructions: string): string => {
    let prompt = "";
    if (fields.role) prompt += `Role: ${fields.role}\n\n`;
    if (fields.task) prompt += `Task: ${fields.task}\n\n`;
    if (fields.context) prompt += `Context: ${fields.context}\n\n`;
    if (fields.constraints) prompt += `Constraints: ${fields.constraints}\n\n`;
    if (additionalInstructions) prompt += `Additional Instructions: ${additionalInstructions}\n\n`;
    
    return prompt.trim();
};


/**
 * Analyzes the alignment of a response to its prompt.
 * This is a meta-prompt that asks the model to evaluate itself.
 * @param prompt The original prompt.
 * @param response The model's response.
 * @returns A string with alignment notes.
 */
export const analyzeAlignment = async (prompt: string, response: string): Promise<string> => {
    const analysisPrompt = `
        Analyze the alignment between the following prompt and response.
        - Does the response directly address the user's prompt?
        - Does it follow all instructions and constraints?
        - Is the tone and format appropriate?
        Provide a brief, one-sentence summary of your findings.

        --- PROMPT ---
        ${prompt}

        --- RESPONSE ---
        ${response}
    `;

    try {
        const analysisResponse = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: analysisPrompt,
            config: {
                systemInstruction: "You are an expert in evaluating AI model responses for quality and alignment with user prompts.",
                temperature: 0.2,
            }
        });
        // FIX: Use .text property to get the string content from the response
        return analysisResponse.text.trim();
    } catch (error) {
        console.error("Error analyzing alignment:", error);
        return "Could not analyze alignment.";
    }
};

/**
 * Blends a base prompt with multiple essence prompts using an AI meta-prompt.
 * @param basePrompt The main prompt to build upon.
 * @param essences An array of strings representing concepts to merge.
 * @returns The AI-generated blended prompt response.
 */
export const blendPrompt = async (basePrompt: string, essences: string[]): Promise<GenerateContentResponse> => {
    const blendingInstruction = `
You are a prompt alchemist. Your task is to magically blend a "base prompt" with several "essences" to create a new, refined, and superior prompt.

**Base Prompt:**
"${basePrompt}"

**Essences to blend in:**
${essences.map(e => `- "${e}"`).join('\n')}

Combine these elements into a single, cohesive, and powerful new prompt. Return ONLY the new prompt text, without any preamble or explanation.
    `;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: blendingInstruction,
            config: {
                temperature: 0.7,
            }
        });
        return response;
    } catch (error) {
        console.error("Error blending prompt:", error);
        throw new Error("Failed to blend prompt using Gemini API.");
    }
};

/**
 * Generates two distinct prompt variations from a single idea for A/B testing.
 * @param idea The core concept provided by the user.
 * @returns An object containing two prompt strings, promptA and promptB.
 */
export const generatePromptVariations = async (idea: string): Promise<{ promptA: string; promptB: string }> => {
    const variationInstruction = `
You are an expert Prompt Engineer tasked with creating two distinct variations of a prompt for A/B testing.
Based on the user's core idea, create two different prompts. They should aim for the same goal but use different approaches.
For example, one could be direct and instructional, while the other is more creative and persona-driven.
The core idea is: "${idea}"
Return the two prompts in a JSON object.
`;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: variationInstruction,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        promptA: {
                            type: Type.STRING,
                            description: "The first prompt variation."
                        },
                        promptB: {
                            type: Type.STRING,
                            description: "The second, different prompt variation."
                        },
                    },
                    required: ["promptA", "promptB"],
                },
            },
        });
        
        const jsonText = response.text.trim();
        const variations = JSON.parse(jsonText);

        if (variations && typeof variations.promptA === 'string' && typeof variations.promptB === 'string') {
            return variations;
        } else {
            throw new Error("Invalid JSON structure received from API.");
        }

    } catch (error) {
        console.error("Error generating prompt variations:", error);
        throw new Error("Failed to generate prompt variations using Gemini API.");
    }
};