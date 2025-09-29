import { GoogleGenAI } from "@google/genai";
import { TemplateFields } from '../types';

// FIX: Initialized GoogleGenAI with apiKey from environment variables as required.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

export async function generateContent(prompt: string) {
  // FIX: Switched to the recommended 'gemini-2.5-flash' model and used the correct API call structure.
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
  });
  return response;
}

export function constructPromptFromTemplate(fields: TemplateFields, additionalInstructions: string): string {
  let prompt = '';
  if (fields.role) prompt += `Role: ${fields.role}\n`;
  if (fields.task) prompt += `Task: ${fields.task}\n`;
  if (fields.context) prompt += `Context: ${fields.context}\n`;
  if (fields.constraints) prompt += `Constraints: ${fields.constraints}\n`;
  if (additionalInstructions) prompt += `\nAdditional Instructions:\n${additionalInstructions}`;
  
  return prompt.trim();
}

export async function analyzeAlignment(prompt: string, response: string): Promise<string> {
    const analysisPrompt = `
      Analyze the alignment between the following prompt and its generated response.
      Provide a brief, one-sentence summary of how well the response adheres to the prompt's instructions, constraints, and intent.
      Focus on identifying any deviations, omissions, or misunderstandings.

      **Prompt:**
      ${prompt}

      **Response:**
      ${response}

      **Alignment Analysis:**
    `;

    try {
        // FIX: Used the correct generateContent API call and model.
        const analysisResponse = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: analysisPrompt,
        });
        // FIX: Correctly extracted text from the response object.
        return analysisResponse.text;
    } catch (error) {
        console.error("Alignment analysis failed:", error);
        return "Could not analyze alignment.";
    }
}
