import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { PromptComponent, PromptRecipe } from '../types';

interface SaveRecipeModalProps {
  isOpen: boolean;
  onClose: () => void;
  components: PromptComponent[];
  onSave: (recipe: Omit<PromptRecipe, 'id'>) => void;
}

const SaveRecipeModal: React.FC<SaveRecipeModalProps> = ({ isOpen, onClose, components, onSave }) => {
  const { t } = useTranslation();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [variables, setVariables] = useState<Record<string, string>>({});

  useEffect(() => {
    if (isOpen) {
      const allContent = components.map(c => c.content).join(' ');
      const foundVariables = allContent.match(/{{(.*?)}}/g) || [];
      const uniqueVariableNames = [...new Set(foundVariables.map(v => v.replace(/{{|}}/g, '')))];
      
      const initialVars: Record<string, string> = {};
      uniqueVariableNames.forEach(v => {
        initialVars[v] = '';
      });
      setVariables(initialVars);
    }
  }, [isOpen, components]);

  const handleVariableChange = (varName: string, value: string) => {
    setVariables(prev => ({ ...prev, [varName]: value }));
  };

  const handleSave = () => {
    if (!name.trim()) return;
    const recipeVariables = Object.entries(variables).map(([name, defaultValue]) => ({
      name,
      defaultValue
    }));
    onSave({ name, description, components, variables: recipeVariables });
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="recipe-modal-title"
    >
      <div 
        className="bg-card border border-border-color rounded-lg shadow-xl w-full max-w-lg p-6 space-y-4 m-4"
        onClick={e => e.stopPropagation()}
      >
        <h2 id="recipe-modal-title" className="text-xl font-bold text-text-main">{t('recipe_modal_title')}</h2>
        
        <div>
          <label htmlFor="recipe-name" className="block text-sm font-medium text-text-secondary mb-1">{t('recipe_modal_name')}</label>
          <input
            id="recipe-name"
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            className="w-full p-2 bg-background border border-border-color rounded-md focus:ring-2 focus:ring-primary focus:outline-none"
          />
        </div>

        <div>
          <label htmlFor="recipe-desc" className="block text-sm font-medium text-text-secondary mb-1">{t('recipe_modal_desc')}</label>
          <textarea
            id="recipe-desc"
            value={description}
            onChange={e => setDescription(e.target.value)}
            rows={3}
            className="w-full p-2 bg-background border border-border-color rounded-md resize-none focus:ring-2 focus:ring-primary focus:outline-none"
          />
        </div>
        
        <div>
            <h3 className="text-md font-semibold text-text-main mb-2">{t('recipe_modal_vars')}</h3>
            <div className="space-y-2 max-h-40 overflow-y-auto bg-background/50 p-3 rounded-md">
                {Object.keys(variables).length > 0 ? Object.keys(variables).map(varName => (
                    <div key={varName} className="flex items-center gap-2">
                        <span className="font-mono text-sm text-accent p-2 bg-card-secondary rounded-md">{`{{${varName}}}`}</span>
                        <input
                            type="text"
                            placeholder={t('recipe_modal_default_val')}
                            value={variables[varName]}
                            onChange={e => handleVariableChange(varName, e.target.value)}
                            className="flex-grow p-2 bg-background border border-border-color rounded-md text-sm focus:ring-2 focus:ring-primary focus:outline-none"
                        />
                    </div>
                )) : (
                    <p className="text-sm text-text-secondary italic">{t('recipe_modal_no_vars')}</p>
                )}
            </div>
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <button onClick={onClose} className="px-4 py-2 text-sm font-semibold text-text-main bg-card-secondary rounded-lg hover:bg-border-color">
            Cancel
          </button>
          <button onClick={handleSave} disabled={!name.trim()} className="px-4 py-2 text-sm font-semibold text-white bg-primary rounded-lg hover:opacity-90 disabled:bg-primary/50">
            {t('recipe_modal_save')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SaveRecipeModal;
