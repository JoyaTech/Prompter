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
  alignment_notes?: string;
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
