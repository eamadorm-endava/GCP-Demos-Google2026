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

  const formatCurrency = (val: number) => `$${(Math.abs(val) / 1000000).toFixed(1)}M`;

  const getSeverityColor = (severity: string) => {
    switch(severity) {
        case 'Critical': return 'text-red-500 bg-red-500/10 border-red-500/20';
        case 'High': return 'text-orange-500 bg-orange-500/10 border-orange-500/20';
        case 'Medium': return 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20';
        default: return 'text-blue-500 bg-blue-500/10 border-blue-500/20';
    }
  };

  return (
    <div className="h-full overflow-y-auto bg-slate-950 p-6 lg:p-8 space-y-6 custom-scrollbar">
      {/* Header & Date */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-slate-400 mb-1 text-sm">
             <span className="bg-slate-900 border border-slate-800 px-2 py-0.5 rounded text-xs font-mono">{data.projectId}</span>
             <span>•</span>
             <span>{data.location}</span>
          </div>
          <h2 className="text-3xl font-bold text-white tracking-tight">{data.projectName}</h2>
        </div>
        <div className="flex items-center gap-4 bg-slate-900/50 p-2 rounded-xl border border-slate-800 backdrop-blur-sm">
            <div className="px-4 border-r border-slate-800">
                <span className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Total Completion</span>
                <div className="text-2xl font-bold text-white flex items-center">
                    {data.totalCompletion}%
                    <span className={`ml-2 text-xs font-medium px-1.5 py-0.5 rounded flex items-center ${data.weeklyProgressTrend.direction === 'up' ? 'text-emerald-500 bg-emerald-500/10' : 'text-red-500 bg-red-500/10'}`}>
                        {data.weeklyProgressTrend.direction === 'up' ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
                        {Math.abs(data.weeklyProgressTrend.value)}%
                    </span>
                </div>
            </div>
            <div className="px-4">
                <span className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Forecast Finish</span>
                <div className="text-2xl font-bold text-slate-200">Nov 2024</div>
            </div>
        </div>
      </header>

      {/* AI Predictive Forecaster - New Section */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 relative overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-900/30 to-purple-900/30 border border-indigo-500/30 p-1">
            <div className="absolute inset-0 bg-grid-slate-800/[0.2] -z-10" />
            <div className="bg-slate-950/40 backdrop-blur-md rounded-xl p-6 h-full flex flex-col justify-center">
                <div className="flex items-start gap-4">
                    <div className="p-3 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-lg shadow-indigo-500/20 shrink-0">
                        <BrainCircuit className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="text-lg font-semibold text-white flex items-center">
                                AI Predictive Insight
                                {loadingSummary && <Activity className="w-4 h-4 ml-2 animate-pulse text-indigo-400" />}
                            </h3>
                            <span className="text-xs font-medium text-indigo-300 bg-indigo-500/10 px-2 py-1 rounded border border-indigo-500/20">
                                Forward Looking
                            </span>
                        </div>
                        
                        {loadingSummary ? (
                            <div className="space-y-3 animate-pulse max-w-3xl mt-4">
                                <div className="h-4 bg-slate-800 rounded w-3/4"></div>
                                <div className="h-4 bg-slate-800 rounded w-full"></div>
                                <div className="h-4 bg-slate-800 rounded w-1/2"></div>
                            </div>
                        ) : (
                            <div>
                                <p className="text-slate-200 text-sm leading-relaxed mb-4">
                                    {aiSummary?.summary || data.aiForecast?.summary || "Analyzing project trends..."}
                                </p>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    {(aiSummary?.highlights || []).map((item, i) => (
                                        <div key={i} className="bg-slate-900/60 border border-slate-800 hover:border-indigo-500/30 transition-colors rounded-lg p-3 flex items-start gap-2.5">
                                            <div className="w-1.5 h-1.5 rounded-full bg-accent-orange mt-2 shrink-0 animate-pulse" />
                                            <span className="text-xs text-slate-300 font-medium">{item}</span>
                                        </div>
                                    ))}
                                    {!aiSummary && data.aiForecast && (
                                        <div className="bg-red-900/20 border border-red-900/40 rounded-lg p-3 flex items-start gap-2.5">
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

          <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 backdrop-blur-sm flex flex-col justify-between">
             <div>
                 <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">Risk Probability Score</h3>
                 <div className="flex items-center justify-center py-6">
                     <div className="relative w-40 h-40 flex items-center justify-center">
                         <svg className="w-full h-full transform -rotate-90 overflow-visible" viewBox="0 0 100 100">
                             <circle cx="50" cy="50" r="42" stroke="#1e293b" strokeWidth="8" fill="none" />
                             <circle 
                                cx="50" cy="50" r="42" stroke={data.aiForecast?.riskLevel === 'High' ? '#ef4444' : data.aiForecast?.riskLevel === 'Medium' ? '#f97316' : '#10b981'} 
                                strokeWidth="8" fill="none" 
                                strokeDasharray={264} 
                                strokeDashoffset={264 - (264 * (data.aiForecast?.probability || 0)) / 100}
                                strokeLinecap="round"
                             />
                         </svg>
                         <div className="absolute flex flex-col items-center">
                             <span className="text-3xl font-bold text-white">{data.aiForecast?.probability}%</span>
                             <span className="text-xs text-slate-400">Risk Confidence</span>
                         </div>
                     </div>
                 </div>
             </div>
             <div className="text-center">
                 <p className="text-xs text-slate-400 mb-2">Top Predicted Impact</p>
                 <div className="flex gap-2 justify-center flex-wrap">
                    {data.aiForecast?.affectedTaskIds.map(id => (
                        <span key={id} className="text-xs font-mono bg-slate-800 border border-slate-700 px-2 py-1 rounded text-slate-300">
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
        <div className="xl:col-span-2 bg-slate-900/50 border border-slate-800 rounded-2xl p-6 backdrop-blur-sm">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h3 className="text-lg font-bold text-white">Financial Forecast</h3>
                    <p className="text-xs text-slate-400">Budget vs Actuals by Category</p>
                </div>
                <div className="flex items-center gap-2 text-xs">
                    <span className="flex items-center"><span className="w-2 h-2 rounded-full bg-primary-500 mr-1"></span> Budget</span>
                    <span className="flex items-center"><span className="w-2 h-2 rounded-full bg-emerald-500 mr-1"></span> Actual</span>
                </div>
            </div>
            <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={costData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                        <XAxis dataKey="name" stroke="#64748b" tick={{fontSize: 11}} axisLine={false} tickLine={false} dy={10} />
                        <YAxis stroke="#64748b" tick={{fontSize: 11}} tickFormatter={(val) => `$${val/1000000}M`} axisLine={false} tickLine={false} />
                        <Tooltip 
                            contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', color: '#f8fafc' }}
                            itemStyle={{ fontSize: '12px' }}
                            formatter={(value: number) => [`$${(value).toLocaleString()}`, '']}
                        />
                        <Bar dataKey="Budget" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={20} fillOpacity={0.8} />
                        <Bar dataKey="Actual" fill="#10b981" radius={[4, 4, 0, 0]} barSize={20} fillOpacity={0.8} />
                        <Line type="monotone" dataKey="Forecast" stroke="#f97316" strokeWidth={2} dot={{r: 3, fill: '#f97316'}} />
                    </ComposedChart>
                </ResponsiveContainer>
            </div>
        </div>

        {/* Active Risk Alerts */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 backdrop-blur-sm flex flex-col">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-white flex items-center">
                    <ShieldAlert className="w-5 h-5 mr-2 text-primary-400" />
                    Active Risk Alerts
                </h3>
                <span className="text-xs text-slate-500">Confidence &ge; {riskThreshold}%</span>
            </div>
            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-3 max-h-[400px]">
                {visibleAlerts.length === 0 ? (
                     <div className="text-center py-10">
                        <ShieldCheck className="w-10 h-10 text-slate-700 mx-auto mb-2" />
                        <p className="text-sm text-slate-500">No active alerts meeting criteria.</p>
                     </div>
                ) : (
                    visibleAlerts.map(alert => (
                        <div key={alert.id} className="p-3 bg-slate-900 border border-slate-800 rounded-xl hover:border-slate-600 transition-colors group">
                            <div className="flex justify-between items-start mb-1">
                                <span className={`px-2 py-0.5 rounded text-[10px] font-medium border ${getSeverityColor(alert.severity)}`}>
                                    {alert.severity}
                                </span>
                                <span className="text-[10px] text-slate-500 flex items-center">
                                    {alert.confidenceScore}% Conf.
                                </span>
                            </div>
                            <h4 className="text-sm font-medium text-white group-hover:text-primary-400 transition-colors line-clamp-1">{alert.title}</h4>
                            <p className="text-xs text-slate-400 mt-1 line-clamp-2">{alert.description}</p>
                            <div className="flex justify-between items-center mt-2 pt-2 border-t border-slate-800/50">
                                <span className="text-[10px] text-slate-600 font-mono">{alert.agentType}</span>
                                <span className="text-[10px] text-slate-500">{alert.dateDetected}</span>
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
        neutral: 'bg-slate-800 text-slate-400 border-slate-700'
    };

    const currentStyle = statusColors[status as keyof typeof statusColors] || statusColors.neutral;

    return (
        <div className="bg-slate-900/50 border border-slate-800 p-5 rounded-2xl backdrop-blur-sm hover:border-slate-700 transition-colors group">
            <div className="flex justify-between items-start mb-2">
                <div className={`p-2 rounded-lg ${currentStyle}`}>
                    <Icon className="w-5 h-5" />
                </div>
                {trend && (
                    <div className={`flex items-center text-xs font-medium ${trend.direction === 'up' ? 'text-emerald-400' : trend.direction === 'down' ? 'text-red-400' : 'text-slate-400'}`}>
                        {trend.direction === 'up' ? <TrendingUp className="w-3 h-3 mr-1" /> : trend.direction === 'down' ? <TrendingDown className="w-3 h-3 mr-1" /> : <Activity className="w-3 h-3 mr-1" />}
                        {Math.abs(trend.value)}%
                    </div>
                )}
            </div>
            <div className="mt-2">
                <h3 className="text-sm font-medium text-slate-400">{title}</h3>
                <p className="text-2xl font-bold text-white mt-1 tracking-tight">{value}</p>
                <p className="text-xs text-slate-500 mt-1">{subValue}</p>
            </div>
        </div>
    );
};

export default Dashboard;