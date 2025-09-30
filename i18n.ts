import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    debug: true,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
    resources: {
      en: {
        translation: {
          // App-wide
          app_subtitle: 'Prompt Engineering IDE',
          // Sidebar
          dashboard_title: 'Dashboard',
          ide_title: 'IDE',
          alchemist_title: 'Alchemist',
          appearance_title: 'Appearance',
          // Header
          // ... (already there)
          // Dashboard
          dashboard_welcome: 'Welcome to Flow-It Magical',
          dashboard_description: 'Your creative space for designing, testing, and refining prompts.',
          dashboard_new_prompt: 'Start with a new prompt',
          dashboard_challenges: 'Quick Start Challenges',
          // History
          history: 'History',
          alignment_notes_title: 'Alignment Notes',
          // Saved Prompts
          saved_prompts: 'Saved Prompts',
          // Prompt Editor
          prompt_input_label: 'Prompt',
          prompt_placeholder: 'Enter your prompt here. You can use variables like {{input}} for testing.',
          prompt_run: 'Run',
          prompt_running: 'Running...',
          prompt_save: 'Save',
          prompt_view_simple: 'Simple',
          prompt_view_template: 'Template',
          prompt_view_visual: 'Visual',
          prompt_view_comparison: 'Compare',
          prompt_send_to_alchemist: 'Refine in Alchemist',
          // Output Display
          output_title: 'Output',
          output_placeholder: 'Output will appear here after running the prompt.',
          status_generating: 'Generating...',
          prompt_used_label: 'Prompt Used:',
          comparison_declare_winner: 'Declare Winner',
          comparison_higher_rated: 'Higher Rated',
          // Feedback
          feedback_rating_label: 'Rate this response:',
          feedback_notes_placeholder: 'Optional: provide feedback or notes for improvement...',
          feedback_save_button: 'Save Feedback',
          feedback_thanks: 'Thank you for your feedback!',
          // Copy Button
          copy_button_label: 'Copy output',
          copy_button_copy: 'Copy',
          copy_button_copied: 'Copied!',
          // Template Builder
          template_builder_title: 'Template Builder',
          component_type_role: 'Role',
          component_type_task: 'Task',
          component_type_context: 'Context',
          component_type_constraints: 'Constraints',
          component_type_text: 'Text',
          template_role_label: 'Define the persona or role for the AI',
          template_task_label: 'Clearly state the main task or objective',
          template_context_label: 'Provide background or contextual information',
          template_constraints_label: 'Specify rules, formats, or limitations',
          // Visual Builder
          visual_builder_palette_title: 'Components',
          visual_builder_drop_zone: 'Drag components from the palette here',
          // Unit Tester
          tester_title: 'Prompt Unit Tester',
          tester_desc: 'Create test cases to verify your prompt\'s behavior.',
          tester_run_tests: 'Run Tests',
          tester_running_tests: 'Running...',
          tester_input_label: 'Input',
          tester_expected_output_label: 'Expected Output (contains)',
          tester_add_case: 'Add Test Case',
          tester_results_title: 'Test Results',
          tester_result_pass: 'PASS',
          tester_result_fail: 'FAIL',
          // Alignment Analysis
          alignment_title: 'Alignment Analysis',
          alignment_desc: 'Check how well the output aligns with the prompt\'s intent.',
          alignment_analyze: 'Analyze',
          alignment_analyzing: 'Analyzing...',
          // Save Prompt Modal
          save_prompt_modal_title: 'Save Prompt',
          save_prompt_name_label: 'Prompt Name',
          save_prompt_name_placeholder: 'e.g., "Creative Story Starter"',
          save_prompt_folder_label: 'Folder (Optional)',
          save_prompt_no_folder: 'No folder',
          save_prompt_save_button: 'Save Prompt',
          // Alchemist
          alchemist_desc: 'Distill, blend, and transmute prompts to discover new possibilities.',
          alchemist_library_title: 'Library',
          alchemist_library_community: 'Community',
          alchemist_library_recipes: 'My Recipes',
          alchemist_library_essences: 'My Essences',
          alchemist_library_search: 'Search library...',
          alchemist_library_surprise: 'Surprise Me',
          alchemist_workbench_title: 'Workbench',
          alchemist_workbench_base: 'Base Prompt',
          alchemist_workbench_base_placeholder: 'Start with a base prompt or drag one from the library.',
          alchemist_workbench_essences: 'Essences',
          alchemist_workbench_essences_placeholder: 'Drag essences here to blend with the base prompt.',
          alchemist_workbench_blend: 'Blend',
          alchemist_workbench_blending: 'Blending...',
          alchemist_workbench_clear: 'Clear',
          alchemist_workbench_result: 'Blended Prompt',
          // Save Recipe Modal
          save_recipe_modal_title: 'Save as Recipe',
          save_recipe_name_label: 'Recipe Name',
          save_recipe_desc_label: 'Description',
          save_recipe_vars_label: 'Variables',
          save_recipe_vars_desc: 'Variables like {{variable}} were found and will be configurable.',
          save_recipe_no_vars: 'No variables found in this prompt.',
          save_recipe_save_button: 'Save Recipe',
          // Use Recipe Modal
          use_recipe_modal_title: 'Use Recipe',
          use_recipe_desc: 'Fill in the variables to generate your prompt.',
          use_recipe_use_button: 'Use Recipe',
          // Appearance Page
          appearance_desc: 'Customize the look and feel of your workspace.',
          appearance_presets: 'Presets',
          appearance_density: 'Density',
          appearance_density_compact: 'Compact',
          appearance_density_comfortable: 'Comfortable',
          appearance_density_spacious: 'Spacious',
          appearance_border_radius: 'Border Radius',
          appearance_data_management: 'Data Management',
          appearance_data_desc: 'Export your workspace or import a backup file.',
          appearance_data_export: 'Export Data',
          appearance_data_import: 'Import Data',
          appearance_data_import_label: 'Import from .json file',
          // Challenge Card
          challenge_start: 'Start Challenge',
          // Folder Structure
          folder_create: 'Create new folder',
          folder_new_name: 'New folder name...',
          folder_delete_confirm: 'Are you sure you want to delete this folder? Items inside will become uncategorized.',
          folder_rename: 'Rename',
          folder_delete: 'Delete',
          uncategorized: 'Uncategorized',
        }
      },
      he: {
        translation: {
          app_subtitle: 'סביבת פיתוח לפרומפטים',
          dashboard_title: 'לוח מחוונים',
          ide_title: 'סביבת פיתוח',
          alchemist_title: 'אלכימאי',
          appearance_title: 'מראה',
        }
      }
    }
  });

export default i18n;
