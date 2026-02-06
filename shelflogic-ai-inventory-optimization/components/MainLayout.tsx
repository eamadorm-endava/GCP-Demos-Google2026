
import React from 'react';
import { useStore } from '../store/useStore';
import { LayoutDashboard, StoreIcon, Activity, LogOut, Camera } from './Icons';
import { theme } from '../theme';

interface MainLayoutProps {
  children: React.ReactNode;
}

const NavButton = ({ view, icon: Icon, label }: { view: any, icon: any, label?: string }) => {
  const { currentView, setCurrentView } = useStore();
  
  const isActive = currentView === view;
  const isLab = view === 'ml_lab';
  const activeClasses = isLab 
    ? 'bg-[var(--color-brand-secondary-200)] text-white shadow-lg shadow-[var(--color-brand-secondary-100)]' 
    : 'bg-[var(--color-brand-primary-500)] text-white shadow-lg shadow-[var(--color-brand-primary-500)]';

  return (
    <button 
      onClick={() => setCurrentView(view)} 
      className={`p-3 rounded-xl transition-all flex items-center justify-center ${isActive ? activeClasses : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
      aria-label={label}
    >
      <Icon className="w-6 h-6" />
    </button>
  );
};


export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const { user, logout } = useStore();

  if (!user) return <>{children}</>;

  return (
    <>
      {/* Desktop Sidebar */}
      <div className={`hidden md:flex fixed left-0 top-0 bottom-0 w-20 ${theme.colors.background.sidebar} flex-col items-center py-8 z-50 border-r ${theme.colors.border.base} glass-panel`}>
        <div 
          className={`w-10 h-10 bg-gradient-to-br ${theme.semantic.primary.gradient} rounded-xl mb-10 flex items-center justify-center text-white font-bold cursor-pointer shadow-lg shadow-[var(--color-brand-primary-500)]`} 
          onClick={() => useStore.getState().setCurrentView('dashboard')}
        >
            S
        </div>
        <div className="space-y-6 flex flex-col items-center w-full px-3 flex-1">
          <NavButton view="dashboard" icon={LayoutDashboard} label="Dashboard" />
          {user.role !== 'STORE' && (
              <>
                <NavButton view="stores" icon={StoreIcon} label="Stores" />
                <NavButton view="shelf_vision" icon={Camera} label="Vision" />
                <NavButton view="ml_lab" icon={Activity} label="ML Lab" />
              </>
          )}
        </div>
        
        <button onClick={logout} className="p-3 text-slate-500 hover:text-red-400 mt-auto transition-colors" aria-label="Logout"><LogOut className="w-6 h-6" /></button>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className={`md:hidden fixed bottom-0 left-0 right-0 h-16 ${theme.colors.background.card} border-t ${theme.colors.border.base} flex justify-around items-center z-50 px-2 pb-safe shadow-[0_-10px_40px_rgba(0,0,0,0.5)]`}>
          <NavButton view="dashboard" icon={LayoutDashboard} label="Dashboard" />
          {user.role !== 'STORE' && (
              <>
                <NavButton view="stores" icon={StoreIcon} label="Stores" />
                <NavButton view="shelf_vision" icon={Camera} label="Vision" />
                <NavButton view="ml_lab" icon={Activity} label="ML Lab" />
              </>
          )}
          <button onClick={logout} className="p-3 text-slate-500 hover:text-red-400 transition-colors"><LogOut className="w-6 h-6" /></button>
      </div>

      <main className="md:ml-20 min-h-screen relative pb-20 md:pb-0 overflow-x-hidden">
        {children}
      </main>
    </>
  );
};
