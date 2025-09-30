import { CommunityPrompt } from '../types';

// This is a mock service for the internal community prompts.
const MOCK_PROMPTS: CommunityPrompt[] = [
    {
        id: 'cp-1',
        name: 'Creative Story Writer',
        description: 'Generates short, creative stories based on a simple premise.',
        prompt: 'You are a master storyteller. Write a short story (under 500 words) about {{topic}}. The story should have a surprising twist at the end.',
        downloads: 1204,
        author: 'GenSpark',
        tags: ['creative', 'storytelling', 'writing']
    },
    {
        id: 'cp-2',
        name: 'Technical Explainer',
        description: 'Explains complex technical topics in simple terms.',
        prompt: 'You are a patient and knowledgeable teacher. Explain the concept of {{concept}} to a complete beginner. Use analogies and simple language. Avoid jargon.',
        downloads: 876,
        author: 'GenSpark',
        tags: ['technical', 'education', 'eli5']
    },
];

export const getGenSparkPrompts = async (): Promise<CommunityPrompt[]> => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return MOCK_PROMPTS;
};

const AWESOME_PROMPTS_URL = 'https://raw.githubusercontent.com/f/awesome-chatgpt-prompts/main/prompts.csv';

export const fetchAwesomePrompts = async (): Promise<CommunityPrompt[]> => {
    try {
        const response = await fetch(AWESOME_PROMPTS_URL);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const csvText = await response.text();
        const lines = csvText.trim().split('\n').slice(1); // remove header
        const prompts: CommunityPrompt[] = [];

        for (const line of lines) {
            // This is a simple parser for the specific CSV format: "act","prompt"
            // It assumes the prompt content itself does not contain the '","' separator
            const separatorIndex = line.indexOf('","');
            if (line.startsWith('"') && separatorIndex > 0) {
                const act = line.substring(1, separatorIndex);
                const prompt = line.substring(separatorIndex + 3, line.length - 1);
                
                prompts.push({
                    id: `acp-${act.replace(/\s+/g, '-').toLowerCase()}`,
                    name: act,
                    prompt: prompt,
                    description: prompt.substring(0, 100) + (prompt.length > 100 ? '...' : ''),
                    author: 'Awesome-ChatGPT',
                    downloads: 0, // This info is not available from the source
                    tags: ['awesome-chatgpt']
                });
            }
        }
        return prompts;
    } catch (error) {
        console.error("Failed to fetch Awesome ChatGPT prompts:", error);
        return []; // Return empty array on error to prevent UI crash
    }
};

const ENGINEERING_PROMPTS_URL = 'https://raw.githubusercontent.com/prm-engineering/chat-gpt-prompts/main/prompts.json';

export const fetchEngineeringPrompts = async (): Promise<CommunityPrompt[]> => {
    try {
        const response = await fetch(ENGINEERING_PROMPTS_URL);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const json = await response.json();
        const prompts: CommunityPrompt[] = json.map((item: { title: string, prompt: string }) => ({
            id: `eng-${item.title.replace(/\s+/g, '-').toLowerCase()}`,
            name: item.title,
            prompt: item.prompt,
            description: item.prompt.substring(0, 100) + (item.prompt.length > 100 ? '...' : ''),
            author: 'prm-engineering',
            downloads: 0,
            tags: ['engineering', 'professional'],
        }));
        return prompts;
    } catch (error) {
        console.error("Failed to fetch Engineering prompts:", error);
        return [];
    }
}