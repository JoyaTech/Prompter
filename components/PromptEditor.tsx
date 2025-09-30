import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { EditorState, PromptComponent, HistoryItem } from '../types';
import { generateContent } from '../services/geminiService';
import { useAppContext } from './AppContext';

import TemplateBuilder from './TemplateBuilder';
import VisualPromptBuilder from './VisualPromptBuilder';
import OutputDisplay from './OutputDisplay';
import PromptUnitTester from './PromptUnitTester';
import AlignmentAnalysis from './AlignmentAnalysis';
import SavePromptModal from './SavePromptModal';
import ComparisonEditor from './ComparisonEditor';
import { generatePromptVariations } from '../services/geminiService';


type ViewMode = 'simple' | 'template' | 'visual' | 'comparison';

const componentsToText = (components: PromptComponent[]): string => {
  return components.map(c => c.content).join('\n\n');
};

const textToComponents = (text: string): PromptComponent[] => {
    // This is a simplification. A real implementation might parse structured text.
    return [{ id: 'text-1', type: 'text', content: text }];
};

interface PromptEditorProps {
  initialState: EditorState | null;
  onInitialStateLoaded: () => void;
  onSendToAlchemist: (prompt: string) => void;
}

const PromptEditor: React.FC<PromptEditorProps> = ({ initialState, onInitialStateLoaded, onSendToAlchemist }) => {
  const { t } = useTranslation();
  const { handleAddHistory, handleUpdateHistoryItem } = useAppContext();

  const [viewMode, setViewMode] = useState<ViewMode>('simple');
  const [promptComponents, setPromptComponents] = useState<PromptComponent[]>([]);
  const [output, setOutput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
  const [currentHistoryItem, setCurrentHistoryItem] = useState<HistoryItem | null>(null);

  // For comparison view
  const [comparisonPrompts, setComparisonPrompts] = useState<{ promptA: string; promptB: string } | null>(null);


  const promptText = useMemo(() => componentsToText(promptComponents), [promptComponents]);

  useEffect(() => {
    if (initialState) {
      if (initialState.promptText) {
        setPromptComponents(textToComponents(initialState.promptText));
      } else if (initialState.components) {
        setPromptComponents(initialState.components);
        setViewMode('template'); // Assume template view for components
      } else if (initialState.historyItem) {
        setPromptComponents(textToComponents(initialState.historyItem.prompt));
        setOutput(initialState.historyItem.response);
        setCurrentHistoryItem(initialState.historyItem);
      }
      onInitialStateLoaded();
    }
  }, [initialState, onInitialStateLoaded]);
  
  const handleComponentsChange = (newComponents: PromptComponent[]) => {
    setPromptComponents(newComponents);
  };
  
  const handlePromptTextChange = (text: string) => {
    setPromptComponents([{ id: 'text-1', type: 'text', content: text }]);
  };

  const handleRunPrompt = async () => {
    if (!promptText.trim()) return;
    setIsLoading(true);
    setOutput('');
    setCurrentHistoryItem(null);
    try {
      const response = await generateContent(promptText);
      const text = response.text ?? '';
      setOutput(text);
      const newHistoryItem = handleAddHistory(promptText, text);
      setCurrentHistoryItem(newHistoryItem);
    } catch (error) {
      console.error('Error generating content:', error);
      setOutput('An error occurred while generating the response.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateAlignmentNotes = (notes: string) => {
    if (currentHistoryItem) {
        handleUpdateHistoryItem(currentHistoryItem.id, { alignment_notes: notes });
    }
  };

  const generateVariations = async () => {
    if (!promptText.trim()) return;
    setIsLoading(true);
    const variations = await generatePromptVariations(promptText);
    setComparisonPrompts(variations);
    setViewMode('comparison');
    setIsLoading(false);
  };

  const handleDeclareWinner = (winningPrompt: string) => {
    setPromptComponents(textToComponents(winningPrompt));
    setComparisonPrompts(null);
    setViewMode('simple');
    setOutput('');
    setCurrentHistoryItem(null);
  };
  
  const renderEditor = () => {
    switch (viewMode) {
      case 'template':
        return <TemplateBuilder components={promptComponents} onComponentsChange={handleComponentsChange} />;
      case 'visual':
        return <VisualPromptBuilder components={promptComponents} onComponentsChange={handleComponentsChange} />;
      case 'comparison':
        if (comparisonPrompts) {
            return <ComparisonEditor promptA={comparisonPrompts.promptA} promptB={comparisonPrompts.promptB} onDeclareWinner={handleDeclareWinner} />
        }
        return null;
      case 'simple':
      default:
        return (
            <textarea
              value={promptText}
              onChange={(e) => handlePromptTextChange(e.target.value)}
              placeholder={t('prompt_placeholder')}
              className="w-full h-full p-4 bg-card border border-border-color rounded-lg text-text-main resize-none focus:ring-2 focus:ring-primary focus:outline-none"
            />
        );
    }
  };
  
  return (
    <div className="flex flex-col h-full gap-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2 bg-card p-1 rounded-lg">
          {(['simple', 'template', 'visual', 'comparison'] as ViewMode[]).map(mode => (
            <button
              key={mode}
              onClick={() => setViewMode(mode)}
              disabled={mode === 'comparison' && !comparisonPrompts}
              className={`px-3 py-1.5 text-sm font-semibold rounded-md transition-colors ${
                viewMode === mode ? 'bg-primary text-white' : 'text-text-secondary hover:bg-card-secondary'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {t(`prompt_view_${mode}`)}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-3">
            <button onClick={() => onSendToAlchemist(promptText)} className="px-4 py-2 text-sm font-semibold text-text-secondary hover:text-text-main transition-colors">{t('prompt_send_to_alchemist')}</button>
            <button onClick={() => setIsSaveModalOpen(true)} className="px-4 py-2 text-sm font-semibold text-text-secondary hover:text-text-main transition-colors">{t('prompt_save')}</button>
            <button onClick={generateVariations} className="px-4 py-2 text-sm font-semibold text-text-secondary hover:text-text-main transition-colors">Generate Variations</button>
            <button onClick={handleRunPrompt} disabled={isLoading} className="px-6 py-2 bg-primary text-white font-bold rounded-lg shadow-md hover:bg-primary/90 disabled:bg-primary/50">
            {isLoading ? t('prompt_running') : t('prompt_run')}
          </button>
        </div>
      </div>

      <div className="flex-grow grid grid-cols-1 lg:grid-cols-2 gap-4 overflow-hidden">
        <div className="flex flex-col gap-4">
            <div className="flex-grow">
                {renderEditor()}
            </div>
            {viewMode !== 'comparison' && <PromptUnitTester prompt={promptText} />}
        </div>
        <div className="flex flex-col gap-4">
            {viewMode !== 'comparison' ? (
                <>
                    <OutputDisplay
                        output={output}
                        isLoading={isLoading}
                        prompt={promptText}
                        historyItem={currentHistoryItem}
                        onUpdateHistoryItem={handleUpdateHistoryItem}
                    />
                    {output && !isLoading && <AlignmentAnalysis prompt={promptText} responseText={output} onAnalysisComplete={handleUpdateAlignmentNotes} />}
                </>
            ) : (
                <div className="bg-card p-4 rounded-lg border border-border-color h-full flex items-center justify-center">
                    <p className="text-text-secondary">Comparison results will appear here.</p>
                </div>
            )}
        </div>
      </div>
      <SavePromptModal
        isOpen={isSaveModalOpen}
        onClose={() => setIsSaveModalOpen(false)}
        promptText={promptText}
      />
    </div>
  );
};

export default PromptEditor;
