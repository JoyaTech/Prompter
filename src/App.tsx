import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { v4 as uuidv4 } from 'uuid';

// Import components with correct paths
import Sidebar from './components/common/Sidebar';
import Header from './components/common/Header';
import Dashboard from './components/common/Dashboard';
import PromptEditor from './components/common/PromptEditor';
import ThemeCustomizer from './components/common/ThemeCustomizer';
import AlchemistPage from './components/common/AlchemistPage';

// New Alchemist components
import FocusMode from './components/adhd/FocusMode';
import TaskBreakdown from './components/adhd/TaskBreakdown';
import MusicProductionHub from './components/music/MusicProductionHub';

// Types and services
import { Prompt, HistoryItem } from './types/types';
import * as dataService from './services/dataService';

// Import enhanced i18n
import './locales/i18n';
import { getCurrentLanguage, isRTL, switchLanguage } from './locales/i18n';

// A simple challenge prompt to demonstrate loading.
const CHALLENGE_PROMPT = "You are a travel agent specializing in Israeli destinations. A customer wants to book a 7-day trip to Israel for a family of four on a budget of $3000. Provide three distinct options including flights, accommodation, and two cultural activities for each option. Present the options in a markdown table and include kosher food considerations.";

// Hebrew challenge prompt
const HEBREW_CHALLENGE_PROMPT = "אתה סוכן נסיעות המתמחה בישראל. לקוח רוצה להזמין נסיעה של 7 ימים בישראל למשפחה של ארבעה בתקציב של 12,000 שקל. ספק שלוש אפשרויות שונות כולל טיסות, לינה ושני אטרקציות תרבותיות לכל אפשרות. הצג את האפשרויות בטבלת markdown וכלול שיקולי אוכל כשר.";

