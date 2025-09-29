import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      "app_subtitle": "GenSpark Prompt IDE",
      "prompt_name_prompt": "Enter a name for your prompt:",
      "prompt_name_default": "My New Prompt",
      "error_empty_prompt": "Prompt cannot be empty.",
      "error_generation_failed": "Failed to generate response. Please check your API key and try again.",
      "button_standard_mode": "Standard Mode",
      "button_ab_test": "A/B Test Mode",
      "prompt_placeholder": "Additional instructions or a direct prompt...",
      "button_generating": "Generating...",
      "button_generate": "Generate",
      "button_save": "Save",
      "button_unit_test": "Unit Test",
      "saved_prompts": "Saved Prompts",
      "history": "History",
      "alignment_notes_title": "Alignment Analysis",
      "output_title": "Output",
      "status_generating": "Generating response...",
      "output_placeholder": "Generated output will appear here.",
      "prompt_used_label": "Final Prompt Sent to Model:",
      "feedback_thanks": "Thank you for your feedback!",
      "feedback_rating_label": "Rate this response:",
      "feedback_notes_placeholder": "Optional feedback notes...",
      "feedback_save_button": "Save Feedback",
      "dashboard_title": "Dashboard",
      "dashboard_desc": "Overview of your prompt engineering activity.",
      "dashboard_total_runs": "Total Runs",
      "dashboard_avg_response_time": "Avg. Response Time",
      "dashboard_success_rate": "Success Rate",
      "dashboard_recent_activity": "Recent Activity",
      "template_role_label": "Role (Persona)",
      "template_task_label": "Task",
      "template_context_label": "Context",
      "template_constraints_label": "Constraints",
      "tester_title": "Prompt Unit Tester",
      "tester_desc": "Define test cases to validate prompt performance.",
      "tester_running_tests": "Running...",
      "tester_run_tests": "Run Tests",
      "tester_input_label": "Input Variable",
      "tester_expected_output_label": "Expected Output (contains)",
      "tester_add_case": "Add Test Case",
      "tester_results_title": "Test Results",
      "tester_result_pass": "PASS",
      "tester_result_fail": "FAIL",
      "theme_title": "Theme Customizer",
      "theme_desc": "Customize the look and feel of the application.",
      "theme_primary_color": "Primary Color",
      "theme_accent_color": "Accent Color",
      "theme_background_color": "Background Color",
      "theme_card_color": "Card Color",
      "theme_text_color": "Text Color",
      "sidebar_dashboard": "Dashboard",
      "sidebar_ide": "Prompt IDE",
      "sidebar_alchemist": "Alchemist",
      "sidebar_theme": "Theme",
      "alchemist_title": "Alchemist",
      "alchemist_desc": "A suite of advanced prompt engineering tools.",
      "alchemist_library_title": "Component Library",
      "alchemist_workbench_title": "Workbench"
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
