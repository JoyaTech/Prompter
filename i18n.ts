import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  en: {
    translation: {
      // General
      app_subtitle: "Prompt Engineering Studio",
      // Sidebar
      dashboard_title: "Dashboard",
      ide_title: "IDE",
      alchemist_title: "Alchemist",
      appearance_title: "Appearance",
      // Dashboard
      dashboard_welcome_title: "Welcome to Flow-It Magical",
      dashboard_welcome_desc: "Your all-in-one studio for crafting, testing, and perfecting prompts.",
      dashboard_challenges_title: "Get Started with a Challenge",
      challenge_1_title: "Tell a Sci-Fi Story",
      challenge_1_desc: "Craft a short, wondrous story about a robot's first encounter with music.",
      challenge_2_title: "Explain a Concept",
      challenge_2_desc: "Use a simple analogy to explain a complex topic to a beginner.",
      challenge_3_title: "Generate Marketing Copy",
      challenge_3_desc: "Create three catchy slogans for an eco-friendly product.",
      challenge_start: "Start Challenge",
      history: "History",
      saved_prompts: "Saved Prompts",
      // IDE
      prompt_input_title: "Prompt",
      ide_refine_alchemist: "Refine in Alchemist",
      save_prompt: "Save Prompt",
      status_generating: "Generating...",
      generate_button: "Generate",
      prompt_placeholder: "Enter your prompt here...",
      tester_title: "Unit Tester",
      alignment_title: "Alignment Analysis",
      output_title: "Output",
      copied_button: "Copied!",
      copy_button: "Copy",
      feedback_thanks: "Thank you for your feedback!",
      feedback_rating_label: "Rate this response:",
      feedback_notes_placeholder: "Add optional feedback notes...",
      feedback_save_button: "Save Feedback",
      prompt_used_label: "Prompt Used:",
      comparison_declare_winner: "Declare Winner",
      alignment_notes_title: "Alignment Notes",
      // Prompt Editor Tabs
      editor_tab_simple: "Simple Editor",
      editor_tab_template: "Template Builder",
      editor_tab_visual: "Visual Builder",
      editor_tab_comparison: "Comparison",
      save_as_recipe: "Save as Recipe",
      // Alchemist
      alchemist_desc: "Blend prompts, use recipes, and discover new ideas from the community.",
      alchemist_library_title: "Library",
      alchemist_workbench_title: "Workbench",
      alchemist_base_prompt_label: "Base Prompt",
      alchemist_essences_label: "Essences",
      alchemist_essences_desc: "Add ingredients to modify the base prompt. Drag to reorder.",
      alchemist_blend_button: "Blend",
      alchemist_clear_button: "Clear",
      alchemist_refine_ide: "Refine in IDE",
      // Save Prompt Modal
      save_prompt_modal_title: "Save Prompt",
      save_prompt_name_label: "Prompt Name",
      save_prompt_name_placeholder: "e.g., 'Creative Story Starter'",
      save_prompt_folder_label: "Folder (Optional)",
      save_prompt_no_folder: "No folder",
      save_prompt_save_button: "Save Prompt",
      // Unit Tester
      tester_desc: "Define test cases to ensure your prompt behaves as expected.",
      tester_run_tests: "Run Tests",
      tester_running_tests: "Running...",
      tester_input_label: "Input",
      tester_expected_output_label: "Expected to Contain",
      tester_add_case: "Add Test Case",
      tester_results_title: "Results",
      tester_result_pass: "PASS",
      tester_result_fail: "FAIL",
      // Alignment Analysis
      alignment_desc: "Check if the output aligns with the intent of your prompt.",
      alignment_analyze: "Analyze",
      alignment_analyzing: "Analyzing...",
      output_placeholder: "Generated output will appear here.",
      // Appearance Page
      appearance_desc: "Customize the look and feel of the application.",
      // Template Builder
      template_builder_title: "Template Builder",
      component_type_role: "Role",
      component_type_task: "Task",
      component_type_context: "Context",
      component_type_constraints: "Constraints",
      component_type_text: "Text",
      template_role_label: "Define the persona or character for the AI",
      template_task_label: "Specify the primary goal or action to be performed",
      template_context_label: "Provide background information or setting",
      template_constraints_label: "Set rules, limits, or formatting requirements",
      // Visual Builder
      visual_builder_palette_title: "Palette",
      visual_builder_drop_zone: "Drag and drop components here to build your prompt.",
      // Folder Structure
      folder_create: "Create New Folder",
      folder_new_name: "New folder name...",
      folder_delete_confirm: "Are you sure you want to delete this folder? All items inside will be uncategorized.",
      folder_rename: "Rename",
      folder_delete: "Delete",
      uncategorized: "Uncategorized",
      // Alchemist Library
      library_tab_my_prompts: "My Prompts",
      library_tab_my_recipes: "My Recipes",
      library_tab_community: "Community",
      library_tab_surprise: "Surprise Me",
      library_search_placeholder: "Search library...",
      library_add_to_workbench: "Add",
      library_use_recipe: "Use",
      surprise_me_title: "Idea Generator",
      surprise_me_desc: "Generate random combinations to spark new ideas.",
      surprise_me_button: "Surprise Me!",
      // Use Recipe Modal
      'use_recipe_modal_title': "Use Recipe",
      use_recipe_desc: "Fill in the variables to generate a prompt from this recipe.",
      use_recipe_use_button: "Use Recipe",
    },
  },
  he: {
    translation: {
      app_subtitle: "סטודיו להנדסת פרומפטים",
      dashboard_title: "לוח מחוונים",
      ide_title: "סביבת פיתוח",
      alchemist_title: "אלכימאי",
      appearance_title: "מראה",
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['queryString', 'cookie', 'localStorage', 'navigator', 'htmlTag'],
      caches: ['cookie'],
    },
  });

export default i18n;
