
export type Page = 'editor' | 'dashboard' | 'theme' | 'challenge';

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
  alignment_notes?: string;
  rating?: number;
  feedback?: string;
}

export interface TemplateFields {
    role: string;
    task: string;
    context: string;
    constraints: string;
}

export interface TestCase {
    id: string;
    input: string;
    expectedOutput: string;
}

export interface TestResult {
    testCaseId: string;
    pass: boolean;
    actualOutput: string;
    error?: string;
}

export interface Theme {
  primary: string;
  background: string;
  card: string;
  cardSecondary: string;
  textMain: string;
  textSecondary: string;
  accent: string;
  border: string;
}

export interface PredefinedTheme extends Theme {
  name: string;
}

export interface Challenge {
  id: number;
  title: string;
  description: string;
}
