import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { PromptRecipe } from '../types';

interface UseRecipeModalProps {
  isOpen: boolean;
  onClose: () => void;
  recipe: PromptRecipe;
  onUse: (variableValues: Record<string, string>) => void;
}

const UseRecipeModal: React.FC<UseRecipeModalProps> = ({ isOpen, onClose, recipe, onUse }) => {
  const { t } = useTranslation();
  const [variableValues, setVariableValues] = useState<Record<string, string>>(() => 
    Object.fromEntries(recipe.variables.map(v => [v.name, v.defaultValue]))
  );

  const handleValueChange = (name: string, value: string) => {
    setVariableValues(prev => ({ ...prev, [name]: value }));
  };

  const handleUse = () => {
    onUse(variableValues);
  };
  
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-card p-6 rounded-lg w-full max-w-lg shadow-lg border border-border-color">
        <h2 className="text-lg font-bold">{t('use_recipe_modal_title')}: {recipe.name}</h2>
        <p className="text-sm text-text-secondary mt-1 mb-4">{t('use_recipe_desc')}</p>
        <div className="space-y-4 max-h-80 overflow-y-auto pr-2">
            {recipe.variables.map(variable => (
                <div key={variable.name}>
                    <label className="text-sm font-medium text-text-secondary" htmlFor={`var-${variable.name}`}>{`{{${variable.name}}}`}</label>
                    <input
                        id={`var-${variable.name}`}
                        type="text"
                        value={variableValues[variable.name]}
                        onChange={(e) => handleValueChange(variable.name, e.target.value)}
                        className="w-full mt-1 p-2 bg-background border border-border-color rounded-md"
                    />
                </div>
            ))}
        </div>
        <div className="mt-6 flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 bg-card-secondary rounded-md text-sm font-semibold">Cancel</button>
          <button onClick={handleUse} className="px-4 py-2 bg-primary text-white rounded-md text-sm font-semibold">{t('use_recipe_use_button')}</button>
        </div>
      </div>
    </div>
  );
};

export default UseRecipeModal;
