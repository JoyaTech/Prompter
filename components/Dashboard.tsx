import React, { useMemo } from 'react';
import { HistoryItem } from '../types';

interface DashboardProps {
  history: HistoryItem[];
  t: (key: string) => string;
}

const Dashboard: React.FC<DashboardProps> = ({ history, t }) => {
  const analysis = useMemo(() => {
    const topicCounts: Record<string, number> = {};
    let totalItemsWithTopics = 0;
    let compliantItems = 0;

    history.forEach(item => {
      if (item.alignment_notes && item.alignment_notes.toLowerCase().includes('no issues found')) {
        compliantItems++;
      }

      if (item.topics && item.topics.length > 0) {
        totalItemsWithTopics++;
        item.topics.forEach(topic => {
          topicCounts[topic] = (topicCounts[topic] || 0) + 1;
        });
      }
    });

    const sortedTopics = Object.entries(topicCounts)
      .sort(([, countA], [, countB]) => countB - countA)
      .slice(0, 5);

    const maxCount = sortedTopics.length > 0 ? sortedTopics[0][1] : 0;
    const complianceRate = history.length > 0 ? Math.round((compliantItems / history.length) * 100) : 100;

    return { sortedTopics, maxCount, complianceRate, totalItems: history.length };
  }, [history]);

  if (history.length === 0) {
    return (
      <div className="text-center p-12 text-gray-500">
        <h3 className="text-2xl font-semibold">{t('dashboard_title')}</h3>
        <p className="mt-4">{t('dashboard_no_data')}</p>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      <h2 className="text-3xl font-bold text-white border-b border-gray-700 pb-4">{t('dashboard_title')}</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <KPICard title={t('total_prompts')} value={analysis.totalItems} color="text-indigo-400" />
        <KPICard 
            title={t('dashboard_ethical_score')} 
            value={`${analysis.complianceRate}%`} 
            color={analysis.complianceRate > 90 ? 'text-green-400' : 'text-yellow-400'} 
        />
        <KPICard 
            title={t('est_tokens')} 
            value={Math.round(history.reduce((sum, item) => sum + (item.response.length / 4), 0))} 
            color="text-sky-400" 
        />
      </div>

      <div className="bg-gray-800/60 p-6 rounded-xl shadow-lg border border-gray-700">
        <h3 className="text-lg font-semibold text-gray-300 mb-4">{t('dashboard_topic_analysis')}</h3>
        <div className="space-y-4">
          {analysis.sortedTopics.length > 0 ? analysis.sortedTopics.map(([topic, count]) => {
            const widthPercent = analysis.maxCount > 0 ? (count / analysis.maxCount) * 100 : 0;
            return (
              <div key={topic} className="flex items-center gap-4 animate-fade-in">
                <span className="w-32 text-sm text-gray-400 truncate text-right">{topic}</span>
                <div className="flex-grow bg-gray-700 rounded-full h-6">
                  <div
                    className="h-full bg-indigo-500 rounded-full flex items-center justify-end pr-2 text-xs font-bold text-white transition-all duration-700 ease-out"
                    style={{ width: `${widthPercent}%` }}
                  >
                    {count}
                  </div>
                </div>
              </div>
            );
          }) : <p className="text-gray-500">{t('dashboard_no_data')}</p>}
        </div>
      </div>
    </div>
  );
};

interface KPICardProps {
    title: string;
    value: string | number;
    color: string;
}

const KPICard: React.FC<KPICardProps> = ({ title, value, color }) => (
    <div className="bg-gray-800/60 p-6 rounded-xl shadow-xl border border-gray-700">
      <p className="text-sm text-gray-400">{title}</p>
      <p className={`text-4xl font-extrabold mt-1 ${color}`}>{value}</p>
    </div>
);


export default Dashboard;