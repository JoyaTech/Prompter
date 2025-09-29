import React, { useState } from 'react';
import { generateContent, constructPromptFromTemplate, analyzeAlignment } from '../services/geminiService';
import { Prompt, HistoryItem, TemplateFields } from '../types';
import TemplateBuilder from './TemplateBuilder';
import OutputDisplay from './OutputDisplay';
import SavedPrompts from './SavedPrompts';
import History from './History';
import PromptUnitTester from './PromptUnitTester';
import { SaveIcon, SparklesIcon } from './icons';

interface PromptEditorProps {
  prompts: Prompt[];
  history: HistoryItem[];
  onSavePrompt: (name: string, text: string) => void;
  onDeletePrompt: (id: string) => void;
  onAddHistory: (prompt: string, response: string, alignmentNotes?: string) => void;
  onDeleteHistory: (id: string) => void;
  t: (key: string) => string;
}

const PromptEditor: React.FC<PromptEditorProps> = ({
  prompts,
  history,
  onSavePrompt,
  onDeletePrompt,
  onAddHistory,
  onDeleteHistory,
  t,
}) => {
  const [templateFields, setTemplateFields] = useState<TemplateFields>({ role: '', task: '', context: '', constraints: '' });
  const [additionalInstructions, setAdditionalInstructions] = useState('');
  const [finalPrompt, setFinalPrompt] = useState('');
  const [output, setOutput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showTester, setShowTester] = useState(false);

  const handleGenerate = async () => {
    const constructedPrompt = constructPromptFromTemplate(templateFields, additionalInstructions);
    if (!constructedPrompt) {
      setError(t('error_empty_prompt'));
      return;
    }
    setFinalPrompt(constructedPrompt);
    setIsLoading(true);
    setError(null);
    setOutput('');

    try {
      const response = await generateContent(constructedPrompt);
      // FIX: Replaced response.response.text() with response.text for direct access to the generated text content.
      const responseText = response.text;
      setOutput(responseText);
      const alignmentNotes = await analyzeAlignment(constructedPrompt, responseText);
      onAddHistory(constructedPrompt, responseText, alignmentNotes);
    } catch (err) {
      console.error(err);
      setError(t('error_generation_failed'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = () => {
    const constructedPrompt = constructPromptFromTemplate(templateFields, additionalInstructions);
    if (!constructedPrompt) return;
    const name = prompt(t('prompt_name_prompt'), t('prompt_name_default'));
    if (name) {
      onSavePrompt(name, constructedPrompt);
    }
  };

  const handleSelectPrompt = (promptText: string) => {
    // This is a simplification. A real app might parse the text back into fields.
    setAdditionalInstructions(promptText);
    setTemplateFields({ role: '', task: '', context: '', constraints: '' });
    setFinalPrompt(promptText);
  };
  
  const handleSelectHistory = (prompt: string, response: string) => {
     // This is a simplification. A real app might parse the text back into fields.
    setAdditionalInstructions(prompt);
    setTemplateFields({ role: '', task: '', context: '', constraints: '' });
    setFinalPrompt(prompt);
    setOutput(response);
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-8 h-full">
      <div className="md:col-span-4 lg:col-span-3 space-y-6 overflow-y-auto pr-2">
        <SavedPrompts prompts={prompts} onSelectPrompt={handleSelectPrompt} onDeletePrompt={onDeletePrompt} t={t} />
        <History history={history} onSelectHistory={handleSelectHistory} onDeleteHistory={onDeleteHistory} t={t} />
      </div>

      <div className="md:col-span-8 lg:col-span-9 flex flex-col gap-6">
        <div className="flex-grow flex flex-col gap-6">
          <TemplateBuilder fields={templateFields} onFieldChange={setTemplateFields} t={t}>
            <textarea
              value={additionalInstructions}
              onChange={(e) => setAdditionalInstructions(e.target.value)}
              className="w-full h-32 p-3 bg-gray-900/50 border border-gray-600 rounded-md text-sm text-gray-200 resize-none focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              placeholder={t('prompt_placeholder')}
            />
          </TemplateBuilder>
          
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <button
                onClick={handleGenerate}
                disabled={isLoading}
                className="px-5 py-2.5 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 disabled:bg-indigo-400 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
              >
                <SparklesIcon className="w-5 h-5" />
                {isLoading ? t('button_generating') : t('button_generate')}
              </button>
              <button
                onClick={handleSave}
                className="px-5 py-2.5 bg-gray-700 text-gray-300 font-semibold rounded-lg hover:bg-gray-600 transition-colors flex items-center gap-2"
              >
                <SaveIcon className="w-5 h-5" />
                {t('button_save')}
              </button>
            </div>
             <button
              onClick={() => setShowTester(!showTester)}
              className="px-4 py-2 text-sm font-medium text-cyan-400 border border-cyan-400/50 rounded-lg hover:bg-cyan-400/10 transition-colors"
            >
              {t('button_unit_test')}
            </button>
          </div>
          
          {error && <p className="text-red-400 bg-red-900/50 p-3 rounded-md">{error}</p>}
          
          <OutputDisplay output={output} isLoading={isLoading} prompt={finalPrompt} t={t} />
        </div>
        {showTester && <PromptUnitTester prompt={constructPromptFromTemplate(templateFields, additionalInstructions)} t={t} />}
      </div>
    </div>
  );
};

export default PromptEditor;
