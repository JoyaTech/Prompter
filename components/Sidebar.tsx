import React from 'react';
import { Page } from '../types';
import { FlowItLogo, DashboardIcon, EditIcon, SettingsIcon } from './icons';

interface SidebarProps {
  currentPage: Page;
  setCurrentPage: (page: Page) => void;
  t: (key: string) => string;
}

const Sidebar: React.FC<SidebarProps> = ({ currentPage, setCurrentPage, t }) => {
  // FIX: Specified a more precise type for the 'icon' prop to resolve a TypeScript error with React.cloneElement.
  // This ensures that TypeScript knows the cloned element can accept a 'className'.
  const NavItem: React.FC<{ page: Page; icon: React.ReactElement<{ className?: string }>; labelKey: string }> = ({ page, icon, labelKey }) => (
    <button
      onClick={() => setCurrentPage(page)}
      className={`flex items-center gap-3 p-3 rounded-lg transition-colors w-full text-left ${
        currentPage === page ? 'bg-primary text-white shadow-lg' : 'text-text-secondary hover:bg-card-secondary hover:text-text-main'
      }`}
    >
      {React.cloneElement(icon, { className: 'w-5 h-5' })}
      <span className="font-medium">{t(labelKey)}</span>
    </button>
  );

  return (
    <aside className="w-64 bg-card p-6 flex-col space-y-8 border-r border-border-color hidden md:flex">
      <div className="flex items-center gap-3 mb-4">
        <FlowItLogo className="w-8 h-8 text-primary" />
        <h2 className="text-xl font-bold text-text-main">{t('app_title')}</h2>
      </div>

      <nav className="space-y-2">
        <NavItem page="editor" icon={<EditIcon />} labelKey="menu_editor" />
        <NavItem page="dashboard" icon={<DashboardIcon />} labelKey="menu_dashboard" />
        <NavItem page="theme" icon={<SettingsIcon />} labelKey="menu_theme" />
      </nav>
    </aside>
  );
};

export default Sidebar;