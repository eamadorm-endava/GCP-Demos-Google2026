
import React, { useEffect } from 'react';
import { useStore } from './store/useStore';
import { IDLE_TIMEOUT } from './constants';
import AttractMode from './components/AttractMode';
import Dashboard from './components/Dashboard';
import QuickPitch from './components/QuickPitch';
import DemoContainer from './components/DemoContainer';
import AdminView from './components/AdminView';
import EndavaLogo from './components/EndavaLogo';
import { RefreshCw, Settings, ChevronRight, ShieldCheck, Terminal, Maximize, Minimize, Sparkles } from 'lucide-react';


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
  const [isFullscreen, setIsFullscreen] = React.useState(false);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((err) => {
        console.error(`Error attempting to enable full-screen mode: ${err.message}`);
      });
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

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
    <div className="h-screen w-screen flex flex-col bg-endava-dark text-white relative overflow-hidden select-none">
      {/* Resetting Overlay */}
      {isResetting && (
        <div className="fixed inset-0 z-[200] bg-endava-orange flex flex-col items-center justify-center animate-in fade-in duration-300">
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
      <header className="h-20 md:h-24 lg:h-32 bg-endava-dark border-b border-white/5 flex items-center justify-between px-6 md:px-12 flex-shrink-0 z-30 pt-[env(safe-area-inset-top)] shadow-2xl shadow-black/20">
        <div className="flex items-center gap-4 md:gap-8">
          <button
            onClick={handleSwitch}
            className="flex flex-col justify-center py-4 hover:opacity-80 transition-opacity active:scale-95"
          >
            <EndavaLogo height={48} className="md:h-12 lg:h-16 w-auto" />
          </button>
        </div>

        {currentVertical && (
          <div className="hidden sm:flex items-center gap-4 md:gap-6 animate-in slide-in-from-left-4">
            <ChevronRight className="text-endava-blue-40 w-5 h-5 md:w-6 md:h-6" />
            <span className="text-lg md:text-2xl font-medium text-endava-blue-20 capitalize truncate max-w-[200px] lg:max-w-none">{currentVertical}</span>
          </div>
        )}

        <div className="flex items-center gap-2 md:gap-6">
          <button
            onClick={() => setIdle(true)}
            className="p-3 md:p-5 hover:bg-white/10 active:bg-endava-orange/10 rounded-full transition-all text-endava-blue-50 hover:text-white"
            title="Start Attract Mode"
          >
            <Sparkles className="w-5 h-5 md:w-8 md:h-8" />
          </button>

          <button
            onClick={toggleFullscreen}
            className="p-3 md:p-5 hover:bg-white/10 active:bg-endava-orange/10 rounded-full transition-all text-endava-blue-50 hover:text-white"
            title="Toggle Fullscreen"
          >
            {isFullscreen ? <Minimize className="w-5 h-5 md:w-8 md:h-8" /> : <Maximize className="w-5 h-5 md:w-8 md:h-8" />}
          </button>


          <button
            onClick={() => setAdminOpen(true)}
            className="p-3 md:p-5 hover:bg-white/10 active:bg-endava-orange/10 rounded-full transition-all text-endava-blue-50 hover:text-white -ml-2 md:-ml-4"
          >
            <Terminal className="w-5 h-5 md:w-8 md:h-8" />
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-grow relative overflow-hidden">
        {currentVertical ? <DemoContainer /> : <Dashboard />}
        {isQuickPitchOpen && <QuickPitch />}
        {isAdminOpen && <AdminView />}
      </main>

      {/* Copyright Footer */}
      <div className="fixed bottom-4 w-full z-[50] pointer-events-none hidden md:block">
        <p className="text-[9px] md:text-[10px] text-endava-blue-60/40 font-bold uppercase tracking-[0.4em] text-center">
          © 2026 ENDAVA | ALL RIGHTS RESERVED
        </p>
      </div>

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
