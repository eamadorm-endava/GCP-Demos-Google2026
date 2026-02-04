import React from 'react';
import { Shield, Zap, FileSearch, ArrowRight, TrendingUp, Lock } from 'lucide-react';

interface WelcomeModalProps {
  onStart: () => void;
}

const WelcomeModal: React.FC<WelcomeModalProps> = ({ onStart }) => {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-brand-dark/90 backdrop-blur-md p-4 animate-in fade-in duration-500">
      
      {/* Main Container */}
      <div className="bg-slate-900/95 border border-slate-700/50 rounded-2xl w-full max-w-5xl shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[90vh] md:h-[80vh] relative ring-1 ring-white/10">
        
        {/* Decorative background glow (Endava Gradient) */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-brand-primary via-orange-500 to-red-600 z-50"></div>

        {/* LEFT PANEL */}
        <div className="md:w-[40%] bg-gradient-to-b from-slate-900 to-slate-950 flex flex-col border-b md:border-b-0 md:border-r border-slate-800 shrink-0 relative overflow-hidden">
          
          {/* Background pattern */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-orange-900/20 via-transparent to-transparent opacity-50 pointer-events-none"></div>

          <div className="flex-1 overflow-y-auto p-8 relative z-10">
            <div className="flex items-center space-x-2 text-brand-primary mb-6">
              <div className="p-2 bg-brand-primary/10 rounded-lg border border-brand-primary/20">
                 <Shield className="w-5 h-5" />
              </div>
              <span className="font-mono font-bold tracking-widest text-sm">SENTINEL AI</span>
            </div>

            <h1 className="text-3xl md:text-4xl font-bold text-white mb-6 leading-tight">
              Autonomous <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-primary to-orange-400">Risk Assurance</span>
            </h1>
            
            <p className="text-slate-400 leading-relaxed text-sm mb-8">
              Replace manual sampling with <strong>100% population verification</strong>. Sentinel deploys a fleet of specialized AI agents to continuously audit your Identity, Finance, and Infrastructure controls.
            </p>
          
            <div className="space-y-4">
               <div className="flex items-center space-x-3 text-sm text-slate-300">
                 <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-400 border border-emerald-500/20"><TrendingUp size={16} /></div>
                 <span>Continuous Compliance Monitoring</span>
               </div>
               <div className="flex items-center space-x-3 text-sm text-slate-300">
                 <div className="p-2 bg-brand-primary/10 rounded-lg text-brand-primary border border-brand-primary/20"><Zap size={16} /></div>
                 <span>Zero-Touch Autonomous Execution</span>
               </div>
               <div className="flex items-center space-x-3 text-sm text-slate-300">
                 <div className="p-2 bg-purple-500/10 rounded-lg text-purple-400 border border-purple-500/20"><Lock size={16} /></div>
                 <span>Immutable Audit Trails</span>
               </div>
            </div>
          </div>

          <div className="p-6 border-t border-slate-800 bg-slate-900/80 backdrop-blur-sm z-10">
            <button 
              onClick={onStart}
              className="w-full group relative flex items-center justify-center space-x-2 bg-gradient-to-r from-brand-primary to-orange-600 hover:from-orange-500 hover:to-red-500 text-white px-6 py-4 rounded-xl font-bold transition-all shadow-lg shadow-orange-900/30 hover:shadow-orange-900/50 hover:scale-[1.02] active:scale-[0.98]"
            >
              <span className="tracking-wide">Launch Simulation</span>
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
            <div className="text-center mt-3">
              <span className="text-[10px] text-slate-500 uppercase tracking-widest">Enterprise Edition v2.4</span>
            </div>
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div className="md:w-[60%] bg-slate-950 flex flex-col overflow-hidden relative">
          
          <div className="flex-1 overflow-y-auto p-8 scroll-smooth">
            <div className="mb-8">
               <h2 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-6 flex items-center">
                  <span className="w-1 h-4 bg-brand-primary rounded-full mr-3"></span>
                  Active Agent Fleet
               </h2>

               <div className="grid gap-4">
                  <div className="group p-4 rounded-xl bg-slate-900 border border-slate-800 hover:border-brand-primary/30 transition-all duration-300">
                    <div className="flex items-start justify-between mb-2">
                       <div className="flex items-center space-x-3">
                          <div className="p-2 bg-slate-800 border border-slate-700 rounded-lg">
                             <Shield size={18} className="text-slate-400" />
                          </div>
                          <h3 className="font-semibold text-slate-200">Access Control Effectiveness</h3>
                       </div>
                       <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-1 rounded border border-slate-700">Identity</span>
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed pl-[44px]">
                       Detects toxic SoD combinations (e.g., Create Vendor + Pay Vendor) and identifies orphaned accounts by correlating HRIS and IdP data.
                    </p>
                  </div>

                  <div className="group p-4 rounded-xl bg-slate-900 border border-slate-800 hover:border-brand-primary/30 transition-all duration-300">
                    <div className="flex items-start justify-between mb-2">
                       <div className="flex items-center space-x-3">
                          <div className="p-2 bg-slate-800 border border-slate-700 rounded-lg">
                             <FileSearch size={18} className="text-slate-400" />
                          </div>
                          <h3 className="font-semibold text-slate-200">Audit Evidence Collection</h3>
                       </div>
                       <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-1 rounded border border-slate-700">Compliance</span>
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed pl-[44px]">
                       Validates 100% of change tickets against deployment logs. Generates SHA-256 hashed evidence packages for external auditors.
                    </p>
                  </div>

                  <div className="group p-4 rounded-xl bg-slate-900 border border-slate-800 hover:border-brand-primary/30 transition-all duration-300">
                    <div className="flex items-start justify-between mb-2">
                       <div className="flex items-center space-x-3">
                          <div className="p-2 bg-slate-800 border border-slate-700 rounded-lg">
                             <Zap size={18} className="text-slate-400" />
                          </div>
                          <h3 className="font-semibold text-slate-200">Anomaly Detection</h3>
                       </div>
                       <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-1 rounded border border-slate-700">Forensics</span>
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed pl-[44px]">
                       Applies Benford's Law and Z-Score analysis to General Ledger data to identify fraud patterns like structuring and ghost vendors.
                    </p>
                  </div>
               </div>
            </div>

            <div>
               <h2 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-6 flex items-center">
                  <span className="w-1 h-4 bg-emerald-500 rounded-full mr-3"></span>
                  System Capabilities
               </h2>
               <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-slate-900/50 rounded-lg border border-slate-800/50">
                     <div className="text-xs text-slate-500 mb-1">Coverage</div>
                     <div className="text-sm font-bold text-white">100% Population</div>
                  </div>
                  <div className="p-3 bg-slate-900/50 rounded-lg border border-slate-800/50">
                     <div className="text-xs text-slate-500 mb-1">Frequency</div>
                     <div className="text-sm font-bold text-white">Continuous</div>
                  </div>
                  <div className="p-3 bg-slate-900/50 rounded-lg border border-slate-800/50">
                     <div className="text-xs text-slate-500 mb-1">Integration</div>
                     <div className="text-sm font-bold text-white">Read-Only API</div>
                  </div>
                  <div className="p-3 bg-slate-900/50 rounded-lg border border-slate-800/50">
                     <div className="text-xs text-slate-500 mb-1">Reporting</div>
                     <div className="text-sm font-bold text-white">Digitally Signed</div>
                  </div>
               </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

export default WelcomeModal;