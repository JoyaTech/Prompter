import React from 'react';
import { DashboardIcon, EditIcon, AlembicIcon, PaletteIcon } from './icons';

interface SidebarProps {
  currentView: string;
  onSetView: (view: string) => void;
  t: (key: string) => string;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, onSetView, t }) => {
  const navItems = [
    { id: 'dashboard', label: t('sidebar_dashboard'), icon: DashboardIcon },
    { id: 'editor', label: t('sidebar_ide'), icon: EditIcon },
    { id: 'alchemist', label: t('sidebar_alchemist'), icon: AlembicIcon },
    { id: 'theme', label: t('sidebar_theme'), icon: PaletteIcon },
  ];

  return (
    <aside className="w-64 bg-card-secondary p-4 flex flex-col flex-shrink-0">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-text-main">GenSpark</h2>
      </div>
      <nav className="flex flex-col gap-2">
        {navItems.map(item => (
          <button
            key={item.id}
            onClick={() => onSetView(item.id)}
            className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors w-full text-left ${
              currentView === item.id
                ? 'bg-primary text-white'
                : 'text-text-secondary hover:bg-border-color hover:text-text-main'
            }`}
          >
            <item.icon className="w-5 h-5" />
            <span>{item.label}</span>
          </button>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
