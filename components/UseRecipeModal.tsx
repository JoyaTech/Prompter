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
  const [variableValues, setVariableValues] = useState<Record<string, string>>(() => {
    const initialValues: Record<string, string> = {};
    recipe.variables.forEach(v => {
        initialValues[v.name] = v.defaultValue;
    });
    return initialValues;
  });

  const handleValueChange = (varName: string, value: string) => {
    setVariableValues(prev => ({ ...prev, [varName]: value }));
  };
  
  const handleSubmit = () => {
    onUse(variableValues);
  }

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="use-recipe-modal-title"
    >
      <div 
        className="bg-card border border-border-color rounded-lg shadow-xl w-full max-w-lg p-6 space-y-4 m-4"
        onClick={e => e.stopPropagation()}
      >
        <div className="text-center">
            <h2 id="use-recipe-modal-title" className="text-xl font-bold text-text-main">{recipe.name}</h2>
            <p className="text-sm text-text-secondary mt-1">{recipe.description}</p>
        </div>
        
        <div className="space-y-3 max-h-80 overflow-y-auto p-1">
            {recipe.variables.map(variable => (
                <div key={variable.name}>
                    <label htmlFor={`var-${variable.name}`} className="block text-sm font-medium text-text-secondary mb-1">
                        {`{{${variable.name}}}`}
                    </label>
                    <input
                        id={`var-${variable.name}`}
                        type="text"
                        value={variableValues[variable.name] || ''}
                        onChange={e => handleValueChange(variable.name, e.target.value)}
                        className="w-full p-2 bg-background border border-border-color rounded-md focus:ring-2 focus:ring-primary focus:outline-none"
                    />
                </div>
            ))}
            {recipe.variables.length === 0 && (
                <p className="text-sm text-text-secondary italic text-center py-4">This recipe has no variables.</p>
            )}
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <button onClick={onClose} className="px-4 py-2 text-sm font-semibold text-text-main bg-card-secondary rounded-lg hover:bg-border-color">
            Cancel
          </button>
          <button onClick={handleSubmit} className="px-4 py-2 text-sm font-semibold text-white bg-primary rounded-lg hover:opacity-90">
            {t('use_recipe_button')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UseRecipeModal;
