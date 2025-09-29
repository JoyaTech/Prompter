// FIX: Defined the necessary types for the application based on their usage in other components.
export type Language = 'en' | 'he';
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
  alignment_notes: string | null;
  topics: string[];
}
