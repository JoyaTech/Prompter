import { GenerateContentResponse, Type } from "@google/genai";
import { ThemeColors } from "../types";


// Mocks a server response for GenerateContentResponse
const createMockResponse = (text: string): GenerateContentResponse => {
    return {
      text: text,
      // The following are added to satisfy the type, but are not used in the app's current state.
      // In a real backend, these would be populated correctly.
      functionCalls: [],
      candidates: [],
      // FIX: Added missing properties to satisfy the GenerateContentResponse type.
      data: undefined,
      executableCode: undefined,
      codeExecutionResult: undefined,
    };
};


// All functions now point to a conceptual backend proxy.
// This ensures the API key is NEVER handled on the client side.

export const generateContent = async (prompt: string): Promise<GenerateContentResponse> => {
  // In a real app, this would be a fetch call:
  // const response = await fetch('/api/generate', {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify({ prompt })
  // });
  // if (!response.ok) throw new Error("API call failed");
  // const data = await response.json();
  // return createMockResponse(data.text);

  // For demonstration in a client-only environment:
  console.warn("DEV MODE: Using mocked API response for generateContent. No actual API call was made.");
  const mockText = `This is a mocked response for the prompt: "${prompt.substring(0, 50)}..."`;
  return Promise.resolve(createMockResponse(mockText));
};

export const analyzeAlignment = async (prompt: string, responseText: string): Promise<string> => {
  // const response = await fetch('/api/analyze', { ... });
  console.warn("DEV MODE: Using mocked API response for analyzeAlignment.");
  return Promise.resolve("This is a mocked alignment analysis. The response appears to align well with the prompt's intent.");
};

export const blendPrompt = async (basePrompt: string, essences: string[]): Promise<GenerateContentResponse> => {
  // const response = await fetch('/api/blend', { ... });
  console.warn("DEV MODE: Using mocked API response for blendPrompt.");
  const mockText = `This is a blended prompt based on "${basePrompt.substring(0, 30)}..." and ${essences.length} essences.`;
  return Promise.resolve(createMockResponse(mockText));
};

export const generatePromptVariations = async (idea: string): Promise<{ promptA: string; promptB: string }> => {
    // const response = await fetch('/api/variations', { ... });
    console.warn("DEV MODE: Using mocked API response for generatePromptVariations.");
    return Promise.resolve({
        promptA: `Variation A for the idea: "${idea}" - This version focuses on a professional tone.`,
        promptB: `Variation B for the idea: "${idea}" - This version uses a more creative and narrative approach.`
    });
};


export const generateThemeFromPrompt = async (prompt: string): Promise<ThemeColors> => {
    // const response = await fetch('/api/generate-theme', { ... });
    console.warn("DEV MODE: Using mocked API response for generateThemeFromPrompt.");
    // Return a random, fun theme for demonstration
    const palettes = [
        { primary: '#ff6b6b', background: '#2c3e50', card: '#34495e', 'card-secondary': '#4a627a', 'text-main': '#ecf0f1', 'text-secondary': '#bdc3c7', 'border-color': '#4e6a85', accent: '#4ecdc4' },
        { primary: '#9b59b6', background: '#1a1a1a', card: '#2c2c2c', 'card-secondary': '#3e3e3e', 'text-main': '#ffffff', 'text-secondary': '#a0a0a0', 'border-color': '#4f4f4f', accent: '#f1c40f' },
    ];
    return Promise.resolve(palettes[Math.floor(Math.random() * palettes.length)]);
};