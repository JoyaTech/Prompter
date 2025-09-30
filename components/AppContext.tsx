import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Prompt, HistoryItem, PromptRecipe, Folder, ThemeSettings } from '../types';
import * as dataService from '../services/dataService';

interface AppContextType {
  prompts: Prompt[];
  history: HistoryItem[];
  recipes: PromptRecipe[];
  folders: Folder[];
  handleSavePrompt: (name: string, text: string, folderId?: string) => void;
  handleDeletePrompt: (id: string) => void;
  handleSaveRecipe: (recipe: Omit<PromptRecipe, 'id'>, folderId?: string) => void;
  handleAddHistory: (prompt: string, response: string, alignmentNotes?: string, comparisonId?: string, duration?: number) => HistoryItem;
  handleDeleteHistory: (id: string) => void;
  handleUpdateHistoryItem: (id: string, updates: Partial<HistoryItem>) => void;
  handleCreateFolder: (name: string, type: 'prompt' | 'recipe') => void;
  handleRenameFolder: (id: string, newName: string) => void;
  handleDeleteFolder: (id: string) => void;
  handleMoveItemToFolder: (itemId: string, folderId: string | null, itemType: 'prompt' | 'recipe') => void;
  handleExportData: () => void;
  handleImportData: (jsonString: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [recipes, setRecipes] = useState<PromptRecipe[]>([]);
  const [folders, setFolders] = useState<Folder[]>([]);

  useEffect(() => {
    setPrompts(dataService.getPrompts());
    setHistory(dataService.getHistory());
    setRecipes(dataService.getRecipes());
    setFolders(dataService.getFolders());
  }, []);

  const handleSavePrompt = (name: string, text: string, folderId?: string) => {
    const newPrompt: Prompt = { id: uuidv4(), name, text, folderId };
    const updatedPrompts = [...prompts, newPrompt];
    setPrompts(updatedPrompts);
    dataService.savePrompts(updatedPrompts);
  };

  const handleDeletePrompt = (id: string) => {
    const updatedPrompts = prompts.filter(p => p.id !== id);
    setPrompts(updatedPrompts);
    dataService.savePrompts(updatedPrompts);
  };

  const handleSaveRecipe = (recipe: Omit<PromptRecipe, 'id'>, folderId?: string) => {
    const newRecipe: PromptRecipe = { ...recipe, id: uuidv4(), folderId };
    const updatedRecipes = [...recipes, newRecipe];
    setRecipes(updatedRecipes);
    dataService.saveRecipes(updatedRecipes);
  };

  const handleAddHistory = (prompt: string, response: string, alignmentNotes?: string, comparisonId?: string, duration?: number): HistoryItem => {
    const newHistoryItem: HistoryItem = {
      id: uuidv4(),
      prompt,
      response,
      timestamp: new Date(),
      alignment_notes: alignmentNotes,
      comparisonId,
      duration
    };
    const updatedHistory = [newHistoryItem, ...history];
    setHistory(updatedHistory);
    dataService.saveHistory(updatedHistory);
    return newHistoryItem;
  };

  const handleDeleteHistory = (id: string) => {
    const updatedHistory = history.filter(h => h.id !== id);
    setHistory(updatedHistory);
    dataService.saveHistory(updatedHistory);
  };

  const handleUpdateHistoryItem = (id: string, updates: Partial<HistoryItem>) => {
    const updatedHistory = history.map(item =>
      item.id === id ? { ...item, ...updates } : item
    );
    setHistory(updatedHistory);
    dataService.saveHistory(updatedHistory);
  };

  const handleCreateFolder = (name: string, type: 'prompt' | 'recipe') => {
    const newFolder: Folder = { id: uuidv4(), name, type };
    const updatedFolders = [...folders, newFolder];
    setFolders(updatedFolders);
    dataService.saveFolders(updatedFolders);
  };

  const handleRenameFolder = (id: string, newName: string) => {
    const updatedFolders = folders.map(f => f.id === id ? { ...f, name: newName } : f);
    setFolders(updatedFolders);
    dataService.saveFolders(updatedFolders);
  };

  const handleDeleteFolder = (id: string) => {
    const folderToDelete = folders.find(f => f.id === id);
    if (!folderToDelete) return;
    const updatedFolders = folders.filter(f => f.id !== id);
    setFolders(updatedFolders);
    dataService.saveFolders(updatedFolders);
    if (folderToDelete.type === 'prompt') {
      const updatedPrompts = prompts.map(p => p.folderId === id ? { ...p, folderId: undefined } : p);
      setPrompts(updatedPrompts);
      dataService.savePrompts(updatedPrompts);
    } else if (folderToDelete.type === 'recipe') {
      const updatedRecipes = recipes.map(r => r.folderId === id ? { ...r, folderId: undefined } : r);
      setRecipes(updatedRecipes);
      dataService.saveRecipes(updatedRecipes);
    }
  };

  const handleMoveItemToFolder = (itemId: string, folderId: string | null, itemType: 'prompt' | 'recipe') => {
    if (itemType === 'prompt') {
      const updatedPrompts = prompts.map(p => p.id === itemId ? { ...p, folderId: folderId ?? undefined } : p);
      setPrompts(updatedPrompts);
      dataService.savePrompts(updatedPrompts);
    } else if (itemType === 'recipe') {
      const updatedRecipes = recipes.map(r => r.id === itemId ? { ...r, folderId: folderId ?? undefined } : r);
      setRecipes(updatedRecipes);
      dataService.saveRecipes(updatedRecipes);
    }
  };
  
  const handleExportData = () => {
    const theme = localStorage.getItem('flow-it-magical-theme');
    const data = {
        prompts: dataService.getPrompts(),
        history: dataService.getHistory(),
        recipes: dataService.getRecipes(),
        folders: dataService.getFolders(),
        theme: theme ? JSON.parse(theme) : null,
    };
    const jsonString = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `flow-it-magical-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportData = (jsonString: string) => {
    if (!window.confirm("Are you sure you want to import data? This will overwrite your current workspace.")) {
        return;
    }
    try {
        const data = JSON.parse(jsonString);
        if (data.prompts) {
            setPrompts(data.prompts);
            dataService.savePrompts(data.prompts);
        }
        if (data.history) {
            const revivedHistory = data.history.map((item: any) => ({ ...item, timestamp: new Date(item.timestamp) }));
            setHistory(revivedHistory);
            dataService.saveHistory(revivedHistory);
        }
        if (data.recipes) {
            setRecipes(data.recipes);
            dataService.saveRecipes(data.recipes);
        }
        if (data.folders) {
            setFolders(data.folders);
            dataService.saveFolders(data.folders);
        }
        if (data.theme) {
            localStorage.setItem('flow-it-magical-theme', JSON.stringify(data.theme));
        }
        alert("Data imported successfully! The application will now reload.");
        window.location.reload();
    } catch (error) {
        alert("Import failed. The file might be corrupted.");
        console.error("Import error:", error);
    }
  };

  const value = {
    prompts, history, recipes, folders,
    handleSavePrompt, handleDeletePrompt, handleSaveRecipe, handleAddHistory,
    handleDeleteHistory, handleUpdateHistoryItem, handleCreateFolder,
    handleRenameFolder, handleDeleteFolder, handleMoveItemToFolder,
    handleExportData, handleImportData
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = (): AppContextType => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};