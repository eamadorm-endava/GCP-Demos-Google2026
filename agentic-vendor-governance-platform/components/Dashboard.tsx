
import React, { useState, useMemo } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, 
  Legend, ComposedChart, Line
} from 'recharts';
import { 
  TrendingUp, AlertTriangle, Zap, Target, 
  ShieldCheck, CalendarRange, Bug, Timer, Info, CheckCircle2, ArrowUpRight
} from 'lucide-react';
import { Link } from 'react-router-dom';
import AgentFeed from './AgentFeed';
import { VENDORS, METRIC_LOGS, INVOICES } from '../constants';
import { AuditStatus, MetricType } from '../types';
import StatCard from './common/StatCard';

const Dashboard: React.FC = () => {
  const [selectedVendorIds, setSelectedVendorIds] = useState<Set<string>>(new Set(VENDORS.map(v => v.id)));

  const criticalFlagsCount = useMemo(() => {
    return INVOICES.filter(i => i.status === AuditStatus.Flagged || i.status === AuditStatus.Rejected).length;
  }, []);

  const toggleVendor = (id: string) => {
    const newSet = new Set(selectedVendorIds);
    if (newSet.has(id)) {
      if (newSet.size > 1) newSet.delete(id); // Keep at least one selected
    } else {
      newSet.add(id);
    }
    setSelectedVendorIds(newSet);
  };

  const filteredComparisonData = useMemo(() => {
    return VENDORS
      .filter(v => selectedVendorIds.has(v.id))
      .map(v => {
        let colorHex = '#4f46e5'; // indigo default
        if (v.color === 'teal') colorHex = '#0d9488';
        else if (v.color === 'orange') colorHex = '#f97316';
        else if (v.color === 'purple') colorHex = '#8b5cf6';
        else if (v.color === 'rose') colorHex = '#e11d48';
        else if (v.color === 'blue') colorHex = '#2563eb';

        return {
          name: v.name,
          id: v.id,
          bugs: METRIC_LOGS.find(m => m.vendorId === v.id && m.type === MetricType.BugCount)?.value || 0,
          bugTarget: METRIC_LOGS.find(m => m.vendorId === v.id && m.type === MetricType.BugCount)?.target || 15,
          responseTime: METRIC_LOGS.find(m => m.vendorId === v.id && m.type === MetricType.ResponseTime)?.value || 0,
          responseTarget: METRIC_LOGS.find(m => m.vendorId === v.id && m.type === MetricType.ResponseTime)?.target || 4.0,
          velocity: METRIC_LOGS.find(m => m.vendorId === v.id && m.type === MetricType.Velocity)?.value || 0,
          color: colorHex
        };
      });
  }, [selectedVendorIds]);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 rounded-2xl shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">{label}</p>
          {payload.map((p: any, i: number) => (
            <div key={i} className="flex items-center justify-between gap-8 mb-1">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color }}></div>
                <span className="text-xs font-bold text-slate-600">{p.name}:</span>
              </div>
              <span className="text-sm font-black text-slate-900">{p.value}</span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="flex flex-col xl:flex-row h-full gap-8">
      <div className="flex-1 space-y-8 min-w-0">
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl lg:text-4xl font-black text-slate-800 tracking-tight">Command Center</h1>
            <p className="text-slate-500 font-medium mt-1">Global Vendor Portfolio Overview</p>
          </div>
          <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl shadow-sm border border-slate-200">
            <CalendarRange className="text-indigo-600" size={18} />
            <span className="text-sm font-bold text-slate-700">Q1 FY2024</span>
          </div>
        </header>

        {/* Top Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <StatCard
            icon={<TrendingUp size={24} />}
            iconBgColor="bg-indigo-50 text-indigo-600"
            title="Governance Savings"
            value="$350,000"
            trend={{ text: "+12.4% savings", color: "green" }}
          />
          <StatCard
            icon={<Zap size={24} />}
            iconBgColor="bg-teal-50 text-teal-600"
            title="Automation Rate"
            value="92% AI-Audited"
            trend={{ text: "Efficiency Up", color: "blue" }}
          />
          <StatCard
            icon={<AlertTriangle size={24} />}
            iconBgColor="bg-amber-50 text-amber-600"
            title="Critical Flags"
            value={`${criticalFlagsCount} Issues`}
            trend={{ text: "Action Req", color: "red" }}
            linkTo="/finance?status=critical"
          />
        </div>

        {/* Head-to-Head Multi-Selector & Comparison Section */}
        <section className="bg-white p-8 lg:p-10 rounded-[3rem] shadow-sm border border-slate-200 space-y-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="w-1.5 h-10 bg-indigo-600 rounded-full"></div>
              <div>
                <h3 className="text-2xl font-black text-slate-800">Head-to-Head Analytics</h3>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Multi-Vendor Side-by-Side Comparison</p>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {VENDORS.map(v => (
                <div key={v.id} className="group relative">
                  <button
                    onClick={() => toggleVendor(v.id)}
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all ${
                      selectedVendorIds.has(v.id) 
                        ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100 pr-8' 
                        : 'bg-slate-100 text-slate-400 grayscale hover:grayscale-0 hover:bg-slate-200'
                    }`}
                  >
                    <CheckCircle2 size={14} className={selectedVendorIds.has(v.id) ? 'opacity-100' : 'opacity-0'} />
                    {v.name}
                  </button>
                  {selectedVendorIds.has(v.id) && (
                    <Link 
                      to={`/vendor/${v.id}`}
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-white/70 hover:text-white transition-colors"
                      title="View Vendor Profile"
                    >
                      <ArrowUpRight size={14} />
                    </Link>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Bug Count Comparison */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-red-50 text-red-600 rounded-xl"><Bug size={18} /></div>
                  <h4 className="font-black text-slate-700 uppercase tracking-widest text-xs">Quality (Bug Count)</h4>
                </div>
                <span className="text-[10px] font-bold text-slate-400">TARGET: {Math.max(...filteredComparisonData.map(d => d.bugTarget))} MAX</span>
              </div>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={filteredComparisonData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }} />
                    <Tooltip cursor={{ fill: '#f8fafc' }} content={<CustomTooltip />} />
                    <Bar dataKey="bugs" name="Bugs" radius={[8, 8, 0, 0]} barSize={40}>
                      {filteredComparisonData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.bugs > entry.bugTarget ? '#ef4444' : entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Response Time Comparison */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-blue-50 text-blue-600 rounded-xl"><Timer size={18} /></div>
                  <h4 className="font-black text-slate-700 uppercase tracking-widest text-xs">Support (Response Time)</h4>
                </div>
                <span className="text-[10px] font-bold text-slate-400">TARGET: 4.0h CAP</span>
              </div>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={filteredComparisonData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }} />
                    <Tooltip cursor={{ fill: '#f8fafc' }} content={<CustomTooltip />} />
                    <Bar dataKey="responseTime" name="Hours" radius={[8, 8, 0, 0]} barSize={40}>
                      {filteredComparisonData.map((entry, index) => (
                        <Cell key={`cell-rt-${index}`} fill={entry.responseTime > entry.responseTarget ? '#f59e0b' : entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
          
          <div className="pt-6 border-t border-slate-100 flex items-center justify-center gap-8">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">SLA Overrun</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-slate-300 rounded-full"></div>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">At Risk</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-indigo-600 rounded-full"></div>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Optimal Range</span>
            </div>
          </div>
        </section>

        {/* Existing Performance Sections simplified to use the filtered set */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pb-12">
          {/* Velocity Comparison */}
          <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-200">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="w-1.5 h-8 bg-indigo-600 rounded-full"></div>
                <div>
                  <h3 className="text-xl font-black text-slate-800">Delivery Velocity</h3>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Story Points vs Target</p>
                </div>
              </div>
              <Target className="text-slate-300" />
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={filteredComparisonData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="velocity" name="Story Points" radius={[8, 8, 0, 0]} barSize={48}>
                    {filteredComparisonData.map((entry, index) => (
                      <Cell key={`cell-v-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                  <Line type="monotone" dataKey="bugTarget" name="Base Target" stroke="#94a3b8" strokeDasharray="5 5" strokeWidth={2} dot={false} />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* SLA Status for selected vendors */}
          <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-200">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="w-1.5 h-8 bg-teal-600 rounded-full"></div>
                <div>
                  <h3 className="text-xl font-black text-slate-800">SLA Adherence</h3>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Availability Tracking</p>
                </div>
              </div>
              <ShieldCheck className="text-slate-300" />
            </div>
            <div className="space-y-8">
              {VENDORS.filter(v => selectedVendorIds.has(v.id)).map(v => {
                const val = METRIC_LOGS.find(m => m.vendorId === v.id && m.type === MetricType.SLAAdherence)?.value || 0;
                const isBelow = val < 99.0;
                return (
                  <div key={v.id}>
                    <div className="flex justify-between items-end mb-2">
                      <Link to={`/vendor/${v.id}`} className="text-sm font-black text-slate-800 hover:text-indigo-600 transition-colors flex items-center gap-1 group">
                        {v.name}
                        <ArrowUpRight size={12} className="opacity-0 group-hover:opacity-50 transition-opacity" />
                      </Link>
                      <span className={`text-lg font-black ${isBelow ? 'text-amber-600' : 'text-teal-600'}`}>{val}%</span>
                    </div>
                    <div className="h-3 bg-slate-100 rounded-full overflow-hidden p-0.5">
                      <div 
                        className={`h-full rounded-full transition-all duration-1000 ease-out ${isBelow ? 'bg-amber-400' : 'bg-teal-500'}`}
                        style={{ width: `${val}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
      
      {/* Hidden on Tablet, visible on desktop sidebar */}
      <div className="hidden xl:block">
        <AgentFeed />
      </div>
    </div>
  );
};

export default Dashboard;
