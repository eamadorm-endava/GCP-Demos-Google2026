import React, { useState } from 'react';
import { Shield, LayoutDashboard, LineChart, Briefcase, Network, Activity, Code, ChevronDown, ChevronRight, Settings, Layers, Cpu, Globe } from 'lucide-react';

interface SidebarProps {
  viewMode: 'ops' | 'analytics' | 'portfolio' | 'integrations' | 'ciam' | 'capabilities' | 'swarm';
  setViewMode: (mode: 'ops' | 'analytics' | 'portfolio' | 'integrations' | 'ciam' | 'capabilities' | 'swarm') => void;
  onReset: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ viewMode, setViewMode, onReset }) => {
  const [sectionsOpen, setSectionsOpen] = useState({
    operations: true,
    configuration: false
  });

  const toggleSection = (section: keyof typeof sectionsOpen) => {
    setSectionsOpen(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const NavItem = ({ mode, icon: Icon, label }: { mode: 'ops' | 'analytics' | 'portfolio' | 'integrations' | 'ciam' | 'capabilities' | 'swarm', icon: any, label: string }) => (
    <button 
      onClick={() => setViewMode(mode)}
      className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-all duration-200 text-sm font-medium border ${
        viewMode === mode 
          /* ESTADO ACTIVO: Naranja Endava */
          ? 'bg-brand-primary/10 text-brand-primary border-brand-primary/20 shadow-[0_0_15px_rgba(255,85,64,0.1)]' 
          : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200 border-transparent'
      }`}
    >
      <Icon className={`w-4 h-4 ${viewMode === mode ? 'text-brand-primary' : 'text-slate-500'}`} />
      <span>{label}</span>
    </button>
  );

  return (
    <aside className="w-64 bg-brand-dark border-r border-slate-800 flex flex-col shrink-0 z-20">
      {/* Brand Header */}
      <div className="p-6 border-b border-slate-800 flex items-center space-x-3 bg-slate-900/50">
        {/* Logo Icon con Gradiente Naranja */}
        <div className="bg-gradient-to-br from-brand-primary to-orange-600 p-2 rounded-lg shadow-lg shadow-orange-900/20">
          <Shield className="w-5 h-5 text-white" />
        </div>
        <div>
           <h1 className="font-bold text-white tracking-wide text-lg">SENTINEL</h1>
           <div className="text-[10px] text-brand-primary font-mono tracking-widest uppercase opacity-80">AI Assurance</div>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        
        {/* Operations Section */}
        <div className="mb-2">
           <button 
             onClick={() => toggleSection('operations')}
             className="w-full flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 px-3 py-2 hover:text-slate-300 transition-colors"
           >
             <div className="flex items-center space-x-2">
               <Layers className="w-3 h-3" />
               <span>Risk Operations</span>
             </div>
             {sectionsOpen.operations ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
           </button>
           
           {sectionsOpen.operations && (
             <div className="space-y-1 animate-in slide-in-from-top-2 duration-200">
                <NavItem mode="ops" icon={LayoutDashboard} label="Command Center" />
                <NavItem mode="swarm" icon={Globe} label="Swarm Intelligence" />
                <NavItem mode="ciam" icon={Code} label="CIAM Attestation" />
                <NavItem mode="analytics" icon={LineChart} label="Analytics & Trends" />
             </div>
           )}
        </div>

        {/* Separator */}
        <div className="h-px bg-slate-800/50 my-2 mx-3"></div>

        {/* Configuration Section */}
        <div>
           <button 
             onClick={() => toggleSection('configuration')}
             className="w-full flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 px-3 py-2 hover:text-slate-300 transition-colors"
           >
             <div className="flex items-center space-x-2">
               <Settings className="w-3 h-3" />
               <span>System Config</span>
             </div>
             {sectionsOpen.configuration ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
           </button>
           
           {sectionsOpen.configuration && (
             <div className="space-y-1 animate-in slide-in-from-top-2 duration-200">
                <NavItem mode="portfolio" icon={Briefcase} label="Agent Portfolio" />
                <NavItem mode="integrations" icon={Network} label="Integrations" />
                <NavItem mode="capabilities" icon={Cpu} label="Core Capabilities" />
             </div>
           )}
        </div>

      </nav>

      {/* Footer Actions */}
      <div className="p-4 border-t border-slate-800 bg-slate-900/30">
         <button 
            onClick={onReset} 
            className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg transition-colors text-xs font-medium border border-slate-700 hover:border-brand-primary/50 group"
         >
            <Activity className="w-3 h-3 group-hover:text-brand-primary transition-colors" />
            <span>Reset Simulation</span>
         </button>
      </div>
    </aside>
  );
};

export default Sidebar;