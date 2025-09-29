export type Language = 'en' | 'he';

export type Mode = 'quick' | 'deep';

export type TargetModel = 'Generic-LLM' | 'Gemini-Ultra' | 'Code-Interpreter' | 'Imagen';

export type Page = 'editor' | 'dashboard';

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
  alignment_notes?: string; // For Ethical & Compliance Audit MVP
  topics?: string[]; // For Dashboard Analytics
}