import React from 'react';
import { useTranslation } from 'react-i18next';

interface ChallengeCardProps {
  title: string;
  description: string;
  prompt: string;
  onStart: (prompt: string) => void;
}

const ChallengeCard: React.FC<ChallengeCardProps> = ({ title, description, prompt, onStart }) => {
  const { t } = useTranslation();
  return (
    <div className="bg-card-secondary p-4 rounded-lg flex flex-col justify-between">
      <div>
        <h4 className="font-bold text-text-main">{title}</h4>
        <p className="text-sm text-text-secondary mt-1">{description}</p>
      </div>
      <button
        onClick={() => onStart(prompt)}
        className="mt-4 w-full bg-primary text-white font-semibold py-2 rounded-md hover:bg-primary/90 transition-colors"
      >
        {t('challenge_start')}
      </button>
    </div>
  );
};

export default ChallengeCard;
