import React, { useState } from 'react';
import { Risk, Control, AgentStatus, ActiveSession, AuditResult, AgentCapability, CapabilityDefinition } from '../types';
import { X, Code2, Terminal as TerminalIcon, Settings, Thermometer, BoxSelect } from 'lucide-react';
import ReportModal from './ReportModal';
import AddRiskModal from './AddRiskModal';
import AddAgentModal from './AddAgentModal';
import { getAgentSystemInstruction } from '../services/prompts';
import { INITIAL_AGENT_CATALOG, AGENT_BLUEPRINTS, INITIAL_CAPABILITIES, INTEGRATIONS } from '../constants';
import Sidebar from './Sidebar';
import CommandCenterView from './views/CommandCenterView';
import AnalyticsView from './views/AnalyticsView';
import AgentPortfolioView from './views/AgentPortfolioView';
import IntegrationsView from './views/IntegrationsView';
import CIAMView from './views/CIAMView';
import CapabilitiesView from './views/CapabilitiesView';
import SwarmView from './views/SwarmView';

interface RiskDashboardProps {
  risks: Risk[];
  activeSessions: Record<string, ActiveSession>;
  onDeployAgent: (risk: Risk, control: Control) => void;
  onStopAgent: (controlId: string) => void;
  completedAudits: Record<string, AuditResult>;
  onReset: () => void;
  onAddRisk: (risk: Risk) => void;
}

