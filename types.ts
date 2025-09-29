// FIX: Added TemplateFields for the Visual Builder, and updated HistoryItem.
export type Language = 'en' | 'he';
export type Page = 'editor' | 'dashboard';

// חדש: סוגי מודלים וכלי יעד
export type TargetModel = 'Generic-LLM' | 'Gemini-Ultra' | 'Code-Interpreter' | 'Imagen';
export type Mode = 'quick' | 'deep';

// חדש: מבנה נתונים עבור Template Builder
export interface TemplateFields {
  role: string;
  task: string;
  context: string;
  constraints: string;
}

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
  alignment_notes: string | null;
  topics: string[];
  // test_results?: any; // שמור לשלב 4 (Prompt Unit Tester)
}