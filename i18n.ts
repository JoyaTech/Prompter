// FIX: Implemented the i18n module to provide translations for the application.
import { Language } from './types';

const translations = {
  en: {
    app_title: 'FlowIt',
    app_tagline: 'Craft and refine your AI prompts with precision',
    switch_lang: 'עברית',
    switch_title: 'Switch to Hebrew',
    prompt_placeholder: 'Enter your prompt here, e.g., "Summarize this article for a 5th grader..."',
    variables_title: 'Template Variables',
    variables_desc: 'Add placeholders to your prompt, like {{name}}.',
    add_variable: 'Add Variable',
    variable_name_placeholder: 'variable_name',
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
  },
  he: {
    app_title: 'FlowIt',
    app_tagline: 'צור וחדד את הפרומפטים שלך ל-AI בדיוק מירבי',
    switch_lang: 'English',
    switch_title: 'החלף לאנגלית',
    prompt_placeholder: 'הזן את הפרומפט שלך כאן, למשל, "סכם את המאמר הזה עבור תלמיד כיתה ה\'..."',
    variables_title: 'משתני תבנית',
    variables_desc: 'הוסף מצייני מקום לפרומפט שלך, כמו {{name}}.',
    add_variable: 'הוסף משתנה',
    variable_name_placeholder: 'שם_משתנה',
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
  }
};

export const getTranslator = (lang: Language) => {
  const dictionary = translations[lang] || translations.en;
  return (key: keyof typeof translations.en): string => {
    return dictionary[key] || key;
  };
};
