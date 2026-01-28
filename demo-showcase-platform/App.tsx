
import React, { useEffect } from 'react';
import { useStore } from './store/useStore';
import { IDLE_TIMEOUT } from './constants';
import AttractMode from './components/AttractMode';
import Dashboard from './components/Dashboard';
import QuickPitch from './components/QuickPitch';
import DemoContainer from './components/DemoContainer';
import AdminView from './components/AdminView';
import { Home, RefreshCw, LayoutGrid, Settings, ChevronRight, ShieldCheck, Terminal } from 'lucide-react';

const App: React.FC = () => {
  const currentVertical = useStore((state) => state.currentVertical);
  const isQuickPitchOpen = useStore((state) => state.isQuickPitchOpen);
  const isAdminOpen = useStore((state) => state.isAdminOpen);
  const isIdle = useStore((state) => state.isIdle);
  const isResetting = useStore((state) => state.isResetting);
  const lastActivity = useStore((state) => state.lastActivity);
  const setIdle = useStore((state) => state.setIdle);
  const updateActivity = useStore((state) => state.updateActivity);
  const resetDemo = useStore((state) => state.resetDemo);
  const setVertical = useStore((state) => state.setVertical);
  const setPitchVertical = useStore((state) => state.setPitchVertical);
  const toggleQuickPitch = useStore((state) => state.toggleQuickPitch);
  const setAdminOpen = useStore((state) => state.setAdminOpen);

  useEffect(() => {
    const interval = setInterval(() => {
      if (Date.now() - lastActivity > IDLE_TIMEOUT) {
        setIdle(true);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [lastActivity, setIdle]);

  useEffect(() => {
    const handleActivity = () => updateActivity();
    window.addEventListener('mousedown', handleActivity, { passive: true });
    window.addEventListener('keydown', handleActivity, { passive: true });
    window.addEventListener('touchstart', handleActivity, { passive: true });
    return () => {
      window.removeEventListener('mousedown', handleActivity);
      window.removeEventListener('keydown', handleActivity);
      window.removeEventListener('touchstart', handleActivity);
    };
  }, [updateActivity]);

  const handleSwitch = () => {
    setVertical(null);
    setPitchVertical(null);
    toggleQuickPitch(false);
  };

  if (isIdle) return <AttractMode />;

  return (
    <div className="h-screen w-screen flex flex-col bg-[#0b0c0d] text-white relative overflow-hidden select-none">
      {/* Resetting Overlay */}
      {isResetting && (
        <div className="fixed inset-0 z-[200] bg-[#DE411B] flex flex-col items-center justify-center animate-in fade-in duration-300">
          <RefreshCw className="w-24 h-24 text-white animate-spin mb-8" strokeWidth={3} />
          <h2 className="text-4xl md:text-6xl font-black tracking-tighter text-white uppercase italic">
            Restoring Gold Master
          </h2>
          <div className="mt-8 flex items-center gap-3 text-white/60 font-black uppercase tracking-[0.4em] text-sm">
            <ShieldCheck className="w-5 h-5" /> All Session Data Wiped
          </div>
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="w-full h-[2px] bg-white/30 absolute top-0 animate-[scan_2s_linear_infinite]" />
          </div>
        </div>
      )}

      {/* Header */}
      <header className="h-16 md:h-20 lg:h-24 bg-[#121417] border-b border-white/5 flex items-center justify-between px-4 md:px-10 flex-shrink-0 z-30 pt-[env(safe-area-inset-top)]">
        <div className="flex items-center gap-3 md:gap-6">
          <div className="w-9 h-9 md:w-12 md:h-12 bg-white flex items-center justify-center flex-shrink-0 rounded-lg shadow-lg">
             <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 md:w-8 md:h-8">
                <path d="M12 18C7.5 18 4 14.5 4 10C4 5.5 7.5 2 12 2C16.5 2 20 5.5 20 10H9C9 11.5 10.5 13 12 13C13.5 13 14.5 12.5 15 11.5L19.5 13C18.5 15.5 15.5 18 12 18ZM9 7H15C14.5 5.5 13.5 4.5 12 4.5C10.5 4.5 9.5 5.5 9 7Z" fill="#DE411B" />
             </svg>
          </div>
          <div className="flex flex-col">
            <span className="text-lg md:text-2xl lg:text-3xl font-black tracking-tighter text-white leading-tight">endava</span>
            <span className="text-[8px] md:text-[10px] font-black text-[#DE411B] uppercase tracking-[0.3em]">Next '26 Showcase</span>
          </div>
        </div>

        {currentVertical && (
          <div className="hidden sm:flex items-center gap-2 md:gap-3 animate-in slide-in-from-left-4">
            <ChevronRight className="text-gray-700 w-4 h-4 md:w-5 md:h-5" />
            <span className="text-sm md:text-lg font-medium text-gray-400 capitalize truncate max-w-[120px] lg:max-w-none">{currentVertical}</span>
          </div>
        )}

        <div className="flex items-center gap-3 md:gap-10">
          <div className="hidden md:flex flex-col text-right">
            <span className="text-[10px] font-black text-[#DE411B] tracking-[0.2em] uppercase">Booth #204</span>
            <span className="text-xs font-bold text-gray-600">Mandalay Bay</span>
          </div>
          <button 
            onClick={() => setAdminOpen(true)}
            className="p-2 md:p-3 hover:bg-white/10 active:bg-[#DE411B]/10 rounded-full transition-all text-gray-600 hover:text-[#DE411B]"
          >
            <Terminal className="w-5 h-5 md:w-6 md:h-6" />
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-grow relative overflow-hidden">
        {currentVertical ? <DemoContainer /> : <Dashboard />}
        {isQuickPitchOpen && <QuickPitch />}
        {isAdminOpen && <AdminView />}
      </main>

      {/* Persistent Global Navigation Dock */}
      <nav className="fixed bottom-4 md:bottom-10 left-4 right-4 md:left-1/2 md:-translate-x-1/2 md:right-auto bg-[#121417]/95 backdrop-blur-2xl border border-white/10 rounded-2xl md:rounded-full px-2 md:px-4 py-2 md:py-3 shadow-2xl flex items-center justify-around md:justify-start md:gap-2 z-[60] mb-[env(safe-area-inset-bottom)]">
        <button 
          onClick={handleSwitch}
          className={`flex items-center gap-2 md:gap-3 px-4 md:px-10 py-3 md:py-4 rounded-xl md:rounded-full font-black text-[10px] md:text-lg transition-all active:scale-95 ${
            !currentVertical ? 'bg-[#DE411B] text-white shadow-lg shadow-[#DE411B]/20' : 'text-gray-500 hover:text-white'
          }`}
        >
          <Home className="w-4 h-4 md:w-6 md:h-6" />
          <span>HOME</span>
        </button>

        <div className="hidden md:block w-px h-10 bg-white/5 mx-2" />

        <button 
          onClick={resetDemo}
          className="flex items-center gap-2 md:gap-3 px-4 md:px-10 py-3 md:py-4 rounded-xl md:rounded-full font-black text-[10px] md:text-lg text-red-500/80 hover:text-red-400 hover:bg-red-500/5 transition-all active:scale-95"
        >
          <RefreshCw className={`w-4 h-4 md:w-6 md:h-6 ${isResetting ? 'animate-spin' : ''}`} />
          <span>RESET</span>
        </button>

        <div className="hidden md:block w-px h-10 bg-white/5 mx-2" />

        <button 
          onClick={handleSwitch}
          className={`flex items-center gap-2 md:gap-3 px-4 md:px-10 py-3 md:py-4 rounded-xl md:rounded-full font-black text-[10px] md:text-lg transition-all active:scale-95 ${
            currentVertical ? 'bg-[#DE411B]/10 text-[#DE411B]' : 'text-gray-500 hover:text-white'
          }`}
        >
          <LayoutGrid className="w-4 h-4 md:w-6 md:h-6" />
          <span>SWITCH</span>
        </button>
      </nav>

      <style>{`
        @keyframes scan {
          from { top: 0; }
          to { top: 100%; }
        }
      `}</style>
    </div>
  );
};

export default App;
