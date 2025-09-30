import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Folder, Prompt, PromptRecipe } from '../types';
import { useAppContext } from './AppContext';
import { FolderIcon, TrashIcon, EllipsisIcon, PencilIcon, FolderPlusIcon, CheckIcon } from './icons';

type Item = Prompt | PromptRecipe;

interface FolderStructureProps {
  itemType: 'prompt' | 'recipe';
  items: Item[];
  onSelectItem: (item: any) => void;
  onDeleteItem?: (id: string) => void;
  itemActionLabel?: string;
}

const FolderStructure: React.FC<FolderStructureProps> = ({ itemType, items, onSelectItem, onDeleteItem, itemActionLabel }) => {
  const { t } = useTranslation();
  const { folders, handleCreateFolder, handleRenameFolder, handleDeleteFolder, handleMoveItemToFolder } = useAppContext();
  
  const [isCreatingFolder, setIsCreatingFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [renamingFolderId, setRenamingFolderId] = useState<string | null>(null);
  const [renamingFolderName, setRenamingFolderName] = useState('');
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [dragOverFolder, setDragOverFolder] = useState<string | null>(null);

  const menuRef = useRef<HTMLDivElement>(null);

  const relevantFolders = folders.filter(f => f.type === itemType);
  const uncategorizedItems = items.filter(i => !i.folderId);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setActiveMenu(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleCreateNewFolder = () => {
    if (newFolderName.trim()) {
      handleCreateFolder(newFolderName.trim(), itemType);
      setNewFolderName('');
      setIsCreatingFolder(false);
    }
  };

  const handleStartRename = (folder: Folder) => {
    setRenamingFolderId(folder.id);
    setRenamingFolderName(folder.name);
    setActiveMenu(null);
  };

  const handleConfirmRename = () => {
    if (renamingFolderId && renamingFolderName.trim()) {
      handleRenameFolder(renamingFolderId, renamingFolderName.trim());
    }
    setRenamingFolderId(null);
    setRenamingFolderName('');
  };
  
  const handleConfirmDelete = (folderId: string) => {
    if (window.confirm(t('folder_delete_confirm'))) {
        handleDeleteFolder(folderId);
    }
    setActiveMenu(null);
  }

  const handleDragStart = (e: React.DragEvent, item: Item) => {
    e.dataTransfer.setData('item', JSON.stringify({ id: item.id, type: itemType }));
  };

  const handleDrop = (e: React.DragEvent, folderId: string | null) => {
    e.preventDefault();
    setDragOverFolder(null);
    const itemData = JSON.parse(e.dataTransfer.getData('item'));
    if (itemData.type === itemType) {
      handleMoveItemToFolder(itemData.id, folderId, itemType);
    }
  };
  
  const renderItem = (item: Item) => (
    <div
      key={item.id}
      draggable
      onDragStart={(e) => handleDragStart(e, item)}
      className="group bg-card-secondary p-3 rounded-md flex justify-between items-center transition-colors hover:bg-border-color cursor-grab"
    >
      <button onClick={() => onSelectItem(item)} className="text-left flex-grow overflow-hidden">
        <p className="text-text-main truncate" title={(item as Prompt).text || (item as PromptRecipe).description}>{item.name}</p>
      </button>
      {onDeleteItem && (
        <button
          onClick={() => onDeleteItem(item.id)}
          className="ml-4 p-1 text-text-secondary hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
          title="Delete item"
        >
          <TrashIcon className="w-4 h-4" />
        </button>
      )}
       {itemActionLabel && (
         <button onClick={() => onSelectItem(item)} className="ml-4 px-2 py-1 text-xs font-semibold bg-primary/80 text-white rounded-md hover:bg-primary">
            {itemActionLabel}
         </button>
       )}
    </div>
  );

  return (
    <div className="space-y-2">
      <div className="px-1 mb-3">
        {isCreatingFolder ? (
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleCreateNewFolder()}
              onBlur={() => { setIsCreatingFolder(false); setNewFolderName(''); }}
              placeholder={t('folder_new_name')}
              className="w-full p-1.5 bg-background border border-primary rounded-md text-sm"
              autoFocus
            />
            <button onClick={handleCreateNewFolder} className="p-1.5 text-green-400 hover:bg-card-secondary rounded-md">
                <CheckIcon className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <button onClick={() => setIsCreatingFolder(true)} className="w-full flex items-center gap-2 p-2 text-sm text-text-secondary hover:text-text-main hover:bg-card-secondary rounded-md">
            <FolderPlusIcon className="w-5 h-5" />
            <span>{t('folder_create')}</span>
          </button>
        )}
      </div>

      {relevantFolders.map(folder => {
        const folderItems = items.filter(i => i.folderId === folder.id);
        return (
          <details key={folder.id} open className="group">
            <summary 
              className={`flex items-center justify-between p-2 rounded-md cursor-pointer list-none hover:bg-card-secondary transition-colors ${dragOverFolder === folder.id ? 'bg-primary/20' : ''}`}
              onDragOver={e => { e.preventDefault(); setDragOverFolder(folder.id); }}
              onDragLeave={() => setDragOverFolder(null)}
              onDrop={(e) => handleDrop(e, folder.id)}
            >
              <div className="flex items-center gap-2">
                <FolderIcon className="w-5 h-5 text-accent" />
                {renamingFolderId === folder.id ? (
                    <input
                        type="text"
                        value={renamingFolderName}
                        onChange={(e) => setRenamingFolderName(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && handleConfirmRename()}
                        onBlur={handleConfirmRename}
                        className="p-0 bg-transparent border-b border-primary text-sm font-semibold"
                        autoFocus
                    />
                ) : (
                    <span className="text-sm font-semibold text-text-main">{folder.name}</span>
                )}
              </div>
              <div className="relative">
                <button onClick={(e) => { e.preventDefault(); setActiveMenu(folder.id === activeMenu ? null : folder.id);}} className="p-1 opacity-0 group-hover:opacity-100 focus:opacity-100">
                  <EllipsisIcon className="w-4 h-4 text-text-secondary" />
                </button>
                {activeMenu === folder.id && (
                    <div ref={menuRef} className="absolute right-0 mt-2 w-40 bg-card-secondary border border-border-color rounded-md shadow-lg z-10">
                        <button onClick={() => handleStartRename(folder)} className="w-full text-left flex items-center gap-2 px-3 py-2 text-sm hover:bg-border-color">
                            <PencilIcon className="w-4 h-4"/> {t('folder_rename')}
                        </button>
                         <button onClick={() => handleConfirmDelete(folder.id)} className="w-full text-left flex items-center gap-2 px-3 py-2 text-sm text-red-400 hover:bg-border-color">
                           <TrashIcon className="w-4 h-4"/> {t('folder_delete')}
                        </button>
                    </div>
                )}
              </div>
            </summary>
            <div className="pl-6 pt-2 space-y-2">
              {folderItems.map(renderItem)}
              {folderItems.length === 0 && <p className="text-xs text-text-secondary/70 px-2 py-1">Drop items here</p>}
            </div>
          </details>
        );
      })}
      
      {uncategorizedItems.length > 0 && (
        <div>
            <div 
              className={`p-2 text-sm font-semibold text-text-secondary mt-4 rounded-md ${dragOverFolder === 'uncategorized' ? 'bg-primary/20' : ''}`}
              onDragOver={e => { e.preventDefault(); setDragOverFolder('uncategorized'); }}
              onDragLeave={() => setDragOverFolder(null)}
              onDrop={(e) => handleDrop(e, null)}
            >
                {t('uncategorized')}
            </div>
            <div className="pt-2 space-y-2">
                {uncategorizedItems.map(renderItem)}
            </div>
        </div>
      )}
    </div>
  );
};

export default FolderStructure;