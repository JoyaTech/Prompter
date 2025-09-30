
export interface HistoryItem {
  id: string;
  prompt: string;
  response: string;
  timestamp: Date;
  rating?: number;
  feedback?: string;
  alignment_notes?: string;
  isVariant?: boolean;
  variantParentId?: string;
}

export interface Prompt {
  id: string;
  name: string;
  text: string;
  folderId?: string | null;
}

export type PromptComponentType = 'role' | 'task' | 'context' | 'constraints' | 'text';

export interface PromptComponent {
    id: string;
    type: PromptComponentType;
    content: string;
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

export interface ThemeFonts {
  heading: string;
  body: string;
}

export type ThemeDensity = 'compact' | 'comfortable' | 'spacious';
export type ThemePreset = 'default' | 'ocean' | 'forest' | 'sunset';

export interface ThemeSettings {
  name: string;
  colors: ThemeColors;
  fonts: ThemeFonts;
  density: ThemeDensity;
  borderRadius: number;
}

export interface CommunityPrompt {
    id: string;
    name: string;
    prompt: string;
    description: string;
    author: string;
    downloads: number;
    tags: string[];
}

export interface Essence {
    id: string;
    text: string;
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
    folderId?: string | null;
    name_HE?: string;
}

export interface Folder {
    id: string;
    name: string;
    type: 'prompt' | 'recipe';
}

export type ToastMessage = {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
};

export type View = 'dashboard' | 'ide' | 'alchemist' | 'appearance';
