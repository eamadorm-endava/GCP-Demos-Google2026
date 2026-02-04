
import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, LineChart, Line, AreaChart, Area
} from 'recharts';
import { MOCK_FINDINGS, REGULATORY_SCOPE } from '../constants';

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

const COLORS = ['#3B82F6', '#EF4444', '#10B981', '#F59E0B'];

const Dashboard: React.FC = () => {
  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Overall Risk Level', value: 'Moderate', color: 'text-yellow-600', icon: 'fa-shield-halved' },
          { label: 'Agent Uptime', value: '99.98%', color: 'text-green-600', icon: 'fa-server' },
          { label: 'Open Findings', value: MOCK_FINDINGS.length.toString(), color: 'text-red-600', icon: 'fa-triangle-exclamation' },
          { label: 'Audit Progress', value: '74%', color: 'text-blue-600', icon: 'fa-chart-pie' },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">{stat.label}</p>
                <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
              </div>
              <div className={`p-2 rounded-lg bg-gray-50 ${stat.color}`}>
                <i className={`fas ${stat.icon}`}></i>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold mb-6 flex items-center">
            <i className="fas fa-chart-simple mr-2 text-blue-500"></i>
            Compliance Health by Category
          </h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={riskData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="score" fill="#3B82F6" radius={[4, 4, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold mb-6 flex items-center">
            <i className="fas fa-wave-square mr-2 text-indigo-500"></i>
            Agentic Detection Trend
          </h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData}>
                <defs>
                  <linearGradient id="colorFail" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#EF4444" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#EF4444" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Area type="monotone" dataKey="failures" stroke="#EF4444" fillOpacity={1} fill="url(#colorFail)" />
                <Area type="monotone" dataKey="gaps" stroke="#3B82F6" fillOpacity={0} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold mb-4">Critical Exceptions Log</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="pb-3 text-sm font-semibold text-gray-600">ID</th>
                <th className="pb-3 text-sm font-semibold text-gray-600">Type</th>
                <th className="pb-3 text-sm font-semibold text-gray-600">Framework</th>
                <th className="pb-3 text-sm font-semibold text-gray-600">Severity</th>
                <th className="pb-3 text-sm font-semibold text-gray-600">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {MOCK_FINDINGS.map((finding) => (
                <tr key={finding.id} className="hover:bg-gray-50 transition-colors">
                  <td className="py-4 text-sm font-medium text-gray-900">{finding.id}</td>
                  <td className="py-4 text-sm text-gray-600">{finding.type}</td>
                  <td className="py-4 text-sm text-gray-600">{finding.framework}</td>
                  <td className="py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      finding.severity === 'Critical' ? 'bg-red-100 text-red-700' :
                      finding.severity === 'High' ? 'bg-orange-100 text-orange-700' :
                      'bg-blue-100 text-blue-700'
                    }`}>
                      {finding.severity}
                    </span>
                  </td>
                  <td className="py-4 text-sm text-green-600 font-medium italic">Pending Review</td>
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
