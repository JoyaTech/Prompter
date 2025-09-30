import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppContext } from './AppContext';
import { Folder } from '../types';

interface SavePromptModalProps {
  isOpen: boolean;
  onClose: () => void;
  promptText: string;
}

const SavePromptModal: React.FC<SavePromptModalProps> = ({ isOpen, onClose, promptText }) => {
  const { t } = useTranslation();
  const { handleSavePrompt, folders } = useAppContext();
  const [promptName, setPromptName] = useState('');
  const [selectedFolder, setSelectedFolder] = useState<string>('');
  
  const promptFolders = folders.filter(f => f.type === 'prompt');

  const handleSave = () => {
    if (!promptName.trim()) return;
    handleSavePrompt(promptName.trim(), promptText, selectedFolder || undefined);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-card p-6 rounded-lg w-full max-w-md shadow-lg border border-border-color">
        <h2 className="text-lg font-bold mb-4">{t('save_prompt_modal_title')}</h2>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-text-secondary" htmlFor="prompt-name">{t('save_prompt_name_label')}</label>
            <input
              id="prompt-name"
              type="text"
              value={promptName}
              onChange={(e) => setPromptName(e.target.value)}
              placeholder={t('save_prompt_name_placeholder')}
              className="w-full mt-1 p-2 bg-background border border-border-color rounded-md"
              autoFocus
            />
          </div>
          <div>
            <label className="text-sm font-medium text-text-secondary" htmlFor="prompt-folder">{t('save_prompt_folder_label')}</label>
            <select
              id="prompt-folder"
              value={selectedFolder}
              onChange={(e) => setSelectedFolder(e.target.value)}
              className="w-full mt-1 p-2 bg-background border border-border-color rounded-md"
            >
              <option value="">{t('save_prompt_no_folder')}</option>
              {promptFolders.map((folder: Folder) => (
                <option key={folder.id} value={folder.id}>{folder.name}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="mt-6 flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 bg-card-secondary rounded-md text-sm font-semibold">Cancel</button>
          <button onClick={handleSave} className="px-4 py-2 bg-primary text-white rounded-md text-sm font-semibold">
            {t('save_prompt_save_button')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SavePromptModal;
