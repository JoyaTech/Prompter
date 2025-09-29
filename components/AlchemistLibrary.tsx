import React, { useState, useEffect } from 'react';
import { CommunityPrompt } from '../types';
import * as communityPromptService from '../services/communityPromptService';

interface AlchemistLibraryProps {
    t: (key: string) => string;
}

const AlchemistLibrary: React.FC<AlchemistLibraryProps> = ({ t }) => {
    const [prompts, setPrompts] = useState<CommunityPrompt[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPrompts = async () => {
            setLoading(true);
            const communityPrompts = await communityPromptService.getCommunityPrompts();
            setPrompts(communityPrompts);
            setLoading(false);
        };
        fetchPrompts();
    }, []);

    return (
        <div className="bg-card p-4 rounded-lg border border-border-color h-full">
            <h3 className="text-lg font-semibold text-text-main mb-4">{t('alchemist_library_title')}</h3>
            {loading ? (
                <p className="text-text-secondary">Loading prompts...</p>
            ) : (
                <ul className="space-y-2">
                    {prompts.map(prompt => (
                        <li key={prompt.id} className="bg-card-secondary p-3 rounded-md hover:bg-border-color cursor-pointer">
                            <p className="font-semibold text-text-main">{prompt.name}</p>
                            <p className="text-xs text-text-secondary mt-1">{prompt.description}</p>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default AlchemistLibrary;
