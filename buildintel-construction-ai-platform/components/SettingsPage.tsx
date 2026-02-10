import React, { useState } from 'react';
import { Settings as SettingsIcon, Bell, Lock, User, Database, RefreshCw, CheckCircle2, XCircle, Link as LinkIcon, AlertCircle } from 'lucide-react';

interface Integration {
    id: string;
    name: string;
    description: string;
    status: 'Connected' | 'Disconnected' | 'Syncing';
    lastSync?: string;
    icon: string;
    category: 'ERP' | 'Project Mgmt' | 'Scheduling' | 'Design';
}

const SettingsPage: React.FC = () => {
  const [integrations, setIntegrations] = useState<Integration[]>([
      { id: '1', name: 'Autodesk Construction Cloud', description: 'Drawings, Issues, and RFIs sync.', status: 'Connected', lastSync: '12 mins ago', icon: 'ACC', category: 'Project Mgmt' },
      { id: '2', name: 'Procore', description: 'Financials and Daily Logs.', status: 'Connected', lastSync: '1 hour ago', icon: 'PR', category: 'Project Mgmt' },
      { id: '3', name: 'Oracle Primavera P6', description: 'Master Schedule data.', status: 'Disconnected', icon: 'P6', category: 'Scheduling' },
      { id: '4', name: 'SAP S/4HANA', description: 'Enterprise Resource Planning.', status: 'Connected', lastSync: '4 hours ago', icon: 'SAP', category: 'ERP' },
      { id: '5', name: 'Revit (BIM 360)', description: '3D Model Metadata.', status: 'Disconnected', icon: 'RVT', category: 'Design' },
  ]);

  const toggleConnection = (id: string) => {
      setIntegrations(prev => prev.map(item => {
          if (item.id === id) {
              if (item.status === 'Connected') return { ...item, status: 'Disconnected', lastSync: undefined };
              return { ...item, status: 'Syncing' };
          }
          return item;
      }));

      // Simulate connection delay
      const item = integrations.find(i => i.id === id);
      if (item && item.status === 'Disconnected') {
          setTimeout(() => {
              setIntegrations(prev => prev.map(i => i.id === id ? { ...i, status: 'Connected', lastSync: 'Just now' } : i));
          }, 2000);
      }
  };

  return (
    <div className="h-full overflow-y-auto bg-slate-950 p-6 lg:p-8 space-y-8 custom-scrollbar">
      <header className="mb-6">
        <h2 className="text-2xl font-bold text-white mb-2">Settings & Integrations</h2>
        <p className="text-slate-400 text-sm">Manage data pipelines, agent permissions, and notification rules.</p>
      </header>

      {/* Data Sources Section */}
      <section className="space-y-4">
          <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-white flex items-center">
                  <Database className="w-5 h-5 mr-2 text-[color:var(--color-brand-600)]" />
                  Data Source Integrations
              </h3>
              <button className="text-xs font-medium text-primary-400 hover:text-primary-300 flex items-center bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-lg transition-colors">
                  <RefreshCw className="w-3 h-3 mr-1.5" /> Refresh All
              </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {integrations.map(item => (
                  <div key={item.id} className="bg-slate-900 border border-slate-800 rounded-xl p-5 hover:border-slate-700 transition-all group">
                      <div className="flex justify-between items-start">
                          <div className="flex items-start gap-4">
                              <div className="w-10 h-10 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-xs text-slate-300 shadow-sm">
                                  {item.icon}
                              </div>
                              <div>
                                  <h4 className="text-sm font-bold text-white mb-0.5">{item.name}</h4>
                                  <p className="text-xs text-slate-500 mb-2">{item.description}</p>
                                  <div className="flex items-center gap-2">
                                      <span className={`flex items-center text-[10px] px-2 py-0.5 rounded-full border ${
                                          item.status === 'Connected' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 
                                          item.status === 'Syncing' ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' :
                                          'bg-slate-800 text-slate-400 border-slate-700'
                                      }`}>
                                          {item.status === 'Connected' && <CheckCircle2 className="w-3 h-3 mr-1" />}
                                          {item.status === 'Syncing' && <RefreshCw className="w-3 h-3 mr-1 animate-spin" />}
                                          {item.status === 'Disconnected' && <XCircle className="w-3 h-3 mr-1" />}
                                          {item.status}
                                      </span>
                                      {item.lastSync && (
                                          <span className="text-[10px] text-slate-600">Synced: {item.lastSync}</span>
                                      )}
                                  </div>
                              </div>
                          </div>
                          
                          <button 
                            onClick={() => toggleConnection(item.id)}
                            className={`p-2 rounded-lg transition-colors border ${
                                item.status === 'Connected' 
                                ? 'bg-slate-800 border-slate-700 text-slate-400 hover:text-red-400 hover:border-red-500/30 hover:bg-red-500/10' 
                                : 'bg-primary-600/10 border-primary-600/20 text-primary-400 hover:bg-primary-600/20'
                            }`}
                            disabled={item.status === 'Syncing'}
                          >
                              {item.status === 'Connected' ? <LinkIcon className="w-4 h-4" /> : <LinkIcon className="w-4 h-4" />}
                          </button>
                      </div>
                  </div>
              ))}
          </div>
      </section>

      <div className="border-t border-slate-800 my-8"></div>

      {/* Notifications Section */}
      <section className="space-y-4">
           <h3 className="text-lg font-bold text-white flex items-center">
              <Bell className="w-5 h-5 mr-2 text-accent-orange" />
              Notification Rules
           </h3>
           <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
               <div className="p-4 flex items-center justify-between border-b border-slate-800">
                   <div>
                       <p className="text-sm font-medium text-white">Critical Risk Alerts</p>
                       <p className="text-xs text-slate-500">Notify me immediately when an Agent detects High Severity risks.</p>
                   </div>
                   <div className="w-11 h-6 bg-primary-600 rounded-full relative cursor-pointer hover:bg-primary-500 transition-colors">
                       <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm"></div>
                   </div>
               </div>
               <div className="p-4 flex items-center justify-between border-b border-slate-800">
                   <div>
                       <p className="text-sm font-medium text-white">Daily Digest</p>
                       <p className="text-xs text-slate-500">Receive a summary email at 8:00 AM local time.</p>
                   </div>
                   <div className="w-11 h-6 bg-primary-600 rounded-full relative cursor-pointer hover:bg-primary-500 transition-colors">
                       <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm"></div>
                   </div>
               </div>
               <div className="p-4 flex items-center justify-between">
                   <div>
                       <p className="text-sm font-medium text-white">Agent Deployment Updates</p>
                       <p className="text-xs text-slate-500">Notify when new agents are successfully deployed or fail initialization.</p>
                   </div>
                   <div className="w-11 h-6 bg-slate-700 rounded-full relative cursor-pointer hover:bg-slate-600 transition-colors">
                       <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm"></div>
                   </div>
               </div>
           </div>
      </section>

      {/* Security Section */}
      <section className="space-y-4 pb-8">
           <h3 className="text-lg font-bold text-white flex items-center">
              <Lock className="w-5 h-5 mr-2 text-emerald-500" />
              Security & Permissions
           </h3>
           <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-4 flex items-start gap-4">
               <AlertCircle className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
               <div>
                   <h4 className="text-sm font-medium text-white">Enterprise Data Encryption</h4>
                   <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                       Your data is encrypted at rest using AES-256. Gemini Enterprise agents operate within a secure enclave and do not use your data for model training. 
                       <a href="#" className="text-primary-400 ml-1 hover:underline">Learn more about our Security Principles.</a>
                   </p>
               </div>
           </div>
      </section>
    </div>
  );
};

export default SettingsPage;