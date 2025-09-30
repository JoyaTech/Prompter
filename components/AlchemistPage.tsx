import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import AlchemistLibrary from './AlchemistLibrary';
import AlchemistWorkbench from './AlchemistWorkbench';
import { Essence } from '../types';

interface AlchemistPageProps {
  t: (key: string) => string;
  onSavePrompt: (name: string, text: string) => void;
  onRefineInIDE: (prompt: string) => void;
  initialBasePrompt: string | null;
  onInitialBasePromptLoaded: () => void;
}

const AlchemistPage: React.FC<AlchemistPageProps> = ({ 
  t, 
  onSavePrompt, 
  onRefineInIDE,
  initialBasePrompt,
  onInitialBasePromptLoaded
}) => {
  const [basePrompt, setBasePrompt] = useState<string>('');
  const [essences, setEssences] = useState<Essence[]>([]);

  useEffect(() => {
    if(initialBasePrompt) {
      setBasePrompt(initialBasePrompt);
      onInitialBasePromptLoaded();
    }
  }, [initialBasePrompt, onInitialBasePromptLoaded]);

  const handleAddToWorkbench = (promptText: string) => {
    if (!basePrompt.trim()) {
      setBasePrompt(promptText);
    } else {
      setEssences(prev => [...prev, { id: uuidv4(), text: promptText }]);
    }
  };

  const handleUpdateEssences = (updatedEssences: Essence[]) => {
    setEssences(updatedEssences);
  };

  const handleClearWorkbench = () => {
    setBasePrompt('');
    setEssences([]);
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-text-main">{t('alchemist_title')}</h2>
        <p className="mt-1 text-text-secondary">{t('alchemist_desc')}</p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8" style={{ height: 'calc(100vh - 200px)' }}>
        <div className="lg:col-span-1 h-full">
          <AlchemistLibrary t={t} onSavePrompt={onSavePrompt} onAddToWorkbench={handleAddToWorkbench} />
        </div>
        <div className="lg:col-span-2 h-full">
          <AlchemistWorkbench 
            t={t} 
            basePrompt={basePrompt}
            essences={essences}
            onUpdateBasePrompt={setBasePrompt}
            onUpdateEssences={handleUpdateEssences}
            onClearWorkbench={handleClearWorkbench}
            onSavePrompt={onSavePrompt}
            onRefineInIDE={onRefineInIDE}
          />
        </div>
      </div>
    </div>
  );
};

export default AlchemistPage;