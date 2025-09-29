// types.ts
export type Language = 'en' | 'he';
export type Mode = 'quick' | 'deep';

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
}