import React, { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { PromptComponent } from '../types';
import PromptEditor from './PromptEditor';
import TemplateBuilder from './TemplateBuilder';
import VisualPromptBuilder from './VisualPromptBuilder';
import ComparisonEditor from './ComparisonEditor';
import { useAppContext } from './AppContext';
import SaveRecipeModal from './SaveRecipeModal';

interface IDEPageProps {
  initialPrompt: string | null;
  initialComponents: PromptComponent[] | null;
  onInitialPromptLoaded: () => void;
  onRefineInAlchemist: (prompt: string) => void;
}

type EditorTab = 'simple' | 'template' | 'visual' | 'comparison';

const IDEPage: React.FC<IDEPageProps> = ({ initialPrompt, initialComponents, onInitialPromptLoaded, onRefineInAlchemist }) => {
  const { t } = useTranslation();
  const [prompt, setPrompt] = useState<string>('');
  const [components, setComponents] = useState<PromptComponent[]>([]);
  const [activeTab, setActiveTab] = useState<EditorTab>('simple');
  const [isSaveRecipeModalOpen, setIsSaveRecipeModalOpen] = useState(false);

  useEffect(() => {
    if (initialPrompt !== null) {
      setPrompt(initialPrompt);
      setComponents([]);
      setActiveTab('simple');
      onInitialPromptLoaded();
    } else if (initialComponents !== null) {
      setComponents(initialComponents);
      setPrompt(compileComponents(initialComponents));
      setActiveTab('template');
      onInitialPromptLoaded();
    }
  }, [initialPrompt, initialComponents, onInitialPromptLoaded]);

  const compileComponents = (comps: PromptComponent[]): string => {
    return comps.map(c => c.content).join('\n\n');
  };

  const handlePromptChange = useCallback((newPrompt: string) => {
    setPrompt(newPrompt);
    if (components.length > 0) {
      // If we're editing as plain text, de-structure it.
      // A more robust implementation might try to parse it back,
      // but for now, we convert it to a single 'text' component.
      setComponents([{ id: 'text-1', type: 'text', content: newPrompt }]);
    }
  }, [components]);
  
  const handleComponentsChange = useCallback((newComponents: PromptComponent[]) => {
    setComponents(newComponents);
    setPrompt(compileComponents(newComponents));
  }, []);

  const TABS: { id: EditorTab; labelKey: string }[] = [
    { id: 'simple', labelKey: 'editor_tab_simple' },
    { id: 'template', labelKey: 'editor_tab_template' },
    { id: 'visual', labelKey: 'editor_tab_visual' },
    { id: 'comparison', labelKey: 'editor_tab_comparison' },
  ];

  const renderActiveEditor = () => {
    switch (activeTab) {
      case 'simple':
        return <PromptEditor prompt={prompt} onPromptChange={handlePromptChange} onRefineInAlchemist={onRefineInAlchemist} />;
      case 'template':
        return <TemplateBuilder components={components} onComponentsChange={handleComponentsChange} />;
      case 'visual':
        return <VisualPromptBuilder components={components} onComponentsChange={handleComponentsChange} />;
      case 'comparison':
        return <ComparisonEditor />;
      default:
        return null;
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex-shrink-0 flex justify-between items-center mb-4">
          <div className="flex border-b border-border-color">
            {TABS.map(tab => (
              <button 
                key={tab.id} 
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 text-sm font-semibold -mb-px border-b-2 ${activeTab === tab.id ? 'border-primary text-primary' : 'border-transparent text-text-secondary hover:text-text-main'}`}
              >
                {t(tab.labelKey)}
              </button>
            ))}
          </div>
          {(activeTab === 'template' || activeTab === 'visual') && (
            <button 
                onClick={() => setIsSaveRecipeModalOpen(true)}
                className="px-3 py-1.5 text-xs font-semibold bg-accent/80 text-background rounded-md hover:bg-accent transition-colors"
            >
                {t('save_as_recipe')}
            </button>
          )}
      </div>
      <div className="flex-grow">
        {renderActiveEditor()}
      </div>
      {isSaveRecipeModalOpen && (
          <SaveRecipeModal
            isOpen={isSaveRecipeModalOpen}
            onClose={() => setIsSaveRecipeModalOpen(false)}
            components={components}
          />
      )}
    </div>
  );
};

export default IDEPage;
