import React, { useMemo } from 'react';
import { AnalyzedContract } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { AlertTriangle, TrendingUp, DollarSign, Clock, FileText } from 'lucide-react';

interface DashboardProps {
  contracts: AnalyzedContract[];
}

const COLORS = ['#30A661', '#CF820E', '#FF5641', '#8684BF', '#3E9C8F'];

export const Dashboard: React.FC<DashboardProps> = ({ contracts }) => {
  
  // Metric: Average Risk Score by Category (Page 9 of PDF)
  const riskByCategory = useMemo(() => {
    const categories: Record<string, { total: number; count: number }> = {};
    contracts.forEach(c => {
      if (!categories[c.type]) categories[c.type] = { total: 0, count: 0 };
      categories[c.type].total += c.riskScore;
      categories[c.type].count += 1;
    });
    return Object.keys(categories).map(cat => ({
      name: cat,
      risk: parseFloat((categories[cat].total / categories[cat].count).toFixed(1))
    }));
  }, [contracts]);

  // Metric: High-Risk Concentration by Jurisdiction (Page 9 of PDF)
  const jurisdictionData = useMemo(() => {
    const counts: Record<string, number> = {};
    contracts.forEach(c => {
      const law = c.governingLaw || 'Unknown';
      counts[law] = (counts[law] || 0) + 1;
    });
    return Object.keys(counts).map(law => ({
      name: law,
      value: counts[law]
    })).sort((a, b) => b.value - a.value);
  }, [contracts]);

  const highRiskCount = contracts.filter(c => c.riskLevel === 'High').length;
  const avgReviewTime = "< 10 mins"; // Static from PDF value prop
  const costSavings = "$15/doc"; // Static from PDF value prop

  return (
    <div className="space-y-8 bg-[var(--color-brand-primary-200)]">
      <div>
        <h2 className="text-2xl font-bold text-[var(--color-brand-primary-300)]">Risk Intelligence Dashboard</h2>
        <p className="text-[var(--color-brand-sb-shade-30)] mt-1">Real-time overview of portfolio risk and compliance posture.</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-[var(--color-brand-sb-shade-90)] p-6 rounded-xl border border-[var(--color-brand-sb-shade-80)] shadow-sm flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-[var(--color-brand-sb-shade-30)]">Total Contracts</p>
            <h3 className="text-3xl font-bold text-[var(--color-brand-primary-300)] mt-2">{contracts.length}</h3>
          </div>
          <div className="p-3 bg-blue-50 text-[var(--color-brand-dv-blue)] rounded-lg">
            <FileText size={20} />
          </div>
        </div>

        <div className="bg-[var(--color-brand-sb-shade-90)] p-6 rounded-xl border border-[var(--color-brand-sb-shade-80)] shadow-sm flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-[var(--color-brand-sb-shade-30)]">High Risk Detected</p>
            <h3 className="text-3xl font-bold text-[var(--color-brand-primary-300)] mt-2">{highRiskCount}</h3>
          </div>
          <div className="p-3 bg-red-50 text-[var(--color-brand-sc-negative)] rounded-lg">
            <AlertTriangle size={20} />
          </div>
        </div>

        <div className="bg-[var(--color-brand-sb-shade-90)] p-6 rounded-xl border border-[var(--color-brand-sb-shade-80)] shadow-sm flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-[var(--color-brand-sb-shade-30)]">Avg. Review Time</p>
            <h3 className="text-3xl font-bold text-[var(--color-brand-primary-300)] mt-2">{avgReviewTime}</h3>
            <p className="text-xs text-[var(--color-brand-sc-positive)] mt-1">Reduced from 2 hrs</p>
          </div>
          <div className="p-3 bg-green-50 text-[var(--color-brand-sc-positive)] rounded-lg">
            <Clock size={20} />
          </div>
        </div>

        <div className="bg-[var(--color-brand-sb-shade-90)] p-6 rounded-xl border border-[var(--color-brand-sb-shade-80)] shadow-sm flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-[var(--color-brand-sb-shade-30)]">Processing Savings</p>
            <h3 className="text-3xl font-bold text-[var(--color-brand-primary-300)] mt-2">{costSavings}</h3>
          </div>
          <div className="p-3 bg-purple-50 text-[var(--color-brand-primary-50)] rounded-lg">
            <DollarSign size={20} />
          </div>
        </div>
      </div>

      {/* Charts Section - Matching PDF Page 9 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Average Risk Score by Category */}
        <div className="bg-[var(--color-brand-sb-shade-90)] p-6 rounded-xl border border-[var(--color-brand-sb-shade-80)] shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-[var(--color-brand-primary-300)]">Average Risk Score by Category</h3>
            <TrendingUp size={18} className="text-slate-400" />
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={riskByCategory} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#5E6A73" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#A3AAAF', fontSize: 12 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#A3AAAF', fontSize: 12 }} domain={[0, 10]} />
                <Tooltip 
                  cursor={{ fill: '#47555F' }}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="risk" fill="#5899C4" radius={[4, 4, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p className="text-sm text-[var(--color-brand-sb-shade-30)] mt-4 text-center italic">
            Visualizing where risk is concentrated across different contract types.
          </p>
        </div>

        {/* High-Risk Concentration (Jurisdiction) */}
        <div className="bg-[var(--color-brand-sb-shade-90)] p-6 rounded-xl border border-[var(--color-brand-sb-shade-80)] shadow-sm">
           <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-[var(--color-brand-primary-300)]">Jurisdictional Exposure</h3>
            <PieChartIcon size={18} className="text-slate-400" />
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={jurisdictionData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {jurisdictionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Legend 
                  layout="vertical" 
                  verticalAlign="middle" 
                  align="right"
                  wrapperStyle={{ fontSize: '12px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
           <p className="text-sm text-[var(--color-brand-sb-shade-30)] mt-4 text-center italic">
            Critical compliance questions about jurisdictional exposure answered in seconds.
          </p>
        </div>
      </div>
    </div>
  );
};

// Helper icon component
const PieChartIcon = ({ size, className }: { size: number, className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M21.21 15.89A10 10 0 1 1 8 2.83"></path>
    <path d="M22 12A10 10 0 0 0 12 2v10z"></path>
  </svg>
);