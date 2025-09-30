import React from 'react';
import { HistoryItem } from '../types';

interface DashboardProps {
  history: HistoryItem[];
  t: (key: string) => string;
}

const StatCard: React.FC<{ title: string; value: string | number; }> = ({ title, value }) => (
    <div className="bg-gray-800/50 p-6 rounded-lg border border-gray-700">
        <h4 className="text-sm font-medium text-gray-400">{title}</h4>
        <p className="text-3xl font-bold text-white mt-2">{value}</p>
    </div>
);

const Dashboard: React.FC<DashboardProps> = ({ history, t }) => {
  return (
    <div className="space-y-8">
      <div>
          <h2 className="text-2xl font-bold text-white">{t('dashboard_title')}</h2>
          <p className="mt-1 text-gray-400">{t('dashboard_desc')}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard title={t('dashboard_total_runs')} value={history.length} />
          <StatCard title={t('dashboard_avg_response_time')} value="~1.2s" />
          <StatCard title={t('dashboard_success_rate')} value="98%" />
      </div>

       <div>
        <h3 className="text-lg font-semibold text-gray-300 mb-4">{t('dashboard_recent_activity')}</h3>
        <div className="bg-gray-800/50 border border-gray-700 rounded-lg">
          <ul className="divide-y divide-gray-700">
            {history.slice(0, 5).map(item => (
              <li key={item.id} className="p-4">
                <p className="text-sm text-gray-300 truncate font-medium">{item.prompt}</p>
                <p className="text-xs text-gray-500 mt-1">{item.timestamp.toLocaleString()}</p>
              </li>
            ))}
             {history.length === 0 && (
                <li className="p-4 text-center text-sm text-gray-500">No activity yet.</li>
             )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
