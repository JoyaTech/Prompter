import Polyglot from 'polyglot.js';
import { Language } from './types';

const phrases = {
  en: {
    switch_title: 'Switch to Hebrew',
    switch_lang: 'עברית',
    app_title: 'FlowIt',
    app_tagline: 'Refine Your AI Prompts to Perfection',
    user_prompt_placeholder: 'Enter your initial prompt here...',
    refining: 'Refining...',
    refine_prompt_btn: 'Refine Prompt',
    mode_quick: 'Quick',
    mode_quick_desc: 'Fast and simple refinement.',
    mode_deep: 'Deep',
    mode_deep_desc: 'In-depth analysis for higher quality.',
    target_model_label: 'Target Model:',
    model_generic: 'Generic LLM',
    model_gemini_ultra: 'Gemini',
    model_code_interpreter: 'Code Interpreter',
    model_imagen: 'Image Gen (Imagen)',
    saved_prompts: 'Saved Prompts',
    history: 'History',
    output_placeholder: 'Your refined prompt will appear here.',
    est_tokens: 'Est. Tokens:',
    prompt_saved: 'Saved!',
    save_prompt: 'Save Prompt',
    enter_prompt_name: 'Enter a name for this prompt:',
    alignment_notes_title: 'Ethical & Compliance Notes',
    menu_editor: 'Prompt Editor',
    menu_dashboard: 'Analytics Dashboard',
    dashboard_title: 'Prompt Analytics Hub',
    dashboard_topic_analysis: 'Topic Breakdown',
    dashboard_ethical_score: 'Ethical/Compliance Score',
    dashboard_no_data: 'Generate some prompts in the editor to see your analytics here.',
    total_prompts: 'Total Prompts',
  },
  he: {
    switch_title: 'עבור לאנגלית',
    switch_lang: 'English',
    app_title: 'FlowIt',
    app_tagline: 'שפר את הפרומפטים שלך לשלמות',
    user_prompt_placeholder: 'הזן כאן את הפרומפטים הראשוני שלך...',
    refining: 'משפר...',
    refine_prompt_btn: 'שפר פרומפט',
    mode_quick: 'מהיר',
    mode_quick_desc: 'שיפור מהיר ופשוט.',
    mode_deep: 'מעמיק',
    mode_deep_desc: 'ניתוח מעמיק לאיכות גבוהה יותר.',
    target_model_label: 'מודל יעד:',
    model_generic: 'LLM גנרי',
    model_gemini_ultra: 'Gemini',
    model_code_interpreter: 'מפרש קוד',
    model_imagen: 'מחולל תמונות (Imagen)',
    saved_prompts: 'פרומפטים שמורים',
    history: 'היסטוריה',
    output_placeholder: 'הפרומפט המשופר שלך יופיע כאן.',
    est_tokens: 'טוקנים מוערכים:',
    prompt_saved: 'נשמר!',
    save_prompt: 'שמור פרומפט',
    enter_prompt_name: 'הזן שם עבור פרומפט זה:',
    alignment_notes_title: 'הערות אתיקה ותאימות',
    menu_editor: 'עורך הפרומפטים',
    menu_dashboard: 'לוח מחוונים אנליטי',
    dashboard_title: 'מרכז ניתוח הפרומפטים',
    dashboard_topic_analysis: 'ניתוח נושאים',
    dashboard_ethical_score: 'ציון אתי/ציות',
    dashboard_no_data: 'צור כמה פרומפטים בעורך כדי לראות את הניתוחים שלך כאן.',
    total_prompts: 'סך הכל פרומפטים',
  },
};

let polyglotInstance: Polyglot | undefined;

const getPolyglotInstance = (): Polyglot => {
  if (!polyglotInstance) {
    polyglotInstance = new Polyglot({
      phrases: phrases.en,
      locale: 'en',
    });
  }
  return polyglotInstance;
};

export const setLocale = (lang: Language) => {
  const instance = getPolyglotInstance();
  instance.locale(lang);
  instance.replace(phrases[lang]);
};

export const t = (key: string, options?: any): string => {
  return getPolyglotInstance().t(key, options);
};

// Ensure the instance is created on initial load
getPolyglotInstance();
