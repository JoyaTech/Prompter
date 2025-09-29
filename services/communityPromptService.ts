import { CommunityPrompt } from '../types';

// This is a mock service. In a real app, this would fetch data from a server.
const MOCK_PROMPTS: CommunityPrompt[] = [
    {
        id: 'cp-1',
        name: 'Creative Story Writer',
        description: 'Generates short, creative stories based on a simple premise.',
        prompt: 'You are a master storyteller. Write a short story (under 500 words) about {{topic}}. The story should have a surprising twist at the end.',
        downloads: 1204,
        author: 'AI_Wizard',
        tags: ['creative', 'storytelling', 'writing']
    },
    {
        id: 'cp-2',
        name: 'Technical Explainer',
        description: 'Explains complex technical topics in simple terms.',
        prompt: 'You are a patient and knowledgeable teacher. Explain the concept of {{concept}} to a complete beginner. Use analogies and simple language. Avoid jargon.',
        downloads: 876,
        author: 'CodeGuru',
        tags: ['technical', 'education', 'eli5']
    },
];

export const getCommunityPrompts = async (): Promise<CommunityPrompt[]> => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return MOCK_PROMPTS;
};
