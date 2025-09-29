import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      "app_title": "GenSpark",
      "app_subtitle": "Prompt Engineering Studio",
      "menu_editor": "Prompt Editor",
      "menu_dashboard": "Dashboard",
      "saved_prompts": "Saved Prompts",
      "history": "History",
      "template_role_label": "Role",
      "template_task_label": "Task",
      "template_context_label": "Context",
      "template_constraints_label": "Constraints",
      "prompt_placeholder": "Additional Instructions / Prompt Text...",
      "button_generate": "Generate",
      "button_generating": "Generating...",
      "button_save": "Save Prompt",
      "button_unit_test": "Unit Test Prompt",
      "output_title": "Output",
      "output_placeholder": "Generated output will appear here.",
      "status_generating": "Generating response...",
      "prompt_used_label": "Final Prompt Used:",
      "error_empty_prompt": "Prompt cannot be empty.",
      "error_generation_failed": "Failed to generate content. Please check the console for details.",
      "prompt_name_prompt": "Enter a name for this prompt:",
      "prompt_name_default": "My New Prompt",
      "alignment_notes_title": "Safety & Alignment Analysis",
      "dashboard_title": "Performance Dashboard",
      "dashboard_desc": "Analytics and insights on your prompt engineering history.",
      "dashboard_total_runs": "Total Runs",
      "dashboard_avg_response_time": "Avg. Response Time (mock)",
      "dashboard_success_rate": "Success Rate (mock)",
      "dashboard_recent_activity": "Recent Activity",
      "tester_title": "Prompt Unit Tester",
      "tester_desc": "Define test cases to validate your prompt's behavior against various inputs.",
      "tester_add_case": "Add Test Case",
      "tester_run_tests": "Run Tests",
      "tester_running_tests": "Running...",
      "tester_input_label": "Input Variable",
      "tester_expected_output_label": "Expected Output (contains)",
      "tester_result_pass": "PASS",
      "tester_result_fail": "FAIL",
      "tester_results_title": "Test Results"
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
