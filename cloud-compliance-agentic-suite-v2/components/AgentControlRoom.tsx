
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
      <div className="flex justify-between items-center bg-blue-900 text-white p-6 rounded-xl shadow-lg relative overflow-hidden">
        <div className="relative z-10">
          <h2 className="text-2xl font-bold mb-2">Agentic Orchestration Layer</h2>
          <p className="text-blue-200 text-sm">Real-time status tracking for the multi-agent compliance framework.</p>
        </div>
        <div className="absolute right-0 top-0 opacity-10 text-9xl">
          <i className="fas fa-microchip"></i>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {AGENTS.map((agent) => (
          <div key={agent.id} className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
            <div className={`h-2 w-full ${
              agent.status === 'success' ? 'bg-green-500' :
              agent.status === 'processing' ? 'bg-blue-500 animate-pulse' :
              agent.status === 'warning' ? 'bg-orange-500' : 'bg-gray-400'
            }`} />
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h4 className="font-bold text-gray-800">{agent.role}</h4>
                <span className={`text-[10px] px-2 py-1 rounded-full uppercase font-bold tracking-wider ${
                  agent.status === 'success' ? 'bg-green-50 text-green-700' :
                  agent.status === 'processing' ? 'bg-blue-50 text-blue-700' :
                  agent.status === 'warning' ? 'bg-orange-50 text-orange-700' : 'bg-gray-100 text-gray-600'
                }`}>
                  {agent.status}
                </span>
              </div>
              <div className="space-y-3">
                <div className="flex items-center text-sm text-gray-600">
                  <i className="fas fa-bolt mr-2 w-5 text-yellow-500"></i>
                  <span><strong>Last Action:</strong> {agent.lastAction}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <i className="fas fa-gauge-high mr-2 w-5 text-indigo-500"></i>
                  <span><strong>Performance:</strong> {agent.performanceScore}% Fidelity</span>
                </div>
                <div className="w-full bg-gray-100 h-1.5 rounded-full mt-2">
                  <div className="bg-indigo-600 h-full rounded-full" style={{ width: `${agent.performanceScore}%` }}></div>
                </div>
              </div>
              <div className="mt-6 pt-4 border-t border-gray-50 flex gap-2">
                <button 
                  onClick={() => openModal(agent.role, 'logs')}
                  className="flex-1 text-xs bg-gray-50 text-gray-600 py-2 rounded-lg hover:bg-gray-100 transition-colors font-bold uppercase tracking-tight"
                >
                  <i className="fas fa-list-ul mr-2"></i>
                  Logs
                </button>
                <button 
                  onClick={() => openModal(agent.role, 'directives')}
                  className="flex-1 text-xs bg-indigo-50 text-indigo-700 py-2 rounded-lg hover:bg-indigo-100 transition-colors font-bold uppercase tracking-tight"
                >
                  <i className="fas fa-scroll mr-2"></i>
                  Role Specs
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white p-8 rounded-xl border border-gray-200">
        <h3 className="text-xl font-bold mb-6 flex items-center">
          <i className="fas fa-network-wired mr-3 text-indigo-600"></i>
          Inter-Agent Communication Log
        </h3>
        <div className="space-y-4">
          {[
            { from: 'Agent 1', to: 'Agent 2', msg: 'Sync complete: 4,500 Trade Records transferred via Flat File API.', time: '2 mins ago' },
            { from: 'Agent 2', to: 'Agent 4', msg: 'Anomaly Detected: Pattern mismatch in SEC Rule 204-2 records.', time: '10 mins ago' },
            { from: 'Agent 4', to: 'Human Manager', msg: 'Escalation required: Design gap in TILA Disclosure logic.', time: '15 mins ago' },
          ].map((log, i) => (
            <div key={i} className="flex items-start gap-4 p-4 rounded-lg bg-gray-50 border border-gray-100">
              <div className="flex -space-x-2 mt-1">
                <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-[10px] ring-2 ring-white">A{log.from.split(' ')[1]}</div>
                <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-white text-[10px] ring-2 ring-white">A{log.to.split(' ')[1]}</div>
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">{log.from} &rarr; {log.to}</span>
                  <span className="text-xs text-gray-400 italic">{log.time}</span>
                </div>
                <p className="text-sm text-gray-700">{log.msg}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Log Modal / Drawer */}
      {selectedAgent && (
        <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/40 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white w-full max-w-2xl h-full shadow-2xl flex flex-col animate-slideInRight">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white">
                  <i className={`fas ${modalTab === 'logs' ? 'fa-terminal' : 'fa-scroll'}`}></i>
                </div>
                <div>
                  <h3 className="font-bold text-lg text-gray-800 uppercase tracking-tight">{selectedAgent}</h3>
                  <p className="text-xs text-gray-500">{modalTab === 'logs' ? 'Live System Operational Stream' : 'Underlying Agent Directives'}</p>
                </div>
              </div>
              <button 
                onClick={closeLogs}
                className="w-10 h-10 rounded-full hover:bg-gray-200 flex items-center justify-center transition-colors"
              >
                <i className="fas fa-times text-gray-500"></i>
              </button>
            </div>

            {/* Modal Tabs */}
            <div className="flex bg-gray-50 px-6 border-b border-gray-100">
              <button 
                onClick={() => setModalTab('logs')}
                className={`px-6 py-3 text-xs font-bold uppercase tracking-widest border-b-2 transition-colors ${
                  modalTab === 'logs' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-400'
                }`}
              >
                Operational Logs
              </button>
              <button 
                onClick={() => setModalTab('directives')}
                className={`px-6 py-3 text-xs font-bold uppercase tracking-widest border-b-2 transition-colors ${
                  modalTab === 'directives' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-400'
                }`}
              >
                Agent Directives
              </button>
            </div>
            
            <div className={`flex-1 overflow-y-auto p-8 space-y-6 ${modalTab === 'logs' ? 'bg-[#0f172a] text-gray-300' : 'bg-white'}`}>
              {modalTab === 'logs' ? (
                <div className="font-mono space-y-3">
                  <div className="text-[10px] text-gray-500 mb-4 pb-2 border-b border-gray-800">
                    # INITIALIZING LOG STREAM FOR {selectedAgent.toUpperCase()}...
                    <br />
                    # SESSION ID: {Math.random().toString(36).substr(2, 9).toUpperCase()}
                  </div>
                  {MOCK_AGENT_LOGS[selectedAgent].map((log) => (
                    <div key={log.id} className="text-sm py-1 border-b border-gray-800/50 flex gap-4">
                      <span className="text-gray-500 shrink-0">[{log.timestamp.split(' ')[1]}]</span>
                      <span className={`shrink-0 uppercase font-bold text-[10px] mt-1 ${
                        log.level === 'success' ? 'text-green-400' :
                        log.level === 'warning' ? 'text-yellow-400' :
                        log.level === 'error' ? 'text-red-400' : 'text-blue-400'
                      }`}>
                        {log.level}
                      </span>
                      <span className="text-gray-300">{log.message}</span>
                    </div>
                  ))}
                  <div className="text-[10px] text-indigo-400 animate-pulse mt-4 italic">
                    Listening for new events...
                  </div>
                </div>
              ) : (
                <div className="space-y-8 animate-fadeIn">
                  <section>
                    <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3 flex items-center">
                      <i className="fas fa-bullseye mr-2 text-red-500"></i> Mission Statement
                    </h4>
                    <p className="text-lg font-medium text-gray-800 leading-relaxed italic border-l-4 border-indigo-100 pl-4">
                      "{AGENT_DIRECTIVES[selectedAgent].mission}"
                    </p>
                  </section>

                  <section>
                    <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4 flex items-center">
                      <i className="fas fa-list-check mr-2 text-blue-500"></i> Core Responsibilities
                    </h4>
                    <ul className="grid grid-cols-1 gap-3">
                      {AGENT_DIRECTIVES[selectedAgent].responsibilities.map((resp, i) => (
                        <li key={i} className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 border border-gray-100 text-sm text-gray-700">
                          <i className="fas fa-circle-check text-green-500 mt-1 shrink-0"></i>
                          {resp}
                        </li>
                      ))}
                    </ul>
                  </section>

                  <section>
                    <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4 flex items-center">
                      <i className="fas fa-ban mr-2 text-orange-500"></i> Operational Constraints
                    </h4>
                    <div className="bg-orange-50/50 border border-orange-100 rounded-xl p-4 space-y-2">
                      {AGENT_DIRECTIVES[selectedAgent].constraints.map((cons, i) => (
                        <div key={i} className="flex items-center gap-3 text-xs text-orange-800 font-medium">
                          <div className="w-1.5 h-1.5 bg-orange-400 rounded-full"></div>
                          {cons}
                        </div>
                      ))}
                    </div>
                  </section>

                  <section>
                    <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3 flex items-center">
                      <i className="fas fa-code-branch mr-2 text-indigo-500"></i> Standard Operating Procedure
                    </h4>
                    <div className="bg-gray-900 rounded-lg p-4 text-xs font-mono text-indigo-300 border border-indigo-900/50">
                      {AGENT_DIRECTIVES[selectedAgent].sop}
                    </div>
                  </section>
                </div>
              )}
            </div>
            
            <div className="p-4 bg-gray-50 border-t border-gray-100 flex justify-between items-center">
              <p className="text-xs text-gray-400 italic">
                {modalTab === 'logs' ? 'Logs are immutable and stored in encrypted cold storage.' : 'Directives are signed and version-controlled.'}
              </p>
              <button className="text-xs font-bold text-indigo-600 hover:text-indigo-800">
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
