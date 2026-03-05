
import React, { useState, useEffect } from 'react';
import { Shield, StoreIcon, Briefcase, Maximize, Minimize } from './Icons';
import { UserRole } from '../types';
import { theme } from '../theme';

interface AuthViewProps {
  onLogin: (role: UserRole) => void;
  className?: string;
}

export const AuthView: React.FC<AuthViewProps> = ({ onLogin, className = '' }) => {
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const handleChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', handleChange);
    return () => document.removeEventListener('fullscreenchange', handleChange);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((err) => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`);
      });
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  return (
    <div className={`min-h-screen ${theme.colors.background.sidebar} flex items-center justify-center p-4 relative ${className}`}>
      {/* Fullscreen Toggle */}
      <button
        onClick={toggleFullscreen}
        className="absolute top-6 right-6 p-2.5 text-slate-400 hover:text-white transition-colors bg-white/5 rounded-xl border border-[#47555F] hover:bg-white/10 z-50 shadow-lg"
        aria-label="Toggle Fullscreen"
      >
        {isFullscreen ? <Minimize className="w-5 h-5" /> : <Maximize className="w-5 h-5" />}
      </button>

      <div className={`${theme.colors.background.card} rounded-2xl shadow-2xl overflow-hidden max-w-5xl w-full flex flex-col md:flex-row border ${theme.colors.border.base}`}>
        <div className={`w-full md:w-2/5 bg-gradient-to-br ${theme.semantic.primary.gradient} p-12 flex flex-col justify-between text-white relative overflow-hidden`}>
          <div className="z-10">
            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center mb-6 border border-[#5E6A73] overflow-hidden p-1.5">
              <img src="./endava-logo.svg" alt="Endava Logo" className="w-full h-full object-contain" />
            </div>
            <h1 className="text-4xl font-bold tracking-tight mb-2">ShelfLogic AI</h1>
            <p className="text-cyan-100 text-lg opacity-90">Autonomous Merchandising</p>
          </div>
          <div className="z-10 text-xs text-cyan-200/50">SECURE ENTERPRISE NODE v2.5</div>
        </div>

        <div className={`w-full md:w-3/5 p-12 flex flex-col justify-center ${theme.colors.background.main}`}>
          <h2 className={`text-2xl font-bold ${theme.colors.text.primary} mb-8`}>Access Control</h2>

          <div className="grid grid-cols-1 gap-4">
            <button onClick={() => onLogin('HQ')} className={`${theme.components.card} p-5 hover:border-cyan-500 flex items-center group`}>
              <Shield className="w-8 h-8 text-cyan-400 mr-4" />
              <div className="text-left">
                <h3 className="font-bold text-white">Network Admin</h3>
                <p className="text-xs text-slate-500">Full visibility & Strategy Lab</p>
              </div>
            </button>

            <button onClick={() => onLogin('CATEGORY_MGR')} className={`${theme.components.card} p-5 hover:border-indigo-500 flex items-center group`}>
              <Briefcase className="w-8 h-8 text-indigo-400 mr-4" />
              <div className="text-left">
                <h3 className="font-bold text-white">Category Manager</h3>
                <p className="text-xs text-slate-500">Spirits / Beer / Wine Specialization</p>
              </div>
            </button>

            <button onClick={() => onLogin('STORE')} className={`${theme.components.card} p-5 hover:border-emerald-500 flex items-center group`}>
              <StoreIcon className="w-8 h-8 text-emerald-400 mr-4" />
              <div className="text-left">
                <h3 className="font-bold text-white">Store Manager</h3>
                <p className="text-xs text-slate-500">Execution Portal (Dubuque)</p>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
