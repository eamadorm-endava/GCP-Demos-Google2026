
import React, { useEffect } from 'react';
import { useStore } from './store/useStore';
import { IDLE_TIMEOUT } from './constants';
import AttractMode from './components/AttractMode';
import Dashboard from './components/Dashboard';
import QuickPitch from './components/QuickPitch';
import DemoContainer from './components/DemoContainer';
import AdminView from './components/AdminView';
import EndavaLogo from './components/EndavaLogo';
import { RefreshCw, Settings, ChevronRight, ShieldCheck, Terminal, Maximize, Minimize, Sparkles, X } from 'lucide-react';


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
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-[20%] -left-[10%] w-[60%] h-[60%] rounded-full bg-endava-orange/10 filter blur-[120px] opacity-50 animate-blob"></div>
        <div className="absolute top-[10%] -right-[10%] w-[50%] h-[70%] rounded-full bg-blue-500/10 filter blur-[120px] opacity-40 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-[20%] left-[15%] w-[60%] h-[60%] rounded-full bg-purple-500/10 filter blur-[120px] opacity-40 animate-blob animation-delay-4000"></div>
      </div>

      {/* Resetting Overlay */}
      {isResetting && (
        <div className="fixed inset-0 z-[200] bg-endava-orange flex flex-col items-center justify-center animate-in fade-in duration-300">
          <RefreshCw className="w-16 h-16 md:w-24 md:h-24 text-white animate-spin mb-6" strokeWidth={3} />
          <h2 className="text-3xl md:text-5xl font-medium tracking-tighter text-white uppercase italic">
            Restoring Gold Master
          </h2>
          <div className="mt-6 flex items-center gap-3 text-white/60 font-black uppercase tracking-[0.4em] text-xs md:text-sm">
            <ShieldCheck className="w-4 h-4 md:w-5 md:h-5" /> All Session Data Wiped
          </div>
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="w-full h-[2px] bg-white/30 absolute top-0 animate-[scan_2s_linear_infinite]" />
          </div>
        </div>
      )}

      {/* Header - Only visible on Dashboard */}
      {!currentVertical && (
        <header className="h-20 md:h-24 lg:h-32 bg-endava-dark/60 backdrop-blur-3xl border-b border-white/[0.05] flex items-center justify-between px-6 md:px-12 flex-shrink-0 z-30 pt-[env(safe-area-inset-top)] shadow-2xl shadow-[0_4px_30px_rgba(0,0,0,0.5)]">
          <div className="flex items-center gap-4 md:gap-8">
            <button
              onClick={handleSwitch}
              className="flex flex-col justify-center py-4 hover:opacity-80 transition-opacity active:scale-95"
            >
              <EndavaLogo height={48} className="md:h-12 lg:h-16 w-auto" />
            </button>
          </div>

          <div className="flex items-center gap-4 md:gap-8">
            <button
              onClick={() => setIdle(true)}
              className="p-3 md:p-5 hover:bg-white/10 active:bg-endava-orange/10 rounded-full transition-all text-endava-blue-50 hover:text-white"
              title="Start Attract Mode"
            >
              <Sparkles className="w-6 h-6 md:w-8 md:h-8" />
            </button>

            <button
              onClick={toggleFullscreen}
              className="p-3 md:p-5 hover:bg-white/10 active:bg-endava-orange/10 rounded-full transition-all text-endava-blue-50 hover:text-white"
              title="Toggle Fullscreen"
            >
              {isFullscreen ? <Minimize className="w-6 h-6 md:w-8 md:h-8" /> : <Maximize className="w-6 h-6 md:w-8 md:h-8" />}
            </button>

            <button
              onClick={() => setAdminOpen(true)}
              className="p-3 md:p-5 hover:bg-white/10 active:bg-endava-orange/10 rounded-full transition-all text-endava-blue-50 hover:text-white"
            >
              <Terminal className="w-6 h-6 md:w-8 md:h-8" />
            </button>
          </div>
        </header>
      )}

      {/* Main Content Area */}
      <main className="flex-grow relative overflow-hidden z-10">
        {currentVertical ? <DemoContainer /> : <Dashboard />}
        {isQuickPitchOpen && <QuickPitch />}
        {isAdminOpen && <AdminView />}

        {currentVertical && (
          <button
            onClick={handleSwitch}
            className="absolute top-6 right-6 z-50 p-3 rounded-xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.5)] hover:bg-white/10 hover:border-white/20 hover:scale-105 transition-all text-white/50 hover:text-white group flex items-center justify-center"
            title="Back to Gallery"
          >
            <X className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" strokeWidth={2} />
          </button>
        )}
      </main>

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