const RiskDashboard: React.FC<RiskDashboardProps> = ({ risks, activeSessions, onDeployAgent, onStopAgent, completedAudits, onReset, onAddRisk }) => {
  const [selectedRiskId, setSelectedRiskId] = useState<string | null>(risks[0]?.id || null);
  const [viewMode, setViewMode] = useState<'ops' | 'analytics' | 'portfolio' | 'integrations' | 'ciam' | 'capabilities' | 'swarm'>('ops');
  const [agents, setAgents] = useState(INITIAL_AGENT_CATALOG);
  const [capabilities, setCapabilities] = useState<CapabilityDefinition[]>(INITIAL_CAPABILITIES);
  
  // State for Modals
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [addRiskModalOpen, setAddRiskModalOpen] = useState(false);
  const [addAgentModalOpen, setAddAgentModalOpen] = useState(false);
  
  const [selectedReportControlId, setSelectedReportControlId] = useState<string | null>(null);
  const [selectedAgentId, setSelectedAgentId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'logic' | 'prompt'>('logic');

  const selectedRisk = risks.find(r => r.id === selectedRiskId);
  const selectedAgent = agents.find(a => a.id === selectedAgentId);
  
  // Dashboard Metrics
  const totalControls = risks.reduce((acc, r) => acc + r.controls.length, 0);
  const completedCount = Object.keys(completedAudits).length;
  const passedCount = Object.values(completedAudits).filter((a: AuditResult) => a.effective).length;
  const coverage = Math.round((completedCount / totalControls) * 100) || 0;
  const effectiveRate = Math.round((passedCount / completedCount) * 100) || 0;

  const handleOpenReport = (controlId: string) => {
    setSelectedReportControlId(controlId);
    setReportModalOpen(true);
  };

  const handleAddAgent = (newAgent: any) => {
    setAgents([...agents, newAgent]);
    setAddAgentModalOpen(false);
  };

  const handleAddCapability = (newCap: CapabilityDefinition) => {
    setCapabilities([...capabilities, newCap]);
  };

  const handleDeleteCapability = (id: string) => {
    setCapabilities(capabilities.filter(c => c.id !== id));
  };

  // Prepare Report Data
  const reportRisk = selectedRisk;
  const reportControl = selectedRisk?.controls.find(c => c.id === selectedReportControlId);
  const reportResult = selectedReportControlId ? completedAudits[selectedReportControlId] : null;

  const getCodeContent = () => {
    if (!selectedAgent) return '';
    if (activeTab === 'logic') {
      return AGENT_BLUEPRINTS[selectedAgent.id] || '// Logic blueprint unavailable for this agent type.';
    } else {
       if (selectedAgent.config?.systemInstruction) {
         return selectedAgent.config.systemInstruction;
       }
       const mockRisk: Risk = {
         id: 'PREVIEW',
         title: 'Example Risk Scenario',
         description: 'This is a simulated risk context to demonstrate how the agent receives instructions.',
         severity: Object.values(AgentStatus)[0] as any,
         category: 'Simulation',
         scoring: 100,
         controls: []
       };
       return getAgentSystemInstruction(mockRisk, 'Example_Target_Control', selectedAgent.id as any);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-slate-950 text-slate-200 font-sans overflow-hidden">
      
      {/* GLOBAL HEADER (Full Width) - Centrado agregado aquí */}
      <header className="h-18 bg-brand-dark border-b border-slate-800 flex items-center justify-center px-6 py-4 shrink-0 z-50">
        <div className="flex items-center gap-4">
            {/* Logo */}
            <div className="w-10 h-10 rounded-xl overflow-hidden border border-slate-700/50 shadow-lg">
              <img
                src="https://cdn.brandfetch.io/id4YZ7PWEj/w/200/h/200/theme/dark/icon.jpeg?c=1bxid64Mup7aczewSAYMX&t=1761617484712"
                alt="Endava Sentinel AI Autonomous Risk Assurance"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Title */}
            <div className="flex flex-col leading-tight">
              <span className="text-xl font-black tracking-tight text-white">
                Sentinel AI
              </span>
              <span className="text-[10px] font-bold tracking-wide text-brand-primary uppercase">
                Autonomous Risk Assurance
              </span>
            </div>
        </div>
      </header>

      {/* MAIN LAYOUT (Sidebar + Content) */}
      <div className="flex flex-1 overflow-hidden">
          
          {/* SIDEBAR NAVIGATION */}
          <Sidebar viewMode={viewMode} setViewMode={setViewMode} onReset={onReset} />

          {/* MAIN CONTENT AREA */}
          <main className="flex-1 flex flex-col overflow-hidden relative bg-slate-950">
            
            {viewMode === 'portfolio' && (
              <AgentPortfolioView 
                agents={agents} 
                onAddAgent={() => setAddAgentModalOpen(true)} 
                onSelectAgent={(id) => { setSelectedAgentId(id); setActiveTab('logic'); }}
              />
            )}

            {viewMode === 'integrations' && (
              <IntegrationsView />
            )}
            
            {viewMode === 'ciam' && (
              <CIAMView />
            )}

            {viewMode === 'capabilities' && (
              <CapabilitiesView 
                capabilities={capabilities}
                onAddCapability={handleAddCapability}
                onDeleteCapability={handleDeleteCapability}
              />
            )}

            {viewMode === 'swarm' && (
              <SwarmView />
            )}

            {viewMode === 'ops' && (
              <CommandCenterView 
                risks={risks}
                selectedRiskId={selectedRiskId}
                setSelectedRiskId={setSelectedRiskId}
                activeSessions={activeSessions}
                completedAudits={completedAudits}
                onDeployAgent={onDeployAgent}
                onStopAgent={onStopAgent}
                onOpenReport={handleOpenReport}
                onAddRisk={() => setAddRiskModalOpen(true)}
                coverage={coverage}
                effectiveRate={effectiveRate}
                agents={agents}
              />
            )}
            
            {viewMode === 'analytics' && (
              <AnalyticsView 
                  risks={risks} 
                  completedAudits={completedAudits} 
                  totalControls={totalControls} 
                  agentsCount={agents.length} 
              />
            )}

          </main>
      </div>

      {/* MODALS */}
      {reportRisk && reportControl && reportResult && (
        <ReportModal 
          isOpen={reportModalOpen} 
          onClose={() => setReportModalOpen(false)}
          risk={reportRisk}
          control={reportControl}
          result={reportResult}
        />
      )}
      
      <AddRiskModal
        isOpen={addRiskModalOpen}
        onClose={() => setAddRiskModalOpen(false)}
        onAdd={onAddRisk}
        existingCount={risks.length}
      />

      <AddAgentModal
         isOpen={addAgentModalOpen}
         onClose={() => setAddAgentModalOpen(false)}
         onAdd={handleAddAgent}
         availableCapabilities={capabilities}
      />

      {/* AGENT DETAILS MODAL */}
      {selectedAgent && (
         <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/90 backdrop-blur-md p-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="bg-slate-900 border border-slate-700 rounded-xl max-w-5xl w-full shadow-2xl overflow-hidden flex flex-col h-[90vh]">
               <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-slate-800/50 shrink-0">
                  <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-lg ${selectedAgent.bg} ${selectedAgent.color}`}>
                         <selectedAgent.icon className="w-6 h-6" />
                      </div>
                      <div>
                         <h2 className="text-xl font-bold text-white">{selectedAgent.name}</h2>
                         <div className="text-xs text-slate-400 font-mono flex items-center space-x-2">
                            <span>AGENT_ID: {selectedAgent.id}</span>
                            <span>•</span>
                            <span className="text-brand-primary">v2.4.0-STABLE</span>
                         </div>
                      </div>
                  </div>
                  <button onClick={() => setSelectedAgentId(null)} className="text-slate-500 hover:text-white transition-colors">
                      <X className="w-6 h-6" />
                  </button>
               </div>
               
               <div className="flex-1 min-h-0 flex flex-col md:flex-row">
                  <div className="w-full md:w-64 border-b md:border-b-0 md:border-r border-slate-800 p-6 bg-slate-900/50 order-2 md:order-1 overflow-y-auto">
                      <div className="mb-6">
                         <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Capabilities</div>
                         <ul className="space-y-2">
                            {selectedAgent.capabilities.map((cap: string) => (
                               <li key={cap} className="text-sm text-slate-300 flex items-start">
                                   <div className="w-1.5 h-1.5 rounded-full bg-brand-primary mt-1.5 mr-2 shrink-0"></div>
                                   {cap}
                               </li>
                            ))}
                         </ul>
                      </div>
                      <div className="mb-6">
                         <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Connected Systems</div>
                         <div className="flex flex-col space-y-2">
                              {selectedAgent.requiredIntegrations?.map((intId: string) => {
                                const integration = INTEGRATIONS.find(i => i.id === intId);
                                if (!integration) return null;
                                const statusBg = integration.status === 'connected' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 
                                                 integration.status === 'error' ? 'bg-red-500/10 text-red-400 border-red-500/20' : 
                                                 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
                                const dotColor = integration.status === 'connected' ? 'bg-emerald-400' : 
                                                 integration.status === 'error' ? 'bg-red-400' : 'bg-yellow-400';
                                return (
                                 <div key={intId} className="flex items-center justify-between px-3 py-2 rounded bg-slate-950 border border-slate-800 text-xs text-slate-300 w-full">
                                      <div className="flex items-center space-x-2">
                                         <integration.icon className={`w-4 h-4 ${integration.color}`} />
                                         <span className="font-medium">{integration.name}</span>
                                      </div>
                                      <div className={`flex items-center space-x-1.5 px-2 py-0.5 rounded-full border text-[10px] uppercase font-bold tracking-wider ${statusBg}`}>
                                         <div className={`w-1.5 h-1.5 rounded-full ${dotColor}`}></div>
                                         <span>{integration.status}</span>
                                      </div>
                                 </div>
                                )
                              })}
                         </div>
                      </div>
                      <div className="mb-6">
                         <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Model Spec</div>
                         <div className="p-3 bg-slate-950 rounded border border-slate-800 text-xs font-mono text-slate-400 space-y-2">
                            <div className="flex justify-between">
                               <span>Base:</span> <span className="text-slate-200">{selectedAgent.model}</span>
                            </div>
                            {selectedAgent.config ? (
                               <>
                                   <div className="flex justify-between items-center pt-2 border-t border-slate-800/50">
                                      <span className="flex items-center"><Thermometer className="w-3 h-3 mr-1"/> Temp:</span> 
                                      <span className="text-brand-primary">{selectedAgent.config.temperature}</span>
                                   </div>
                                   <div className="flex justify-between items-center">
                                      <span className="flex items-center"><BoxSelect className="w-3 h-3 mr-1"/> Tokens:</span> 
                                      <span className="text-brand-primary">{selectedAgent.config.maxTokens}</span>
                                   </div>
                               </>
                            ) : (
                               <>
                                   <div className="flex justify-between"><span>Temp:</span> <span className="text-slate-200">0.2</span></div>
                                   <div className="flex justify-between"><span>Context:</span> <span className="text-slate-200">1M</span></div>
                               </>
                            )}
                         </div>
                      </div>
                  </div>

                  <div className="flex-1 bg-[#1e1e1e] flex flex-col min-h-0 order-1 md:order-2 overflow-hidden">
                      <div className="flex items-center bg-[#252526] text-xs text-slate-400 border-b border-slate-700 select-none shrink-0">
                         <button 
                           onClick={() => setActiveTab('logic')}
                           className={`px-4 py-2 flex items-center space-x-2 border-t-2 transition-colors ${activeTab === 'logic' ? 'bg-[#1e1e1e] text-brand-primary border-brand-primary' : 'hover:bg-[#2a2d2e] border-transparent'}`}
                         >
                            <Code2 size={12} className={activeTab === 'logic' ? 'text-yellow-400' : ''} />
                            <span>agent_logic.ts</span>
                         </button>
                         <button 
                           onClick={() => setActiveTab('prompt')}
                           className={`px-4 py-2 flex items-center space-x-2 border-t-2 transition-colors ${activeTab === 'prompt' ? 'bg-[#1e1e1e] text-brand-primary border-brand-primary' : 'hover:bg-[#2a2d2e] border-transparent'}`}
                         >
                            <TerminalIcon size={12} className={activeTab === 'prompt' ? 'text-emerald-400' : ''} />
                            <span>system_prompt.md</span>
                         </button>
                      </div>
                      <div className="flex-1 flex overflow-hidden font-mono text-sm leading-6">
                         <div className="w-12 bg-[#1e1e1e] text-slate-600 text-right pr-3 pt-4 select-none border-r border-slate-800 shrink-0 overflow-hidden">
                            {getCodeContent().split('\n').map((_, i) => (<div key={i}>{i + 1}</div>))}
                         </div>
                         <div className="flex-1 overflow-auto p-4 pt-4 text-slate-300">
                            <pre className="whitespace-pre"><code>{getCodeContent()}</code></pre>
                         </div>
                      </div>
                  </div>
               </div>
               
               <div className="p-4 border-t border-slate-800 bg-slate-900 flex justify-end space-x-3 shrink-0">
                  <button onClick={() => setSelectedAgentId(null)} className="px-4 py-2 rounded-lg text-sm text-slate-400 hover:text-white hover:bg-slate-800 transition-colors">Close</button>
                  <button 
                     onClick={() => { setSelectedAgentId(null); setViewMode('ops'); }} 
                     className="px-4 py-2 rounded-lg text-sm bg-brand-primary hover:bg-orange-600 text-white font-medium shadow-lg shadow-orange-900/20"
                  >
                     Deploy Agent
                  </button>
               </div>
            </div>
         </div>
      )}
    </div>
  );
};

export default RiskDashboard;