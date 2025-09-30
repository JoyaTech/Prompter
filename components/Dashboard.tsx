import React from 'react';
import { useTranslation } from 'react-i18next';
import { HistoryItem } from '../types';
import ChallengeCard from './ChallengeCard';
import History from './History';
import SavedPrompts from './SavedPrompts';

interface DashboardProps {
  onStartChallenge: (prompt: string) => void;
  onSelectHistory: (item: HistoryItem) => void;
}

const challenges = [
  {
    title: 'Your First Prompt',
    description: 'Learn the basics by crafting a simple "hello world" prompt.',
    prompt: 'You are a friendly assistant. Greet the user and ask how you can help them today.',
  },
  {
    title: 'Creative Storyteller',
    description: 'Generate a short story opening based on three random words.',
    prompt: 'Write the opening paragraph of a fantasy story that includes the words "dragon", "library", and "sandwich".',
  },
  {
    title: 'Code Generation',
    description: 'Create a Python function based on a simple instruction.',
    prompt: 'Write a Python function that takes a list of numbers and returns the sum of all even numbers in the list.',
  },
];

const Dashboard: React.FC<DashboardProps> = ({ onStartChallenge, onSelectHistory }) => {
  const { t } = useTranslation();

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-text-main">{t('dashboard_welcome')}</h2>
        <p className="mt-1 text-text-secondary">{t('dashboard_description')}</p>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-text-secondary mb-3">{t('dashboard_challenges')}</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {challenges.map(challenge => (
            <ChallengeCard
              key={challenge.title}
              title={challenge.title}
              description={challenge.description}
              prompt={challenge.prompt}
              onStart={onStartChallenge}
            />
          ))}
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <History onSelectHistory={onSelectHistory} />
        <SavedPrompts onSelectPrompt={onStartChallenge} />
      </div>
    </div>
  );
};

export default Dashboard;
