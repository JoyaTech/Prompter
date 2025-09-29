export enum Status {
  IDLE = 'IDLE',
  LOADING = 'LOADING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR',
}

export interface SavedPrompt {
  id: string;
  original: string;
  improved: string;
  timestamp: number;
}
