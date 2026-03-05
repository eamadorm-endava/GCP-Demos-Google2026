import React, { useState } from 'react';
import { Settings as SettingsIcon, Bell, Lock, User, Database, RefreshCw, CheckCircle2, XCircle, Link as LinkIcon, Unlink, AlertCircle } from 'lucide-react';

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

    const handleRefreshAll = () => {
        setIntegrations(prev => prev.map(item =>
            item.status === 'Connected' ? { ...item, status: 'Syncing' } : item
        ));
        setTimeout(() => {
            setIntegrations(prev => prev.map(item =>
                item.status === 'Syncing' ? { ...item, status: 'Connected', lastSync: 'Just now' } : item
            ));
        }, 2000);
    };

    // Notification toggle state
    const [notifications, setNotifications] = useState({
        criticalAlerts: true,
        dailyDigest: true,
        agentUpdates: false,
    });

    const toggleNotification = (key: keyof typeof notifications) => {
        setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
    };

    return (
        <div className="h-full overflow-y-auto bg-transparent p-6 lg:p-8 space-y-8 custom-scrollbar relative">
            <div className="absolute inset-0 bg-endava-dark -z-10" />
            <header className="mb-6">
                <h2 className="text-2xl font-bold text-white mb-2">Settings & Integrations</h2>
                <p className="text-endava-blue-40 text-sm">Manage data pipelines, agent permissions, and notification rules.</p>
            </header>

            {/* Data Sources Section */}
            <section className="space-y-4">
                <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold text-white flex items-center">
                        <Database className="w-5 h-5 mr-2 text-endava-orange" />
                        Data Source Integrations
                    </h3>
                    <button
                        onClick={handleRefreshAll}
                        className="text-xs font-medium text-endava-orange hover:text-[#ff7e6b] flex items-center bg-endava-blue-90/80 border border-white/10 px-3 py-1.5 rounded-lg transition-colors backdrop-blur-sm"
                    >
                        <RefreshCw className="w-3 h-3 mr-1.5" /> Refresh All
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {integrations.map(item => (
                        <div key={item.id} className="bg-endava-blue-90/50 border border-white/10 rounded-xl p-5 hover:border-endava-orange/50 hover:bg-white/5 transition-all group backdrop-blur-sm shadow-xl">
                            <div className="flex justify-between items-start">
                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 rounded-lg bg-endava-blue-80 border border-white/5 flex items-center justify-center font-bold text-xs text-white shadow-inner group-hover:border-endava-orange/30 transition-colors">
                                        {item.icon}
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-bold text-white mb-0.5 group-hover:text-endava-orange transition-colors">{item.name}</h4>
                                        <p className="text-xs text-endava-blue-40 mb-2">{item.description}</p>
                                        <div className="flex items-center gap-2">
                                            <span className={`flex items-center text-[10px] px-2 py-0.5 rounded-full border shadow-sm ${item.status === 'Connected' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                                                item.status === 'Syncing' ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' :
                                                    'bg-white/5 text-endava-blue-30 border-white/10'
                                                }`}>
                                                {item.status === 'Connected' && <CheckCircle2 className="w-3 h-3 mr-1" />}
                                                {item.status === 'Syncing' && <RefreshCw className="w-3 h-3 mr-1 animate-spin" />}
                                                {item.status === 'Disconnected' && <XCircle className="w-3 h-3 mr-1" />}
                                                {item.status}
                                            </span>
                                            {item.lastSync && (
                                                <span className="text-[10px] text-endava-blue-50">Synced: {item.lastSync}</span>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <button
                                    onClick={() => toggleConnection(item.id)}
                                    className={`p-2 rounded-lg transition-colors border ${item.status === 'Connected'
                                        ? 'bg-endava-blue-80 border-white/5 text-endava-blue-30 hover:text-red-400 hover:border-red-500/30 hover:bg-red-500/10'
                                        : 'bg-endava-orange/10 border-endava-orange/20 text-endava-orange hover:bg-endava-orange/20'
                                        }`}
                                    disabled={item.status === 'Syncing'}
                                >
                                    {item.status === 'Connected' ? <Unlink className="w-4 h-4" /> : <LinkIcon className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            <div className="border-t border-white/10 my-8"></div>

            {/* Notifications Section */}
            <section className="space-y-4">
                <h3 className="text-lg font-bold text-white flex items-center">
                    <Bell className="w-5 h-5 mr-2 text-endava-orange" />
                    Notification Rules
                </h3>
                <div className="bg-endava-blue-90/50 border border-white/10 rounded-xl overflow-hidden backdrop-blur-sm shadow-xl">
                    <div className="p-4 flex items-center justify-between border-b border-white/5 hover:bg-white/5 transition-colors">
                        <div>
                            <p className="text-sm font-medium text-white">Critical Risk Alerts</p>
                            <p className="text-xs text-endava-blue-40">Notify me immediately when an Agent detects High Severity risks.</p>
                        </div>
                        <div
                            onClick={() => toggleNotification('criticalAlerts')}
                            className={`w-11 h-6 rounded-full relative cursor-pointer transition-colors shadow-inner ${notifications.criticalAlerts ? 'bg-endava-orange hover:bg-[#ff7e6b]' : 'bg-white/20 hover:bg-white/30'}`}
                        >
                            <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm transition-all ${notifications.criticalAlerts ? 'right-1' : 'left-1'}`}></div>
                        </div>
                    </div>
                    <div className="p-4 flex items-center justify-between border-b border-white/5 hover:bg-white/5 transition-colors">
                        <div>
                            <p className="text-sm font-medium text-white">Daily Digest</p>
                            <p className="text-xs text-endava-blue-40">Receive a summary email at 8:00 AM local time.</p>
                        </div>
                        <div
                            onClick={() => toggleNotification('dailyDigest')}
                            className={`w-11 h-6 rounded-full relative cursor-pointer transition-colors shadow-inner ${notifications.dailyDigest ? 'bg-endava-orange hover:bg-[#ff7e6b]' : 'bg-white/20 hover:bg-white/30'}`}
                        >
                            <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm transition-all ${notifications.dailyDigest ? 'right-1' : 'left-1'}`}></div>
                        </div>
                    </div>
                    <div className="p-4 flex items-center justify-between hover:bg-white/5 transition-colors">
                        <div>
                            <p className="text-sm font-medium text-white">Agent Deployment Updates</p>
                            <p className="text-xs text-endava-blue-40">Notify when new agents are successfully deployed or fail initialization.</p>
                        </div>
                        <div
                            onClick={() => toggleNotification('agentUpdates')}
                            className={`w-11 h-6 rounded-full relative cursor-pointer transition-colors shadow-inner ${notifications.agentUpdates ? 'bg-endava-orange hover:bg-[#ff7e6b]' : 'bg-white/20 hover:bg-white/30'}`}
                        >
                            <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm transition-all ${notifications.agentUpdates ? 'right-1' : 'left-1'}`}></div>
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
                <div className="bg-endava-blue-90/50 border border-white/10 rounded-xl p-4 flex items-start gap-4 backdrop-blur-sm shadow-xl hover:border-endava-blue-70 transition-colors group">
                    <AlertCircle className="w-5 h-5 text-endava-orange shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
                    <div>
                        <h4 className="text-sm font-medium text-white group-hover:text-endava-orange transition-colors">Enterprise Data Encryption</h4>
                        <p className="text-xs text-endava-blue-30 mt-1 leading-relaxed">
                            Your data is encrypted at rest using AES-256. Gemini Enterprise agents operate within a secure enclave and do not use your data for model training.
                            <a href="https://cloud.google.com/security" target="_blank" rel="noopener noreferrer" className="text-endava-orange ml-1 hover:underline font-medium">Learn more about our Security Principles.</a>
                        </p>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default SettingsPage;