const App: React.FC = () => {
  const { t } = useTranslation();
  const [view, setView] = useState('dashboard');
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [challengeToLoad, setChallengeToLoad] = useState<string | null>(null);
  
  // New Alchemist state
  const [focusModeActive, setFocusModeActive] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState(getCurrentLanguage());
  const [isRTLLayout, setIsRTLLayout] = useState(isRTL());

  useEffect(() => {
    setPrompts(dataService.getPrompts());
    setHistory(dataService.getHistory());
    
    // Load appropriate challenge based on language
    const hasSeenChallenge = localStorage.getItem('seen-challenge');
    if (!hasSeenChallenge) {
      const challenge = currentLanguage === 'he' ? HEBREW_CHALLENGE_PROMPT : CHALLENGE_PROMPT;
      setChallengeToLoad(challenge);
    }

    // Update layout direction
    setIsRTLLayout(isRTL());
  }, [currentLanguage]);

  // Language switching handler
  const handleLanguageChange = (newLanguage: string) => {
    switchLanguage(newLanguage);
    setCurrentLanguage(newLanguage);
    setIsRTLLayout(isRTL());
  };

  const handleChallengeLoaded = () => {
    setChallengeToLoad(null);
    localStorage.setItem('seen-challenge', 'true');
  };

  const handleSavePrompt = (name: string, text: string) => {
    const newPrompt = { id: uuidv4(), name, text };
    const updatedPrompts = [...prompts, newPrompt];
    setPrompts(updatedPrompts);
    dataService.savePrompts(updatedPrompts);
  };

  const handleDeletePrompt = (id: string) => {
    const updatedPrompts = prompts.filter(p => p.id !== id);
    setPrompts(updatedPrompts);
    dataService.savePrompts(updatedPrompts);
  };

  const handleAddHistory = (prompt: string, response: string, alignmentNotes?: string): HistoryItem => {
    const newHistoryItem: HistoryItem = { 
      id: uuidv4(), 
      prompt, 
      response, 
      timestamp: new Date(), 
      alignment_notes: alignmentNotes 
    };
    const updatedHistory = [newHistoryItem, ...history];
    setHistory(updatedHistory);
    dataService.saveHistory(updatedHistory);
    return newHistoryItem;
  };

  const handleDeleteHistory = (id: string) => {
    const updatedHistory = history.filter(h => h.id !== id);
    setHistory(updatedHistory);
    dataService.saveHistory(updatedHistory);
  };

  const handleUpdateHistoryItem = (id: string, updates: Partial<HistoryItem>) => {
    const updatedHistory = history.map(item =>
      item.id === id ? { ...item, ...updates } : item
    );
    setHistory(updatedHistory);
    dataService.saveHistory(updatedHistory);
  };

  const renderView = () => {
    const commonProps = {
      t,
      prompts,
      history,
      onSavePrompt: handleSavePrompt,
      onDeletePrompt: handleDeletePrompt,
      onAddHistory: handleAddHistory,
      onDeleteHistory: handleDeleteHistory,
      onUpdateHistoryItem: handleUpdateHistoryItem,
    };

    switch (view) {
      case 'dashboard':
        return <Dashboard history={history} t={t} />;
        
      case 'editor':
        return (
          <PromptEditor
            {...commonProps}
            challengeToLoad={challengeToLoad}
            onChallengeLoaded={handleChallengeLoaded}
          />
        );
        
      case 'alchemist':
        return <AlchemistPage t={t} />;
        
      case 'music':
        return (
          <MusicProductionHub 
            onPromptSelect={(prompt) => {
              // Handle music prompt selection
              console.log('Selected music prompt:', prompt);
            }}
          />
        );
        
      case 'adhd':
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-text-main mb-2">{t('adhd_title')}</h2>
              <p className="text-text-secondary">{t('adhd_desc')}</p>
            </div>
            
            <TaskBreakdown
              prompt={challengeToLoad || "Create a comprehensive marketing strategy for a new Israeli startup"}
              onStepsGenerated={(steps) => console.log('Generated steps:', steps)}
              onStepCompleted={(stepId) => console.log('Completed step:', stepId)}
            />
          </div>
        );
        
      case 'theme':
        return <ThemeCustomizer />;
        
      default:
        return <Dashboard history={history} t={t} />;
    }
  };

  return (
    <div className={`app-container ${isRTLLayout ? 'rtl' : 'ltr'}`}>
      <FocusMode 
        isActive={focusModeActive}
        onToggle={() => setFocusModeActive(!focusModeActive)}
      >
        <div className="flex h-screen bg-background text-text-main font-sans">
          <Sidebar 
            currentView={view} 
            onSetView={setView} 
            t={t} 
          />
          <div className="flex-1 flex flex-col overflow-hidden">
            <Header 
              t={t}
              currentLanguage={currentLanguage}
              onLanguageChange={handleLanguageChange}
              focusModeActive={focusModeActive}
              onFocusModeToggle={() => setFocusModeActive(!focusModeActive)}
            />
            <main className="flex-1 overflow-y-auto p-8">
              {renderView()}
            </main>
          </div>
        </div>
      </FocusMode>

      {/* RTL Styles */}
      <style jsx>{`
        .app-container.rtl {
          direction: rtl;
        }
        
        .app-container.rtl * {
          text-align: ${isRTLLayout ? 'right' : 'left'};
        }
        
        .app-container.rtl .flex {
          flex-direction: ${isRTLLayout ? 'row-reverse' : 'row'};
        }
        
        .app-container.rtl .space-x-2 > * + * {
          margin-left: ${isRTLLayout ? '0' : '0.5rem'};
          margin-right: ${isRTLLayout ? '0.5rem' : '0'};
        }
        
        .app-container.rtl .space-x-4 > * + * {
          margin-left: ${isRTLLayout ? '0' : '1rem'};
          margin-right: ${isRTLLayout ? '1rem' : '0'};
        }

        /* Focus mode enhancements */
        .focus-mode-active .sidebar {
          transform: translateX(${isRTLLayout ? '100%' : '-100%'});
        }
        
        .focus-mode-active .main-content {
          margin-left: ${isRTLLayout ? '0' : '0'};
          margin-right: ${isRTLLayout ? '0' : '0'};
        }
      `}</style>
    </div>
  );
};

export default App;