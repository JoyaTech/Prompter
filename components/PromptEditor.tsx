
import React, { useState, useEffect } from 'react';
import { generateContent, constructPromptFromTemplate, analyzeAlignment } from '../services/geminiService';
import { Prompt, HistoryItem, TemplateFields, HistoryItem as HistoryItemType } from '../types';
import TemplateBuilder from './TemplateBuilder';
import OutputDisplay from './OutputDisplay';
import SavedPrompts from './SavedPrompts';
import History from './History';
import PromptUnitTester from './PromptUnitTester';
import { SaveIcon, SparklesIcon } from './icons';
import ComparisonEditor from './ComparisonEditor';

interface PromptEditorProps {
  prompts: Prompt[];
  history: HistoryItem[];
  onSavePrompt: (name: string, text: string) => void;
  onDeletePrompt: (id: string) => void;
  onAddHistory: (prompt: string, response: string, alignmentNotes?: string) => HistoryItemType;
  onDeleteHistory: (id: string) => void;
  onUpdateHistoryItem: (id: string, updates: Partial<HistoryItem>) => void;
  challengeToLoad: string | null;
  onChallengeLoaded: () => void;
  t: (key: string) => string;
}

const PromptEditor: React.FC<PromptEditorProps> = ({
  prompts,
  history,
  onSavePrompt,
  onDeletePrompt,
  onAddHistory,
  onDeleteHistory,
  onUpdateHistoryItem,
  challengeToLoad,
  onChallengeLoaded,
  t,
}) => {
  const [templateFields, setTemplateFields] = useState<TemplateFields>({ role: '', task: '', context: '', constraints: '' });
  const [additionalInstructions, setAdditionalInstructions] = useState('');
  const [finalPrompt, setFinalPrompt] = useState('');
  const [output, setOutput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showTester, setShowTester] = useState(false);
  const [activeHistoryId, setActiveHistoryId] = useState<string | null>(null);
  const [isComparisonMode, setIsComparisonMode] = useState(false);

  useEffect(() => {
    if (challengeToLoad) {
      setTemplateFields(prev => ({ ...prev, context: challengeToLoad }));
      setAdditionalInstructions('');
      onChallengeLoaded();
    }
  }, [challengeToLoad, onChallengeLoaded]);

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
    setActiveHistoryId(null);

    try {
      const response = await generateContent(constructedPrompt);
      const responseText = response.text;
      setOutput(responseText);
      const alignmentNotes = await analyzeAlignment(constructedPrompt, responseText);
      const newHistoryItem = onAddHistory(constructedPrompt, responseText, alignmentNotes);
      setActiveHistoryId(newHistoryItem.id);
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
    setAdditionalInstructions(promptText);
    setTemplateFields({ role: '', task: '', context: '', constraints: '' });
    setFinalPrompt(promptText);
    setOutput('');
    setActiveHistoryId(null);
  };
  
  const handleSelectHistory = (item: HistoryItem) => {
    setAdditionalInstructions(item.prompt);
    setTemplateFields({ role: '', task: '', context: '', constraints: '' });
    setFinalPrompt(item.prompt);
    setOutput(item.response);
    setActiveHistoryId(item.id);
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-8 h-full">
      <div className="md:col-span-4 lg:col-span-3 space-y-6 overflow-y-auto pr-2">
        <SavedPrompts prompts={prompts} onSelectPrompt={handleSelectPrompt} onDeletePrompt={onDeletePrompt} t={t} />
        <History history={history} onSelectHistory={handleSelectHistory} onDeleteHistory={onDeleteHistory} t={t} />
      </div>

      <div className="md:col-span-8 lg:col-span-9 flex flex-col gap-6">
        <div className="flex justify-end">
          <button onClick={() => setIsComparisonMode(!isComparisonMode)} className="px-4 py-2 text-sm font-medium bg-card-secondary border border-border-color rounded-lg hover:bg-card text-text-main transition-colors">
            {isComparisonMode ? t('button_standard_mode') : t('button_ab_test')}
          </button>
        </div>

        {isComparisonMode ? (
          <ComparisonEditor onAddHistory={onAddHistory} onUpdateHistoryItem={onUpdateHistoryItem} />
        ) : (
          <>
            <div className="flex-grow flex flex-col gap-6">
              <TemplateBuilder fields={templateFields} onFieldChange={setTemplateFields} t={t}>
                <textarea
                  value={additionalInstructions}
                  onChange={(e) => setAdditionalInstructions(e.target.value)}
                  className="w-full h-32 p-3 bg-background border border-border-color rounded-md text-sm text-text-main resize-none focus:ring-2 focus:ring-primary focus:outline-none"
                  placeholder={t('prompt_placeholder')}
                />
              </TemplateBuilder>
              
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <button
                    onClick={handleGenerate}
                    disabled={isLoading}
                    className="px-5 py-2.5 bg-primary text-white font-semibold rounded-lg shadow-md hover:opacity-90 disabled:bg-primary/50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                  >
                    <SparklesIcon className="w-5 h-5" />
                    {isLoading ? t('button_generating') : t('button_generate')}
                  </button>
                  <button
                    onClick={handleSave}
                    className="px-5 py-2.5 bg-card-secondary text-text-main font-semibold rounded-lg hover:bg-border-color transition-colors flex items-center gap-2"
                  >
                    <SaveIcon className="w-5 h-5" />
                    {t('button_save')}
                  </button>
                </div>
                 <button
                  onClick={() => setShowTester(!showTester)}
                  className="px-4 py-2 text-sm font-medium text-accent border border-accent/50 rounded-lg hover:bg-accent/10 transition-colors"
                >
                  {t('button_unit_test')}
                </button>
              </div>
              
              {error && <p className="text-red-400 bg-red-900/50 p-3 rounded-md">{error}</p>}
              
              <OutputDisplay
                output={output}
                isLoading={isLoading}
                prompt={finalPrompt}
                historyId={activeHistoryId}
                onUpdateHistoryItem={onUpdateHistoryItem}
                t={t}
              />
            </div>
            {showTester && <PromptUnitTester prompt={constructPromptFromTemplate(templateFields, additionalInstructions)} t={t} />}
          </>
        )}
      </div>
    </div>
  );
};

export default PromptEditor;
