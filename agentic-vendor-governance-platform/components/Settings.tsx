
import React, { useState } from 'react';
import {
  Save, Bell, Shield, Cpu, Link as LinkIcon,
  Database, Globe, Mail, CheckCircle2, AlertTriangle, Zap
} from 'lucide-react';

const Settings: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const [agentConfig, setAgentConfig] = useState({
    auditTolerance: 50,
    autoApprove: false,
    // FIX: Updated to a recommended model from the guidelines.
    scribeModel: 'gemini-3-flash-preview',
    tone: 'professional'
  });

  const [integrations, setIntegrations] = useState({
    jira: true,
    slack: true,
    serviceNow: false,
    sap: false
  });

  const [notifications, setNotifications] = useState([
    { label: 'SLA Breaches (>5%)', checked: true },
    { label: 'Invoice Discrepancies', checked: true },
    { label: 'Daily QBR Digest', checked: false },
    { label: 'New Vendor Onboarding', checked: true },
  ]);

  const toggleNotification = (index: number) => {
    const newNotifs = [...notifications];
    newNotifs[index].checked = !newNotifs[index].checked;
    setNotifications(newNotifs);
  };

  const handleSave = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    }, 1500);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700 max-w-5xl mx-auto pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-semibold text-white tracking-tight">Platform Settings</h2>
          <p className="text-endava-blue-30 font-medium mt-1">Configure your Agentic workforce and integrations.</p>
        </div>
        <button
          onClick={handleSave}
          disabled={loading}
          className={`px-8 py-3 rounded-2xl font-semibold text-sm transition-all flex items-center gap-2 active:scale-95 ${success ? 'bg-green-500 text-white' : 'bg-endava-orange text-white hover:bg-endava-orange/80 hover:scale-105 '
            }`}
        >
          {loading ? (
            'Saving...'
          ) : success ? (
            <>
              <CheckCircle2 size={18} />
              Saved!
            </>
          ) : (
            <>
              <Save size={18} />
              Save Changes
            </>
          )}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Left Column: Agents & AI */}
        <div className="lg:col-span-2 space-y-8">

          {/* Agent Configuration Card */}
          <div className="bg-endava-blue-90 p-8 rounded-[2.5rem] shadow-sm border border-white/10 relative overflow-hidden">
            <div className="flex items-center gap-4 mb-8">
              <div className="p-3 bg-endava-orange/20 text-endava-orange rounded-2xl">
                <Cpu size={24} />
              </div>
              <div>
                <h3 className="font-semibold text-white text-lg">Agent Intelligence</h3>
                <p className="text-xs font-medium text-endava-blue-40 uppercase tracking-widest mt-1">Model Behavior & Thresholds</p>
              </div>
            </div>

            <div className="space-y-8">
              {/* Audit Tolerance */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-medium text-white flex items-center gap-2">
                    <Shield size={16} className="text-endava-blue-40" />
                    Auditor Discrepancy Tolerance
                  </label>
                  <span className="text-xs font-semibold bg-endava-blue-70 text-white px-3 py-1 rounded-full">
                    ${agentConfig.auditTolerance}
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="500"
                  step="10"
                  value={agentConfig.auditTolerance}
                  onChange={(e) => setAgentConfig({ ...agentConfig, auditTolerance: parseInt(e.target.value) })}
                  className="w-full h-2 bg-endava-blue-70 rounded-lg appearance-none cursor-pointer accent-endava-orange"
                />
                <p className="text-xs text-endava-blue-40 font-medium">
                  Invoices with discrepancies below <strong>${agentConfig.auditTolerance}</strong> will be flagged as "Low Risk" instead of "Critical".
                </p>
              </div>

              <div className="w-full h-px bg-endava-blue-70"></div>

              {/* Scribe Model Selection */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-sm font-medium text-white mb-3 block">Scribe Model Version</label>
                  <select
                    value={agentConfig.scribeModel}
                    onChange={(e) => setAgentConfig({ ...agentConfig, scribeModel: e.target.value })}
                    className="w-full p-3 bg-endava-blue-80 border border-white/10 rounded-xl text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-endava-orange/20"
                  >
                    {/* FIX: Use correct model names and update labels. */}
                    <option value="gemini-3-flash-preview">Gemini 3 Flash (Fastest)</option>
                    <option value="gemini-3-pro-preview">Gemini 3 Pro (High Reasoning)</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-white mb-3 block">Reporting Tone</label>
                  <select
                    value={agentConfig.tone}
                    onChange={(e) => setAgentConfig({ ...agentConfig, tone: e.target.value })}
                    className="w-full p-3 bg-endava-blue-80 border border-white/10 rounded-xl text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-endava-orange/20"
                  >
                    <option value="professional">Executive / Professional</option>
                    <option value="concise">Concise / Bulleted</option>
                    <option value="detailed">Detailed / Analytical</option>
                  </select>
                </div>
              </div>

              {/* Auto Approval Toggle */}
              <div className="flex items-center justify-between p-4 bg-endava-blue-80 rounded-2xl border border-white/10">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${agentConfig.autoApprove ? 'bg-green-100 text-green-600' : 'bg-endava-blue-60 text-endava-blue-40'}`}>
                    <Zap size={20} className={agentConfig.autoApprove ? 'fill-current' : ''} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">Auto-Approve Verified Invoices</p>
                    <p className="text-xs font-medium text-endava-blue-40">If 100% MSA match & SOC2 verified</p>
                  </div>
                </div>
                <button
                  onClick={() => setAgentConfig({ ...agentConfig, autoApprove: !agentConfig.autoApprove })}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${agentConfig.autoApprove ? 'bg-endava-orange' : 'bg-endava-blue-90/20'}`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-endava-blue-90 transition-transform ${agentConfig.autoApprove ? 'translate-x-6' : 'translate-x-1'}`} />
                </button>
              </div>

            </div>
          </div>

          {/* Integrations Card */}
          <div className="bg-endava-blue-90 p-8 rounded-[2.5rem] shadow-sm border border-white/10">
            <div className="flex items-center gap-4 mb-8">
              <div className="p-3 bg-endava-blue-80 border border-white/10 text-endava-blue-30 rounded-2xl">
                <LinkIcon size={24} />
              </div>
              <div>
                <h3 className="font-semibold text-white text-lg">System Integrations</h3>
                <p className="text-xs font-medium text-endava-blue-40 uppercase tracking-widest mt-1">Data Sources & Sinks</p>
              </div>
            </div>

            <div className="space-y-4">
              {[
                { id: 'jira', name: 'Atlassian Jira', icon: <Database size={18} />, status: 'Connected', color: 'blue' },
                { id: 'slack', name: 'Slack Workspaces', icon: <Mail size={18} />, status: 'Connected', color: 'purple' },
                { id: 'serviceNow', name: 'ServiceNow', icon: <Shield size={18} />, status: 'Disconnected', color: 'slate' },
                { id: 'sap', name: 'SAP Ariba', icon: <Globe size={18} />, status: 'Disconnected', color: 'slate' },
              ].map((tool) => (
                <div key={tool.id} className="flex items-center justify-between p-4 border border-white/10 rounded-2xl hover:bg-endava-blue-80 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className={`p-2.5 rounded-xl ${tool.status === 'Connected' ? `bg-${tool.color}-100 text-${tool.color}-600` : 'bg-endava-blue-70 text-endava-blue-40'}`}>
                      {tool.icon}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">{tool.name}</p>
                      <p className={`text-[10px] font-semibold uppercase tracking-wider ${tool.status === 'Connected' ? 'text-green-600' : 'text-endava-blue-40'}`}>
                        {tool.status}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setIntegrations({ ...integrations, [tool.id]: !integrations[tool.id as keyof typeof integrations] })}
                    className={`px-4 py-2 rounded-xl text-xs font-medium transition-all ${integrations[tool.id as keyof typeof integrations]
                        ? 'bg-red-50 text-red-600 hover:bg-red-100'
                        : 'bg-endava-orange/20 text-endava-orange hover:bg-endava-orange/80 hover:scale-105 30'
                      }`}
                  >
                    {integrations[tool.id as keyof typeof integrations] ? 'Disconnect' : 'Connect'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Profile & Notifications */}
        <div className="space-y-8">

          {/* User Profile */}
          <div className="bg-endava-blue-90 p-8 rounded-[2.5rem] shadow-sm border border-white/10">
            <div className="flex flex-col items-center text-center">
              <div className="w-24 h-24 rounded-3xl bg-endava-blue-60 mb-4 overflow-hidden ring-4 ring-white">
                <img src="https://picsum.photos/seed/vignesh/200/200" alt="Profile" className="w-full h-full object-cover" />
              </div>
              <h3 className="text-xl font-semibold text-white">Vignesh S.</h3>
              <p className="text-xs font-medium text-endava-orange bg-endava-orange/20 px-3 py-1 rounded-full uppercase tracking-widest mt-2">Admin Access</p>
              <div className="w-full mt-6 space-y-4 text-left">
                <div>
                  <label className="text-[10px] font-semibold text-endava-blue-40 uppercase tracking-widest block mb-1">Role</label>
                  <p className="text-sm font-medium text-white bg-endava-blue-80 p-3 rounded-xl border border-white/10">Procurement Operations</p>
                </div>
              </div>
            </div>
          </div>

          {/* Notifications */}
          <div className="bg-endava-blue-90 p-8 rounded-[2.5rem] shadow-sm border border-white/10">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-amber-50 text-amber-600 rounded-2xl">
                <Bell size={24} />
              </div>
              <div>
                <h3 className="font-semibold text-white text-lg">Notifications</h3>
                <p className="text-xs font-medium text-endava-blue-40 uppercase tracking-widest mt-1">Alert Preferences</p>
              </div>
            </div>

            <div className="space-y-2">
              {notifications.map((item, i) => (
                <label key={i} className="flex items-center justify-between p-3 hover:bg-endava-blue-80 rounded-xl cursor-pointer transition-colors group">
                  <span className="text-sm font-medium text-white group-hover:text-white">{item.label}</span>
                  <div
                    onClick={() => toggleNotification(i)}
                    className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${item.checked ? 'bg-endava-orange border-endava-orange' : 'border-white/20'}`}
                  >
                    {item.checked && <CheckCircle2 size={14} className="text-white" />}
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Danger Zone */}
          <div className="bg-red-50 p-8 rounded-[2.5rem] border border-red-100">
            <div className="flex items-center gap-3 mb-4">
              <AlertTriangle className="text-red-600" size={20} />
              <h3 className="font-semibold text-red-900 text-sm uppercase tracking-widest">Danger Zone</h3>
            </div>
            <p className="text-xs font-medium text-red-700/70 mb-6 leading-relaxed">
              Resetting the workspace will clear all ingested invoices and meeting transcripts. This action cannot be undone.
            </p>
            <button className="w-full py-3 bg-endava-blue-90 border border-red-200 text-red-600 text-xs font-semibold rounded-xl hover:bg-red-600 hover:scale-105 hover:text-white transition-all shadow-md active:scale-95">
              Reset Workspace Data
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Settings;