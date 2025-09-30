import React, { useState, useEffect } from 'react';
import { HistoryItem, EditorState, PromptComponent } from '../types';
import OutputDisplay from './OutputDisplay';
import { generateContent } from '../services/geminiService';
import { useAppContext } from './AppContext';

interface ComparisonEditorProps {
    promptA: string;
    promptB: string;
    onDeclareWinner: (winningPrompt: string) => void;
}

const ComparisonEditor: React.FC<ComparisonEditorProps> = ({ promptA, promptB, onDeclareWinner }) => {
    const { handleAddHistory, handleUpdateHistoryItem } = useAppContext();

    const [outputA, setOutputA] = useState('');
    const [outputB, setOutputB] = useState('');
    const [isLoadingA, setIsLoadingA] = useState(false);
    const [isLoadingB, setIsLoadingB] = useState(false);
    const [historyItemA, setHistoryItemA] = useState<HistoryItem | null>(null);
    const [historyItemB, setHistoryItemB] = useState<HistoryItem | null>(null);
    
    const runPrompt = async (
        prompt: string, 
        setIsLoading: (loading: boolean) => void, 
        setOutput: (output: string) => void,
        setHistoryItem: (item: HistoryItem) => void
    ) => {
        if (!prompt) return;
        setIsLoading(true);
        setOutput('');
        try {
            const response = await generateContent(prompt);
            const text = response.text ?? '';
            setOutput(text);
            const newItem = handleAddHistory(prompt, text);
            setHistoryItem(newItem);
        } catch (error) {
            console.error('Error generating content:', error);
            setOutput('An error occurred.');
        } finally {
            setIsLoading(false);
        }
    };
    
    useEffect(() => {
        runPrompt(promptA, setIsLoadingA, setOutputA, setHistoryItemA);
        runPrompt(promptB, setIsLoadingB, setOutputB, setHistoryItemB);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [promptA, promptB]);

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 h-full">
            <OutputDisplay
                output={outputA}
                isLoading={isLoadingA}
                prompt={promptA}
                historyItem={historyItemA}
                onUpdateHistoryItem={handleUpdateHistoryItem}
                onDeclareWinner={onDeclareWinner}
                competingRating={historyItemB?.rating}
            />
            <OutputDisplay
                output={outputB}
                isLoading={isLoadingB}
                prompt={promptB}
                historyItem={historyItemB}
                onUpdateHistoryItem={handleUpdateHistoryItem}
                onDeclareWinner={onDeclareWinner}
                competingRating={historyItemA?.rating}
            />
        </div>
    );
};

export default ComparisonEditor;
