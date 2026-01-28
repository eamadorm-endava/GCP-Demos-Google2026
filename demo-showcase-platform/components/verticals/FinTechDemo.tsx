
import React from 'react';
import { useStore } from '../../store/useStore';
import { Shield, ShieldAlert, ShieldCheck, Landmark, Search, ArrowUpRight } from 'lucide-react';

const FinTechDemo: React.FC = () => {
  const demoData = useStore((state) => state.demoData.fintech);

  return (
    <div className="p-4 md:p-8 h-full flex flex-col gap-6 md:gap-8 custom-scrollbar overflow-y-auto pb-40">
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl md:text-4xl font-black">Fraud <span className="text-[#DE411B]">Defense</span></h2>
          <p className="text-base md:text-xl text-gray-500 font-light">BigQuery ML Real-Time Scoring</p>
        </div>
        <div className="bg-[#DE411B]/10 text-[#DE411B] px-4 py-2 rounded-full font-black flex items-center gap-2 border border-[#DE411B]/20 text-xs md:text-base tracking-widest uppercase">
          <Shield className="w-4 h-4 md:w-6 md:h-6" strokeWidth={2.5} /> NETWORK ACTIVE
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-10">
        <div className="lg:col-span-1 space-y-6 md:space-y-10">
          <div className="bg-gradient-to-br from-[#DE411B] to-[#7a1f0a] rounded-[2.5rem] p-8 md:p-10 shadow-2xl shadow-[#DE411B]/20 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full translate-x-10 -translate-y-10 group-hover:scale-110 transition-transform" />
            <h3 className="text-white/60 text-xs font-black uppercase tracking-[0.3em] mb-3">Safety Index</h3>
            <div className="text-6xl md:text-7xl font-black text-white mb-6">99.8%</div>
            <p className="text-white/80 text-lg font-light leading-snug">Current global infrastructure resilience level.</p>
            <div className="mt-10 pt-8 border-t border-white/10 flex items-center justify-between">
              <div className="text-white/60 text-sm font-bold uppercase">Active Nodes: <span className="text-white">14,204</span></div>
              <div className="bg-white/20 p-2 rounded-lg">
                <ArrowUpRight className="text-white w-6 h-6" />
              </div>
            </div>
          </div>

          <div className="bg-[#121417] rounded-[2.5rem] p-8 md:p-10 border border-white/5 shadow-xl">
            <div className="flex items-center gap-5 mb-8">
              <div className="bg-[#DE411B]/10 p-4 rounded-2xl border border-[#DE411B]/20">
                <ShieldAlert className="text-[#DE411B] w-6 h-6" strokeWidth={2.5} />
              </div>
              <h4 className="text-xl md:text-2xl font-black tracking-tight">AI Firewall</h4>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-5 bg-white/5 rounded-3xl text-sm md:text-base border border-transparent hover:border-white/10 transition-all">
                <span className="text-gray-500 font-bold uppercase tracking-wider text-xs">Risk Cutoff</span>
                <span className="font-black text-[#DE411B]">0.85 ML</span>
              </div>
              <div className="flex items-center justify-between p-5 bg-white/5 rounded-3xl text-sm md:text-base border border-transparent hover:border-white/10 transition-all">
                <span className="text-gray-500 font-bold uppercase tracking-wider text-xs">Geo-Fencing</span>
                <span className="text-green-500 font-black uppercase tracking-widest text-[10px] bg-green-500/10 px-3 py-1 rounded-full border border-green-500/20">Active</span>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 bg-[#121417] rounded-[2.5rem] p-8 md:p-12 border border-white/5 flex flex-col shadow-2xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-10 gap-6">
            <h3 className="text-2xl md:text-3xl font-black flex items-center gap-4">
              <Landmark className="text-[#DE411B] w-8 h-8" /> Stream Logs
            </h3>
            <div className="relative group">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-600 group-focus-within:text-[#DE411B] transition-colors" />
              <input 
                type="text" 
                placeholder="Search Transaction ID..." 
                className="bg-white/5 border border-white/10 rounded-2xl pl-14 pr-6 py-4 text-sm w-full sm:w-80 outline-none focus:border-[#DE411B]/50 focus:bg-white/10 transition-all font-bold"
              />
            </div>
          </div>

          <div className="flex-grow space-y-5 overflow-y-auto custom-scrollbar pr-2">
            {demoData.transactions.map((tx) => (
              <div key={tx.id} className="group flex flex-col sm:flex-row sm:items-center justify-between p-5 md:p-8 bg-white/5 rounded-3xl border border-transparent hover:border-[#DE411B]/20 hover:bg-[#DE411B]/5 transition-all gap-6">
                <div className="flex items-center gap-6 md:gap-8">
                  <div className={`p-4 md:p-5 rounded-full flex-shrink-0 border ${
                    tx.risk === 'High' 
                      ? 'bg-red-500/10 border-red-500/30' 
                      : 'bg-green-500/10 border-green-500/30'
                  }`}>
                    {tx.risk === 'High' 
                      ? <ShieldAlert className="text-red-500 w-6 h-6 md:w-8 md:h-8" /> 
                      : <ShieldCheck className="text-green-500 w-6 h-6 md:w-8 md:h-8" />
                    }
                  </div>
                  <div className="truncate">
                    <div className="font-black text-xl md:text-2xl truncate tracking-tight">{tx.id}</div>
                    <div className="text-gray-600 text-xs md:text-sm font-bold uppercase tracking-widest mt-1">Cross-Border • Settlement Pending</div>
                  </div>
                </div>
                <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center">
                  <div className="text-2xl md:text-3xl font-black sm:mb-2">${tx.amount.toLocaleString()}</div>
                  <div className={`text-[10px] md:text-xs font-black uppercase tracking-[0.2em] px-4 py-1 rounded-full border ${
                    tx.status === 'Flagged' 
                      ? 'text-red-500 bg-red-500/10 border-red-500/20' 
                      : 'text-green-500 bg-green-500/10 border-green-500/20'
                  }`}>
                    {tx.status}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button className="mt-10 w-full p-6 rounded-3xl border-2 border-dashed border-white/5 text-gray-600 font-black tracking-widest uppercase hover:bg-white/5 hover:text-[#DE411B] hover:border-[#DE411B]/30 active:scale-95 transition-all text-sm">
            Load Historical Dataset
          </button>
        </div>
      </div>
    </div>
  );
};

export default FinTechDemo;
