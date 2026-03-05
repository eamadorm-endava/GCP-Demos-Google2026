import React, { useState, useEffect } from 'react';
import { useStore } from '../store/useStore';
import { LayoutDashboard, StoreIcon, Activity, LogOut, Camera, Maximize, Minimize } from './Icons';
import { theme } from '../theme';

interface MainLayoutProps {
  children: React.ReactNode;
}

const NavButton = ({ view, icon: Icon, label }: { view: any, icon: any, label?: string }) => {
  const { currentView, setCurrentView } = useStore();
  const isActive = currentView === view;

  return (
    <button
      onClick={() => setCurrentView(view)}
      title={label}
      className={`w-full flex flex-col items-center gap-1 py-2 px-1 rounded-xl transition-all duration-200 group overflow-hidden
        ${isActive
          ? 'bg-[#FF5640] text-white shadow-lg shadow-[#FF5640]/30'
          : 'text-[#758087] hover:bg-[#47555F] hover:text-white'}`}
      aria-label={label}
    >
      <Icon className="w-5 h-5 flex-shrink-0 transition-transform group-hover:scale-110" />
      {label && <span className="text-[9px] font-semibold uppercase tracking-wider leading-none w-full text-center truncate px-0.5">{label}</span>}
    </button>
  );
};


export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const { user, logout } = useStore();
  const [isFullscreen, setIsFullscreen] = useState(false);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => setIsFullscreen(true)).catch(err => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`);
      });
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().then(() => setIsFullscreen(false));
      }
    }
  };

  useEffect(() => {
    const handleChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', handleChange);
    return () => document.removeEventListener('fullscreenchange', handleChange);
  }, []);

  if (!user) return <>{children}</>;

  return (
    <>
      {/* Desktop Sidebar */}
      <div className={`hidden md:flex fixed left-0 top-0 bottom-0 w-20 ${theme.colors.background.sidebar} flex-col items-center py-8 z-50 border-r ${theme.colors.border.base} glass-panel`}>
        <div
          className="w-10 h-10 bg-white rounded-xl mb-8 flex items-center justify-center cursor-pointer shadow-lg shadow-[#FF5640]/20 overflow-hidden p-1 hover:scale-105 transition-transform"
          onClick={() => useStore.getState().setCurrentView('dashboard')}
          title="ShelfLogic AI"
        >
          <img src="./endava-logo.svg" alt="Endava Logo" className="w-full h-full object-contain" />
        </div>
        <div className="space-y-2 flex flex-col items-center w-full px-3 flex-1">
          <NavButton view="dashboard" icon={LayoutDashboard} label="Home" />
          {user.role !== 'STORE' && (
            <>
              <NavButton view="stores" icon={StoreIcon} label="Stores" />
              <NavButton view="shelf_vision" icon={Camera} label="Vision" />
              <NavButton view="ml_lab" icon={Activity} label="ML Lab" />
            </>
          )}
        </div>

        <div className="mt-auto flex flex-col gap-4 mb-4">
          <button onClick={toggleFullscreen} className="p-2 text-[#758087] hover:text-white hover:bg-[#47555F] rounded-lg transition-colors" aria-label="Toggle Fullscreen">
            {isFullscreen ? <Minimize className="w-5 h-5" /> : <Maximize className="w-5 h-5" />}
          </button>
          <button onClick={logout} className="p-2 text-[#758087] hover:text-[#FF5640] hover:bg-[#47555F] rounded-lg transition-colors" aria-label="Logout"><LogOut className="w-5 h-5" /></button>
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className={`md:hidden fixed bottom-0 left-0 right-0 h-16 ${theme.colors.background.card} border-t ${theme.colors.border.base} flex justify-around items-center z-50 px-2 pb-safe shadow-[0_-10px_40px_rgba(0,0,0,0.5)]`}>
        <NavButton view="dashboard" icon={LayoutDashboard} label="Home" />
        {user.role !== 'STORE' && (
          <>
            <NavButton view="stores" icon={StoreIcon} label="Stores" />
            <NavButton view="shelf_vision" icon={Camera} label="Vision" />
            <NavButton view="ml_lab" icon={Activity} label="ML Lab" />
          </>
        )}
        <button onClick={toggleFullscreen} className="p-3 text-slate-500 hover:text-white transition-colors">
          {isFullscreen ? <Minimize className="w-6 h-6" /> : <Maximize className="w-6 h-6" />}
        </button>
        <button onClick={logout} className="p-3 text-slate-500 hover:text-red-400 transition-colors"><LogOut className="w-6 h-6" /></button>
      </div>

      <main className="md:ml-20 min-h-screen relative pb-20 md:pb-0 overflow-x-hidden">
        {children}
      </main>
    </>
  );
};