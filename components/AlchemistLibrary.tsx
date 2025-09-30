import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { CommunityPrompt, PromptRecipe } from '../types';
import { getGenSparkPrompts, fetchAwesomePrompts, getHebrewPrompts } from '../services/communityPromptService';
import { useAppContext } from './AppContext';
import FolderStructure from './FolderStructure';
import { DownloadIcon, UserIcon } from './icons';

interface AlchemistLibraryProps {
    onAddToWorkbench: (promptText: string) => void;
    onSelectRecipe: (recipe: PromptRecipe) => void;
    onSurpriseMe: (base: string, essences: string[]) => void;
}

const AlchemistLibrary: React.FC<AlchemistLibraryProps> = ({ onAddToWorkbench, onSelectRecipe, onSurpriseMe }) => {
    const { t, i18n } = useTranslation();
    const { recipes } = useAppContext();
    const [activeTab, setActiveTab] = useState('community');
    const [prompts, setPrompts] = useState<CommunityPrompt[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const loadPrompts = async () => {
            setIsLoading(true);
            const isHebrew = i18n.language === 'he';
            const communitySources = isHebrew 
                ? [getHebrewPrompts()] 
                : [getGenSparkPrompts(), fetchAwesomePrompts()];
            
            const results = await Promise.all(communitySources);
            setPrompts(results.flat());
            setIsLoading(false);
        };
        loadPrompts();
    }, [i18n.language]);
    
    const handleSurprise = () => {
        const base = "You are a creative assistant.";
        const essences = ["Write in the style of a pirate.", "The tone should be humorous.", "The output must be a limerick."];
        onSurpriseMe(base, essences);
    };

    return (
        <div className="bg-card p-4 rounded-lg border border-border-color h-full flex flex-col">
            <h3 className="text-lg font-semibold text-text-main mb-3">{t('alchemist_library_title')}</h3>
            <div className="flex items-center gap-2 bg-card-secondary p-1 rounded-md mb-3">
                <button onClick={() => setActiveTab('community')} className={`w-full py-1.5 text-sm font-semibold rounded ${activeTab === 'community' ? 'bg-primary text-white' : 'hover:bg-border-color'}`}>{t('alchemist_library_community')}</button>
                <button onClick={() => setActiveTab('recipes')} className={`w-full py-1.5 text-sm font-semibold rounded ${activeTab === 'recipes' ? 'bg-primary text-white' : 'hover:bg-border-color'}`}>{t('alchemist_library_recipes')}</button>
            </div>
            <div className="flex-grow overflow-y-auto pr-2">
                {activeTab === 'community' && (
                    <div className="space-y-2">
                        {isLoading ? <p>Loading...</p> : prompts.map(p => (
                            <div key={p.id} className="bg-card-secondary p-3 rounded-md">
                                <p className="font-semibold text-text-main">{p.name}</p>
                                <p className="text-xs text-text-secondary mt-1">{p.description}</p>
                                <div className="flex justify-between items-center mt-2">
                                    <div className="flex items-center gap-3 text-xs text-text-secondary">
                                        <div className="flex items-center gap-1"><UserIcon className="w-3 h-3"/><span>{p.author}</span></div>
                                        <div className="flex items-center gap-1"><DownloadIcon className="w-3 h-3"/><span>{p.downloads || 0}</span></div>
                                    </div>
                                    <button onClick={() => onAddToWorkbench(p.prompt)} className="px-2 py-1 text-xs font-semibold bg-primary/80 text-white rounded-md hover:bg-primary">Add</button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
                 {activeTab === 'recipes' && (
                    <FolderStructure 
                        itemType="recipe"
                        items={recipes}
                        onSelectItem={onSelectRecipe}
                        itemActionLabel="Use"
                    />
                 )}
            </div>
            <div className="mt-4 pt-4 border-t border-border-color">
                <button onClick={handleSurprise} className="w-full py-2 bg-accent/80 text-background font-semibold rounded-md hover:bg-accent">{t('alchemist_library_surprise')}</button>
            </div>
        </div>
    );
};

export default AlchemistLibrary;
