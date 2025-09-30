import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { generateContent, analyzeAlignment } from '../services/geminiService';
import { Prompt, HistoryItem, HistoryItem as HistoryItemType, PromptComponent, PromptRecipe } from '../types';
import OutputDisplay from './OutputDisplay';
import SavedPrompts from './SavedPrompts';
import History from './History';
import PromptUnitTester from './PromptUnitTester';
import { SaveIcon, SparklesIcon, AlembicIcon } from './icons';
import ComparisonEditor from './ComparisonEditor';
import VisualPromptBuilder from './VisualPromptBuilder';
import SaveRecipeModal from './SaveRecipeModal';

interface PromptEditorProps {
  prompts: Prompt[];
  history: HistoryItem[];
  onSavePrompt: (name: string, text: string) => void;
  onDeletePrompt: (id: string) => void;
  onSaveRecipe: (recipe: Omit<PromptRecipe, 'id'>) => void;
  onAddHistory: (prompt: string, response: string, alignmentNotes?: string, comparisonId?: string) => HistoryItemType;
  onDeleteHistory: (id: string) => void;
  onUpdateHistoryItem: (id: string, updates: Partial<HistoryItem>) => void;
  initialPromptText: string | null;
  onInitialPromptLoaded: () => void;
  initialComponents: PromptComponent[] | null;
  onInitialComponentsLoaded: () => void;
  onSendToAlchemist: (prompt: string) => void;
  t: (key: string) => string;
}

const PromptEditor: React.FC<PromptEditorProps> = ({
  prompts,
  history,
  onSavePrompt,
  onDeletePrompt,
  onSaveRecipe,
  onAddHistory,
  onDeleteHistory,
  onUpdateHistoryItem,
  initialPromptText,
  onInitialPromptLoaded,
  initialComponents,
  onInitialComponentsLoaded,
  onSendToAlchemist,
  t,
}) => {
  const [components, setComponents] = useState<PromptComponent[]>([]);
  const [finalPrompt, setFinalPrompt] = useState('');
  const [output, setOutput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showTester, setShowTester] = useState(false);
  const [activeHistoryItem, setActiveHistoryItem] = useState<HistoryItem | null>(null);
  const [isComparisonMode, setIsComparisonMode] = useState(false);
  const [isSaveRecipeModalOpen, setIsSaveRecipeModalOpen] = useState(false);

  useEffect(() => {
      const promptText = components.map(c => c.content).filter(Boolean).join('\n\n');
      setFinalPrompt(promptText);
  }, [components]);


  useEffect(() => {
    if (initialPromptText) {
      setComponents([{ id: uuidv4(), type: 'text', content: initialPromptText }]);
      onInitialPromptLoaded();
    }
  }, [initialPromptText, onInitialPromptLoaded]);

  useEffect(() => {
    if (initialComponents) {
      setComponents(initialComponents);
      onInitialComponentsLoaded();
    }
  }, [initialComponents, onInitialComponentsLoaded]);

  const handleGenerate = async () => {
    if (!finalPrompt) {
      setError(t('error_empty_prompt'));
      return;
    }
    setIsLoading(true);
    setError(null);
    setOutput('');
    setActiveHistoryItem(null);

    try {
      const response = await generateContent(finalPrompt);
      const responseText = response.text;
      setOutput(responseText);
      const alignmentNotes = await analyzeAlignment(finalPrompt, responseText);
      const newHistoryItem = onAddHistory(finalPrompt, responseText, alignmentNotes);
      setActiveHistoryItem(newHistoryItem);
    } catch (err) {
      console.error(err);
      setError(t('error_generation_failed'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = () => {
    if (!finalPrompt) return;
    const name = prompt(t('prompt_name_prompt'), t('prompt_name_default'));
    if (name) {
      onSavePrompt(name, finalPrompt);
    }
  };

  const handleSelectPrompt = (promptText: string) => {
    setComponents([{ id: uuidv4(), type: 'text', content: promptText }]);
    setOutput('');
    setActiveHistoryItem(null);
  };
  
  const handleSelectHistory = (item: HistoryItem) => {
    setComponents([{ id: uuidv4(), type: 'text', content: item.prompt }]);
    setOutput(item.response);
    setActiveHistoryItem(item);
  }
  
  const handleUpdateHistoryItemWrapper = (id: string, updates: Partial<HistoryItem>) => {
    onUpdateHistoryItem(id, updates);
    if(activeHistoryItem && activeHistoryItem.id === id) {
        setActiveHistoryItem(prev => prev ? {...prev, ...updates} : null);
    }
  }

  const handleSaveRecipe = (recipe: Omit<PromptRecipe, 'id'>) => {
    onSaveRecipe(recipe);
    setIsSaveRecipeModalOpen(false);
  }

  return (
    <>
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
            <ComparisonEditor 
              onAddHistory={onAddHistory} 
              onUpdateHistoryItem={onUpdateHistoryItem}
              onSavePrompt={onSavePrompt}
              t={t} 
            />
          ) : (
            <>
              <div className="flex-grow flex flex-col gap-6">
                <VisualPromptBuilder components={components} onComponentsChange={setComponents} t={t} />
                
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
                    <button
                      onClick={() => setIsSaveRecipeModalOpen(true)}
                      disabled={components.length === 0}
                      className="px-5 py-2.5 bg-card-secondary text-text-main font-semibold rounded-lg hover:bg-border-color transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                      title={t('button_save_as_recipe')}
                    >
                      🧑‍🍳 {t('button_save_as_recipe')}
                    </button>
                     <button
                      onClick={() => onSendToAlchemist(finalPrompt)}
                      disabled={!finalPrompt}
                      className="px-5 py-2.5 bg-card-secondary text-text-main font-semibold rounded-lg hover:bg-border-color transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                      title={t('ide_send_to_alchemist')}
                    >
                      <AlembicIcon className="w-5 h-5" />
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
                  historyItem={activeHistoryItem}
                  onUpdateHistoryItem={handleUpdateHistoryItemWrapper}
                  t={t}
                />
              </div>
              {showTester && <PromptUnitTester prompt={finalPrompt} t={t} />}
            </>
          )}
        </div>
      </div>
      {isSaveRecipeModalOpen && (
        <SaveRecipeModal
          isOpen={isSaveRecipeModalOpen}
          onClose={() => setIsSaveRecipeModalOpen(false)}
          components={components}
          onSave={handleSaveRecipe}
        />
      )}
    </>
  );
};

export default PromptEditor;