// FIX: Reverting to custom, dependency-free i18n logic to resolve Polyglot initialization errors.
import { Language } from './types';

const translations = {
  en: {
    app_title: 'FlowIt',
    app_tagline: 'Craft and refine your AI prompts with precision',
    switch_lang: 'עברית',
    switch_title: 'Switch to Hebrew',
    prompt_placeholder: 'Enter your prompt here or provide additional instructions for the template...',
    refine_prompt: 'Refine Prompt',
    refining: 'Refining...',
    output_placeholder: 'Your refined prompt will appear here.',
    est_tokens: 'Est. Tokens:',
    save_prompt: 'Save Prompt',
    prompt_saved: 'Saved!',
    saved_prompts: 'Saved Prompts',
    history: 'History',
    alignment_notes_title: 'Ethical Alignment Notes',
    menu_editor: 'Prompt Editor',
    menu_dashboard: 'Dashboard',
    dashboard_title: 'Performance Dashboard',
    dashboard_no_data: 'No history yet. Refine some prompts to see your stats!',
    total_prompts: 'Total Prompts Processed',
    dashboard_ethical_score: 'Ethical Compliance Score',
    dashboard_topic_analysis: 'Top 5 Topics',
    remove_file_title: 'Remove file',
    quick_mode: 'Quick Mode',
    deep_mode: 'Deep Mode',
    target_model_label: 'Optimize for:',
    model_generic: 'Generic LLM',
    model_gemini_ultra: 'Gemini-Ultra',
    model_code_interpreter: 'Code-Interpreter',
    model_imagen: 'Imagen',
    // --- Phase 3 New Translations ---
    template_role_label: 'Role (e.g., Senior Analyst)',
    template_task_label: 'Task (The goal)',
    template_context_label: 'Context (Key facts/data)',
    template_constraints_label: 'Constraints (Format/Length)',
    attach_file: 'Attach Data File (RAG)',
    file_attached: 'File Attached: {{fileName}}',
    file_too_large: 'File is too large (max 5MB).',
  },
  he: {
    app_title: 'FlowIt',
    app_tagline: 'צור וחדד את הפרומפטים שלך ל-AI בדיוק מירבי',
    switch_lang: 'English',
    switch_title: 'החלף לאנגלית',
    prompt_placeholder: 'הזן את הפרומפט שלך כאן או ספק הוראות נוספות עבור התבנית...',
    refine_prompt: 'חדד פרומפט',
    refining: 'מחדד פרומפט...',
    output_placeholder: 'הפרומפט המשופר שלך יופיע כאן.',
    est_tokens: 'טוקנים מוערכים:',
    save_prompt: 'שמור פרומפט',
    prompt_saved: 'נשמר!',
    saved_prompts: 'פרומפטים שמורים',
    history: 'היסטוריה',
    alignment_notes_title: 'הערות יישור אתיות',
    menu_editor: 'עורך פרומפטים',
    menu_dashboard: 'לוח מחוונים',
    dashboard_title: 'לוח מחוונים - ביצועים',
    dashboard_no_data: 'אין עדיין היסטוריה. חדד כמה פרומפטים כדי לראות סטטיסטיקות!',
    total_prompts: 'סך הכל פרומפטים שעובדו',
    dashboard_ethical_score: 'ציון תאימות אתית',
    dashboard_topic_analysis: '5 הנושאים המובילים',
    remove_file_title: 'הסר קובץ',
    quick_mode: 'מצב מהיר',
    deep_mode: 'מצב עמוק',
    target_model_label: 'בצע אופטימיזציה עבור:',
    model_generic: 'LLM גנרי',
    model_gemini_ultra: 'Gemini-Ultra',
    model_code_interpreter: 'Code-Interpreter',
    model_imagen: 'Imagen',
    // --- Phase 3 New Translations ---
    template_role_label: 'תפקיד (לדוגמה, אנליסט בכיר)',
    template_task_label: 'משימה (המטרה)',
    template_context_label: 'הקשר (עובדות/נתונים מרכזיים)',
    template_constraints_label: 'מגבלות (פורמט/אורך)',
    attach_file: 'צרף קובץ נתונים (RAG)',
    file_attached: 'קובץ מצורף: {{fileName}}',
    file_too_large: 'הקובץ גדול מדי (מקסימום 5MB).',
  }
};

// FIX: Custom getTranslator for stability. Added simple variable replacement.
export const getTranslator = (lang: Language) => {
  const dictionary = translations[lang] || translations.en;
  return (key: keyof typeof translations.en, options?: Record<string, string>): string => {
    let result = dictionary[key] || key;
    if (options) {
      for (const [varName, varValue] of Object.entries(options)) {
        result = result.replace(new RegExp(`{{\\s*${varName}\\s*}}`, 'g'), varValue);
      }
    }
    return result;
  };
};