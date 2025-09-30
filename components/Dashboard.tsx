import React from 'react';
import { HistoryItem } from '../types';
import { useAppContext } from './AppContext';

interface DashboardProps {
  t: (key: string) => string;
}

const StatCard: React.FC<{ title: string; value: string | number; }> = ({ title, value }) => (
    <div className="bg-card p-6 rounded-lg border border-border-color">
        <h4 className="text-sm font-medium text-text-secondary">{title}</h4>
        <p className="text-3xl font-bold text-text-main mt-2">{value}</p>
    </div>
);

const Dashboard: React.FC<DashboardProps> = ({ t }) => {
  const { history } = useAppContext();

  const successRate = () => {
    const ratedItems = history.filter(item => typeof item.rating === 'number' && item.rating > 0);
    if (ratedItems.length === 0) return 'N/A';
    const successfulItems = ratedItems.filter(item => item.rating! >= 4);
    return `${Math.round((successfulItems.length / ratedItems.length) * 100)}%`;
  };

  return (
    <div className="space-y-8">
      <div>
          <h2 className="text-2xl font-bold text-text-main">{t('dashboard_title')}</h2>
          <p className="mt-1 text-text-secondary">{t('dashboard_desc')}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard title={t('dashboard_total_runs')} value={history.length} />
          <StatCard title={t('dashboard_avg_response_time')} value="~1.2s" />
          <StatCard title={t('dashboard_success_rate')} value={successRate()} />
      </div>

       <div>
        <h3 className="text-lg font-semibold text-text-secondary mb-4">{t('dashboard_recent_activity')}</h3>
        <div className="bg-card border border-border-color rounded-lg">
          <ul className="divide-y divide-border-color">
            {history.slice(0, 5).map(item => (
              <li key={item.id} className="p-4">
                <p className="text-sm text-text-main truncate font-medium">{item.prompt}</p>
                <p className="text-xs text-text-secondary mt-1">{item.timestamp.toLocaleString()}</p>
              </li>
            ))}
             {history.length === 0 && (
                <li className="p-4 text-center text-sm text-text-secondary">No activity yet.</li>
             )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;