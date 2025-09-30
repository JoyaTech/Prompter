// FIX: Implemented data service to handle localStorage persistence.
import { HistoryItem, Prompt, PromptRecipe, Folder } from '../types';

const STORAGE_KEY = 'flow-it-magical-data';

export interface AppData {
  history: HistoryItem[];
  prompts: Prompt[];
  recipes: PromptRecipe[];
  folders: Folder[];
}

const initialData: AppData = {
    history: [],
    prompts: [],
    recipes: [],
    folders: [],
};

export const loadDataFromStorage = (): AppData => {
  try {
    const serializedData = localStorage.getItem(STORAGE_KEY);
    if (serializedData === null) {
      return initialData;
    }
    const parsedData = JSON.parse(serializedData);
    // Dates need to be revived from string format
    if (parsedData.history) {
        parsedData.history = parsedData.history.map((item: any) => ({
            ...item,
            timestamp: new Date(item.timestamp),
        }));
    }
    return { ...initialData, ...parsedData };
  } catch (error) {
    console.error("Error loading data from localStorage:", error);
    return initialData;
  }
};

export const saveDataToStorage = (data: AppData) => {
  try {
    const serializedData = JSON.stringify(data);
    localStorage.setItem(STORAGE_KEY, serializedData);
  } catch (error) {
    console.error("Error saving data to localStorage:", error);
  }
};
