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
      className={`w-full flex items-center gap-4 px-6 py-4 transition-all border-l-4 ${
        activeTab === id 
          ? 'bg-brand-primary/10 text-brand-primary border-brand-primary' 
          : 'text-brand-muted border-transparent hover:bg-brand-border/30 hover:text-white'
      }`}
    >
      <i className={`fas ${icon} w-5 text-lg`}></i>
      <span className="font-medium text-sm tracking-wide">{label}</span>
    </button>
  );

  return (
    <div className="flex min-h-screen bg-brand-dark text-brand-text">
      {/* Sidebar */}
      <aside className="w-72 bg-brand-secondary border-r border-brand-border flex flex-col fixed inset-y-0 shadow-xl z-30">
        <div className="p-8 border-b border-brand-border">
          <div className="flex items-center gap-3 text-brand-primary mb-2">
            <div className="w-10 h-10 bg-brand-primary rounded-lg flex items-center justify-center text-white shadow-lg shadow-brand-primary/20">
              <i className="fas fa-fingerprint text-xl"></i>
            </div>
            <h1 className="font-extrabold text-xl tracking-tight text-white">GuardianAI</h1>
          </div>
          <p className="text-[10px] text-brand-muted font-bold uppercase tracking-widest pl-1">Compliance Suite v2.0</p>
        </div>

        <nav className="flex-1 pt-6">
          <SidebarItem id="dashboard" icon="fa-table-columns" label="Risk Dashboard" />
          <SidebarItem id="agents" icon="fa-microchip" label="Agent Control Room" />
          <SidebarItem id="workflow" icon="fa-route" label="Control Workflow" />
          <SidebarItem id="chat" icon="fa-comments" label="Compliance AI" />
          <SidebarItem id="audit" icon="fa-file-invoice" label="Audit Trail" />
          <SidebarItem id="settings" icon="fa-sliders" label="API Orchestration" />
        </nav>

        <div className="p-6 mt-auto border-t border-brand-border">
          <div className="bg-brand-dark p-4 rounded-xl border border-brand-border">
            <p className="text-xs font-bold text-brand-primary mb-2 uppercase tracking-tight">System Status</p>
            <div className="flex items-center gap-2 mb-3">
              <span className="w-2 h-2 bg-signal-green rounded-full animate-pulse-fast"></span>
              <span className="text-[11px] font-medium text-brand-muted">All Agents Synchronized</span>
            </div>
            <button className="w-full py-2 bg-brand-primary text-white text-[11px] font-bold rounded hover:bg-brand-hover transition-colors shadow-lg shadow-brand-primary/20 cursor-pointer">
              FORCE SYSTEM SYNC
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-72">
        <header className="h-20 bg-brand-secondary/80 backdrop-blur-md border-b border-brand-border sticky top-0 z-20 flex items-center justify-between px-8">
          <div className="flex items-center gap-4">
            <h2 className="text-xl font-bold text-white capitalize">{activeTab.replace('-', ' ')}</h2>
            <div className="h-4 w-[1px] bg-brand-border mx-2"></div>
            <div className="flex gap-2">
              {REGULATORY_SCOPE.map(reg => (
                <span key={reg.category} className="px-2 py-1 bg-brand-dark text-[10px] font-bold text-brand-muted rounded border border-brand-border uppercase tracking-tighter">
                  {reg.category} Ready
                </span>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="relative">
              <i className="fas fa-bell text-brand-muted hover:text-brand-primary transition-colors cursor-pointer text-lg"></i>
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-signal-red rounded-full border border-brand-secondary"></span>
            </div>
            <div className="flex items-center gap-3 bg-brand-dark px-3 py-2 rounded-full border border-brand-border">
              <img src="https://picsum.photos/32/32" className="w-8 h-8 rounded-full border-2 border-brand-primary" alt="Avatar" />
              <div className="hidden sm:block">
                <p className="text-xs font-bold text-white leading-none">Senior Auditor</p>
                <p className="text-[10px] text-brand-muted font-medium">Regional Compliance</p>
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
            <div className="bg-brand-secondary rounded-xl shadow-lg border border-brand-border overflow-hidden">
              <div className="p-6 border-b border-brand-border flex justify-between items-center bg-brand-secondary">
                <div>
                  <h3 className="text-lg font-bold text-white">Supervisory Audit Trail</h3>
                  <p className="text-sm text-brand-muted italic">Immutable log generated by Agent 4 (At no compute cost)</p>
                </div>
                <button className="flex items-center gap-2 px-4 py-2 bg-brand-dark border border-brand-border rounded-lg text-sm font-semibold text-brand-muted hover:text-white hover:border-brand-primary transition-colors cursor-pointer">
                  <i className="fas fa-download"></i> Export PDF/CSV
                </button>
              </div>
              <div className="p-0">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-brand-dark/50 text-[10px] font-bold text-brand-muted uppercase tracking-widest border-b border-brand-border">
                      <th className="px-6 py-4">Timestamp</th>
                      <th className="px-6 py-4">Actor</th>
                      <th className="px-6 py-4">Action</th>
                      <th className="px-6 py-4">Details</th>
                      <th className="px-6 py-4 text-right">Reference</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-brand-border">
                    {MOCK_AUDIT_LOG.map((log) => (
                      <tr key={log.id} className="hover:bg-brand-primary/5 transition-colors">
                        <td className="px-6 py-4 text-xs font-medium text-brand-muted tabular-nums">{log.timestamp}</td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-tight ${
                            log.actor.includes('Super') ? 'bg-brand-primary/20 text-brand-primary' : 'bg-brand-dark text-brand-muted border border-brand-border'
                          }`}>
                            {log.actor}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm font-semibold text-white">{log.action}</td>
                        <td className="px-6 py-4 text-sm text-brand-muted">{log.details}</td>
                        <td className="px-6 py-4 text-right">
                          <button className="text-brand-primary hover:underline text-xs font-bold">{log.id}</button>
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
              <div className="bg-brand-secondary p-6 rounded-xl border border-brand-border">
                <h3 className="font-bold text-lg mb-4 text-white">Enterprise System Integration</h3>
                <p className="text-sm text-brand-muted mb-6">Connect your Primary System of Record. Our system-agnostic architecture supports both API and Flat File transfers.</p>
                <div className="space-y-4">
                  {[
                    { name: 'ERM Main Instance', type: 'API Connection', status: 'Connected' },
                    { name: 'Quarterly Trade History', type: 'Flat File (SFTP)', status: 'Connected' },
                    { name: 'CCPA Records Staging', type: 'Cloud Storage', status: 'Pending' }
                  ].map((sys, i) => (
                    <div key={i} className="flex items-center justify-between p-4 border border-brand-border rounded-lg bg-brand-dark/30">
                      <div>
                        <p className="font-bold text-sm text-white">{sys.name}</p>
                        <p className="text-xs text-brand-muted">{sys.type}</p>
                      </div>
                      <span className={`text-[10px] font-bold px-2 py-1 rounded ${sys.status === 'Connected' ? 'bg-signal-green/20 text-signal-green' : 'bg-signal-amber/20 text-signal-amber'}`}>
                        {sys.status}
                      </span>
                    </div>
                  ))}
                  <button className="w-full py-3 border-2 border-dashed border-brand-border text-brand-muted font-bold rounded-xl hover:border-brand-primary hover:text-brand-primary transition-colors flex items-center justify-center gap-2 cursor-pointer">
                    <i className="fas fa-plus"></i> Add New System Link
                  </button>
                </div>
              </div>
              <div className="bg-brand-secondary p-6 rounded-xl border border-brand-border">
                <h3 className="font-bold text-lg mb-4 text-white">Global Compliance Policy</h3>
                <p className="text-sm text-brand-muted mb-6">Manage the regulatory frameworks that Agent 3 (TOD) and Agent 2 (TOE) utilize for scoring.</p>
                <div className="space-y-2">
                  {REGULATORY_SCOPE.map(scope => (
                    <div key={scope.category} className="p-4 bg-brand-dark rounded-lg border border-brand-border">
                      <div className="flex justify-between items-center mb-2">
                        <p className="font-bold text-sm text-white">{scope.category}</p>
                        <i className="fas fa-check-circle text-signal-green"></i>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {scope.codes.map(code => (
                          <span key={code} className="bg-brand-secondary text-[10px] text-brand-muted px-1.5 py-0.5 rounded border border-brand-border">{code}</span>
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