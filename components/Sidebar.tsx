import React from 'react';
import { useTranslation } from 'react-i18next';
import { DashboardIcon, EditIcon, AlembicIcon, PaletteIcon } from './icons';

// FIX: Added full implementation for the Sidebar component.
interface SidebarProps {
  activeView: string;
  onNavigate: (view: 'dashboard' | 'ide' | 'alchemist' | 'appearance') => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeView, onNavigate }) => {
  const { t } = useTranslation();

  const navItems = [
    { id: 'dashboard', label: t('dashboard_title'), icon: DashboardIcon },
    { id: 'ide', label: t('ide_title'), icon: EditIcon },
    { id: 'alchemist', label: t('alchemist_title'), icon: AlembicIcon },
    { id: 'appearance', label: t('appearance_title'), icon: PaletteIcon },
  ];

  return (
    <aside className="w-64 bg-card/50 border-r border-border-color flex-shrink-0 flex flex-col p-4">
      <div className="flex items-center gap-3 px-2 mb-8">
        <img src="/logo.svg" alt="Flow-It Magical Logo" className="w-8 h-8"/>
        <h2 className="text-2xl font-bold text-text-main">Flow-It Magical</h2>
      </div>
      <nav className="flex flex-col gap-2">
        {navItems.map(item => (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id as any)}
            className={`flex items-center gap-4 px-4 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
              activeView === item.id
                ? 'bg-primary text-white'
                : 'text-text-secondary hover:bg-card-secondary hover:text-text-main'
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