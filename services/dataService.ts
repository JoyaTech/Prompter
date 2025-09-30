import { Prompt, HistoryItem, PromptRecipe } from '../types';

const PROMPTS_KEY = 'gen-spark-prompts';
const HISTORY_KEY = 'gen-spark-history';
const RECIPES_KEY = 'gen-spark-recipes';

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
