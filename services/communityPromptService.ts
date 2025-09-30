import { CommunityPrompt } from '../types';

// This is a mock service for the internal community prompts.
const MOCK_PROMPTS: CommunityPrompt[] = [
    {
        id: 'cp-1',
        name: 'Creative Story Writer',
        description: 'Generates short, creative stories based on a simple premise.',
        prompt: 'You are a master storyteller. Write a short story (under 500 words) about {{topic}}. The story should have a surprising twist at the end.',
        downloads: 1204,
        author: 'Flow-It Magical',
        tags: ['creative', 'storytelling', 'writing']
    },
    {
        id: 'cp-2',
        name: 'Technical Explainer',
        description: 'Explains complex technical topics in simple terms.',
        prompt: 'You are a patient and knowledgeable teacher. Explain the concept of {{concept}} to a complete beginner. Use analogies and simple language. Avoid jargon.',
        downloads: 876,
        author: 'Flow-It Magical',
        tags: ['technical', 'education', 'eli5']
    },
];

export const getGenSparkPrompts = async (): Promise<CommunityPrompt[]> => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return MOCK_PROMPTS;
};

const AWESOME_PROMPTS_URL = 'https://raw.githubusercontent.com/f/awesome-chatgpt-prompts/main/prompts.csv';
const ENGINEERING_PROMPTS_URL = 'https://raw.githubusercontent.com/line/prompt-engineering-template/main/prompts.csv';

/**
 * A robust CSV parser that handles quoted fields containing commas and newlines.
 * @param csvText The raw CSV string.
 * @returns An array of string arrays, where each inner array represents a row.
 */
const parseCsvRobust = (csvText: string): string[][] => {
    const rows = [];
    let currentRow: string[] = [];
    let currentField = '';
    let inQuotedField = false;

    for (let i = 0; i < csvText.length; i++) {
        const char = csvText[i];

        if (inQuotedField) {
            if (char === '"') {
                // Check for escaped quote ("")
                if (i + 1 < csvText.length && csvText[i + 1] === '"') {
                    currentField += '"';
                    i++; // Skip the next quote
                } else {
                    inQuotedField = false;
                }
            } else {
                currentField += char;
            }
        } else {
            switch (char) {
                case '"':
                    inQuotedField = true;
                    break;
                case ',':
                    currentRow.push(currentField);
                    currentField = '';
                    break;
                case '\n':
                case '\r':
                    if (i > 0 && csvText[i - 1] !== '\r' && csvText[i - 1] !== '\n') {
                        currentRow.push(currentField);
                        rows.push(currentRow);
                        currentRow = [];
                        currentField = '';
                    }
                    break;
                default:
                    currentField += char;
            }
        }
    }
    // Add the last field and row
    if (currentField || currentRow.length > 0) {
        currentRow.push(currentField);
        rows.push(currentRow);
    }
    return rows;
};


export const fetchAwesomePrompts = async (): Promise<CommunityPrompt[]> => {
    try {
        const response = await fetch(AWESOME_PROMPTS_URL);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        
        const csvText = await response.text();
        const parsedRows = parseCsvRobust(csvText);
        
        // Assuming headers are 'act', 'prompt'
        const prompts: CommunityPrompt[] = parsedRows.slice(1).map((row, index) => {
            if (row.length >= 2) {
                const [act, prompt] = row;
                 return {
                    id: `acp-${index}-${act.replace(/\s+/g, '-').toLowerCase()}`,
                    name: act,
                    prompt: prompt,
                    description: prompt.substring(0, 100) + (prompt.length > 100 ? '...' : ''),
                    author: 'Awesome-ChatGPT',
                    downloads: 0,
                    tags: ['awesome-chatgpt']
                };
            }
            return null;
        }).filter((p): p is CommunityPrompt => p !== null);
        
        return prompts;

    } catch (error) {
        console.error("Failed to fetch Awesome ChatGPT prompts:", error);
        return [];
    }
};

export const fetchEngineeringPrompts = async (): Promise<CommunityPrompt[]> => {
    try {
        const response = await fetch(ENGINEERING_PROMPTS_URL);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
       
        const csvText = await response.text();
        const parsedRows = parseCsvRobust(csvText);

        // Assuming headers are 'category', 'subcategory', 'title', 'prompt'
        const prompts: CommunityPrompt[] = parsedRows.slice(1).map((row, index) => {
            if (row.length >= 4) {
                 const [category, subcategory, title, promptText] = row;
                 return {
                    id: `eng-${index}-${title.replace(/\s+/g, '-').toLowerCase()}`,
                    name: title,
                    prompt: promptText,
                    description: `Category: ${category} - ${subcategory}.`,
                    author: 'LINE Corp',
                    downloads: 0,
                    tags: [category.toLowerCase(), subcategory.toLowerCase(), 'engineering'],
                };
            }
            return null;
        }).filter((p): p is CommunityPrompt => p !== null);

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
        author: 'Flow-It Magical HE',
        tags: ['creative', 'storytelling', 'writing', 'hebrew']
      },
      {
        id: 'hp-2',
        name: 'מסביר טכני',
        description: 'מסביר נושאים טכניים מורכבים במונחים פשוטים.',
        prompt: 'אתה מורה סבלני ובעל ידע. הסבר את המושג {{concept}} למתחיל גמור. השתמש באנלוגיות ושפה פשוטה. הימנע מז\'רגון.',
        downloads: 95,
        author: 'Flow-It Magical HE',
        tags: ['technical', 'education', 'eli5', 'hebrew']
      }
];

export const getHebrewPrompts = async (): Promise<CommunityPrompt[]> => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return MOCK_HEBREW_PROMPTS;
};