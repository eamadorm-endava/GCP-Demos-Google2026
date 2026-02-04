import React, { useState } from 'react';
import { AgentRole, AgentStatus, AgentLogEntry } from '../types';
import { MOCK_AGENT_LOGS, AGENT_DIRECTIVES } from '../constants';

const AGENTS: AgentStatus[] = [
  { id: '1', role: AgentRole.DOCUMENTATION, status: 'success', lastAction: 'Validated 54 PDF evidence files', performanceScore: 98 },
  { id: '2', role: AgentRole.TOE, status: 'processing', lastAction: 'Running sampling on Q2 GLBA datasets', performanceScore: 92 },
  { id: '3', role: AgentRole.TOD, status: 'warning', lastAction: 'Reviewing COSO framework gaps', performanceScore: 88 },
  { id: '4', role: AgentRole.SUPERVISOR, status: 'idle', lastAction: 'Orchestrating system-wide audit trail', performanceScore: 100 },
];

const AgentControlRoom: React.FC = () => {
  const [selectedAgent, setSelectedAgent] = useState<AgentRole | null>(null);
  const [modalTab, setModalTab] = useState<'logs' | 'directives'>('logs');

  const openModal = (agent: AgentRole, tab: 'logs' | 'directives' = 'logs') => {
    setSelectedAgent(agent);
    setModalTab(tab);
  };

  const closeLogs = () => setSelectedAgent(null);

  return (
    <div className="space-y-6 relative">
      {/* Header Banner */}
      <div className="flex justify-between items-center bg-brand-gradient text-white p-6 rounded-xl shadow-lg relative overflow-hidden">
        <div className="relative z-10">
          <h2 className="text-2xl font-bold mb-2">Agentic Orchestration Layer</h2>
          <p className="text-white/80 text-sm">Real-time status tracking for the multi-agent compliance framework.</p>
        </div>
        <div className="absolute right-0 top-0 opacity-20 text-9xl text-white">
          <i className="fas fa-microchip"></i>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {AGENTS.map((agent) => (
          <div key={agent.id} className="bg-brand-secondary border border-brand-border rounded-xl overflow-hidden shadow-lg hover:border-brand-primary/50 transition-colors">
            <div className={`h-1.5 w-full ${
              agent.status === 'success' ? 'bg-signal-green' :
              agent.status === 'processing' ? 'bg-signal-blue animate-pulse' :
              agent.status === 'warning' ? 'bg-signal-amber' : 'bg-brand-muted'
            }`} />
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h4 className="font-bold text-white text-lg">{agent.role}</h4>
                <span className={`text-[10px] px-2 py-1 rounded-full uppercase font-bold tracking-wider ${
                  agent.status === 'success' ? 'bg-signal-green/20 text-signal-green' :
                  agent.status === 'processing' ? 'bg-signal-blue/20 text-signal-blue' :
                  agent.status === 'warning' ? 'bg-signal-amber/20 text-signal-amber' : 'bg-brand-dark text-brand-muted'
                }`}>
                  {agent.status}
                </span>
              </div>
              <div className="space-y-3">
                <div className="flex items-center text-sm text-brand-muted">
                  <i className="fas fa-bolt mr-2 w-5 text-brand-primary"></i>
                  <span><strong className="text-white">Last Action:</strong> {agent.lastAction}</span>
                </div>
                <div className="flex items-center text-sm text-brand-muted">
                  <i className="fas fa-gauge-high mr-2 w-5 text-data-violet"></i>
                  <span><strong className="text-white">Performance:</strong> {agent.performanceScore}% Fidelity</span>
                </div>
                <div className="w-full bg-brand-dark h-1.5 rounded-full mt-2 border border-brand-border">
                  <div className="bg-brand-primary h-full rounded-full" style={{ width: `${agent.performanceScore}%` }}></div>
                </div>
              </div>
              <div className="mt-6 pt-4 border-t border-brand-border flex gap-2">
                <button 
                  onClick={() => openModal(agent.role, 'logs')}
                  className="flex-1 text-xs bg-brand-dark text-brand-muted py-2 rounded border border-brand-border hover:text-white hover:border-brand-primary transition-colors font-bold uppercase tracking-tight cursor-pointer"
                >
                  <i className="fas fa-list-ul mr-2"></i>
                  Logs
                </button>
                <button 
                  onClick={() => openModal(agent.role, 'directives')}
                  className="flex-1 text-xs bg-brand-primary/10 text-brand-primary py-2 rounded border border-brand-primary/30 hover:bg-brand-primary hover:text-white transition-colors font-bold uppercase tracking-tight cursor-pointer"
                >
                  <i className="fas fa-scroll mr-2"></i>
                  Role Specs
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Inter-Agent Communication */}
      <div className="bg-brand-secondary p-8 rounded-xl border border-brand-border shadow-lg">
        <h3 className="text-xl font-bold mb-6 flex items-center text-white">
          <i className="fas fa-network-wired mr-3 text-brand-primary"></i>
          Inter-Agent Communication Log
        </h3>
        <div className="space-y-4">
          {[
            { from: 'Agent 1', to: 'Agent 2', msg: 'Sync complete: 4,500 Trade Records transferred via Flat File API.', time: '2 mins ago' },
            { from: 'Agent 2', to: 'Agent 4', msg: 'Anomaly Detected: Pattern mismatch in SEC Rule 204-2 records.', time: '10 mins ago' },
            { from: 'Agent 4', to: 'Human Manager', msg: 'Escalation required: Design gap in TILA Disclosure logic.', time: '15 mins ago' },
          ].map((log, i) => (
            <div key={i} className="flex items-start gap-4 p-4 rounded-lg bg-brand-dark border border-brand-border">
              <div className="flex -space-x-2 mt-1">
                <div className="w-8 h-8 rounded-full bg-data-blue flex items-center justify-center text-white text-[10px] ring-2 ring-brand-dark">A{log.from.split(' ')[1]}</div>
                <div className="w-8 h-8 rounded-full bg-brand-primary flex items-center justify-center text-white text-[10px] ring-2 ring-brand-dark">A{log.to.split(' ')[1]}</div>
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs font-bold text-brand-muted uppercase tracking-widest">{log.from} &rarr; {log.to}</span>
                  <span className="text-xs text-brand-muted italic">{log.time}</span>
                </div>
                <p className="text-sm text-white">{log.msg}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Log Modal / Drawer */}
      {selectedAgent && (
        <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-brand-secondary w-full max-w-2xl h-full shadow-2xl flex flex-col animate-slideInRight border-l border-brand-border">
            <div className="p-6 border-b border-brand-border flex justify-between items-center bg-brand-secondary">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded bg-brand-primary flex items-center justify-center text-white">
                  <i className={`fas ${modalTab === 'logs' ? 'fa-terminal' : 'fa-scroll'}`}></i>
                </div>
                <div>
                  <h3 className="font-bold text-lg text-white uppercase tracking-tight">{selectedAgent}</h3>
                  <p className="text-xs text-brand-muted">{modalTab === 'logs' ? 'Live System Operational Stream' : 'Underlying Agent Directives'}</p>
                </div>
              </div>
              <button 
                onClick={closeLogs}
                className="w-10 h-10 rounded hover:bg-brand-dark flex items-center justify-center transition-colors cursor-pointer"
              >
                <i className="fas fa-times text-brand-muted"></i>
              </button>
            </div>

            {/* Modal Tabs */}
            <div className="flex bg-brand-dark px-6 border-b border-brand-border">
              <button 
                onClick={() => setModalTab('logs')}
                className={`px-6 py-3 text-xs font-bold uppercase tracking-widest border-b-2 transition-colors cursor-pointer ${
                  modalTab === 'logs' ? 'border-brand-primary text-brand-primary' : 'border-transparent text-brand-muted hover:text-white'
                }`}
              >
                Operational Logs
              </button>
              <button 
                onClick={() => setModalTab('directives')}
                className={`px-6 py-3 text-xs font-bold uppercase tracking-widest border-b-2 transition-colors cursor-pointer ${
                  modalTab === 'directives' ? 'border-brand-primary text-brand-primary' : 'border-transparent text-brand-muted hover:text-white'
                }`}
              >
                Agent Directives
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-8 space-y-6 bg-brand-dark">
              {modalTab === 'logs' ? (
                <div className="font-mono space-y-3">
                  <div className="text-[10px] text-brand-muted mb-4 pb-2 border-b border-brand-border">
                    # INITIALIZING LOG STREAM FOR {selectedAgent.toUpperCase()}...
                    <br />
                    # SESSION ID: {Math.random().toString(36).substr(2, 9).toUpperCase()}
                  </div>
                  {MOCK_AGENT_LOGS[selectedAgent].map((log) => (
                    <div key={log.id} className="text-sm py-1 border-b border-brand-border/30 flex gap-4">
                      <span className="text-brand-muted/50 shrink-0">[{log.timestamp.split(' ')[1]}]</span>
                      <span className={`shrink-0 uppercase font-bold text-[10px] mt-1 ${
                        log.level === 'success' ? 'text-signal-green' :
                        log.level === 'warning' ? 'text-signal-amber' :
                        log.level === 'error' ? 'text-signal-red' : 'text-signal-blue'
                      }`}>
                        {log.level}
                      </span>
                      <span className="text-brand-muted">{log.message}</span>
                    </div>
                  ))}
                  <div className="text-[10px] text-brand-primary animate-pulse mt-4 italic">
                    Listening for new events...
                  </div>
                </div>
              ) : (
                <div className="space-y-8 animate-fadeIn text-white">
                  <section>
                    <h4 className="text-[10px] font-bold text-brand-muted uppercase tracking-widest mb-3 flex items-center">
                      <i className="fas fa-bullseye mr-2 text-signal-red"></i> Mission Statement
                    </h4>
                    <p className="text-lg font-medium text-white leading-relaxed italic border-l-4 border-brand-primary pl-4">
                      "{AGENT_DIRECTIVES[selectedAgent].mission}"
                    </p>
                  </section>

                  <section>
                    <h4 className="text-[10px] font-bold text-brand-muted uppercase tracking-widest mb-4 flex items-center">
                      <i className="fas fa-list-check mr-2 text-signal-blue"></i> Core Responsibilities
                    </h4>
                    <ul className="grid grid-cols-1 gap-3">
                      {AGENT_DIRECTIVES[selectedAgent].responsibilities.map((resp: string, i: number) => (
                        <li key={i} className="flex items-start gap-3 p-3 rounded-lg bg-brand-secondary border border-brand-border text-sm text-brand-muted">
                          <i className="fas fa-circle-check text-signal-green mt-1 shrink-0"></i>
                          {resp}
                        </li>
                      ))}
                    </ul>
                  </section>

                  <section>
                    <h4 className="text-[10px] font-bold text-brand-muted uppercase tracking-widest mb-4 flex items-center">
                      <i className="fas fa-ban mr-2 text-signal-amber"></i> Operational Constraints
                    </h4>
                    <div className="bg-signal-amber/10 border border-signal-amber/30 rounded-xl p-4 space-y-2">
                      {AGENT_DIRECTIVES[selectedAgent].constraints.map((cons: string, i: number) => (
                        <div key={i} className="flex items-center gap-3 text-xs text-signal-amber font-medium">
                          <div className="w-1.5 h-1.5 bg-signal-amber rounded-full"></div>
                          {cons}
                        </div>
                      ))}
                    </div>
                  </section>

                  <section>
                    <h4 className="text-[10px] font-bold text-brand-muted uppercase tracking-widest mb-3 flex items-center">
                      <i className="fas fa-code-branch mr-2 text-data-violet"></i> Standard Operating Procedure
                    </h4>
                    <div className="bg-black/30 rounded-lg p-4 text-xs font-mono text-brand-muted border border-brand-border">
                      {AGENT_DIRECTIVES[selectedAgent].sop}
                    </div>
                  </section>
                </div>
              )}
            </div>
            
            <div className="p-4 bg-brand-secondary border-t border-brand-border flex justify-between items-center">
              <p className="text-xs text-brand-muted italic">
                {modalTab === 'logs' ? 'Logs are immutable and stored in encrypted cold storage.' : 'Directives are signed and version-controlled.'}
              </p>
              <button className="text-xs font-bold text-brand-primary hover:text-white transition-colors cursor-pointer">
                <i className={`fas ${modalTab === 'logs' ? 'fa-download' : 'fa-print'} mr-1`}></i> 
                {modalTab === 'logs' ? 'EXPORT LOGS' : 'PRINT SPECS'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AgentControlRoom;