import React from 'react';
import { DashboardIcon, EditIcon, AlembicIcon, PaletteIcon } from './icons';

interface SidebarProps {
  currentView: string;
  onSetView: (view: string) => void;
  t: (key: string) => string;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, onSetView, t }) => {
  const navItems = [
    { 
      id: 'dashboard', 
      label: t('sidebar_dashboard'), 
      icon: DashboardIcon,
      description: t('dashboard_desc')
    },
    { 
      id: 'editor', 
      label: t('sidebar_ide'), 
      icon: EditIcon,
      description: t('editor_desc') || 'Prompt Engineering IDE'
    },
    { 
      id: 'alchemist', 
      label: t('sidebar_alchemist'), 
      icon: AlembicIcon,
      description: t('alchemist_desc')
    },
    { 
      id: 'music', 
      label: t('sidebar_music'), 
      icon: () => <span className="text-lg">🎵</span>,
      description: t('music_desc')
    },
    { 
      id: 'adhd', 
      label: t('sidebar_adhd'), 
      icon: () => <span className="text-lg">🧠</span>,
      description: t('adhd_desc')
    },
    { 
      id: 'theme', 
      label: t('sidebar_theme'), 
      icon: PaletteIcon,
      description: t('theme_desc')
    },
  ];

  return (
    <aside className="sidebar w-64 bg-card-secondary p-4 flex flex-col flex-shrink-0 border-r border-border">
      {/* Logo and Brand */}
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-2">
          <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">🧪</span>
          </div>
          <h2 className="text-2xl font-bold text-text-main">Alchemist</h2>
        </div>
        <p className="text-sm text-text-secondary">{t('app_subtitle')}</p>
      </div>

      {/* Navigation */}
      <nav className="flex flex-col gap-1 flex-1">
        {navItems.map(item => {
          const isActive = currentView === item.id;
          const IconComponent = item.icon;
          
          return (
            <button
              key={item.id}
              onClick={() => onSetView(item.id)}
              className={`
                group flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium 
                transition-all duration-200 w-full text-left relative overflow-hidden
                ${isActive
                  ? 'bg-primary text-white shadow-lg' 
                  : 'text-text-secondary hover:bg-card hover:text-text-main'
                }
              `}
              title={item.description}
            >
              {/* Active indicator */}
              {isActive && (
                <div className="absolute left-0 top-0 w-1 h-full bg-white rounded-r-full" />
              )}
              
              {/* Icon */}
              <div className={`
                flex-shrink-0 w-5 h-5 flex items-center justify-center
                ${isActive ? 'text-white' : 'text-text-secondary group-hover:text-primary'}
              `}>
                <IconComponent className="w-5 h-5" />
              </div>
              
              {/* Label */}
              <div className="flex flex-col flex-1 min-w-0">
                <span className="truncate">{item.label}</span>
                {!isActive && (
                  <span className="text-xs text-text-secondary opacity-0 group-hover:opacity-100 transition-opacity duration-200 truncate">
                    {item.description}
                  </span>
                )}
              </div>
              
              {/* New badge for special features */}
              {(item.id === 'music' || item.id === 'adhd') && (
                <span className="px-2 py-1 text-xs bg-accent text-primary rounded-full font-semibold">
                  {t('new')}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="mt-auto pt-4 border-t border-border">
        <div className="text-xs text-text-secondary space-y-1">
          <div className="flex items-center justify-between">
            <span>{t('version')}</span>
            <span className="font-mono">1.0.0</span>
          </div>
          <div className="flex items-center space-x-1">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            <span>{t('status_connected')}</span>
          </div>
        </div>
        
        {/* Language indicator */}
        <div className="mt-2 text-xs text-text-secondary">
          <div className="flex items-center justify-between">
            <span>{t('language')}</span>
            <span className="font-medium">
              {t('current_language') === 'he' ? '🇮🇱 עברית' : '🇺🇸 English'}
            </span>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;