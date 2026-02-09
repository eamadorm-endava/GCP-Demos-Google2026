import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  AreaChart, Area
} from 'recharts';
import { MOCK_FINDINGS } from '../constants';

const riskData = [
  { name: 'Banking', score: 65, target: 100 },
  { name: 'Securities', score: 88, target: 100 },
  { name: 'Privacy', score: 42, target: 100 },
  { name: 'ERM Logic', score: 95, target: 100 },
];

const trendData = [
  { date: 'Mon', failures: 4, gaps: 2 },
  { date: 'Tue', failures: 7, gaps: 3 },
  { date: 'Wed', failures: 3, gaps: 8 },
  { date: 'Thu', failures: 5, gaps: 4 },
  { date: 'Fri', failures: 2, gaps: 1 },
];

const Dashboard: React.FC = () => {
  return (
    <div className="space-y-6 animate-fadeIn">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Overall Risk Level', value: 'Moderate', color: 'text-signal-amber', bg: 'bg-signal-amber/10', icon: 'fa-shield-halved' },
          { label: 'Agent Uptime', value: '99.98%', color: 'text-signal-green', bg: 'bg-signal-green/10', icon: 'fa-server' },
          { label: 'Open Findings', value: MOCK_FINDINGS.length.toString(), color: 'text-signal-red', bg: 'bg-signal-red/10', icon: 'fa-triangle-exclamation' },
          { label: 'Audit Progress', value: '74%', color: 'text-signal-blue', bg: 'bg-signal-blue/10', icon: 'fa-chart-pie' },
        ].map((stat, i) => (
          <div key={i} className="bg-brand-secondary p-6 rounded-xl shadow-lg border border-brand-border">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-brand-muted mb-1">{stat.label}</p>
                <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
              </div>
              <div className={`p-2 rounded-lg ${stat.bg} ${stat.color}`}>
                <i className={`fas ${stat.icon}`}></i>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-brand-secondary p-6 rounded-xl shadow-lg border border-brand-border">
          <h3 className="text-lg font-semibold mb-6 flex items-center text-white">
            <i className="fas fa-chart-simple mr-2 text-data-blue"></i>
            Compliance Health by Category
          </h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={riskData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" />
                <XAxis dataKey="name" stroke="#B0B0B0" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#B0B0B0" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#192B37', borderColor: '#334155', color: '#fff' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Bar dataKey="score" fill="#FF5540" radius={[4, 4, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-brand-secondary p-6 rounded-xl shadow-lg border border-brand-border">
          <h3 className="text-lg font-semibold mb-6 flex items-center text-white">
            <i className="fas fa-wave-square mr-2 text-data-violet"></i>
            Agentic Detection Trend
          </h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData}>
                <defs>
                  <linearGradient id="colorFail" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#E84641" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#E84641" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" />
                <XAxis dataKey="date" stroke="#B0B0B0" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#B0B0B0" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#192B37', borderColor: '#334155', color: '#fff' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Area type="monotone" dataKey="failures" stroke="#E84641" fillOpacity={1} fill="url(#colorFail)" strokeWidth={2} />
                <Area type="monotone" dataKey="gaps" stroke="#5899C4" fillOpacity={0} strokeWidth={2} strokeDasharray="5 5" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Exceptions Log */}
      <div className="bg-brand-secondary p-6 rounded-xl shadow-lg border border-brand-border">
        <h3 className="text-lg font-semibold mb-4 text-white">Critical Exceptions Log</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-brand-border">
                <th className="pb-3 text-sm font-semibold text-brand-muted">ID</th>
                <th className="pb-3 text-sm font-semibold text-brand-muted">Type</th>
                <th className="pb-3 text-sm font-semibold text-brand-muted">Framework</th>
                <th className="pb-3 text-sm font-semibold text-brand-muted">Severity</th>
                <th className="pb-3 text-sm font-semibold text-brand-muted">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-border">
              {MOCK_FINDINGS.map((finding) => (
                <tr key={finding.id} className="hover:bg-brand-dark transition-colors">
                  <td className="py-4 text-sm font-medium text-white">{finding.id}</td>
                  <td className="py-4 text-sm text-brand-muted">{finding.type}</td>
                  <td className="py-4 text-sm text-brand-muted">{finding.framework}</td>
                  <td className="py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      finding.severity === 'Critical' ? 'bg-signal-red/20 text-signal-red' :
                      finding.severity === 'High' ? 'bg-signal-amber/20 text-signal-amber' :
                      'bg-signal-blue/20 text-signal-blue'
                    }`}>
                      {finding.severity}
                    </span>
                  </td>
                  <td className="py-4 text-sm text-signal-green font-medium italic">Pending Review</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;