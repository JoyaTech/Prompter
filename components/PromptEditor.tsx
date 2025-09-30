import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { generateContent } from '../services/geminiService';
import { useAppContext } from './AppContext';
import { HistoryItem } from '../types';
import OutputDisplay from './OutputDisplay';
import AlignmentAnalysis from './AlignmentAnalysis';
import PromptUnitTester from './PromptUnitTester';
import { SaveIcon, RefreshCwIcon, TestTubeIcon, ShieldIcon } from './icons';
import SavePromptModal from './SavePromptModal';

interface PromptEditorProps {
  prompt: string;
  onPromptChange: (newPrompt: string) => void;
  onRefineInAlchemist: (prompt: string) => void;
}

const PromptEditor: React.FC<PromptEditorProps> = ({ prompt, onPromptChange, onRefineInAlchemist }) => {
  const { t } = useTranslation();
  const { handleSaveHistory, handleUpdateHistory } = useAppContext();
  
  const [output, setOutput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
  const [currentHistoryItem, setCurrentHistoryItem] = useState<HistoryItem | null>(null);
  const [activeTab, setActiveTab] = useState<'tester' | 'alignment'>('tester');

  // Reset output when prompt changes
  useEffect(() => {
    setOutput('');
    setCurrentHistoryItem(null);
  }, [prompt]);

  const handleGenerate = async () => {
    if (!prompt) return;
    setIsLoading(true);
    setOutput('');
    setCurrentHistoryItem(null);
    try {
      const response = await generateContent(prompt);
      setOutput(response.text);
      const newHistoryItem = handleSaveHistory(prompt, response.text);
      setCurrentHistoryItem(newHistoryItem);
    } catch (error) {
      console.error("Content generation failed:", error);
      setOutput("An error occurred while generating the response.");
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleUpdateHistoryItem = (id: string, updates: Partial<HistoryItem>) => {
      handleUpdateHistory(id, updates);
      if (currentHistoryItem && currentHistoryItem.id === id) {
          setCurrentHistoryItem(prev => prev ? { ...prev, ...updates } : null);
      }
  };

  const handleAnalysisComplete = (notes: string) => {
    if (currentHistoryItem) {
        handleUpdateHistoryItem(currentHistoryItem.id, { alignment_notes: notes });
    }
  };

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
        <div className="flex flex-col gap-4">
          <div className="flex-grow flex flex-col bg-card p-4 rounded-lg border border-border-color">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-lg font-semibold text-text-main">{t('prompt_input_title')}</h3>
              <div className="flex items-center gap-2">
                 <button onClick={() => onRefineInAlchemist(prompt)} className="px-3 py-1.5 text-xs font-semibold bg-card-secondary text-text-secondary rounded-md hover:bg-border-color hover:text-text-main transition-colors">
                    {t('ide_refine_alchemist')}
                </button>
                <button onClick={() => setIsSaveModalOpen(true)} className="p-2 text-text-secondary hover:text-primary transition-colors" title={t('save_prompt')}>
                  <SaveIcon className="w-5 h-5" />
                </button>
                <button onClick={handleGenerate} disabled={isLoading || !prompt} className="flex items-center gap-2 px-4 py-2 bg-primary text-white font-semibold rounded-lg shadow-md hover:bg-primary/90 disabled:bg-primary/50 disabled:cursor-not-allowed transition-colors">
                  <RefreshCwIcon className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
                  {isLoading ? t('status_generating') : t('generate_button')}
                </button>
              </div>
            </div>
            <textarea
              value={prompt}
              onChange={(e) => onPromptChange(e.target.value)}
              placeholder={t('prompt_placeholder')}
              className="w-full flex-grow p-3 bg-background border border-border-color rounded-md text-base text-text-main resize-none focus:ring-2 focus:ring-primary focus:outline-none font-mono"
            />
          </div>
          <div className="bg-card p-2 rounded-lg border border-border-color">
            <div className="flex items-center gap-2 p-1">
                <button onClick={() => setActiveTab('tester')} className={`w-full flex justify-center items-center gap-2 py-1.5 text-sm font-semibold rounded ${activeTab === 'tester' ? 'bg-primary text-white' : 'hover:bg-border-color'}`}>
                    <TestTubeIcon className="w-5 h-5" /> {t('tester_title')}
                </button>
                 <button onClick={() => setActiveTab('alignment')} className={`w-full flex justify-center items-center gap-2 py-1.5 text-sm font-semibold rounded ${activeTab === 'alignment' ? 'bg-primary text-white' : 'hover:bg-border-color'}`}>
                    <ShieldIcon className="w-5 h-5" /> {t('alignment_title')}
                </button>
            </div>
          </div>
          {activeTab === 'tester' && <PromptUnitTester prompt={prompt} />}
          {activeTab === 'alignment' && <AlignmentAnalysis prompt={prompt} responseText={output} onAnalysisComplete={handleAnalysisComplete} />}
        </div>

        <div className="h-full">
          <OutputDisplay
            output={output}
            isLoading={isLoading}
            prompt={prompt}
            historyItem={currentHistoryItem}
            onUpdateHistoryItem={handleUpdateHistoryItem}
          />
        </div>
      </div>
      {isSaveModalOpen && (
        <SavePromptModal
          isOpen={isSaveModalOpen}
          onClose={() => setIsSaveModalOpen(false)}
          promptText={prompt}
        />
      )}
    </>
  );
};

export default PromptEditor;
