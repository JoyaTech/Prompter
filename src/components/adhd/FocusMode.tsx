import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

interface FocusModeProps {
  isActive: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}

interface FocusSettings {
  hideDistractions: boolean;
  timerEnabled: boolean;
  timerDuration: number; // in minutes
  breakReminders: boolean;
  soundAlerts: boolean;
  visualCues: boolean;
}

const FocusMode: React.FC<FocusModeProps> = ({ isActive, onToggle, children }) => {
  const { t } = useTranslation();
  const [settings, setSettings] = useState<FocusSettings>({
    hideDistractions: true,
    timerEnabled: true,
    timerDuration: 25, // Pomodoro technique default
    breakReminders: true,
    soundAlerts: false,
    visualCues: true
  });
  
  const [remainingTime, setRemainingTime] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isTimerRunning && remainingTime > 0) {
      interval = setInterval(() => {
        setRemainingTime(prev => {
          if (prev <= 1) {
            setIsTimerRunning(false);
            handleTimerComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    
    return () => clearInterval(interval);
  }, [isTimerRunning, remainingTime]);

  const handleTimerComplete = () => {
    if (settings.soundAlerts) {
      // Play notification sound
      const audio = new Audio('/sounds/timer-complete.mp3');
      audio.play().catch(() => {
        // Handle audio play failure silently
      });
    }
    
    if (settings.breakReminders) {
      // Show break reminder
      alert(t('adhd_timer_complete_break_reminder'));
    }
  };

  const startTimer = () => {
    setRemainingTime(settings.timerDuration * 60);
    setIsTimerRunning(true);
  };

  const pauseTimer = () => {
    setIsTimerRunning(false);
  };

  const resetTimer = () => {
    setIsTimerRunning(false);
    setRemainingTime(settings.timerDuration * 60);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const focusOverlayClass = isActive && settings.hideDistractions 
    ? 'focus-mode-overlay' 
    : '';

  return (
    <div className={`focus-mode-container ${isActive ? 'active' : ''}`}>
      {/* Focus Mode Controls */}
      <div className="focus-controls mb-4">
        <div className="flex items-center justify-between bg-card p-4 rounded-lg border">
          <div className="flex items-center space-x-4">
            <button
              onClick={onToggle}
              className={`
                px-4 py-2 rounded-lg font-medium transition-colors
                ${isActive 
                  ? 'bg-green-500 text-white hover:bg-green-600' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }
              `}
            >
              <span className="flex items-center space-x-2">
                <span className={`w-2 h-2 rounded-full ${isActive ? 'bg-white' : 'bg-gray-400'}`} />
                <span>{isActive ? t('adhd_focus_mode_active') : t('adhd_focus_mode_inactive')}</span>
              </span>
            </button>

            {isActive && settings.timerEnabled && (
              <div className="flex items-center space-x-2">
                <div className="text-2xl font-mono font-bold text-primary">
                  {formatTime(remainingTime)}
                </div>
                <div className="flex space-x-1">
                  {!isTimerRunning ? (
                    <button
                      onClick={startTimer}
                      className="p-2 bg-primary text-white rounded hover:bg-primary/80 transition-colors"
                      title={t('adhd_start_timer')}
                    >
                      ▶️
                    </button>
                  ) : (
                    <button
                      onClick={pauseTimer}
                      className="p-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition-colors"
                      title={t('adhd_pause_timer')}
                    >
                      ⏸️
                    </button>
                  )}
                  <button
                    onClick={resetTimer}
                    className="p-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
                    title={t('adhd_reset_timer')}
                  >
                    🔄
                  </button>
                </div>
              </div>
            )}
          </div>

          <button
            onClick={() => setShowSettings(!showSettings)}
            className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
            title={t('adhd_focus_settings')}
          >
            ⚙️
          </button>
        </div>

        {/* Settings Panel */}
        {showSettings && (
          <div className="mt-4 bg-card p-4 rounded-lg border">
            <h3 className="text-lg font-semibold mb-3">{t('adhd_focus_settings')}</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={settings.hideDistractions}
                  onChange={(e) => setSettings(prev => ({ ...prev, hideDistractions: e.target.checked }))}
                  className="rounded"
                />
                <span>{t('adhd_hide_distractions')}</span>
              </label>

              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={settings.timerEnabled}
                  onChange={(e) => setSettings(prev => ({ ...prev, timerEnabled: e.target.checked }))}
                  className="rounded"
                />
                <span>{t('adhd_enable_timer')}</span>
              </label>

              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={settings.breakReminders}
                  onChange={(e) => setSettings(prev => ({ ...prev, breakReminders: e.target.checked }))}
                  className="rounded"
                />
                <span>{t('adhd_break_reminders')}</span>
              </label>

              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={settings.soundAlerts}
                  onChange={(e) => setSettings(prev => ({ ...prev, soundAlerts: e.target.checked }))}
                  className="rounded"
                />
                <span>{t('adhd_sound_alerts')}</span>
              </label>

              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={settings.visualCues}
                  onChange={(e) => setSettings(prev => ({ ...prev, visualCues: e.target.checked }))}
                  className="rounded"
                />
                <span>{t('adhd_visual_cues')}</span>
              </label>

              <div className="flex items-center space-x-3">
                <label htmlFor="timer-duration">{t('adhd_timer_duration')}:</label>
                <select
                  id="timer-duration"
                  value={settings.timerDuration}
                  onChange={(e) => setSettings(prev => ({ ...prev, timerDuration: parseInt(e.target.value) }))}
                  className="bg-background border border-border rounded px-2 py-1"
                >
                  <option value={15}>15 {t('minutes')}</option>
                  <option value={25}>25 {t('minutes')}</option>
                  <option value={30}>30 {t('minutes')}</option>
                  <option value={45}>45 {t('minutes')}</option>
                  <option value={60}>60 {t('minutes')}</option>
                </select>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Progress Bar */}
      {isActive && settings.timerEnabled && settings.visualCues && (
        <div className="progress-container mb-4">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-primary h-2 rounded-full transition-all duration-1000"
              style={{ 
                width: `${((settings.timerDuration * 60 - remainingTime) / (settings.timerDuration * 60)) * 100}%` 
              }}
            />
          </div>
        </div>
      )}

      {/* Content with focus overlay */}
      <div className={focusOverlayClass}>
        {children}
      </div>

      {/* Focus Mode Styles */}
      <style jsx>{`
        .focus-mode-overlay {
          position: relative;
        }
        
        .focus-mode-overlay::before {
          content: '';
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.3);
          backdrop-filter: blur(2px);
          z-index: 10;
          pointer-events: none;
        }
        
        .focus-mode-overlay > * {
          position: relative;
          z-index: 11;
        }
        
        .focus-mode-container.active .focus-controls {
          position: sticky;
          top: 0;
          z-index: 12;
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(10px);
          border-radius: 0 0 1rem 1rem;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        }
      `}</style>
    </div>
  );
};

export default FocusMode;