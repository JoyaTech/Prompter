// FIX: Define and export Prompt and HistoryItem types to resolve module errors.
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
