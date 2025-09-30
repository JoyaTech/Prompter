import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { PromptComponent, RecipeVariable } from '../types';
import { useAppContext } from './AppContext';

interface SaveRecipeModalProps {
  isOpen: boolean;
  onClose: () => void;
  components: PromptComponent[];
}

const extractVariables = (components: PromptComponent[]): RecipeVariable[] => {
    const text = components.map(c => c.content).join(' ');
    const regex = /\{\{([a-zA-Z0-9_]+)\}\}/g;
    const matches = new Set<string>();
    let match;
    while ((match = regex.exec(text)) !== null) {
        matches.add(match[1]);
    }
    return Array.from(matches).map(name => ({ name, defaultValue: '' }));
};

const SaveRecipeModal: React.FC<SaveRecipeModalProps> = ({ isOpen, onClose, components }) => {
  const { t } = useTranslation();
  const { handleSaveRecipe } = useAppContext();
  
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const variables = useMemo(() => extractVariables(components), [components]);

  const handleSave = () => {
    if (!name.trim() || !description.trim()) return;
    const recipe = { name, description, components, variables };
    handleSaveRecipe(recipe);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-card p-6 rounded-lg w-full max-w-lg shadow-lg border border-border-color">
        <h2 className="text-lg font-bold mb-4">{t('save_recipe_modal_title')}</h2>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-text-secondary" htmlFor="recipe-name">{t('save_recipe_name_label')}</label>
            <input id="recipe-name" type="text" value={name} onChange={e => setName(e.target.value)} className="w-full mt-1 p-2 bg-background border border-border-color rounded-md" />
          </div>
          <div>
            <label className="text-sm font-medium text-text-secondary" htmlFor="recipe-desc">{t('save_recipe_desc_label')}</label>
            <textarea id="recipe-desc" value={description} onChange={e => setDescription(e.target.value)} className="w-full mt-1 p-2 h-20 bg-background border border-border-color rounded-md resize-none" />
          </div>
          <div>
            <h3 className="text-sm font-medium text-text-secondary">{t('save_recipe_vars_label')}</h3>
            {variables.length > 0 ? (
                <>
                <p className="text-xs text-text-secondary/80 mb-2">{t('save_recipe_vars_desc')}</p>
                <div className="flex flex-wrap gap-2">
                    {variables.map(v => <span key={v.name} className="px-2 py-1 bg-primary/20 text-primary text-xs font-mono rounded">{`{{${v.name}}}`}</span>)}
                </div>
                </>
            ) : (
                <p className="text-xs text-text-secondary/80 mt-1">{t('save_recipe_no_vars')}</p>
            )}
          </div>
        </div>
        <div className="mt-6 flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 bg-card-secondary rounded-md text-sm font-semibold">Cancel</button>
          <button onClick={handleSave} className="px-4 py-2 bg-primary text-white rounded-md text-sm font-semibold">{t('save_recipe_save_button')}</button>
        </div>
      </div>
    </div>
  );
};

export default SaveRecipeModal;
