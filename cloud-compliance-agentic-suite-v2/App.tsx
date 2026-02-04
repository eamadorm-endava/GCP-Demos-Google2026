
import React, { useState } from 'react';
import Dashboard from './components/Dashboard';
import AgentControlRoom from './components/AgentControlRoom';
import ComplianceExpertChat from './components/ComplianceExpertChat';
import WorkflowSimulator from './components/WorkflowSimulator';
import { REGULATORY_SCOPE, MOCK_AUDIT_LOG } from './constants';

type Tab = 'dashboard' | 'agents' | 'workflow' | 'chat' | 'audit' | 'settings';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');

  const SidebarItem = ({ id, icon, label }: { id: Tab, icon: string, label: string }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`w-full flex items-center gap-4 px-6 py-4 transition-all ${
        activeTab === id 
          ? 'bg-indigo-600/10 text-indigo-600 border-r-4 border-indigo-600' 
          : 'text-gray-500 hover:bg-gray-50'
      }`}
    >
      <i className={`fas ${icon} w-6 text-lg`}></i>
      <span className="font-semibold text-sm">{label}</span>
    </button>
  );

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-72 bg-white border-r border-gray-200 flex flex-col fixed inset-y-0 shadow-sm z-30">
        <div className="p-8 border-b border-gray-100">
          <div className="flex items-center gap-3 text-indigo-600 mb-2">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-200">
              <i className="fas fa-fingerprint text-xl"></i>
            </div>
            <h1 className="font-extrabold text-xl tracking-tight text-gray-900">GuardianAI</h1>
          </div>
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Compliance Suite v2.0</p>
        </div>

        <nav className="flex-1 pt-4">
          <SidebarItem id="dashboard" icon="fa-table-columns" label="Risk Dashboard" />
          <SidebarItem id="agents" icon="fa-microchip" label="Agent Control Room" />
          <SidebarItem id="workflow" icon="fa-route" label="Control Workflow" />
          <SidebarItem id="chat" icon="fa-comments" label="Compliance AI" />
          <SidebarItem id="audit" icon="fa-file-invoice" label="Audit Trail" />
          <SidebarItem id="settings" icon="fa-sliders" label="API Orchestration" />
        </nav>

        <div className="p-6 mt-auto border-t border-gray-100">
          <div className="bg-indigo-50 p-4 rounded-xl border border-indigo-100">
            <p className="text-xs font-bold text-indigo-600 mb-2 uppercase tracking-tight">System Status</p>
            <div className="flex items-center gap-2 mb-3">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              <span className="text-[11px] font-medium text-gray-600">All Agents Synchronized</span>
            </div>
            <button className="w-full py-2 bg-indigo-600 text-white text-[11px] font-bold rounded-lg hover:bg-indigo-700 transition-colors shadow-sm shadow-indigo-100">
              FORCE SYSTEM SYNC
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-72">
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-20 flex items-center justify-between px-8">
          <div className="flex items-center gap-4">
            <h2 className="text-xl font-bold text-gray-800 capitalize">{activeTab.replace('-', ' ')}</h2>
            <div className="h-4 w-[1px] bg-gray-200 mx-2"></div>
            <div className="flex gap-2">
              {REGULATORY_SCOPE.map(reg => (
                <span key={reg.category} className="px-2 py-1 bg-gray-100 text-[10px] font-bold text-gray-500 rounded border border-gray-200 uppercase tracking-tighter">
                  {reg.category} Ready
                </span>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="relative">
              <i className="fas fa-bell text-gray-400 hover:text-indigo-600 transition-colors cursor-pointer"></i>
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </div>
            <div className="flex items-center gap-3 bg-gray-50 px-3 py-2 rounded-full border border-gray-100">
              <img src="https://picsum.photos/32/32" className="w-8 h-8 rounded-full border-2 border-indigo-200" alt="Avatar" />
              <div className="hidden sm:block">
                <p className="text-xs font-bold text-gray-800 leading-none">Senior Auditor</p>
                <p className="text-[10px] text-gray-500 font-medium">Regional Compliance</p>
              </div>
            </div>
          </div>
        </header>

        <div className="p-8">
          {activeTab === 'dashboard' && <Dashboard />}
          {activeTab === 'agents' && <AgentControlRoom />}
          {activeTab === 'workflow' && <WorkflowSimulator />}
          {activeTab === 'chat' && <ComplianceExpertChat />}
          {activeTab === 'audit' && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                <div>
                  <h3 className="text-lg font-bold text-gray-800">Supervisory Audit Trail</h3>
                  <p className="text-sm text-gray-500 italic">Immutable log generated by Agent 4 (At no compute cost)</p>
                </div>
                <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-semibold hover:bg-gray-50 transition-colors">
                  <i className="fas fa-download"></i> Export PDF/CSV
                </button>
              </div>
              <div className="p-0">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-gray-50 text-[10px] font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100">
                      <th className="px-6 py-4">Timestamp</th>
                      <th className="px-6 py-4">Actor</th>
                      <th className="px-6 py-4">Action</th>
                      <th className="px-6 py-4">Details</th>
                      <th className="px-6 py-4 text-right">Reference</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {MOCK_AUDIT_LOG.map((log) => (
                      <tr key={log.id} className="hover:bg-indigo-50/30 transition-colors">
                        <td className="px-6 py-4 text-xs font-medium text-gray-500 tabular-nums">{log.timestamp}</td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-tight ${
                            log.actor.includes('Super') ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-100 text-gray-600'
                          }`}>
                            {log.actor}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm font-semibold text-gray-800">{log.action}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">{log.details}</td>
                        <td className="px-6 py-4 text-right">
                          <button className="text-indigo-600 hover:underline text-xs font-bold">{log.id}</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
          {activeTab === 'settings' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white p-6 rounded-xl border border-gray-200">
                <h3 className="font-bold text-lg mb-4">Enterprise System Integration</h3>
                <p className="text-sm text-gray-500 mb-6">Connect your Primary System of Record. Our system-agnostic architecture supports both API and Flat File transfers.</p>
                <div className="space-y-4">
                  {[
                    { name: 'ERM Main Instance', type: 'API Connection', status: 'Connected' },
                    { name: 'Quarterly Trade History', type: 'Flat File (SFTP)', status: 'Connected' },
                    { name: 'CCPA Records Staging', type: 'Cloud Storage', status: 'Pending' }
                  ].map((sys, i) => (
                    <div key={i} className="flex items-center justify-between p-4 border border-gray-100 rounded-lg">
                      <div>
                        <p className="font-bold text-sm text-gray-800">{sys.name}</p>
                        <p className="text-xs text-gray-400">{sys.type}</p>
                      </div>
                      <span className={`text-[10px] font-bold px-2 py-1 rounded ${sys.status === 'Connected' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                        {sys.status}
                      </span>
                    </div>
                  ))}
                  <button className="w-full py-3 border-2 border-dashed border-indigo-200 text-indigo-600 font-bold rounded-xl hover:bg-indigo-50 transition-colors flex items-center justify-center gap-2">
                    <i className="fas fa-plus"></i> Add New System Link
                  </button>
                </div>
              </div>
              <div className="bg-white p-6 rounded-xl border border-gray-200">
                <h3 className="font-bold text-lg mb-4">Global Compliance Policy</h3>
                <p className="text-sm text-gray-500 mb-6">Manage the regulatory frameworks that Agent 3 (TOD) and Agent 2 (TOE) utilize for scoring.</p>
                <div className="space-y-2">
                  {REGULATORY_SCOPE.map(scope => (
                    <div key={scope.category} className="p-4 bg-gray-50 rounded-lg border border-gray-100">
                      <div className="flex justify-between items-center mb-2">
                        <p className="font-bold text-sm text-gray-800">{scope.category}</p>
                        <i className="fas fa-check-circle text-green-500"></i>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {scope.codes.map(code => (
                          <span key={code} className="bg-white text-[10px] text-gray-400 px-1.5 py-0.5 rounded border border-gray-100">{code}</span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default App;
