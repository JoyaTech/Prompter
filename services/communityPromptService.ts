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
             // A more robust parser for "act","prompt" format
            const parts = line.match(/"(.*?)"/g);
            if (parts && parts.length === 2) {
                const act = parts[0].slice(1, -1).replace(/""/g, '"');
                const prompt = parts[1].slice(1, -1).replace(/""/g, '"');
                
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

// FIX: The previous source for engineering prompts was returning a 404 error.
// Switched to a new, reliable source from LINE Corp and updated the author attribution.
// The existing CSV parser is robust enough for the new format.
const ENGINEERING_PROMPTS_URL = 'https://raw.githubusercontent.com/line/prompt-engineering-template/main/prompts.csv';

export const fetchEngineeringPrompts = async (): Promise<CommunityPrompt[]> => {
    try {
        const response = await fetch(ENGINEERING_PROMPTS_URL);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const csvText = await response.text();
        const lines = csvText.trim().split('\n').slice(1); // remove header
        const prompts: CommunityPrompt[] = [];

        for (const line of lines) {
            if (!line.trim()) continue; // Skip empty lines
            
            // A more robust regex-based parser for CSV format that handles quoted and unquoted fields.
            const parts = line.match(/(".*?"|[^",\n\r]+)(?=\s*,|\s*$)/g);
            
            if (parts && parts.length === 4) {
                // Strip outer quotes from each part if they exist
                const [category, subcategory, title, promptText] = parts.map(p => 
                    p.startsWith('"') && p.endsWith('"') ? p.slice(1, -1) : p
                );

                // Unescape double quotes ("") within a field
                const finalPromptText = promptText.replace(/""/g, '"');
                const finalCategory = category.replace(/""/g, '"');
                const finalSubcategory = subcategory.replace(/""/g, '"');
                const finalTitle = title.replace(/""/g, '"');

                prompts.push({
                    id: `eng-${finalTitle.replace(/\s+/g, '-').toLowerCase()}`,
                    name: finalTitle,
                    prompt: finalPromptText,
                    description: `Category: ${finalCategory} - ${finalSubcategory}.`,
                    author: 'LINE Corp',
                    downloads: 0,
                    tags: [finalCategory.toLowerCase(), finalSubcategory.toLowerCase(), 'engineering'],
                });
            }
        }
        return prompts;
    } catch (error) {
        console.error("Failed to fetch Engineering prompts:", error);
        return [];
    }
}


const MOCK_HEBREW_PROMPTS: CommunityPrompt[] = [
    {
        id: 'hp-1',
        name: 'כותב סיפורים יצירתי',
        description: 'יוצר סיפורים קצרים ויצירתיים על בסיס הנחת יסוד פשוטה.',
        prompt: 'אתה מספר סיפורים אומן. כתוב סיפור קצר (עד 500 מילים) על {{topic}}. הסיפור צריך להכיל טוויסט מפתיע בסוף.',
        downloads: 150,
        author: 'GenSpark HE',
        tags: ['creative', 'storytelling', 'writing', 'hebrew']
      },
      {
        id: 'hp-2',
        name: 'מסביר טכני',
        description: 'מסביר נושאים טכניים מורכבים במונחים פשוטים.',
        prompt: 'אתה מורה סבלני ובעל ידע. הסבר את המושג {{concept}} למתחיל גמור. השתמש באנלוגיות ושפה פשוטה. הימנע מז\'רגון.',
        downloads: 95,
        author: 'GenSpark HE',
        tags: ['technical', 'education', 'eli5', 'hebrew']
      }
];

export const getHebrewPrompts = async (): Promise<CommunityPrompt[]> => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return MOCK_HEBREW_PROMPTS;
};