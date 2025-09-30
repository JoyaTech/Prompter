import { CommunityPrompt } from '../types';

const MOCK_PROMPTS: CommunityPrompt[] = [
  {
    id: 'comm-1',
    name: 'Socratic Tutor',
    prompt: 'You are an AI tutor that uses the Socratic method. Ask me questions to help me understand a topic without giving me the answer directly. Start by asking what I want to learn about.',
    description: 'A prompt to turn the AI into a helpful tutor that guides learning through questions.',
    author: 'AI Enthusiast',
    downloads: 1250,
    tags: ['education', 'tutor', 'socratic'],
  },
  {
    id: 'comm-2',
    name: 'Creative Story Starter',
    prompt: 'Generate an intriguing first paragraph for a fantasy story involving a lost map, a talking animal, and a city in the clouds. The tone should be mysterious and adventurous.',
    description: 'A great prompt to kickstart creative writing for a fantasy novel.',
    author: 'Fantasy Writer',
    downloads: 876,
    tags: ['creative writing', 'storytelling', 'fantasy'],
  },
  {
    id: 'comm-3',
    name: 'Code Review Assistant',
    prompt: 'Act as a senior software engineer reviewing a code snippet. Provide constructive feedback focusing on clarity, efficiency, and potential bugs. Identify at least three areas for improvement. Here is the code: {{code_snippet}}',
    description: 'A prompt designed to get high-quality feedback on code.',
    author: 'DevTools Pro',
    downloads: 2300,
    tags: ['developer tools', 'code review', 'programming'],
  },
];

export const getCommunityPrompts = async (filter?: string): Promise<CommunityPrompt[]> => {
  console.warn("DEV MODE: Using mocked API response for getCommunityPrompts.");
  await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay
  if (!filter) {
    return MOCK_PROMPTS;
  }
  return MOCK_PROMPTS.filter(p => 
    p.name.toLowerCase().includes(filter.toLowerCase()) || 
    p.tags.some(tag => tag.toLowerCase().includes(filter.toLowerCase()))
  );
};
