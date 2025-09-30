// FIX: Added definitions for all shared types used across the application.
export type PromptComponentType = 'role' | 'task' | 'context' | 'constraints' | 'text';

export interface PromptComponent {
  id: string;
  type: PromptComponentType;
  content: string;
}

export interface Prompt {
  id: string;
  name: string;
  text: string;
  folderId?: string;
}

export interface HistoryItem {
  id: string;
  prompt: string;
  response: string;
  timestamp: Date;
  rating?: number;
  feedback?: string;
  alignment_notes?: string;
  comparisonId?: string;
  duration?: number;
}

export interface RecipeVariable {
    name: string;
    defaultValue: string;
}

export interface PromptRecipe {
  id: string;
  name: string;
  description: string;
  components: PromptComponent[];
  variables: RecipeVariable[];
  folderId?: string;
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

export interface EditorState {
  promptText?: string;
  components?: PromptComponent[];
  historyItem?: HistoryItem;
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

export interface Essence {
    id: string;
    text: string;
}

export interface Folder {
    id: string;
    name: string;
    type: 'prompt' | 'recipe';
}

export interface ThemeColors {
  primary: string;
  background: string;
  card: string;
  'card-secondary': string;
  'text-main': string;
  'text-secondary': string;
  'border-color': string;
  accent: string;
}

export interface ThemeSettings {
  name: string;
  colors: ThemeColors;
  fonts: {
    heading: string;
    body: string;
  };
  density: 'compact' | 'comfortable' | 'spacious';
  borderRadius: number; // in rem
}

export type ThemePreset = 'default' | 'ocean' | 'forest' | 'sunset';