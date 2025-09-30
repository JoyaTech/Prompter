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

const Dashboard: React.FC<DashboardProps> = ({ onStartChallenge, onSelectHistory }) => {
  const { t } = useTranslation();

  const challenges = [
    {
      title: t('challenge_1_title'),
      description: t('challenge_1_desc'),
      prompt: "Write a 100-word story about a robot who discovers music for the first time. The story should convey a sense of wonder and transformation.",
    },
    {
      title: t('challenge_2_title'),
      description: t('challenge_2_desc'),
      prompt: "You are a friendly and patient teacher. Explain JavaScript promises to a 10-year-old using a simple analogy, like ordering food at a restaurant.",
    },
    {
      title: t('challenge_3_title'),
      description: t('challenge_3_desc'),
      prompt: "You are a creative marketing expert. Generate three catchy and memorable slogans for a new brand of sneakers made from recycled ocean plastic. Each slogan should be no more than 7 words.",
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-text-main">{t('dashboard_welcome_title')}</h2>
        <p className="mt-1 text-text-secondary">{t('dashboard_welcome_desc')}</p>
      </div>

      <div>
        <h3 className="text-xl font-semibold text-text-main mb-4">{t('dashboard_challenges_title')}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {challenges.map((challenge, index) => (
            <ChallengeCard
              key={index}
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
