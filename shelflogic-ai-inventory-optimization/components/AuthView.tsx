
import React from 'react';
import { Sparkles, Shield, StoreIcon, Briefcase } from './Icons';
import { UserRole } from '../types';
import { theme } from '../theme';

interface AuthViewProps {
  onLogin: (role: UserRole) => void;
  className?: string;
}

export const AuthView: React.FC<AuthViewProps> = ({ onLogin, className = '' }) => {
  return (
    <div className={`min-h-screen ${theme.colors.background.sidebar} flex items-center justify-center p-4 ${className}`}>
      <div className={`${theme.colors.background.card} rounded-2xl shadow-2xl overflow-hidden max-w-5xl w-full flex flex-col md:flex-row border ${theme.colors.border.base}`}>
        <div className={`w-full md:w-2/5 bg-gradient-to-br ${theme.semantic.primary.gradient} p-12 flex flex-col justify-between text-white relative overflow-hidden`}>
          <div className="z-10">
            <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-xl flex items-center justify-center mb-6 border border-white/20">
               <Sparkles className="w-6 h-6 text-cyan-50" />
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
