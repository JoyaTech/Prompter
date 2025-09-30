import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import FreePromptAggregator from '../../services/integrations/freePromptAggregator';

interface SyncStatus {
  isRunning: boolean;
  progress: number;
  currentSource: string;
  totalSources: number;
  completedSources: number;
  results: any[];
}

const PromptSyncDashboard: React.FC = () => {
  const { t } = useTranslation();
  const [syncStatus, setSyncStatus] = useState<SyncStatus>({
    isRunning: false,
    progress: 0,
    currentSource: '',
    totalSources: 0,
    completedSources: 0,
    results: []
  });

  const [aggregator] = useState(() => new FreePromptAggregator());
  const [sources, setSources] = useState<any[]>([]);

  useEffect(() => {
    // Load available sources
    const availableSources = aggregator.getAvailableSources();
    setSources(availableSources);
  }, [aggregator]);

  const handleSyncAllPrompts = async () => {
    setSyncStatus(prev => ({
      ...prev,
      isRunning: true,
      progress: 0,
      totalSources: sources.length,
      completedSources: 0,
      results: []
    }));

    try {
      console.log('🚀 Starting free prompt sync...');
      
      // Start the sync process
      const results = await aggregator.syncAllFreePrompts();
      
      setSyncStatus(prev => ({
        ...prev,
        isRunning: false,
        progress: 100,
        completedSources: results.length,
        results
      }));

      console.log('✅ Sync completed:', results);
      
    } catch (error) {
      console.error('❌ Sync failed:', error);
      setSyncStatus(prev => ({
        ...prev,
        isRunning: false,
        progress: 0
      }));
    }
  };

  const handleSyncSingleSource = async (sourceId: string) => {
    console.log(`🔄 Syncing source: ${sourceId}`);
    // Implementation for single source sync
  };

  const getTotalPrompts = () => {
    return syncStatus.results.reduce((total, result) => total + result.promptsImported, 0);
  };

  const getSuccessfulSources = () => {
    return syncStatus.results.filter(result => result.success).length;
  };

  return (
    <div className="prompt-sync-dashboard p-6 bg-card rounded-lg">
      <h2 className="text-2xl font-bold mb-6">{t('admin_prompt_sync_title')}</h2>
      
      {/* Sync Controls */}
      <div className="sync-controls mb-8 p-4 bg-background rounded-lg">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold">{t('sync_all_free_prompts')}</h3>
            <p className="text-sm text-text-secondary">
              {t('sync_description')} ({sources.length} {t('sources_available')})
            </p>
          </div>
          <button
            onClick={handleSyncAllPrompts}
            disabled={syncStatus.isRunning}
            className={`
              px-6 py-3 rounded-lg font-medium transition-colors
              ${syncStatus.isRunning 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-primary text-white hover:bg-primary/80'
              }
            `}
          >
            {syncStatus.isRunning ? (
              <span className="flex items-center space-x-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>{t('syncing')}</span>
              </span>
            ) : (
              t('sync_all_prompts')
            )}
          </button>
        </div>

        {/* Progress Bar */}
        {syncStatus.isRunning && (
          <div className="progress-section">
            <div className="flex justify-between text-sm mb-2">
              <span>{t('progress')}: {syncStatus.completedSources}/{syncStatus.totalSources}</span>
              <span>{syncStatus.progress.toFixed(0)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-primary h-2 rounded-full transition-all duration-300"
                style={{ width: `${syncStatus.progress}%` }}
              />
            </div>
            {syncStatus.currentSource && (
              <p className="text-sm text-text-secondary mt-2">
                {t('currently_syncing')}: {syncStatus.currentSource}
              </p>
            )}
          </div>
        )}

        {/* Sync Results Summary */}
        {syncStatus.results.length > 0 && (
          <div className="results-summary mt-4 p-4 bg-accent rounded-lg">
            <h4 className="font-semibold mb-2">{t('sync_results')}</h4>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-primary">{getTotalPrompts()}</div>
                <div className="text-sm text-text-secondary">{t('prompts_imported')}</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">{getSuccessfulSources()}</div>
                <div className="text-sm text-text-secondary">{t('successful_sources')}</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-orange-600">{syncStatus.results.length - getSuccessfulSources()}</div>
                <div className="text-sm text-text-secondary">{t('failed_sources')}</div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Sources List */}
      <div className="sources-list">
        <h3 className="text-lg font-semibold mb-4">{t('prompt_sources')}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {sources.map(source => {
            const result = syncStatus.results.find(r => r.source === source.id);
            
            return (
              <div key={source.id} className="source-card p-4 border border-border rounded-lg">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h4 className="font-medium">{source.name}</h4>
                    <p className="text-sm text-text-secondary">
                      {source.type} • {source.language.join(', ')}
                    </p>
                  </div>
                  
                  {result && (
                    <div className={`
                      w-3 h-3 rounded-full
                      ${result.success ? 'bg-green-500' : 'bg-red-500'}
                    `} />
                  )}
                </div>

                <div className="categories mb-3">
                  <div className="flex flex-wrap gap-1">
                    {source.categories.map((category: string) => (
                      <span
                        key={category}
                        className="px-2 py-1 text-xs bg-accent text-primary rounded-full"
                      >
                        {category}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="source-stats text-sm">
                  {result ? (
                    <div>
                      <p className={result.success ? 'text-green-600' : 'text-red-600'}>
                        {result.success 
                          ? `✅ ${result.promptsImported} prompts imported` 
                          : `❌ Sync failed`
                        }
                      </p>
                      {result.errors.length > 0 && (
                        <p className="text-red-500 text-xs mt-1">
                          {result.errors[0]}
                        </p>
                      )}
                    </div>
                  ) : (
                    <div className="flex justify-between items-center">
                      <span className="text-text-secondary">
                        Rate limit: {source.rateLimit.requests}/{source.rateLimit.perMinutes}min
                      </span>
                      <button
                        onClick={() => handleSyncSingleSource(source.id)}
                        disabled={syncStatus.isRunning}
                        className="px-3 py-1 text-xs bg-primary text-white rounded hover:bg-primary/80 disabled:opacity-50"
                      >
                        {t('sync')}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Implementation Instructions */}
      <div className="implementation-guide mt-8 p-4 bg-background rounded-lg">
        <h3 className="text-lg font-semibold mb-3">{t('implementation_guide')}</h3>
        <div className="space-y-3 text-sm">
          <div className="step">
            <strong>1. {t('setup_api_keys')}:</strong>
            <p className="text-text-secondary ml-4">
              Add GITHUB_TOKEN to your .env.local file for accessing GitHub repositories
            </p>
          </div>
          <div className="step">
            <strong>2. {t('configure_sources')}:</strong>
            <p className="text-text-secondary ml-4">
              Modify the freePromptSources array to add or remove prompt sources
            </p>
          </div>
          <div className="step">
            <strong>3. {t('schedule_syncing')}:</strong>
            <p className="text-text-secondary ml-4">
              Set up cron jobs or scheduled tasks to automatically sync prompts daily
            </p>
          </div>
          <div className="step">
            <strong>4. {t('database_integration')}:</strong>
            <p className="text-text-secondary ml-4">
              Replace localStorage with proper database storage for production use
            </p>
          </div>
        </div>
      </div>

      {/* Code Example */}
      <div className="code-example mt-6 p-4 bg-gray-900 rounded-lg">
        <h4 className="text-white font-semibold mb-2">{t('quick_implementation')}</h4>
        <pre className="text-green-400 text-sm overflow-x-auto">
{`// Add to your component or service
import FreePromptAggregator from './services/integrations/freePromptAggregator';

const aggregator = new FreePromptAggregator();

// Sync all free prompts
const results = await aggregator.syncAllFreePrompts();
console.log('Synced prompts:', results);

// Get sync statistics
const stats = aggregator.getSyncStatistics();
console.log('Sync stats:', stats);`}
        </pre>
      </div>
    </div>
  );
};

export default PromptSyncDashboard;