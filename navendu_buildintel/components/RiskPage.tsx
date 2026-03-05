import React, { useState } from 'react';
import { ProjectData, AgentAlert } from '../types';
import { ShieldAlert, Bot, Check, X, AlertTriangle, Eye, ShieldCheck, DollarSign, Truck, Plus, Sparkles, XCircle, CalendarClock, FileWarning, TrendingUp, ClipboardCheck, Filter, SlidersHorizontal } from 'lucide-react';

interface RiskPageProps {
    data: ProjectData;
    threshold: number;
    setThreshold: (val: number) => void;
}

interface AgentDef {
    id: string;
    name: string;
    type: string;
    status: 'Online' | 'Initializing' | 'Offline';
    description?: string;
}

const RiskPage: React.FC<RiskPageProps> = ({ data, threshold, setThreshold }) => {
    const [agents, setAgents] = useState<AgentDef[]>([
        { id: '1', name: 'Schedule Guardian', type: 'Schedule', status: 'Online' },
        { id: '2', name: 'Budget Watchdog', type: 'Budget', status: 'Online' },
        { id: '3', name: 'Safety Sentinel', type: 'Safety', status: 'Online' },
        { id: '4', name: 'Supply Chain Scout', type: 'Supply Chain', status: 'Online' }
    ]);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newAgent, setNewAgent] = useState({ name: '', type: 'General', description: '' });

    // Filter States
    const [filterType, setFilterType] = useState('All');
    const [filterSeverity, setFilterSeverity] = useState('All');
    const [filterStatus, setFilterStatus] = useState('All');

    // Local alert state to allow Verify/Dismiss
    const [localAlerts, setLocalAlerts] = useState(data.agentAlerts);

    const handleVerifyAlert = (alertId: string) => {
        setLocalAlerts(prev => prev.map(a => a.id === alertId ? { ...a, status: 'Verified' } : a));
    };

    const handleDismissAlert = (alertId: string) => {
        setLocalAlerts(prev => prev.map(a => a.id === alertId ? { ...a, status: 'Dismissed' } : a));
    };

    const alerts = localAlerts.filter(alert => {
        if (filterType !== 'All' && alert.agentType !== filterType) return false;
        if (filterSeverity !== 'All' && alert.severity !== filterSeverity) return false;
        if (filterStatus !== 'All' && alert.status !== filterStatus) return false;
        return true;
    });

    const getAgentIcon = (type: string) => {
        switch (type) {
            case 'Safety Sentinel': return ShieldCheck;
            case 'Budget Watchdog': return DollarSign;
            case 'Schedule Guardian': return AlertTriangle;
            case 'Supply Chain Scout': return Truck;
            case 'Productivity Benchmarker': return TrendingUp;
            case 'RFI Bottleneck Detector': return FileWarning;
            case 'Quality Control': return ClipboardCheck;
            case 'Safety': return ShieldCheck;
            case 'Budget': return DollarSign;
            case 'Schedule': return AlertTriangle;
            case 'Supply Chain': return Truck;
            case 'Productivity': return TrendingUp;
            case 'Design': return FileWarning;
            case 'Quality': return ClipboardCheck;
            default: return Bot;
        }
    };

    const getSeverityColor = (severity: string) => {
        switch (severity) {
            case 'Critical': return 'text-red-500 bg-red-500/10 border-red-500/20';
            case 'High': return 'text-orange-500 bg-orange-500/10 border-orange-500/20';
            case 'Medium': return 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20';
            default: return 'text-blue-500 bg-blue-500/10 border-blue-500/20';
        }
    };

    const getConfidenceStyle = (score: number) => {
        if (score >= 90) return 'text-emerald-400';
        if (score >= 70) return 'text-yellow-400';
        return 'text-slate-400';
    };

    const agentTemplates = [
        {
            title: "Predictive Schedule Forecaster",
            type: "Schedule",
            prompt: "Analyze lookahead schedules against daily progress logs. Flag any activity where the current completion rate suggests a >3 day slip on critical path milestones.",
            icon: CalendarClock,
            color: "text-blue-400"
        },
        {
            title: "RFI & Submittal Bottleneck Detector",
            type: "Design",
            prompt: "Monitor RFI aging and approval cycles. Identify specific disciplines (e.g., Structural) causing downstream delays greater than 48 hours.",
            icon: FileWarning,
            color: "text-orange-400"
        },
        {
            title: "Trade Productivity Benchmarker",
            type: "Productivity",
            prompt: "Compare installed quantities from daily reports against planned production rates. Alert when any trade's efficiency drops below 85% for 3 consecutive days.",
            icon: TrendingUp,
            color: "text-emerald-400"
        }
    ];

    const suggestedPhrases: Record<string, string[]> = {
        'General': ['Monitor for anomalies in daily logs', 'Flag keywords like "delay" or "error"', 'Summarize weekly risks'],
        'Schedule': ['Detect slippage in critical path', 'Compare actual vs planned duration', 'Forecast milestone completion'],
        'Budget': ['Identify cost overruns > 10%', 'Track unapproved change orders', 'Monitor material cost variance'],
        'Safety': ['Detect PPE violations', 'Flag near-miss reports', 'Monitor high-risk work permits'],
        'Supply Chain': ['Track long-lead item delivery', 'Monitor shipping delays', 'Flag inventory shortages'],
        'Productivity': ['Benchmark crew output per hour', 'Compare shift performance', 'Detect labor shortages'],
        'Design': ['Monitor RFI aging > 5 days', 'Identify design clashes', 'Track submittal approval times']
    };

    const applyTemplate = (template: any) => {
        setNewAgent({
            name: template.title,
            type: template.type,
            description: template.prompt
        });
    };

    const handleCreateAgent = () => {
        if (!newAgent.name) return;

        const agent: AgentDef = {
            id: Date.now().toString(),
            name: newAgent.name,
            type: newAgent.type,
            status: 'Initializing',
            description: newAgent.description
        };

        setAgents([...agents, agent]);
        setIsModalOpen(false);
        setNewAgent({ name: '', type: 'General', description: '' });

        // Simulate initialization delay
        setTimeout(() => {
            setAgents(prev => prev.map(a => a.id === agent.id ? { ...a, status: 'Online' } : a));
        }, 3000);
    };

    return (
        <div className="h-full overflow-y-auto bg-transparent p-6 lg:p-8 space-y-6 custom-scrollbar relative">
            <div className="absolute inset-0 bg-endava-dark -z-10" />
            <header className="mb-6 flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-white mb-2">Risk Monitor & Agents</h2>
                    <p className="text-endava-blue-40 text-sm">Real-time anomaly detection by autonomous agents.</p>
                </div>
                <div className="flex items-center gap-4 bg-endava-blue-90/80 border border-white/10 p-3 rounded-xl backdrop-blur-sm shadow-xl">
                    <div className="text-xs font-medium text-endava-blue-40">Dashboard Confidence Threshold</div>
                    <div className="flex items-center gap-3">
                        <SlidersHorizontal className="w-4 h-4 text-endava-blue-50" />
                        <input
                            type="range"
                            min="50"
                            max="95"
                            value={threshold}
                            onChange={(e) => setThreshold(Number(e.target.value))}
                            className="w-32 h-2 bg-endava-blue-80 rounded-lg appearance-none cursor-pointer accent-endava-orange"
                        />
                        <span className="text-sm font-bold text-white w-8">{threshold}%</span>
                    </div>
                </div>
            </header>

            {/* Agents Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
                {agents.map(agent => (
                    <div
                        key={agent.id}
                        className={`bg-endava-blue-90/50 border p-4 rounded-xl flex items-center space-x-4 transition-all relative overflow-hidden group backdrop-blur-sm shadow-xl
                    ${agent.status === 'Online' ? 'border-emerald-500/30 hover:border-emerald-500/50' :
                                agent.status === 'Initializing' ? 'border-yellow-500/30 hover:border-yellow-500/50' : 'border-white/10'}
                `}
                        title={`Status: ${agent.status}`}
                    >
                        {/* Status Indicator Bar */}
                        <div className={`absolute left-0 top-0 bottom-0 w-1 
                      ${agent.status === 'Online' ? 'bg-emerald-500' :
                                agent.status === 'Initializing' ? 'bg-yellow-500' : 'bg-endava-blue-50'}
                  `} />

                        <div className="p-2.5 bg-endava-blue-80 rounded-full relative border border-white/5 shadow-inner">
                            <Bot className={`w-5 h-5 ${agent.status === 'Initializing' ? 'text-endava-blue-50 animate-pulse' : 'text-endava-orange'}`} />
                            {agent.status === 'Online' && (
                                <div className="absolute top-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-endava-blue-90 rounded-full animate-pulse"></div>
                            )}
                        </div>
                        <div>
                            <h4 className="text-sm font-semibold text-white truncate w-32 group-hover:text-endava-orange transition-colors">{agent.name}</h4>
                            <p className={`text-xs ${agent.status === 'Online' ? 'text-emerald-400' :
                                agent.status === 'Initializing' ? 'text-yellow-400' : 'text-endava-blue-40'
                                }`}>
                                {agent.status === 'Initializing' ? 'Deploying...' : agent.status === 'Online' ? 'Online • Scanning' : 'Offline'}
                            </p>
                        </div>
                    </div>
                ))}

                {/* Add New Agent Button */}
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-endava-blue-90/30 border border-dashed border-white/10 p-4 rounded-xl flex items-center justify-center space-x-2 text-endava-blue-40 hover:text-endava-orange hover:border-endava-orange/50 hover:bg-endava-orange/5 transition-all group backdrop-blur-sm"
                >
                    <div className="p-1.5 rounded-full bg-endava-blue-80 group-hover:bg-endava-orange/20 transition-colors border border-white/5 group-hover:border-endava-orange/30">
                        <Plus className="w-4 h-4" />
                    </div>
                    <span className="text-sm font-medium">Deploy New Agent</span>
                </button>
            </div>

            {/* Alert Feed Header & Filters */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
                <h3 className="text-lg font-bold text-white flex items-center">
                    <ShieldAlert className="w-5 h-5 mr-2 text-endava-orange" />
                    Detected Anomalies
                </h3>
                <div className="flex flex-wrap gap-2">
                    <div className="relative">
                        <select
                            value={filterType}
                            onChange={(e) => setFilterType(e.target.value)}
                            className="appearance-none bg-endava-blue-90/80 border border-white/10 text-xs text-white rounded-lg pl-3 pr-8 py-2 focus:outline-none focus:border-endava-orange cursor-pointer backdrop-blur-sm shadow-sm hover:border-white/20 transition-colors"
                        >
                            <option value="All">All Types</option>
                            <option value="Safety Sentinel">Safety</option>
                            <option value="Schedule Guardian">Schedule</option>
                            <option value="Budget Watchdog">Budget</option>
                            <option value="Productivity Benchmarker">Productivity</option>
                            <option value="RFI Bottleneck Detector">Design/RFI</option>
                        </select>
                        <Filter className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-endava-blue-50 pointer-events-none" />
                    </div>
                    <div className="relative">
                        <select
                            value={filterSeverity}
                            onChange={(e) => setFilterSeverity(e.target.value)}
                            className="appearance-none bg-endava-blue-90/80 border border-white/10 text-xs text-white rounded-lg pl-3 pr-8 py-2 focus:outline-none focus:border-endava-orange cursor-pointer backdrop-blur-sm shadow-sm hover:border-white/20 transition-colors"
                        >
                            <option value="All">All Severity</option>
                            <option value="Critical">Critical</option>
                            <option value="High">High</option>
                            <option value="Medium">Medium</option>
                            <option value="Low">Low</option>
                        </select>
                        <Filter className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-endava-blue-50 pointer-events-none" />
                    </div>
                    <div className="relative">
                        <select
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            className="appearance-none bg-endava-blue-90/80 border border-white/10 text-xs text-white rounded-lg pl-3 pr-8 py-2 focus:outline-none focus:border-endava-orange cursor-pointer backdrop-blur-sm shadow-sm hover:border-white/20 transition-colors"
                        >
                            <option value="All">All Status</option>
                            <option value="New">New</option>
                            <option value="Verified">Verified</option>
                            <option value="Dismissed">Dismissed</option>
                        </select>
                        <Filter className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-endava-blue-50 pointer-events-none" />
                    </div>
                </div>
            </div>

            {/* Alert Feed */}
            <div className="space-y-4 mb-4">
                {alerts.length === 0 ? (
                    <div className="p-8 text-center bg-endava-blue-90/30 rounded-2xl border border-white/10 border-dashed backdrop-blur-sm shadow-xl">
                        <ShieldCheck className="w-12 h-12 text-endava-blue-50 mx-auto mb-3" />
                        <p className="text-endava-blue-40">No active threats detected matching your filters.</p>
                    </div>
                ) : (
                    alerts.map(alert => {
                        const Icon = getAgentIcon(alert.agentType);
                        return (
                            <div key={alert.id} className="bg-endava-blue-90/50 border border-white/10 rounded-xl p-5 hover:border-endava-orange/30 hover:bg-white/5 transition-all group animate-fade-in-up backdrop-blur-sm shadow-xl relative overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-l from-endava-orange/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                <div className="flex flex-col md:flex-row gap-4 relative z-10">
                                    {/* Icon Column */}
                                    <div className="flex-shrink-0">
                                        <div className="p-3 bg-endava-blue-80 rounded-lg border border-white/5 shadow-inner">
                                            <Icon className="w-6 h-6 text-endava-orange group-hover:scale-110 transition-transform" />
                                        </div>
                                    </div>

                                    {/* Content Column */}
                                    <div className="flex-1">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <div className="flex items-center space-x-2 mb-1">
                                                    <span className="text-xs font-mono text-endava-blue-40 uppercase tracking-wider">{alert.agentType}</span>
                                                    <span className="text-endava-blue-50">•</span>
                                                    <span className="text-xs text-endava-blue-40">{alert.dateDetected}</span>
                                                    {alert.status === 'Verified' && (
                                                        <span className="bg-emerald-500/10 text-emerald-400 text-[10px] px-1.5 py-0.5 rounded border border-emerald-500/20 ml-2 shadow-sm uppercase font-bold tracking-wider">Verified</span>
                                                    )}
                                                </div>
                                                <h4 className="text-base font-semibold text-white mb-1 group-hover:text-endava-orange transition-colors">{alert.title}</h4>
                                            </div>
                                            <span className={`px-2.5 py-0.5 rounded text-xs font-medium border shadow-sm ${getSeverityColor(alert.severity)}`}>
                                                {alert.severity}
                                            </span>
                                        </div>
                                        <p className="text-sm text-endava-blue-30 mb-3 leading-relaxed">{alert.description}</p>

                                        <div className="flex items-center space-x-4 text-xs">
                                            <div className="bg-white/5 px-2 py-1 rounded border border-white/10 flex items-center shadow-inner">
                                                <Eye className="w-3 h-3 mr-1.5 text-endava-orange" />
                                                Source: <span className="text-white ml-1 font-medium">{alert.source}</span>
                                            </div>
                                            <div className="flex items-center">
                                                <span className="text-endava-blue-40 mr-1.5">AI Confidence:</span>
                                                <div className="h-1.5 w-16 bg-endava-blue-80 border border-white/5 rounded-full overflow-hidden mr-2 shadow-inner">
                                                    <div
                                                        className={`h-full rounded-full ${alert.confidenceScore > 80 ? 'bg-emerald-500' : 'bg-yellow-500'}`}
                                                        style={{ width: `${alert.confidenceScore}%` }}
                                                    />
                                                </div>
                                                <span className={`font-bold ${getConfidenceStyle(alert.confidenceScore)}`}>{alert.confidenceScore}%</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Actions Column */}
                                    <div className="flex md:flex-col gap-2 justify-center md:border-l md:border-white/10 md:pl-4">
                                        <button
                                            onClick={() => handleVerifyAlert(alert.id)}
                                            disabled={alert.status === 'Verified'}
                                            className={`flex items-center justify-center px-3 py-2 border rounded-lg text-xs font-medium transition-colors shadow-sm ${alert.status === 'Verified' ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30 cursor-default' : 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border-emerald-500/20'}`}
                                        >
                                            <Check className="w-3.5 h-3.5 mr-1.5" /> {alert.status === 'Verified' ? 'Verified' : 'Verify'}
                                        </button>
                                        <button
                                            onClick={() => handleDismissAlert(alert.id)}
                                            className="flex items-center justify-center px-3 py-2 bg-endava-blue-80 hover:bg-red-500/10 text-endava-blue-30 hover:text-red-400 border border-white/5 hover:border-red-500/20 rounded-lg text-xs font-medium transition-colors shadow-sm"
                                        >
                                            <X className="w-3.5 h-3.5 mr-1.5" /> Dismiss
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>

            {/* Create Agent Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-endava-dark/90 backdrop-blur-md z-[100] flex items-center justify-center p-4">
                    <div className="bg-endava-blue-90 border border-white/10 rounded-2xl w-full max-w-2xl shadow-2xl animate-fade-in-up flex flex-col max-h-[90vh]">
                        <div className="p-6 border-b border-white/10 flex justify-between items-center bg-white/5 rounded-t-2xl">
                            <div className="flex items-center gap-2">
                                <div className="p-2 bg-endava-orange/20 rounded-lg shadow-inner">
                                    <Bot className="w-5 h-5 text-endava-orange" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-white tracking-tight">Deploy New Agent</h3>
                                    <p className="text-xs text-endava-blue-40">Configure autonomous monitoring for your project.</p>
                                </div>
                            </div>
                            <button onClick={() => setIsModalOpen(false)} className="text-endava-blue-40 hover:text-endava-orange transition-colors">
                                <XCircle className="w-6 h-6" />
                            </button>
                        </div>

                        <div className="p-6 overflow-y-auto custom-scrollbar">
                            {/* Solution Templates */}
                            <div className="mb-6">
                                <h4 className="text-xs font-semibold text-endava-blue-40 uppercase mb-3 tracking-wider">High-Impact Solution Blueprints</h4>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                    {agentTemplates.map((template, idx) => {
                                        const Icon = template.icon;
                                        return (
                                            <button
                                                key={idx}
                                                onClick={() => applyTemplate(template)}
                                                className="text-left bg-endava-blue-80/50 border border-white/5 hover:border-endava-orange/50 hover:bg-white/5 p-3 rounded-xl transition-all group shadow-sm"
                                            >
                                                <div className={`p-2 rounded-lg bg-endava-blue-90 group-hover:bg-endava-blue-80 border border-white/5 w-fit mb-2 ${template.color} shadow-inner`}>
                                                    <Icon className="w-5 h-5" />
                                                </div>
                                                <h5 className="text-sm font-semibold text-white mb-1 leading-tight group-hover:text-endava-orange transition-colors">{template.title}</h5>
                                                <p className="text-[10px] text-endava-blue-30 line-clamp-3 leading-relaxed">{template.prompt}</p>
                                            </button>
                                        )
                                    })}
                                </div>
                            </div>

                            <div className="space-y-4 border-t border-white/10 pt-6">
                                <div>
                                    <label className="block text-xs font-medium text-endava-blue-30 mb-1.5 uppercase tracking-wider">Agent Name</label>
                                    <input
                                        type="text"
                                        value={newAgent.name}
                                        onChange={(e) => setNewAgent({ ...newAgent, name: e.target.value })}
                                        placeholder="e.g. Concrete Quality Monitor"
                                        className="w-full bg-endava-blue-90/50 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-endava-orange/50 focus:border-endava-orange/50 shadow-inner placeholder-endava-blue-50"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-medium text-endava-blue-30 mb-1.5 uppercase tracking-wider">Focus Area</label>
                                    <select
                                        value={newAgent.type}
                                        onChange={(e) => setNewAgent({ ...newAgent, type: e.target.value })}
                                        className="w-full bg-endava-blue-90/50 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-endava-orange/50 focus:border-endava-orange/50 shadow-inner cursor-pointer"
                                    >
                                        <option value="General">General Monitoring</option>
                                        <option value="Schedule">Schedule & Planning</option>
                                        <option value="Budget">Cost & Finance</option>
                                        <option value="Safety">Safety & Compliance</option>
                                        <option value="Supply Chain">Supply Chain & Logistics</option>
                                        <option value="Quality">Quality Control</option>
                                        <option value="Productivity">Workforce Productivity</option>
                                        <option value="Design">Design & RFI</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-xs font-medium text-endava-blue-30 mb-1.5 uppercase tracking-wider">Monitoring Prompt</label>
                                    <textarea
                                        value={newAgent.description}
                                        onChange={(e) => setNewAgent({ ...newAgent, description: e.target.value })}
                                        placeholder="Describe what this agent should look for..."
                                        rows={3}
                                        className="w-full bg-endava-blue-90/50 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-endava-orange/50 focus:border-endava-orange/50 resize-none shadow-inner placeholder-endava-blue-50"
                                    />
                                    {/* AI Suggestions */}
                                    {newAgent.type && suggestedPhrases[newAgent.type] && (
                                        <div className="mt-2 flex flex-wrap gap-1.5">
                                            <span className="text-[10px] text-endava-orange flex items-center mr-1 font-semibold uppercase tracking-wider">
                                                <Sparkles className="w-3 h-3 mr-1" /> Suggestions:
                                            </span>
                                            {suggestedPhrases[newAgent.type].map((phrase, idx) => (
                                                <button
                                                    key={idx}
                                                    onClick={() => setNewAgent({ ...newAgent, description: newAgent.description ? newAgent.description + ' ' + phrase : phrase })}
                                                    className="px-2 py-0.5 bg-endava-blue-80 hover:bg-white/5 border border-white/5 hover:border-endava-orange/50 rounded-full text-[10px] text-endava-blue-30 hover:text-white transition-all shadow-sm"
                                                >
                                                    + {phrase}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                <div className="pt-2">
                                    <div className="bg-endava-orange/10 border border-endava-orange/20 rounded-lg p-3 flex items-start gap-2 shadow-inner">
                                        <Sparkles className="w-4 h-4 text-endava-orange shrink-0 mt-0.5" />
                                        <p className="text-xs text-white font-medium">
                                            Gemini Enterprise will operationalize this prompt to continuously scan structured and unstructured project data for these patterns.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="p-4 border-t border-white/10 bg-white/5 rounded-b-2xl flex justify-end gap-3">
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="px-4 py-2 text-sm font-medium text-endava-blue-40 hover:text-white transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleCreateAgent}
                                disabled={!newAgent.name}
                                className="px-4 py-2 text-sm font-medium bg-endava-orange hover:bg-endava-orange/90 text-white rounded-lg shadow-lg shadow-endava-orange/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center"
                            >
                                <Bot className="w-4 h-4 mr-2" />
                                Deploy Agent
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default RiskPage;