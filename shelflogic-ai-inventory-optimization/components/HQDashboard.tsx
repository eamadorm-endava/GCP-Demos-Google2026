
import React, { useState, useMemo } from 'react';
import { User, Opportunity } from '../types';
import { ALL_OPPORTUNITIES, ALL_STORES } from '../constants';
import { useStore } from '../store/useStore';
import { Search, Shield, User as UserIcon } from './Icons';
import { theme } from '../theme';
import { NetworkTicker } from './NetworkTicker';
import { ImpactSimulator } from './ImpactSimulator';
import { OpportunityCard } from './OpportunityCard';
import { StatsGrid } from './StatsGrid';

export const HQDashboard: React.FC = () => {
  const { user, viewOpportunity } = useStore();
  const currentVertical = useStore((state) => state.currentVertical);
  const [searchTerm, setSearchTerm] = useState('');

  const getStore = (id: string) => ALL_STORES.find(s => s.store_id === id);

  const filteredOpportunities = useMemo(() => {
    let list = [...ALL_OPPORTUNITIES];
    list.sort((a, b) => b.projected_lift - a.projected_lift);

    if (!searchTerm) return list;
    const lowerTerm = searchTerm.toLowerCase();
    return list.filter(opp => {
      const targetStore = getStore(opp.target_store_id);
      return (
        targetStore?.name.toLowerCase().includes(lowerTerm) || 
        opp.type.toLowerCase().includes(lowerTerm) ||
        (opp.product?.name.toLowerCase().includes(lowerTerm)) ||
        (opp.event_name?.toLowerCase().includes(lowerTerm))
      );
    });
  }, [searchTerm]);

  if (!user) return null;

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <NetworkTicker />
      
      <div className={`flex-1 overflow-y-auto max-w-7xl mx-auto px-4 md:px-8 py-8 animate-fade-in w-full`}>
        <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
           <div>
              <div className="flex items-center gap-3 mb-2">
                <div className={`p-2 ${currentVertical.color} rounded-lg shadow-lg`}>
                  <Shield className="w-5 h-5 text-white" />
                </div>
                <h1 className={`text-2xl md:text-3xl font-bold ${theme.colors.text.primary} tracking-tight`}>{currentVertical.title}</h1>
              </div>
              <p className={`text-base md:text-lg ${theme.colors.text.secondary} font-medium`}>{currentVertical.pitch.solution}</p>
           </div>
           
           <div className="flex items-center gap-4 bg-slate-900/50 p-2 rounded-2xl border border-slate-800 glass-panel self-start md:self-auto">
              <div className="px-4 text-right hidden md:block">
                  <p className={`text-sm font-bold ${theme.colors.text.primary}`}>{user.name}</p>
                  <p className={`text-[10px] ${theme.colors.text.tertiary} uppercase font-bold tracking-widest`}>Admin Console</p>
              </div>
              <div className={`w-12 h-12 bg-gradient-to-br from-slate-700 to-slate-900 rounded-xl flex items-center justify-center text-white border border-white/10 shadow-lg`}>
                  <UserIcon className="w-6 h-6" />
              </div>
           </div>
        </header>

        <StatsGrid opportunities={filteredOpportunities} />

        <div className="mb-12">
          <ImpactSimulator />
        </div>
        
        <div>
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
                <div className="flex items-center">
                <div className="w-1.5 h-6 bg-cyan-500 rounded-full mr-3"></div>
                <h2 className={`text-xl font-bold ${theme.colors.text.primary}`}>
                    Optimization Pipeline
                </h2>
                <span className={`ml-3 px-2 py-0.5 bg-slate-800 text-slate-400 text-[10px] font-bold rounded-full border border-slate-700`}>
                    {filteredOpportunities.length} ACTIVE
                </span>
                </div>
                
                <div className="relative group w-full md:w-auto">
                <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 ${theme.colors.text.tertiary}`} />
                <input
                    type="text"
                    className={`${theme.components.input} block w-full md:w-80`}
                    placeholder="Search opportunities..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                </div>
            </div>

            <div className="space-y-4">
                {filteredOpportunities.map((opp) => (
                  <OpportunityCard key={opp.id} opportunity={opp} onOpen={() => viewOpportunity(opp.id)} />
                ))}
            </div>
        </div>

        <footer className="mt-16 pt-8 border-t border-slate-800">
          <h3 className="text-center text-xs font-bold text-slate-500 uppercase tracking-widest mb-6">System Status</h3>
          <div className="flex flex-col md:flex-row justify-around items-center text-center md:text-left gap-8">
               <div className="text-sm">
                   <span className="text-slate-400 block">Data Pipeline</span>
                   <span className="flex items-center justify-center md:justify-start text-emerald-400 font-bold"><span className="w-2 h-2 bg-emerald-500 rounded-full mr-2 animate-pulse"></span> Operational</span>
               </div>
               <div className="text-sm">
                   <span className="text-slate-400 block">Model Training</span>
                   <span className="text-slate-200 font-medium">Scheduled (02:00 AM)</span>
               </div>
               <div className="text-sm">
                   <span className="text-slate-400 block">API Latency</span>
                   <span className="text-slate-200 font-medium">45ms</span>
               </div>
          </div>
        </footer>
      </div>
    </div>
  );
};
