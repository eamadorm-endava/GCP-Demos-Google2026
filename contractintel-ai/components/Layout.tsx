import React from 'react';
import { LayoutDashboard, FileText, Search, Settings, ShieldAlert, PieChart } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  currentView: 'dashboard' | 'analysis' | 'list' | 'detail';
  onViewChange: (view: 'dashboard' | 'analysis' | 'list' | 'detail') => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, currentView, onViewChange }) => {
  return (
    <div className="min-h-screen flex bg-[var(--color-brand-primary-200)]">
      {/* Sidebar */}
      <aside className="w-64 bg-[var(--color-brand-sb-shade-90)] text-white flex flex-col fixed h-full z-10">
        <div className="p-6 border-b border-[var(--color-brand-sb-shade-80)]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-secondary rounded-lg flex items-center justify-center bg-[var(--color-brand-primary-50)]">
              <img src="https://cdn.brandfetch.io/id4YZ7PWEj/w/200/h/200/theme/dark/icon.jpeg" 
               className="w-full h-full object-cover"/>              
            </div>           
            <h1 className="text-xl font-bold tracking-tight text-[var(--color-brand-primary-300)]">ContractIntel</h1>
          </div>
          <p className="text-xs text-[var(--color-brand-sb-shade-40)] mt-2 ">Financial Risk Intelligence</p>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <button
            onClick={() => onViewChange('dashboard')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              currentView === 'dashboard' ? 'bg-[var(--color-brand-sb-shade-70)] text-[var(--color-brand-primary-300)]' : 'transparent text-[var(--color-brand-sb-shade-30)] hover:bg-[var(--color-brand-sb-shade-80)]'
            }`}
          >
            <LayoutDashboard size={20} />
            <span className="font-medium">Dashboard</span>
          </button>

          <button
            onClick={() => onViewChange('analysis')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              currentView === 'analysis' ? 'bg-[var(--color-brand-sb-shade-70)] text-[var(--color-brand-primary-300)]' : 'transparent text-[var(--color-brand-sb-shade-30)] hover:bg-[var(--color-brand-sb-shade-80)]'
            }`}
          >
            <Search size={20} />
            <span className="font-medium">Analyze Contract</span>
          </button>

          <button
            onClick={() => onViewChange('list')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              currentView === 'list' || currentView === 'detail' ? 'bg-[var(--color-brand-sb-shade-70)] text-[var(--color-brand-primary-300)]' : 'transparent text-[var(--color-brand-sb-shade-30)] hover:bg-[var(--color-brand-sb-shade-80)]'
            }`}
          >
            <FileText size={20} />
            <span className="font-medium">Contracts List</span>
          </button>
        </nav>

        <div className="p-4 border-t border-[var(--color-brand-sb-shade-80)]">
          <div className="flex items-center gap-3 px-4 py-2 text-[var(--color-brand-sb-shade-40)] hover:text-[var(--color-brand-primary-300)] cursor-pointer">
            <Settings size={18} />
            <span className="text-sm">Settings</span>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 p-8 overflow-y-auto">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
};