import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import AlchemistLibrary from './AlchemistLibrary';
import AlchemistWorkbench from './AlchemistWorkbench';
import UseRecipeModal from './UseRecipeModal';
import { Essence, PromptRecipe, PromptComponent } from '../types';

interface AlchemistPageProps {
  t: (key: string) => string;
  onSavePrompt: (name: string, text: string) => void;
  onRefineInIDE: (prompt: string) => void;
  onUseRecipe: (components: PromptComponent[]) => void;
  initialBasePrompt: string | null;
  onInitialBasePromptLoaded: () => void;
}

const AlchemistPage: React.FC<AlchemistPageProps> = ({ 
  t, 
  onSavePrompt, 
  onRefineInIDE,
  onUseRecipe,
  initialBasePrompt,
  onInitialBasePromptLoaded
}) => {
  const [basePrompt, setBasePrompt] = useState<string>('');
  const [essences, setEssences] = useState<Essence[]>([]);
  const [isUseRecipeModalOpen, setIsUseRecipeModalOpen] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState<PromptRecipe | null>(null);


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
  
  const handleSelectRecipe = (recipe: PromptRecipe) => {
    setSelectedRecipe(recipe);
    setIsUseRecipeModalOpen(true);
  };
  
  const handleUseRecipe = (variableValues: Record<string, string>) => {
    if (!selectedRecipe) return;

    const populatedComponents = selectedRecipe.components.map(component => {
        let newContent = component.content;
        for (const [key, value] of Object.entries(variableValues)) {
            const regex = new RegExp(`{{${key}}}`, 'g');
            newContent = newContent.replace(regex, value);
        }
        return { ...component, content: newContent };
    });

    onUseRecipe(populatedComponents);
    setIsUseRecipeModalOpen(false);
    setSelectedRecipe(null);
  };

  const handleUpdateEssences = (updatedEssences: Essence[]) => {
    setEssences(updatedEssences);
  };

  const handleClearWorkbench = () => {
    setBasePrompt('');
    setEssences([]);
  };

  return (
    <>
      <div className="space-y-8">
        <div>
          <h2 className="text-2xl font-bold text-text-main">{t('alchemist_title')}</h2>
          <p className="mt-1 text-text-secondary">{t('alchemist_desc')}</p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8" style={{ height: 'calc(100vh - 200px)' }}>
          <div className="lg:col-span-1 h-full">
            <AlchemistLibrary onSavePrompt={onSavePrompt} onAddToWorkbench={handleAddToWorkbench} onSelectRecipe={handleSelectRecipe} />
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
      {isUseRecipeModalOpen && selectedRecipe && (
          <UseRecipeModal
            isOpen={isUseRecipeModalOpen}
            onClose={() => setIsUseRecipeModalOpen(false)}
            recipe={selectedRecipe}
            onUse={handleUseRecipe}
          />
      )}
    </>
  );
};

export default AlchemistPage;
