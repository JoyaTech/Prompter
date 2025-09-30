import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Prompt, HistoryItem, PromptRecipe } from '../types';
import * as dataService from '../services/dataService';

interface AppContextType {
  prompts: Prompt[];
  history: HistoryItem[];
  recipes: PromptRecipe[];
  handleSavePrompt: (name: string, text: string) => void;
  handleDeletePrompt: (id: string) => void;
  handleSaveRecipe: (recipe: Omit<PromptRecipe, 'id'>) => void;
  handleAddHistory: (prompt: string, response: string, alignmentNotes?: string, comparisonId?: string) => HistoryItem;
  handleDeleteHistory: (id: string) => void;
  handleUpdateHistoryItem: (id: string, updates: Partial<HistoryItem>) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [recipes, setRecipes] = useState<PromptRecipe[]>([]);

  useEffect(() => {
    setPrompts(dataService.getPrompts());
    setHistory(dataService.getHistory());
    setRecipes(dataService.getRecipes());
  }, []);

  const handleSavePrompt = (name: string, text: string) => {
    const newPrompt = { id: uuidv4(), name, text };
    const updatedPrompts = [...prompts, newPrompt];
    setPrompts(updatedPrompts);
    dataService.savePrompts(updatedPrompts);
  };

  const handleDeletePrompt = (id: string) => {
    const updatedPrompts = prompts.filter(p => p.id !== id);
    setPrompts(updatedPrompts);
    dataService.savePrompts(updatedPrompts);
  };

  const handleSaveRecipe = (recipe: Omit<PromptRecipe, 'id'>) => {
    const newRecipe = { ...recipe, id: uuidv4() };
    const updatedRecipes = [...recipes, newRecipe];
    setRecipes(updatedRecipes);
    dataService.saveRecipes(updatedRecipes);
  };

  const handleAddHistory = (prompt: string, response: string, alignmentNotes?: string, comparisonId?: string): HistoryItem => {
    const newHistoryItem: HistoryItem = {
      id: uuidv4(),
      prompt,
      response,
      timestamp: new Date(),
      alignment_notes: alignmentNotes,
      comparisonId
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

  const value = {
    prompts,
    history,
    recipes,
    handleSavePrompt,
    handleDeletePrompt,
    handleSaveRecipe,
    handleAddHistory,
    handleDeleteHistory,
    handleUpdateHistoryItem,
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
