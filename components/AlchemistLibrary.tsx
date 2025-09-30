import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { CommunityPrompt, PromptRecipe } from '../types';
import * as communityPromptService from '../services/communityPromptService';
import * as dataService from '../services/dataService';
import { SaveIcon, UserIcon, DownloadIcon, CheckIcon, SparklesIcon, AlembicIcon } from './icons';

interface AlchemistLibraryProps {
    onSavePrompt: (name: string, text: string) => void;
    onAddToWorkbench: (prompt: string) => void;
    onSelectRecipe: (recipe: PromptRecipe) => void;
}

type PromptSource = 'genspark' | 'awesome-chatgpt' | 'engineering' | 'hebrew' | 'recipes';

const AlchemistLibrary: React.FC<AlchemistLibraryProps> = ({ onSavePrompt, onAddToWorkbench, onSelectRecipe }) => {
    const { t, i18n } = useTranslation();
    const [prompts, setPrompts] = useState<CommunityPrompt[]>([]);
    const [recipes, setRecipes] = useState<PromptRecipe[]>([]);
    const [loading, setLoading] = useState(true);
    const [justAddedId, setJustAddedId] = useState<string | null>(null);
    const [source, setSource] = useState<PromptSource>('genspark');

    const enSources: {id: PromptSource, name: string}[] = [
        { id: 'genspark', name: t('alchemist_source_genspark')},
        { id: 'awesome-chatgpt', name: t('alchemist_source_awesome_chatgpt')},
        { id: 'engineering', name: t('alchemist_source_prompt_engineering')},
        { id: 'recipes', name: t('alchemist_source_my_recipes')},
    ];
    const heSources: {id: PromptSource, name: string}[] = [
        { id: 'hebrew', name: t('alchemist_source_hebrew') },
        { id: 'recipes', name: t('alchemist_source_my_recipes')},
    ];
    const sources = i18n.language === 'he' ? heSources : enSources;

    useEffect(() => {
        // Reset to the default source when language changes
        if (i18n.language === 'he') {
            setSource('hebrew');
        } else {
            setSource('genspark');
        }
    }, [i18n.language]);

    useEffect(() => {
        const fetchPrompts = async () => {
            setLoading(true);
            setPrompts([]);
            setRecipes([]);

            if (source === 'recipes') {
                const userRecipes = dataService.getRecipes();
                setRecipes(userRecipes);
            } else {
                let communityPrompts: CommunityPrompt[] = [];
                switch (source) {
                    case 'genspark':
                        communityPrompts = await communityPromptService.getGenSparkPrompts();
                        break;
                    case 'awesome-chatgpt':
                        communityPrompts = await communityPromptService.fetchAwesomePrompts();
                        break;
                    case 'engineering':
                        communityPrompts = await communityPromptService.fetchEngineeringPrompts();
                        break;
                    case 'hebrew':
                        communityPrompts = await communityPromptService.getHebrewPrompts();
                        break;
                }
                setPrompts(communityPrompts);
            }
            setLoading(false);
        };
        fetchPrompts();
    }, [source]);

    const handleDownload = (prompt: CommunityPrompt) => {
        onSavePrompt(prompt.name, prompt.prompt);
        setJustAddedId(prompt.id);
        setTimeout(() => setJustAddedId(null), 2000); // Reset after 2 seconds
    };

    const renderCommunityPrompts = () => (
         <ul className="space-y-3">
            {prompts.map(prompt => (
                <li key={prompt.id} className="bg-card-secondary p-4 rounded-lg flex flex-col justify-between transition-shadow hover:shadow-lg">
                    <div>
                        <p className="font-semibold text-text-main">{prompt.name}</p>
                        <p className="text-sm text-text-secondary mt-1 line-clamp-2 h-10">{prompt.description}</p>
                    </div>
                    <div className="mt-4">
                        <div className="flex items-center justify-between text-xs text-text-secondary mb-3">
                            <div className="flex items-center gap-1.5" title="Author">
                                <UserIcon className="w-4 h-4" />
                                <span className="font-medium">{prompt.author}</span>
                            </div>
                            {prompt.downloads > 0 && (
                                <div className="flex items-center gap-1.5" title="Downloads">
                                    <DownloadIcon className="w-4 h-4" />
                                    <span className="font-medium">{prompt.downloads.toLocaleString()}</span>
                                </div>
                            )}
                        </div>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => handleDownload(prompt)}
                                disabled={justAddedId === prompt.id}
                                className={`w-full text-center px-3 py-1.5 text-xs font-semibold text-white rounded-md transition-all flex items-center justify-center gap-2 
                                ${justAddedId === prompt.id ? 'bg-green-600 cursor-default' : 'bg-primary/80 hover:bg-primary'}`}
                            >
                                {justAddedId === prompt.id ? (
                                    <>
                                        <CheckIcon className="w-4 h-4" />
                                        <span>{t('alchemist_prompt_added')}</span>
                                    </>
                                ) : (
                                    <>
                                        <SaveIcon className="w-4 h-4" />
                                        <span>{t('alchemist_add_to_saved')}</span>
                                    </>
                                )}
                            </button>
                            <button onClick={() => onAddToWorkbench(prompt.prompt)} className="w-full text-center px-3 py-1.5 text-xs font-semibold text-text-main bg-card hover:bg-border-color rounded-md transition-colors flex items-center justify-center gap-2">
                                <AlembicIcon className="w-4 h-4"/>
                                <span>{t('alchemist_bring_to_workbench')}</span>
                            </button>
                        </div>
                    </div>
                </li>
            ))}
        </ul>
    );

    const renderMyRecipes = () => (
         <ul className="space-y-3">
            {recipes.map(recipe => (
                <li key={recipe.id} className="bg-card-secondary p-4 rounded-lg flex flex-col justify-between transition-shadow hover:shadow-lg">
                    <div>
                        <p className="font-semibold text-text-main">{recipe.name}</p>
                        <p className="text-sm text-text-secondary mt-1 line-clamp-2 h-10">{recipe.description}</p>
                    </div>
                    <div className="mt-4">
                       <button onClick={() => onSelectRecipe(recipe)} className="w-full text-center px-3 py-1.5 text-sm font-semibold text-white bg-primary/80 hover:bg-primary rounded-md transition-colors flex items-center justify-center gap-2">
                            🧑‍🍳 <span>{t('recipe_use_button')}</span>
                        </button>
                    </div>
                </li>
            ))}
            {recipes.length === 0 && (
                <div className="text-center py-8 text-text-secondary text-sm">You haven't saved any recipes yet.</div>
            )}
        </ul>
    );

    return (
        <div className="bg-card p-4 rounded-lg border border-border-color h-full flex flex-col">
            <h3 className="text-lg font-semibold text-text-main mb-4">{t('alchemist_library_title')}</h3>
            
            <div className="flex items-center border-b border-border-color mb-4 overflow-x-auto">
                 {sources.map(src => (
                    <button
                        key={src.id}
                        onClick={() => setSource(src.id)}
                        className={`px-4 py-2 text-sm font-medium transition-colors flex-shrink-0 ${
                            source === src.id
                            ? 'border-b-2 border-primary text-primary'
                            : 'text-text-secondary hover:text-text-main'
                        }`}
                    >
                        {src.name}
                    </button>
                 ))}
            </div>

            {loading ? (
                <div className="flex-grow flex items-center justify-center">
                    <div className="flex flex-col items-center gap-2 text-text-secondary">
                        <SparklesIcon className="w-8 h-8 animate-pulse text-primary" />
                        <span>Loading...</span>
                    </div>
                </div>
            ) : (
                <div className="overflow-y-auto pr-2 flex-grow">
                   {source === 'recipes' ? renderMyRecipes() : renderCommunityPrompts()}
                </div>
            )}
        </div>
    );
};

export default AlchemistLibrary;