// FIX: Implemented AppContext to provide global state management.
import React, { createContext, useReducer, useContext, useEffect, ReactNode, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import * as dataService from '../services/dataService';
import { HistoryItem, Prompt, PromptRecipe, Folder, ToastMessage, PromptComponent, RecipeVariable, ToastMessage as ToastType } from '../types';

interface AppState {
  history: HistoryItem[];
  prompts: Prompt[];
  recipes: PromptRecipe[];
  folders: Folder[];
  toasts: ToastType[];
}

type Action =
  | { type: 'SET_STATE'; payload: AppState }
  | { type: 'ADD_HISTORY'; payload: HistoryItem }
  | { type: 'UPDATE_HISTORY'; payload: { id: string; updates: Partial<HistoryItem> } }
  | { type: 'DELETE_HISTORY'; payload: string }
  | { type: 'SAVE_PROMPT'; payload: Prompt }
  | { type: 'DELETE_PROMPT'; payload: string }
  | { type: 'SAVE_RECIPE'; payload: PromptRecipe }
  | { type: 'CREATE_FOLDER'; payload: Folder }
  | { type: 'RENAME_FOLDER'; payload: { id: string; name: string } }
  | { type: 'DELETE_FOLDER'; payload: string }
  | { type: 'MOVE_ITEM_TO_FOLDER'; payload: { itemId: string; folderId: string | null; itemType: 'prompt' | 'recipe' } }
  | { type: 'ADD_TOAST'; payload: ToastMessage }
  | { type: 'REMOVE_TOAST'; payload: string };

const initialState: AppState = {
  history: [],
  prompts: [],
  recipes: [],
  folders: [],
  toasts: [],
};

const appReducer = (state: AppState, action: Action): AppState => {
  switch (action.type) {
    case 'SET_STATE':
        return action.payload;
    case 'ADD_HISTORY':
      return { ...state, history: [action.payload, ...state.history] };
    case 'UPDATE_HISTORY':
      return { ...state, history: state.history.map(item => item.id === action.payload.id ? { ...item, ...action.payload.updates } : item) };
    case 'DELETE_HISTORY':
      return { ...state, history: state.history.filter(item => item.id !== action.payload) };
    case 'SAVE_PROMPT':
      const existingPromptIndex = state.prompts.findIndex(p => p.id === action.payload.id);
      if (existingPromptIndex > -1) {
          const newPrompts = [...state.prompts];
          newPrompts[existingPromptIndex] = action.payload;
          return { ...state, prompts: newPrompts };
      }
      return { ...state, prompts: [...state.prompts, action.payload] };
    case 'DELETE_PROMPT':
      return { ...state, prompts: state.prompts.filter(p => p.id !== action.payload) };
    case 'SAVE_RECIPE':
         const existingRecipeIndex = state.recipes.findIndex(r => r.id === action.payload.id);
         if (existingRecipeIndex > -1) {
             const newRecipes = [...state.recipes];
             newRecipes[existingRecipeIndex] = action.payload;
             return { ...state, recipes: newRecipes };
         }
         return { ...state, recipes: [...state.recipes, action.payload] };
    case 'CREATE_FOLDER':
        return { ...state, folders: [...state.folders, action.payload] };
    case 'RENAME_FOLDER':
        return { ...state, folders: state.folders.map(f => f.id === action.payload.id ? { ...f, name: action.payload.name } : f) };
    case 'DELETE_FOLDER':
        const itemType = state.folders.find(f => f.id === action.payload)?.type;
        const updatedPrompts = itemType === 'prompt' ? state.prompts.filter(p => p.folderId !== action.payload) : state.prompts;
        const updatedRecipes = itemType === 'recipe' ? state.recipes.filter(r => r.folderId !== action.payload) : state.recipes;
        return { ...state, folders: state.folders.filter(f => f.id !== action.payload), prompts: updatedPrompts, recipes: updatedRecipes };
    case 'MOVE_ITEM_TO_FOLDER':
        if (action.payload.itemType === 'prompt') {
            return { ...state, prompts: state.prompts.map(p => p.id === action.payload.itemId ? { ...p, folderId: action.payload.folderId } : p) };
        } else {
            return { ...state, recipes: state.recipes.map(r => r.id === action.payload.itemId ? { ...r, folderId: action.payload.folderId } : r) };
        }
    case 'ADD_TOAST':
      return { ...state, toasts: [...state.toasts, action.payload] };
    case 'REMOVE_TOAST':
      return { ...state, toasts: state.toasts.filter(toast => toast.id !== action.payload) };
    default:
      return state;
  }
};

interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<Action>;
  history: HistoryItem[];
  prompts: Prompt[];
  recipes: PromptRecipe[];
  folders: Folder[];
  handleSaveHistory: (prompt: string, response: string) => HistoryItem;
  handleUpdateHistory: (id: string, updates: Partial<HistoryItem>) => void;
  handleDeleteHistory: (id: string) => void;
  handleSavePrompt: (name: string, text: string, folderId?: string) => void;
  handleDeletePrompt: (id: string) => void;
  handleSaveRecipe: (name: string, description: string, components: PromptComponent[], variables: RecipeVariable[], folderId?: string) => void;
  handleCreateFolder: (name: string, type: 'prompt' | 'recipe') => void;
  handleRenameFolder: (id: string, name: string) => void;
  handleDeleteFolder: (id: string) => void;
  handleMoveItemToFolder: (itemId: string, folderId: string | null, itemType: 'prompt' | 'recipe') => void;
  addToast: (message: string, type: ToastMessage['type']) => void;
  removeToast: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  useEffect(() => {
    const loadedData = dataService.loadDataFromStorage();
    // FIX: Merge loaded data with the initial state to ensure all state properties are present,
    // especially transient ones like 'toasts' which are not persisted.
    dispatch({ type: 'SET_STATE', payload: { ...initialState, ...loadedData } });
  }, []);

  useEffect(() => {
    dataService.saveDataToStorage(state);
  }, [state]);

  const addToast = useCallback((message: string, type: ToastMessage['type']) => {
    const id = uuidv4();
    dispatch({ type: 'ADD_TOAST', payload: { id, message, type } });
  }, []);

  const removeToast = useCallback((id: string) => {
    dispatch({ type: 'REMOVE_TOAST', payload: id });
  }, []);
  
  const handleSaveHistory = (prompt: string, response: string): HistoryItem => {
      const newItem: HistoryItem = { id: uuidv4(), prompt, response, timestamp: new Date() };
      dispatch({ type: 'ADD_HISTORY', payload: newItem });
      return newItem;
  };
  
  const handleUpdateHistory = (id: string, updates: Partial<HistoryItem>) => {
      dispatch({ type: 'UPDATE_HISTORY', payload: { id, updates }});
  };

  const handleDeleteHistory = (id: string) => {
      dispatch({ type: 'DELETE_HISTORY', payload: id });
  };
  
  const handleSavePrompt = (name: string, text: string, folderId?: string) => {
      const newPrompt: Prompt = { id: uuidv4(), name, text, folderId: folderId || null };
      dispatch({ type: 'SAVE_PROMPT', payload: newPrompt });
      addToast('Prompt saved successfully!', 'success');
  };

  const handleDeletePrompt = (id: string) => {
      dispatch({ type: 'DELETE_PROMPT', payload: id });
  };
  
  const handleSaveRecipe = (name: string, description: string, components: PromptComponent[], variables: RecipeVariable[], folderId?: string) => {
      const newRecipe: PromptRecipe = { id: uuidv4(), name, description, components, variables, folderId: folderId || null };
      dispatch({ type: 'SAVE_RECIPE', payload: newRecipe });
      addToast('Recipe saved successfully!', 'success');
  };
  
  const handleCreateFolder = (name: string, type: 'prompt' | 'recipe') => {
      const newFolder: Folder = { id: uuidv4(), name, type };
      dispatch({ type: 'CREATE_FOLDER', payload: newFolder });
      addToast('Folder created successfully!', 'success');
  };

  const handleRenameFolder = (id: string, name: string) => {
      dispatch({ type: 'RENAME_FOLDER', payload: { id, name } });
      addToast('Folder renamed successfully!', 'info');
  };

  const handleDeleteFolder = (id: string) => {
      dispatch({ type: 'DELETE_FOLDER', payload: id });
      addToast('Folder deleted successfully!', 'info');
  };
  
  const handleMoveItemToFolder = (itemId: string, folderId: string | null, itemType: 'prompt' | 'recipe') => {
      dispatch({ type: 'MOVE_ITEM_TO_FOLDER', payload: { itemId, folderId, itemType } });
      addToast('Item moved!', 'info');
  };

  return (
    <AppContext.Provider value={{
        state,
        dispatch,
        history: state.history,
        prompts: state.prompts,
        recipes: state.recipes,
        folders: state.folders,
        handleSaveHistory,
        handleUpdateHistory,
        handleDeleteHistory,
        handleSavePrompt,
        handleDeletePrompt,
        handleSaveRecipe,
        handleCreateFolder,
        handleRenameFolder,
        handleDeleteFolder,
        handleMoveItemToFolder,
        addToast,
        removeToast,
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
