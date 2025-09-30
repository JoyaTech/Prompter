import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { v4 as uuidv4 } from 'uuid';
// FIX: Corrected import paths for components by providing their full implementation, resolving the 'is not a module' errors.
import AlchemistLibrary from './AlchemistLibrary';
import AlchemistWorkbench from './AlchemistWorkbench';
import UseRecipeModal from './UseRecipeModal';
import { Essence, PromptRecipe, PromptComponent } from '../types';
import { useAppContext } from './AppContext';

interface AlchemistPageProps {
  onRefineInIDE: (prompt: string) => void;
  onUseRecipe: (components: PromptComponent[]) => void;
  initialBasePrompt: string | null;
  onInitialBasePromptLoaded: () => void;
}

const AlchemistPage: React.FC<AlchemistPageProps> = ({ 
  onRefineInIDE,
  onUseRecipe,
  initialBasePrompt,
  onInitialBasePromptLoaded
}) => {
  const { t } = useTranslation();
  const { handleSavePrompt: onSavePrompt } = useAppContext();
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
  
  const handleSurpriseMe = (base: string, newEssences: string[]) => {
      setBasePrompt(base);
      setEssences(newEssences.map(e => ({ id: uuidv4(), text: e })));
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
            <AlchemistLibrary 
              onAddToWorkbench={handleAddToWorkbench} 
              onSelectRecipe={handleSelectRecipe}
              onSurpriseMe={handleSurpriseMe}
            />
          </div>
          <div className="lg:col-span-2 h-full">
            <AlchemistWorkbench 
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