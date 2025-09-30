import { Prompt, HistoryItem, PromptRecipe, Folder } from '../types';

const PROMPTS_KEY = 'flow-it-magical-prompts';
const HISTORY_KEY = 'flow-it-magical-history';
const RECIPES_KEY = 'flow-it-magical-recipes';
const FOLDERS_KEY = 'flow-it-magical-folders';

export const getPrompts = (): Prompt[] => {
    try {
        const data = localStorage.getItem(PROMPTS_KEY);
        return data ? JSON.parse(data) : [];
    } catch (e) {
        console.error("Failed to load prompts from localStorage", e);
        return [];
    }
};

export const savePrompts = (prompts: Prompt[]): void => {
    try {
        localStorage.setItem(PROMPTS_KEY, JSON.stringify(prompts));
    } catch (e) {
        console.error("Failed to save prompts to localStorage", e);
    }
};

export const getHistory = (): HistoryItem[] => {
    try {
        const data = localStorage.getItem(HISTORY_KEY);
        if (!data) return [];
        // Dates need to be revived from string format
        const history = JSON.parse(data).map((item: any) => ({
            ...item,
            timestamp: new Date(item.timestamp),
        }));
        return history;
    } catch (e) {
        console.error("Failed to load history from localStorage", e);
        return [];
    }
};

export const saveHistory = (history: HistoryItem[]): void => {
    try {
        localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
    } catch (e) {
        console.error("Failed to save history to localStorage", e);
    }
};

export const getRecipes = (): PromptRecipe[] => {
    try {
        const data = localStorage.getItem(RECIPES_KEY);
        return data ? JSON.parse(data) : [];
    } catch (e) {
        console.error("Failed to load recipes from localStorage", e);
        return [];
    }
}

export const saveRecipes = (recipes: PromptRecipe[]): void => {
    try {
        localStorage.setItem(RECIPES_KEY, JSON.stringify(recipes));
    } catch (e) {
        console.error("Failed to save recipes to localStorage", e);
    }
};

export const getFolders = (): Folder[] => {
    try {
        const data = localStorage.getItem(FOLDERS_KEY);
        return data ? JSON.parse(data) : [];
    } catch (e) {
        console.error("Failed to load folders from localStorage", e);
        return [];
    }
};

export const saveFolders = (folders: Folder[]): void => {
    try {
        localStorage.setItem(FOLDERS_KEY, JSON.stringify(folders));
    } catch (e) {
        console.error("Failed to save folders to localStorage", e);
    }
};