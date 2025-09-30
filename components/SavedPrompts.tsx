import React from 'react';
import { useTranslation } from 'react-i18next';
import { useAppContext } from './AppContext';
import FolderStructure from './FolderStructure';

interface SavedPromptsProps {
  onSelectPrompt: (promptText: string) => void;
}

const SavedPrompts: React.FC<SavedPromptsProps> = ({ onSelectPrompt }) => {
  const { t } = useTranslation();
  const { prompts, folders, handleDeletePrompt: onDeletePrompt } = useAppContext();

  return (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold text-text-secondary">{t('saved_prompts')}</h3>
      <div className="max-h-60 overflow-y-auto pr-2">
        {prompts.length > 0 || folders.filter(f => f.type === 'prompt').length > 0 ? (
          <FolderStructure
            itemType="prompt"
            items={prompts}
            onSelectItem={(item) => onSelectPrompt(item.text)}
            onDeleteItem={onDeletePrompt}
          />
        ) : null}
      </div>
    </div>
  );
};

export default SavedPrompts;