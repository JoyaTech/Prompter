import React, { useState, useEffect } from 'react';
import { CommunityPrompt } from '../types';
import * as communityPromptService from '../services/communityPromptService';
import { SaveIcon, UserIcon, DownloadIcon, CheckIcon } from './icons';

interface AlchemistLibraryProps {
    t: (key: string) => string;
    onSavePrompt: (name: string, text: string) => void;
}

const AlchemistLibrary: React.FC<AlchemistLibraryProps> = ({ t, onSavePrompt }) => {
    const [prompts, setPrompts] = useState<CommunityPrompt[]>([]);
    const [loading, setLoading] = useState(true);
    const [justAddedId, setJustAddedId] = useState<string | null>(null);

    useEffect(() => {
        const fetchPrompts = async () => {
            setLoading(true);
            const communityPrompts = await communityPromptService.getCommunityPrompts();
            setPrompts(communityPrompts);
            setLoading(false);
        };
        fetchPrompts();
    }, []);

    const handleDownload = (prompt: CommunityPrompt) => {
        onSavePrompt(prompt.name, prompt.prompt);
        setJustAddedId(prompt.id);
        setTimeout(() => setJustAddedId(null), 2000); // Reset after 2 seconds
    };

    return (
        <div className="bg-card p-4 rounded-lg border border-border-color h-full flex flex-col">
            <h3 className="text-lg font-semibold text-text-main mb-4">{t('alchemist_library_title')}</h3>
            {loading ? (
                <div className="flex-grow flex items-center justify-center">
                    <p className="text-text-secondary">Loading prompts...</p>
                </div>
            ) : (
                <div className="overflow-y-auto pr-2 flex-grow">
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
                                        <div className="flex items-center gap-1.5" title="Downloads">
                                            <DownloadIcon className="w-4 h-4" />
                                            <span className="font-medium">{prompt.downloads.toLocaleString()}</span>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => handleDownload(prompt)}
                                        disabled={justAddedId === prompt.id}
                                        className={`w-full text-center px-3 py-1.5 text-xs font-semibold text-white rounded-md transition-all flex items-center justify-center gap-2 
                                        ${justAddedId === prompt.id ? 'bg-green-600 cursor-default' : 'bg-primary hover:opacity-90'}`}
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
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default AlchemistLibrary;
