import React, { useEffect, useState } from 'react';
import { ProjectData } from '../types';
import {
    AlertCircle, CheckCircle, Clock, DollarSign, TrendingDown, TrendingUp,
    AlertTriangle, Users, HardHat, ChevronRight, Activity, Zap, BrainCircuit, ArrowRight, ShieldAlert, ShieldCheck
} from 'lucide-react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    Cell, PieChart, Pie, Legend, ComposedChart, Line
} from 'recharts';
import { generateDashboardSummary } from '../services/geminiService';

interface DashboardProps {
    data: ProjectData;
    riskThreshold: number;
}

const Dashboard: React.FC<DashboardProps> = ({ data, riskThreshold }) => {
    const [aiSummary, setAiSummary] = useState<{ summary: string; highlights: string[] } | null>(null);
    const [loadingSummary, setLoadingSummary] = useState(false);

    // Load AI Summary on project change
    useEffect(() => {
        const fetchSummary = async () => {
            setLoadingSummary(true);
            // Reset summary while loading
            setAiSummary(null);
            const result = await generateDashboardSummary(data);
            setAiSummary(result);
            setLoadingSummary(false);
        };
        fetchSummary();
    }, [data.id]); // Re-run when project ID changes

    // Metrics
    const delayedTasks = data.schedule.filter(t => t.status === 'Delayed').length;
    const highPriorityRFIs = data.rfis.filter(r => r.status === 'Open' && r.priority === 'High').length;
    const budgetVariance = data.financials.reduce((acc, curr) => acc + curr.variance, 0);
    const costData = data.financials.map(f => ({
        name: f.category,
        Budget: f.budget,
        Actual: f.actual,
        Forecast: f.forecast,
        Variance: f.variance
    }));

    // Filter alerts based on threshold
    const visibleAlerts = data.agentAlerts.filter(a => a.confidenceScore >= riskThreshold);

    // Compute forecast finish from latest schedule end date
    const forecastFinish = (() => {
        const endDates = data.schedule
            .map(t => new Date(t.endDate))
            .filter(d => !isNaN(d.getTime()));
        if (endDates.length === 0) return 'TBD';
        const latest = new Date(Math.max(...endDates.map(d => d.getTime())));
        return latest.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    })();

    const formatCurrency = (val: number) => `$${(Math.abs(val) / 1000000).toFixed(1)}M`;

    const getSeverityColor = (severity: string) => {
        switch (severity) {
            case 'Critical': return 'text-red-500 bg-red-500/10 border-red-500/20';
            case 'High': return 'text-orange-500 bg-orange-500/10 border-orange-500/20';
            case 'Medium': return 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20';
            default: return 'text-blue-500 bg-blue-500/10 border-blue-500/20';
        }
    };

    return (
        <div className="h-full overflow-y-auto bg-endava-dark p-6 lg:p-8 space-y-6 custom-scrollbar">
            {/* Header & Date */}
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <div className="flex items-center space-x-2 text-endava-blue-40 mb-1 text-sm">
                        <span className="bg-endava-blue-90 border border-white/10 px-2 py-0.5 rounded text-xs font-mono">{data.projectId}</span>
                        <span>•</span>
                        <span>{data.location}</span>
                    </div>
                    <h2 className="text-3xl font-bold text-white tracking-tight">{data.projectName}</h2>
                </div>
                <div className="flex items-center gap-4 bg-endava-blue-90/50 p-2 rounded-xl border border-white/10 backdrop-blur-sm shadow-xl">
                    <div className="px-4 border-r border-white/10">
                        <span className="text-xs text-endava-blue-50 uppercase tracking-wider font-semibold">Total Completion</span>
                        <div className="text-2xl font-bold text-white flex items-center">
                            {data.totalCompletion}%
                            <span className={`ml-2 text-xs font-medium px-1.5 py-0.5 rounded flex items-center ${data.weeklyProgressTrend.direction === 'up' ? 'text-emerald-500 bg-emerald-500/10' : 'text-red-500 bg-red-500/10'}`}>
                                {data.weeklyProgressTrend.direction === 'up' ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
                                {Math.abs(data.weeklyProgressTrend.value)}%
                            </span>
                        </div>
                    </div>
                    <div className="px-4">
                        <span className="text-xs text-endava-blue-50 uppercase tracking-wider font-semibold">Forecast Finish</span>
                        <div className="text-2xl font-bold text-white">{forecastFinish}</div>
                    </div>
                </div>
            </header>

            {/* AI Predictive Forecaster - New Section */}
            <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 relative overflow-hidden rounded-2xl bg-gradient-to-r from-endava-blue-90/50 to-endava-blue-80/50 border border-white/10 p-1 shadow-lg group hover:border-endava-blue-70 transition-all">
                    <div className="absolute inset-0 bg-endava-dark/10 opacity-50 -z-10 group-hover:opacity-100 transition-opacity" />
                    <div className="bg-endava-dark/40 backdrop-blur-md rounded-xl p-6 h-full flex flex-col justify-center">
                        <div className="flex items-start gap-4">
                            <div className="p-3 bg-gradient-to-br from-endava-orange to-[#ff7e6b] rounded-xl shadow-lg shadow-endava-orange/20 shrink-0">
                                <BrainCircuit className="w-6 h-6 text-white" />
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center justify-between mb-2">
                                    <h3 className="text-lg font-semibold text-white flex items-center">
                                        AI Predictive Insight
                                        {loadingSummary && <Activity className="w-4 h-4 ml-2 animate-pulse text-endava-orange" />}
                                    </h3>
                                    <span className="text-xs font-medium text-endava-orange bg-endava-orange/10 px-2 py-1 rounded border border-endava-orange/20 uppercase tracking-wider">
                                        Forward Looking
                                    </span>
                                </div>

                                {loadingSummary ? (
                                    <div className="space-y-3 animate-pulse max-w-3xl mt-4">
                                        <div className="h-4 bg-endava-blue-80 rounded w-3/4"></div>
                                        <div className="h-4 bg-endava-blue-80 rounded w-full"></div>
                                        <div className="h-4 bg-endava-blue-80 rounded w-1/2"></div>
                                    </div>
                                ) : (
                                    <div>
                                        <p className="text-white text-sm leading-relaxed mb-4">
                                            {aiSummary?.summary || data.aiForecast?.summary || "Analyzing project trends..."}
                                        </p>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                            {(aiSummary?.highlights || []).map((item, i) => (
                                                <div key={i} className="bg-endava-blue-90/80 border border-white/5 hover:border-endava-orange/40 transition-colors rounded-lg p-3 flex items-start gap-2.5 shadow-sm">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-endava-orange mt-2 shrink-0 animate-pulse" />
                                                    <span className="text-xs text-endava-blue-20 font-medium">{item}</span>
                                                </div>
                                            ))}
                                            {!aiSummary && data.aiForecast && (
                                                <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 flex items-start gap-2.5 shadow-sm">
                                                    <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                                                    <span className="text-xs text-red-200 font-medium">
                                                        {data.aiForecast.probability}% Probability: {data.aiForecast.summary}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-endava-blue-90/50 border border-white/10 rounded-2xl p-6 backdrop-blur-sm flex flex-col justify-between shadow-xl">
                    <div>
                        <h3 className="text-sm font-semibold text-endava-blue-40 uppercase tracking-wider mb-4">Risk Probability Score</h3>
                        <div className="flex items-center justify-center py-6">
                            <div className="relative w-40 h-40 flex items-center justify-center">
                                <svg className="w-full h-full transform -rotate-90 overflow-visible" viewBox="0 0 100 100">
                                    <circle cx="50" cy="50" r="42" stroke="#30404B" strokeWidth="8" fill="none" />
                                    <circle
                                        cx="50" cy="50" r="42" stroke={data.aiForecast?.riskLevel === 'High' ? '#ef4444' : data.aiForecast?.riskLevel === 'Medium' ? '#f97316' : '#10b981'}
                                        strokeWidth="8" fill="none"
                                        strokeDasharray={264}
                                        strokeDashoffset={264 - (264 * (data.aiForecast?.probability || 0)) / 100}
                                        strokeLinecap="round"
                                        className="transition-all duration-1000 ease-out"
                                    />
                                </svg>
                                <div className="absolute flex flex-col items-center">
                                    <span className="text-3xl font-bold text-white">{data.aiForecast?.probability}%</span>
                                    <span className="text-xs text-endava-blue-40">Risk Confidence</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="text-center">
                        <p className="text-xs text-endava-blue-40 mb-2">Top Predicted Impact</p>
                        <div className="flex gap-2 justify-center flex-wrap">
                            {data.aiForecast?.affectedTaskIds.map(id => (
                                <span key={id} className="text-xs font-mono bg-endava-blue-80 border border-endava-blue-70 px-2 py-1 rounded text-endava-blue-20 shadow-sm">
                                    {id}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* KPI Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <KpiCard
                    title="Schedule Health"
                    value={delayedTasks > 0 ? "Delayed" : "On Schedule"}
                    subValue={delayedTasks > 0 ? `${delayedTasks} critical items` : "Tracking well"}
                    icon={Clock}
                    status={delayedTasks > 0 ? 'danger' : 'success'}
                />
                <KpiCard
                    title="Budget Variance"
                    value={budgetVariance < 0 ? "Over Budget" : "Under Budget"}
                    subValue={`${formatCurrency(budgetVariance)} forecast`}
                    icon={DollarSign}
                    status={budgetVariance < -1000000 ? 'danger' : budgetVariance < 0 ? 'warning' : 'success'}
                />
                <KpiCard
                    title="Active RFIs"
                    value={highPriorityRFIs.toString()}
                    subValue="High Priority"
                    icon={AlertCircle}
                    status={highPriorityRFIs > 3 ? 'danger' : 'warning'}
                />
                <KpiCard
                    title="Workforce"
                    value={data.workforce.activeWorkers.toString()}
                    subValue="Active Personnel"
                    icon={Users}
                    status="neutral"
                    trend={data.workforce.trend}
                />
            </div>

            {/* Main Charts Area */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

                {/* Financial Forecast */}
                <div className="xl:col-span-2 bg-endava-blue-90/50 border border-white/10 rounded-2xl p-6 backdrop-blur-sm shadow-xl">
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h3 className="text-lg font-bold text-white">Financial Forecast</h3>
                            <p className="text-xs text-endava-blue-40">Budget vs Actuals by Category</p>
                        </div>
                        <div className="flex items-center gap-2 text-xs">
                            <span className="flex items-center"><span className="w-2 h-2 rounded-full bg-[#758087] mr-1"></span> Budget</span>
                            <span className="flex items-center"><span className="w-2 h-2 rounded-full bg-white mr-1"></span> Actual</span>
                        </div>
                    </div>
                    <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%" minHeight={0} minWidth={0}>
                            <ComposedChart data={costData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#30404B" vertical={false} />
                                <XAxis dataKey="name" stroke="#758087" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} dy={10} />
                                <YAxis stroke="#758087" tick={{ fontSize: 11 }} tickFormatter={(val) => `$${val / 1000000}M`} axisLine={false} tickLine={false} />
                                <Tooltip
                                    cursor={{ fill: '#47555F', opacity: 0.2 }}
                                    contentStyle={{ backgroundColor: '#192B37', borderColor: '#47555F', borderRadius: '8px', color: '#f8fafc' }}
                                    itemStyle={{ fontSize: '12px' }}
                                    formatter={(value: number) => [`$${(value).toLocaleString()}`, '']}
                                />
                                <Bar dataKey="Budget" fill="#758087" radius={[4, 4, 0, 0]} barSize={20} fillOpacity={0.9} />
                                <Bar dataKey="Actual" fill="#FFFFFF" radius={[4, 4, 0, 0]} barSize={20} fillOpacity={0.9} />
                                <Line type="monotone" dataKey="Forecast" stroke="#FF5640" strokeWidth={2.5} dot={{ r: 4, fill: '#FF5640', strokeWidth: 2, stroke: '#192B37' }} />
                            </ComposedChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Active Risk Alerts */}
                <div className="bg-endava-blue-90/50 border border-white/10 rounded-2xl p-6 backdrop-blur-sm flex flex-col shadow-xl">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-bold text-white flex items-center">
                            <ShieldAlert className="w-5 h-5 mr-2 text-endava-orange" />
                            Active Risk Alerts
                        </h3>
                        <span className="text-xs text-endava-blue-50 font-medium">Confidence &ge; {riskThreshold}%</span>
                    </div>
                    <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-3 max-h-[400px]">
                        {visibleAlerts.length === 0 ? (
                            <div className="text-center py-10">
                                <ShieldCheck className="w-10 h-10 text-endava-blue-70 mx-auto mb-2" />
                                <p className="text-sm text-endava-blue-50">No active alerts meeting criteria.</p>
                            </div>
                        ) : (
                            visibleAlerts.map(alert => (
                                <div key={alert.id} className="p-4 bg-endava-blue-90/80 border border-white/5 rounded-xl hover:border-endava-blue-60 transition-all group shadow-sm">
                                    <div className="flex justify-between items-start mb-2">
                                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold tracking-wide border ${getSeverityColor(alert.severity)}`}>
                                            {alert.severity}
                                        </span>
                                        <span className="text-[10px] text-endava-blue-40 flex items-center font-medium">
                                            {alert.confidenceScore}% Conf.
                                        </span>
                                    </div>
                                    <h4 className="text-sm font-semibold text-white group-hover:text-endava-orange transition-colors line-clamp-1 break-all">{alert.title}</h4>
                                    <p className="text-xs text-endava-blue-30 mt-1 line-clamp-2 leading-relaxed">{alert.description}</p>
                                    <div className="flex justify-between items-center mt-3 pt-3 border-t border-white/10">
                                        <span className="text-[10px] text-endava-blue-50 font-mono uppercase bg-endava-blue-80/50 px-1.5 py-0.5 rounded">{alert.agentType}</span>
                                        <span className="text-[10px] text-endava-blue-50">{alert.dateDetected}</span>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

// Sub-component for KPI Cards
const KpiCard = ({ title, value, subValue, icon: Icon, status, trend }: any) => {
    const statusColors = {
        danger: 'bg-red-500/10 text-red-500 border-red-500/20',
        warning: 'bg-orange-500/10 text-orange-500 border-orange-500/20',
        success: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
        neutral: 'bg-endava-blue-90/50 text-white border-white/5'
    };

    const currentStyle = statusColors[status as keyof typeof statusColors] || statusColors.neutral;

    return (
        <div className="bg-endava-blue-90/50 border border-white/10 p-5 rounded-2xl backdrop-blur-sm hover:border-endava-blue-70 transition-all group shadow-lg">
            <div className="flex justify-between items-start mb-2">
                <div className={`p-2 rounded-lg ${currentStyle}`}>
                    <Icon className="w-5 h-5" />
                </div>
                {trend && (
                    <div className={`flex items-center text-xs font-medium ${trend.direction === 'up' ? 'text-emerald-400' : trend.direction === 'down' ? 'text-red-400' : 'text-endava-blue-40'}`}>
                        {trend.direction === 'up' ? <TrendingUp className="w-3 h-3 mr-1" /> : trend.direction === 'down' ? <TrendingDown className="w-3 h-3 mr-1" /> : <Activity className="w-3 h-3 mr-1" />}
                        {Math.abs(trend.value)}%
                    </div>
                )}
            </div>
            <div className="mt-2">
                <h3 className="text-sm font-medium text-endava-blue-40">{title}</h3>
                <p className="text-2xl font-bold text-white mt-1 tracking-tight">{value}</p>
                <p className="text-xs text-endava-blue-50 mt-1">{subValue}</p>
            </div>
        </div>
    );
};

export default Dashboard;