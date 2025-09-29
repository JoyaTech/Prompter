// i18n.ts
import { Language } from './types';

const translations = {
  en: {
    app_title: 'FlowIt Prompt Refiner',
    app_tagline: 'Craft the perfect prompt for any task, powered by Gemini.',
    switch_lang: 'עברית',
    switch_title: 'Switch to Hebrew',
    user_prompt_placeholder: 'Enter your prompt here...',
    mode_quick: 'Quick Refine',
    mode_quick_desc: 'Fast, general improvements.',
    mode_deep: 'Deep Analysis',
    mode_deep_desc: 'Comprehensive, structured rewrite.',
    refine_prompt_btn: 'Refine Prompt',
    refining: 'Refining...',
    output_placeholder: 'Your refined prompt will appear here.',
    save_prompt: 'Save Prompt',
    prompt_saved: 'Saved!',
    est_tokens: 'Est. Tokens:',
    saved_prompts: 'Saved Prompts',
    history: 'History',
    error_generic: 'An error occurred. Please try again.',
    error_empty_prompt: 'Please enter a prompt to refine.',
    target_model_label: 'Optimize for:',
    model_generic: 'Generic LLM',
    model_gemini_ultra: 'Gemini-Ultra',
    model_code_interpreter: 'Code-Interpreter',
    model_imagen: 'Imagen',
  },
  he: {
    app_title: 'FlowIt - מזקק פרומפטים',
    app_tagline: 'צרו את הפרומפט המושלם לכל משימה, בעזרת Gemini.',
    switch_lang: 'English',
    switch_title: 'החלף לאנגלית',
    user_prompt_placeholder: 'הכנס את הפרומפט שלך כאן...',
    mode_quick: 'זיקוק מהיר',
    mode_quick_desc: 'שיפורים מהירים וכלליים.',
    mode_deep: 'ניתוח עומק',
    mode_deep_desc: 'שכתוב מקיף ומובנה.',
    refine_prompt_btn: 'זקק פרומפט',
    refining: 'מזקק...',
    output_placeholder: 'הפרומפט המזוקק שלך יופיע כאן.',
    save_prompt: 'שמור פרומפט',
    prompt_saved: 'נשמר!',
    est_tokens: 'אסימונים (משוער):',
    saved_prompts: 'פרומפטים שמורים',
    history: 'היסטוריה',
    error_generic: 'אירעה שגיאה. אנא נסה שוב.',
    error_empty_prompt: 'אנא הכנס פרומפט לזיקוק.',
    target_model_label: 'בצע אופטימיזציה עבור:',
    model_generic: 'LLM גנרי',
    model_gemini_ultra: 'Gemini-Ultra',
    model_code_interpreter: 'Code-Interpreter',
    model_imagen: 'Imagen',
  },
};

export const useTranslation = (lang: Language) => {
  return (key: keyof typeof translations.en): string => {
    return translations[lang][key] || key;
  };
};
