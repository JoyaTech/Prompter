import React, { useState, useMemo, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppContext } from './AppContext';
import { PromptComponent, Folder, RecipeVariable } from '../types';

interface SaveRecipeModalProps {
  isOpen: boolean;
  onClose: () => void;
  components: PromptComponent[];
}

const SaveRecipeModal: React.FC<SaveRecipeModalProps> = ({ isOpen, onClose, components }) => {
  const { t } = useTranslation();
  const { handleSaveRecipe, folders } = useAppContext();
  const [recipeName, setRecipeName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedFolder, setSelectedFolder] = useState<string>('');
  
  const recipeFolders = folders.filter(f => f.type === 'recipe');

  const detectedVariables = useMemo(() => {
    const variableRegex = /{{(\w+)}}/g;
    const allContent = components.map(c => c.content).join(' ');
    const matches = [...allContent.matchAll(variableRegex)];
    const uniqueNames = [...new Set(matches.map(match => match[1]))];
    return uniqueNames.map(name => ({ name, defaultValue: '' }));
  }, [components]);

  const [variables, setVariables] = useState<RecipeVariable[]>(detectedVariables);

  useEffect(() => {
    setVariables(detectedVariables);
  }, [detectedVariables]);

  const handleVariableChange = (index: number, field: keyof RecipeVariable, value: string) => {
    const newVariables = [...variables];
    newVariables[index] = { ...newVariables[index], [field]: value };
    setVariables(newVariables);
  };

  const handleSave = () => {
    if (!recipeName.trim()) return;
    handleSaveRecipe(recipeName.trim(), description, components, variables, selectedFolder || undefined);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-card p-6 rounded-lg w-full max-w-lg shadow-lg border border-border-color flex flex-col">
        <h2 className="text-lg font-bold mb-4">{t('Save as Recipe')}</h2>
        <div className="space-y-4 overflow-y-auto pr-2" style={{maxHeight: '70vh'}}>
          <div>
            <label className="text-sm font-medium text-text-secondary" htmlFor="recipe-name">Recipe Name</label>
            <input
              id="recipe-name"
              type="text"
              value={recipeName}
              onChange={(e) => setRecipeName(e.target.value)}
              placeholder="e.g., 'Socratic Tutor Template'"
              className="w-full mt-1 p-2 bg-background border border-border-color rounded-md"
              autoFocus
            />
          </div>
          <div>
            <label className="text-sm font-medium text-text-secondary" htmlFor="recipe-desc">Description</label>
            <textarea
              id="recipe-desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="A brief description of what this recipe does."
              className="w-full mt-1 p-2 bg-background border border-border-color rounded-md h-20 resize-none"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-text-secondary" htmlFor="recipe-folder">Folder (Optional)</label>
            <select
              id="recipe-folder"
              value={selectedFolder}
              onChange={(e) => setSelectedFolder(e.target.value)}
              className="w-full mt-1 p-2 bg-background border border-border-color rounded-md"
            >
              <option value="">No folder</option>
              {recipeFolders.map((folder: Folder) => (
                <option key={folder.id} value={folder.id}>{folder.name}</option>
              ))}
            </select>
          </div>
          
          {variables.length > 0 && (
            <div>
              <h3 className="text-md font-semibold text-text-main mt-4 mb-2">Detected Variables</h3>
              <p className="text-xs text-text-secondary mb-3">Set default values for variables found in your components.</p>
              <div className="space-y-2">
                {variables.map((variable, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <span className="font-mono text-sm p-2 bg-background rounded-md">{`{{${variable.name}}}`}</span>
                    <input
                      type="text"
                      value={variable.defaultValue}
                      onChange={(e) => handleVariableChange(index, 'defaultValue', e.target.value)}
                      placeholder="Default value"
                      className="flex-grow p-2 bg-background border border-border-color rounded-md text-sm"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
        <div className="mt-6 flex justify-end gap-3 pt-4 border-t border-border-color">
          <button onClick={onClose} className="px-4 py-2 bg-card-secondary rounded-md text-sm font-semibold">Cancel</button>
          <button onClick={handleSave} className="px-4 py-2 bg-primary text-white rounded-md text-sm font-semibold">
            Save Recipe
          </button>
        </div>
      </div>
    </div>
  );
};

export default SaveRecipeModal;
