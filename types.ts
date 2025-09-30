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
  comparisonId?: string;
}

export interface TemplateFields {
  role: string;
  task: string;
  context: string;
  constraints: string;
}

export interface TestCase {
  id:string;
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

export interface CommunityPrompt {
    id: string;
    name: string;
    description: string;
    prompt: string;
    downloads: number;
    author: string;
    tags: string[];
}

export interface AlchemistRecipe {
    id: string;
    name: string;
    description: string;
    prompt: string;
    variables: { name: string; type: 'string' | 'number'; defaultValue: string }[];
}

export type PromptComponentType = 'role' | 'task' | 'context' | 'constraints' | 'text';

export interface PromptComponent {
  id: string;
  type: PromptComponentType;
  content: string;
}

export interface PromptRecipe {
    id: string;
    name: string;
    description: string;
    components: PromptComponent[];
    variables: { name: string; defaultValue: string }[];
}

export interface Essence {
    id: string;
    text: string;
}
