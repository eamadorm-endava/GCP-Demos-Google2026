
import React, { useState, useMemo } from 'react';
import { Store } from '../types';
import { ALL_STORES } from '../constants';
import { useStore } from '../store/useStore';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, BarChart, Bar, Cell, PieChart, Pie, ComposedChart, Line, ScatterChart, Scatter, ZAxis, Legend, ReferenceLine } from 'recharts';
import { StoreIcon, DollarSign, Users, Tag, Package, TrendingUp, Activity, AlertTriangle, CheckCircle, Shield, Truck, LayoutGrid, Target } from './Icons';
import { theme } from '../theme';

interface StoreDetailViewProps {
  store: Store;
}

const SimpleTooltip = ({ children, content }: { children: React.ReactNode, content: string }) => (
    <div className="relative group cursor-help flex items-center">
        {children}
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1.5 bg-slate-900 text-slate-200 text-[10px] font-medium rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap border border-slate-700 shadow-xl z-50 backdrop-blur-sm">
            {content}
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1 border-4 border-transparent border-t-slate-700"></div>
        </div>
    </div>
);

export const StoreDetailView: React.FC<StoreDetailViewProps> = ({ store }) => {
  const { goBack } = useStore();
  const [activeTab, setActiveTab] = useState<'overview' | 'inventory' | 'sales'>('overview');

  // Calculate Cluster Averages
  const clusterStats = useMemo(() => {
    const clusterStores = ALL_STORES.filter(s => s.cluster === store.cluster);
    const count = clusterStores.length || 1;
    
    const avgRevenue = clusterStores.reduce((sum, s) => sum + s.metrics.monthly_revenue, 0) / count;
    const avgTraffic = clusterStores.reduce((sum, s) => sum + s.metrics.foot_traffic, 0) / count;
    const avgBasket = clusterStores.reduce((sum, s) => sum + s.metrics.avg_basket_size, 0) / count;

    return { avgRevenue, avgTraffic, avgBasket };
  }, [store]);

  // Mock Historical Data
  const historyData = [
    { month: 'Jan', revenue: store.metrics.monthly_revenue * 0.85, target: store.metrics.monthly_revenue * 0.80 },
    { month: 'Feb', revenue: store.metrics.monthly_revenue * 0.88, target: store.metrics.monthly_revenue * 0.82 },
    { month: 'Mar', revenue: store.metrics.monthly_revenue * 0.92, target: store.metrics.monthly_revenue * 0.85 },
    { month: 'Apr', revenue: store.metrics.monthly_revenue * 0.95, target: store.metrics.monthly_revenue * 0.90 },
    { month: 'May', revenue: store.metrics.monthly_revenue * 1.02, target: store.metrics.monthly_revenue * 0.95 },
    { month: 'Jun', revenue: store.metrics.monthly_revenue, target: store.metrics.monthly_revenue * 0.98 },
  ];

  const categoryMix = [
    { name: 'Spirits', value: 40, color: theme.charts.primary },
    { name: 'Beer', value: 35, color: theme.charts.secondary },
    { name: 'Wine', value: 15, color: theme.charts.purple },
    { name: 'Misc', value: 10, color: theme.charts.gray },
  ];

  // Advanced Inventory Data
  const inventoryHealthData = [
      { category: 'Vodka', stock: 1200, turnover: 8.5, safety: 400 },
      { category: 'Whiskey', stock: 850, turnover: 6.2, safety: 300 },
      { category: 'Tequila', stock: 450, turnover: 9.1, safety: 200 },
      { category: 'Rum', stock: 600, turnover: 4.5, safety: 250 },
      { category: 'Cordials', stock: 900, turnover: 1.2, safety: 150 }, // Dead stock candidate
      { category: 'RTD', stock: 200, turnover: 15.0, safety: 300 }, // Stockout risk
  ];

  // Sales/Margin Matrix Data
  const profitabilityData = [
      { name: 'Prem. Vodka', x: 80, y: 45, z: 500, type: 'Star' }, // High Vol, High Margin
      { name: 'Budget Beer', x: 95, y: 15, z: 800, type: 'Cash Cow' }, // High Vol, Low Margin
      { name: 'Aged Scotch', x: 20, y: 65, z: 200, type: 'Problem' }, // Low Vol, High Margin
      { name: 'Flav. Gin', x: 15, y: 20, z: 100, type: 'Dog' }, // Low Vol, Low Margin
      { name: 'Craft IPA', x: 60, y: 35, z: 400, type: 'Star' },
      { name: 'Hard Seltzer', x: 90, y: 25, z: 600, type: 'Cash Cow' },
  ];

  // Hourly Heatmap Data
  const hourlyData = [
      { hour: '8am', traffic: 45, sales: 120 },
      { hour: '10am', traffic: 120, sales: 450 },
      { hour: '12pm', traffic: 380, sales: 1500 },
      { hour: '2pm', traffic: 250, sales: 980 },
      { hour: '4pm', traffic: 520, sales: 2800 },
      { hour: '6pm', traffic: 850, sales: 4200 }, // Peak
      { hour: '8pm', traffic: 400, sales: 2100 },
      { hour: '10pm', traffic: 150, sales: 600 },
  ];

  // Helper for benchmark bars
  const BenchmarkBar = ({ label, value, avg, format }: { label: string, value: number, avg: number, format: (v: number) => string }) => {
      const max = Math.max(value, avg) * 1.2;
      const valuePct = (value / max) * 100;
      const avgPct = (avg / max) * 100;
      const diff = ((value - avg) / avg) * 100;
      const isPositive = diff >= 0;

      return (
          <div className="space-y-2">
              <div className="flex justify-between items-end">
                  <span className={`text-xs font-bold ${theme.colors.text.tertiary} uppercase tracking-wide`}>{label}</span>
                  <div className="text-right">
                      <span className={`text-sm font-bold ${theme.colors.text.primary}`}>{format(value)}</span>
                      <span className={`ml-2 text-xs font-bold ${isPositive ? theme.semantic.success.text : theme.semantic.danger.text}`}>
                          {isPositive ? '+' : ''}{diff.toFixed(1)}%
                      </span>
                  </div>
              </div>
              <div className="h-8 bg-slate-800 rounded-md relative overflow-hidden border border-slate-700">
                  {/* Store Bar */}
                  <div 
                    className={`absolute top-0 left-0 h-full ${theme.semantic.primary.bg} opacity-80 z-10 rounded-r-md transition-all duration-1000`} 
                    style={{ width: `${valuePct}%` }}
                  ></div>
                  {/* Cluster Avg Marker */}
                  <div 
                    className="absolute top-0 bottom-0 w-1 bg-white z-20 shadow-[0_0_10px_rgba(255,255,255,0.5)]" 
                    style={{ left: `${avgPct}%` }}
                  ></div>
                  <div 
                    className="absolute top-1 text-[9px] font-bold text-slate-300 z-30 px-1.5 py-0.5 bg-black/60 rounded backdrop-blur-sm transform -translate-x-1/2"
                    style={{ left: `${avgPct}%` }}
                  >
                      Avg: {format(avg)}
                  </div>
              </div>
          </div>
      );
  };

  return (
    <div className={`flex flex-col h-full ${theme.colors.background.main} overflow-y-auto animate-in`}>
      {/* Header */}
      <div className={`${theme.components.header} px-8 py-5 flex flex-col md:flex-row justify-between md:items-center sticky top-0 z-30 shadow-sm backdrop-blur-xl bg-slate-950/80 gap-4`}>
        <div>
          <button onClick={goBack} className={`text-sm ${theme.colors.text.secondary} hover:text-white flex items-center mb-1 transition-colors group`}>
             <span className="mr-1 group-hover:-translate-x-1 transition-transform">←</span> Back to Network
          </button>
          <h1 className={`text-2xl font-bold ${theme.colors.text.primary} flex items-center`}>
            <SimpleTooltip content={`ID: ${store.store_id} • ${store.location}`}>
                <StoreIcon className={`w-6 h-6 mr-3 ${theme.semantic.primary.base}`} />
            </SimpleTooltip>
            {store.name}
            <span className={`ml-3 px-3 py-1 ${theme.semantic.primary.bgLight} ${theme.semantic.primary.text} text-xs rounded-full font-medium border ${theme.semantic.primary.border} uppercase tracking-wide`}>
              {store.cluster}
            </span>
          </h1>
        </div>
        
        {/* Tab Navigation */}
        <div className="flex flex-wrap justify-center md:flex-nowrap bg-slate-900 p-1 rounded-xl border border-slate-800">
            {['overview', 'inventory', 'sales'].map((tab) => (
                <button
                    key={tab}
                    onClick={() => setActiveTab(tab as any)}
                    className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-all 
                        ${activeTab === tab 
                            ? `${theme.colors.background.active} text-white shadow-sm ring-1 ring-white/10` 
                            : 'text-slate-500 hover:text-slate-300'}`}
                >
                    {tab === 'inventory' ? 'Inventory & Supply' : tab === 'sales' ? 'Sales & Margin' : 'Store Overview'}
                </button>
            ))}
        </div>
      </div>

      <div className="p-8 max-w-7xl mx-auto w-full space-y-8">
        
        {/* KPI Cards (Always Visible) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className={theme.components.card + " p-6"}>
             <div className="flex justify-between items-start mb-2">
                <p className={`text-xs font-bold ${theme.colors.text.tertiary} uppercase tracking-wide`}>Monthly Revenue</p>
                <SimpleTooltip content="Gross Revenue (Last 30 Days)">
                    <DollarSign className={`w-5 h-5 ${theme.semantic.success.base}`} />
                </SimpleTooltip>
             </div>
             <p className={`text-2xl font-bold ${theme.colors.text.primary}`}>${store.metrics.monthly_revenue.toLocaleString()}</p>
             <div className={`mt-2 text-xs ${theme.semantic.success.text} font-bold ${theme.semantic.success.bgLight} inline-block px-2 py-0.5 rounded border ${theme.semantic.success.border}`}>
                +4.2% vs Target
             </div>
          </div>
          
          <div className={theme.components.card + " p-6"}>
             <div className="flex justify-between items-start mb-2">
                <p className={`text-xs font-bold ${theme.colors.text.tertiary} uppercase tracking-wide`}>Foot Traffic</p>
                <SimpleTooltip content="Unique Visitors (Wi-Fi Count)">
                    <Users className={`w-5 h-5 ${theme.semantic.primary.base}`} />
                </SimpleTooltip>
             </div>
             <p className={`text-2xl font-bold ${theme.colors.text.primary}`}>{store.metrics.foot_traffic.toLocaleString()}</p>
             <p className={`text-xs ${theme.colors.text.tertiary} mt-1`}>Visits per Month</p>
          </div>

          <div className={theme.components.card + " p-6"}>
             <div className="flex justify-between items-start mb-2">
                <p className={`text-xs font-bold ${theme.colors.text.tertiary} uppercase tracking-wide`}>Inventory Value</p>
                <SimpleTooltip content="Current Stock Valuation (Wholesale)">
                    <Package className={`w-5 h-5 ${theme.semantic.secondary.base}`} />
                </SimpleTooltip>
             </div>
             <p className={`text-2xl font-bold ${theme.colors.text.primary}`}>$482,000</p>
             <p className={`text-xs ${theme.colors.text.tertiary} mt-1`}>~42 Days Supply</p>
          </div>

          <div className={theme.components.card + " p-6"}>
             <div className="flex justify-between items-start mb-2">
                <p className={`text-xs font-bold ${theme.colors.text.tertiary} uppercase tracking-wide`}>Compliance Score</p>
                <SimpleTooltip content="Planogram Adherence %">
                    <Shield className={`w-5 h-5 ${theme.semantic.warning.base}`} />
                </SimpleTooltip>
             </div>
             <p className={`text-2xl font-bold ${theme.colors.text.primary}`}>{store.compliance_score || 85}%</p>
             <div className={`w-full h-1.5 ${theme.colors.background.active} rounded-full mt-2 overflow-hidden`}>
                <div className={`h-full ${theme.semantic.warning.bg}`} style={{ width: `${store.compliance_score || 85}%` }}></div>
             </div>
          </div>
        </div>

        {/* === OVERVIEW TAB === */}
        {activeTab === 'overview' && (
            <div className="space-y-8 animate-in">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className={`lg:col-span-2 ${theme.components.card} p-6`}>
                        <h3 className={`font-bold ${theme.colors.text.primary} mb-6 flex items-center`}>
                            <SimpleTooltip content="6-Month Historical Revenue Trend">
                                <TrendingUp className={`w-5 h-5 mr-2 ${theme.colors.text.tertiary}`} />
                            </SimpleTooltip>
                            Revenue Performance (6 Mo)
                        </h3>
                        <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={historyData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="colorRevStore" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor={theme.charts.primary} stopOpacity={0.3}/>
                                            <stop offset="95%" stopColor={theme.charts.primary} stopOpacity={0}/>
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={theme.charts.grid} opacity={0.4} />
                                    <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: theme.charts.neutral}} dy={10} />
                                    <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: theme.charts.neutral}} tickFormatter={(val) => `$${val/1000}k`} />
                                    <RechartsTooltip 
                                        {...theme.components.chartTooltip}
                                        formatter={(val: number) => [`$${val.toLocaleString()}`, 'Revenue']}
                                    />
                                    <Area type="monotone" dataKey="revenue" stroke={theme.charts.primary} fillOpacity={1} fill="url(#colorRevStore)" strokeWidth={3} />
                                    <Area type="monotone" dataKey="target" stroke={theme.charts.neutral} fill="none" strokeWidth={2} strokeDasharray="5 5" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    <div className={`${theme.components.card} p-6`}>
                        <h3 className={`font-bold ${theme.colors.text.primary} mb-6`}>Category Composition</h3>
                        <div className="h-[300px] w-full flex items-center justify-center">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={categoryMix}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={80}
                                        paddingAngle={5}
                                        dataKey="value"
                                        stroke={theme.colors.background.card}
                                        strokeWidth={2}
                                    >
                                        {categoryMix.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <RechartsTooltip 
                                        {...theme.components.chartTooltip}
                                        formatter={(value: number) => [`${value}%`, 'Share']} 
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="mt-4 space-y-2">
                            {categoryMix.map((item, idx) => (
                                <div key={idx} className="flex justify-between items-center text-sm">
                                    <div className="flex items-center">
                                        <span className="w-3 h-3 rounded-full mr-2" style={{backgroundColor: item.color}}></span>
                                        <span className={`${theme.colors.text.secondary}`}>{item.name}</span>
                                    </div>
                                    <span className={`font-bold ${theme.colors.text.primary}`}>{item.value}%</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Cluster Benchmarking Section */}
                <div className={`${theme.components.card} p-6`}>
                    <div className="flex items-center justify-between mb-6">
                        <h3 className={`font-bold ${theme.colors.text.primary} flex items-center`}>
                            <Target className={`w-5 h-5 mr-2 ${theme.semantic.primary.base}`} />
                            Cluster Benchmarking: <span className="text-slate-400 font-normal ml-1">{store.cluster}</span>
                        </h3>
                        <span className="text-xs text-slate-500 font-mono bg-slate-800 px-2 py-1 rounded border border-slate-700">Comparing against 8 similar stores</span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <BenchmarkBar 
                            label="Monthly Revenue" 
                            value={store.metrics.monthly_revenue} 
                            avg={clusterStats.avgRevenue} 
                            format={(v) => `$${(v/1000).toFixed(0)}k`} 
                        />
                        <BenchmarkBar 
                            label="Foot Traffic" 
                            value={store.metrics.foot_traffic} 
                            avg={clusterStats.avgTraffic} 
                            format={(v) => `${(v/1000).toFixed(1)}k`} 
                        />
                        <BenchmarkBar 
                            label="Avg Basket Size" 
                            value={store.metrics.avg_basket_size} 
                            avg={clusterStats.avgBasket} 
                            format={(v) => `$${v.toFixed(2)}`} 
                        />
                    </div>
                </div>
            </div>
        )}

        {/* === INVENTORY TAB === */}
        {activeTab === 'inventory' && (
            <div className="space-y-6 animate-in">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className={`${theme.components.card} p-5 border-l-4 border-indigo-500`}>
                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-1">Stock Turnover (Annual)</p>
                        <p className="text-2xl font-bold text-white">8.4x</p>
                        <p className="text-xs text-indigo-400 mt-1">Top 10% of Network</p>
                    </div>
                    <div className={`${theme.components.card} p-5 border-l-4 border-rose-500`}>
                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-1">Dead Stock Valuation</p>
                        <p className="text-2xl font-bold text-white">$12,450</p>
                        <p className="text-xs text-rose-400 mt-1">Requires Markdown Action</p>
                    </div>
                    <div className={`${theme.components.card} p-5 border-l-4 border-emerald-500`}>
                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-1">In-Stock Rate</p>
                        <p className="text-2xl font-bold text-white">98.2%</p>
                        <p className="text-xs text-emerald-400 mt-1">Above SLA Target</p>
                    </div>
                </div>

                <div className={`${theme.components.card} p-8`}>
                    <h3 className={`font-bold ${theme.colors.text.primary} mb-6 flex items-center`}>
                        <SimpleTooltip content="Supply Chain Velocity Analysis">
                            <Truck className={`w-5 h-5 mr-2 text-indigo-400`} />
                        </SimpleTooltip>
                        Inventory Health vs Sales Velocity
                    </h3>
                    <div className="h-[350px] w-full">
                         <ResponsiveContainer width="100%" height="100%">
                            <ComposedChart data={inventoryHealthData} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={theme.charts.grid} opacity={0.3} />
                                <XAxis dataKey="category" tick={{fill: theme.charts.neutral, fontSize: 12}} axisLine={false} tickLine={false} />
                                <YAxis yAxisId="left" orientation="left" stroke={theme.charts.neutral} tick={{fontSize: 12}} label={{ value: 'Units on Hand', angle: -90, position: 'insideLeft', fill: theme.charts.neutral }} />
                                <YAxis yAxisId="right" orientation="right" stroke={theme.charts.secondary} tick={{fontSize: 12}} label={{ value: 'Turnover Rate', angle: 90, position: 'insideRight', fill: theme.charts.secondary }} />
                                <RechartsTooltip {...theme.components.chartTooltip} />
                                <Legend />
                                <Bar yAxisId="left" dataKey="stock" name="Stock Level" fill={theme.charts.neutral} barSize={40} radius={[4, 4, 0, 0]} />
                                <Line yAxisId="right" type="monotone" dataKey="turnover" name="Turnover" stroke={theme.charts.secondary} strokeWidth={3} dot={{r: 4, strokeWidth: 2}} />
                                <Line yAxisId="left" type="step" dataKey="safety" name="Safety Stock" stroke={theme.charts.danger} strokeWidth={2} strokeDasharray="5 5" dot={false} />
                            </ComposedChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        )}

        {/* === SALES TAB === */}
        {activeTab === 'sales' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in">
                <div className={`${theme.components.card} p-6`}>
                    <h3 className={`font-bold ${theme.colors.text.primary} mb-2 flex items-center`}>
                        <SimpleTooltip content="BCG Matrix: Product Performance">
                            <Activity className={`w-5 h-5 mr-2 text-emerald-400`} />
                        </SimpleTooltip>
                        Profitability Matrix (BCG)
                    </h3>
                    <p className="text-xs text-slate-500 mb-6">Mapping SKUs by Margin vs Volume. Size = Revenue.</p>
                    <div className="h-[350px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke={theme.charts.grid} opacity={0.3} />
                                <XAxis type="number" dataKey="x" name="Volume" unit="%" tick={{fill: theme.charts.neutral, fontSize: 10}} label={{ value: 'Sales Volume Percentile', position: 'insideBottom', offset: -10, fill: theme.charts.neutral, fontSize: 10 }} />
                                <YAxis type="number" dataKey="y" name="Margin" unit="%" tick={{fill: theme.charts.neutral, fontSize: 10}} label={{ value: 'Profit Margin %', angle: -90, position: 'insideLeft', fill: theme.charts.neutral, fontSize: 10 }} />
                                <ZAxis type="number" dataKey="z" range={[50, 400]} name="Revenue" />
                                <RechartsTooltip cursor={{ strokeDasharray: '3 3' }} content={({ payload }) => {
                                    if (payload && payload.length) {
                                        const d = payload[0].payload;
                                        return (
                                            <div className="bg-slate-900 border border-slate-700 p-3 rounded-lg shadow-xl text-xs">
                                                <p className="font-bold text-white mb-1">{d.name}</p>
                                                <p className="text-emerald-400">Margin: {d.y}%</p>
                                                <p className="text-indigo-400">Volume: {d.x}th percentile</p>
                                                <p className="text-slate-400 italic mt-1">{d.type}</p>
                                            </div>
                                        );
                                    }
                                    return null;
                                }} />
                                <Scatter name="Products" data={profitabilityData} fill={theme.charts.primary}>
                                    {profitabilityData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.y > 40 ? theme.charts.success : entry.x > 80 ? theme.charts.primary : theme.charts.danger} />
                                    ))}
                                </Scatter>
                            </ScatterChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className={`${theme.components.card} p-6`}>
                    <h3 className={`font-bold ${theme.colors.text.primary} mb-2 flex items-center`}>
                        <SimpleTooltip content="Sales vs Traffic Correlation">
                            <LayoutGrid className={`w-5 h-5 mr-2 text-amber-400`} />
                        </SimpleTooltip>
                        Hourly Trading Heatmap
                    </h3>
                    <p className="text-xs text-slate-500 mb-6">Average trading velocity by hour of day.</p>
                    <div className="h-[350px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={hourlyData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={theme.charts.grid} opacity={0.3} />
                                <XAxis dataKey="hour" tick={{fill: theme.charts.neutral, fontSize: 12}} axisLine={false} tickLine={false} />
                                <YAxis yAxisId="left" orientation="left" stroke={theme.charts.neutral} tick={{fontSize: 12}} label={{ value: 'Revenue ($)', angle: -90, position: 'insideLeft', fill: theme.charts.neutral }} />
                                <YAxis yAxisId="right" orientation="right" stroke={theme.charts.secondary} tick={{fontSize: 12}} label={{ value: 'Traffic', angle: 90, position: 'insideRight', fill: theme.charts.secondary }} />
                                <RechartsTooltip {...theme.components.chartTooltip} />
                                <Bar yAxisId="left" dataKey="sales" name="Sales ($)" fill={theme.charts.primary} radius={[4, 4, 0, 0]} opacity={0.8} />
                                <Line yAxisId="right" type="monotone" dataKey="traffic" name="Foot Traffic" stroke={theme.charts.secondary} strokeWidth={2} dot={{r: 3}} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        )}

      </div>
    </div>
  );
};
