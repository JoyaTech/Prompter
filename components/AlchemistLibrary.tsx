import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppContext } from './AppContext';
import FolderStructure from './FolderStructure';
import { CommunityPrompt, PromptRecipe } from '../types';
import { getCommunityPrompts } from '../services/communityPromptService';
import { generatePromptVariations } from '../services/geminiService';

interface AlchemistLibraryProps {
  onAddToWorkbench: (text: string) => void;
  onSelectRecipe: (recipe: PromptRecipe) => void;
  onSurpriseMe: (base: string, essences: string[]) => void;
}

type Tab = 'my_prompts' | 'my_recipes' | 'community' | 'surprise';

const SurpriseMe: React.FC<{ onSurpriseMe: AlchemistLibraryProps['onSurpriseMe'] }> = ({ onSurpriseMe }) => {
    const { t } = useTranslation();
    const [idea, setIdea] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleGenerate = async () => {
        if (!idea) return;
        setIsLoading(true);
        try {
            const { promptA, promptB } = await generatePromptVariations(idea);
            onSurpriseMe(promptA, [promptB]);
        } catch (error) {
            console.error("Failed to generate variations:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="p-4 space-y-4">
            <h4 className="text-lg font-bold">{t('surprise_me_title')}</h4>
            <p className="text-sm text-text-secondary">{t('surprise_me_desc')}</p>
            <input
                type="text"
                value={idea}
                onChange={e => setIdea(e.target.value)}
                placeholder="Enter a core idea, e.g., 'a friendly chatbot'"
                className="w-full p-2 bg-background border border-border-color rounded-md"
            />
            <button onClick={handleGenerate} disabled={isLoading || !idea} className="w-full py-2 bg-accent text-background font-semibold rounded-md disabled:opacity-50">
                {isLoading ? t('status_generating') : t('surprise_me_button')}
            </button>
        </div>
    );
}


const AlchemistLibrary: React.FC<AlchemistLibraryProps> = ({ onAddToWorkbench, onSelectRecipe, onSurpriseMe }) => {
  const { t } = useTranslation();
  const { prompts, recipes, folders, handleDeletePrompt } = useAppContext();
  const [activeTab, setActiveTab] = useState<Tab>('my_prompts');
  const [communityPrompts, setCommunityPrompts] = useState<CommunityPrompt[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (activeTab === 'community') {
      setIsLoading(true);
      getCommunityPrompts(searchTerm).then(prompts => {
        setCommunityPrompts(prompts);
        setIsLoading(false);
      });
    }
  }, [activeTab, searchTerm]);

  const renderContent = () => {
    switch (activeTab) {
      case 'my_prompts':
        return <FolderStructure itemType="prompt" items={prompts} onSelectItem={(p) => onAddToWorkbench(p.text)} onDeleteItem={handleDeletePrompt} itemActionLabel={t('library_add_to_workbench')} />;
      case 'my_recipes':
        return <FolderStructure itemType="recipe" items={recipes} onSelectItem={onSelectRecipe} itemActionLabel={t('library_use_recipe')} />;
      case 'community':
        return (
          <div className="space-y-3">
            {isLoading ? <p>{t('status_generating')}</p> : communityPrompts.map(p => (
              <div key={p.id} className="bg-card-secondary p-3 rounded-md">
                <div className="flex justify-between items-start">
                  <div>
                    <h5 className="font-semibold text-text-main">{p.name}</h5>
                    <p className="text-xs text-text-secondary mt-1">{p.description}</p>
                  </div>
                  <button onClick={() => onAddToWorkbench(p.prompt)} className="ml-2 px-2 py-1 text-xs font-semibold bg-primary/80 text-white rounded-md hover:bg-primary">{t('library_add_to_workbench')}</button>
                </div>
              </div>
            ))}
          </div>
        );
      case 'surprise':
          return <SurpriseMe onSurpriseMe={onSurpriseMe} />;
    }
  };

  const TABS: { id: Tab, labelKey: string }[] = [
    { id: 'my_prompts', labelKey: 'library_tab_my_prompts' },
    { id: 'my_recipes', labelKey: 'library_tab_my_recipes' },
    { id: 'community', labelKey: 'library_tab_community' },
    { id: 'surprise', labelKey: 'library_tab_surprise' },
  ];

  return (
    <div className="bg-card p-4 rounded-lg border border-border-color h-full flex flex-col">
      <h3 className="text-lg font-semibold text-text-main mb-3">{t('alchemist_library_title')}</h3>
      <div className="flex-shrink-0 mb-3">
        <div className="flex border-b border-border-color">
          {TABS.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`px-4 py-2 text-sm font-semibold -mb-px border-b-2 ${activeTab === tab.id ? 'border-primary text-primary' : 'border-transparent text-text-secondary hover:text-text-main'}`}>
              {t(tab.labelKey)}
            </button>
          ))}
        </div>
      </div>
       {activeTab === 'community' && (
           <div className="mb-3 flex-shrink-0">
               <input
                type="text"
                placeholder={t('library_search_placeholder')}
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full p-2 bg-background border border-border-color rounded-md"
               />
           </div>
       )}
      <div className="flex-grow overflow-y-auto pr-2">
        {renderContent()}
      </div>
    </div>
  );
};

export default AlchemistLibrary;
