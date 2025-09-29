// types.ts
export type Language = 'en' | 'he';
export type Mode = 'quick' | 'deep';
export type TargetModel = 'Gemini-Ultra' | 'Code-Interpreter' | 'Imagen' | 'Generic-LLM';

export interface Prompt {
  id: string;
  name: string;
  text: string;
}

export interface HistoryItem {
  id: string;
  prompt: string;
  response: string;
  timestamp: Date;
  alignment_notes?: string; // For Ethical Audit MVP
}
