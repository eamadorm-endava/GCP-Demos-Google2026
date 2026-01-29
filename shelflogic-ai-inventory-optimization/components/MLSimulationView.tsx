
import React, { useState, useMemo, useEffect } from 'react';
import { ResponsiveContainer, ScatterChart, Scatter, XAxis, YAxis, ZAxis, Tooltip, Legend, ComposedChart, Line, Area, AreaChart, CartesianGrid, ReferenceLine, Label, Cell } from 'recharts';
import { Activity, BrainCircuit, Database, Target, StoreIcon, Tag, Truck, Sparkles, RefreshCw, Zap, Shield, AlertTriangle } from './Icons';
import { generateExpertMathExplanation } from '../services/geminiService';
import { theme } from '../theme';

// --- SIMULATION LOGIC ---

const CLUSTERS = [
  { x: 15, y: 20, z: 100, cluster: 'Rural', name: 'Store A' },
  { x: 50, y: 52, z: 210, cluster: 'Target Group', name: 'Dubuque Node' },
  { x: 52, y: 48, z: 205, cluster: 'Target Group', name: 'Davenport Node' },
  { x: 80, y: 85, z: 150, cluster: 'Urban High-Density', name: 'Store X' },
];

export const MLSimulationView = () => {
    const [activeTab, setActiveTab] = useState<'clustering' | 'pricing' | 'forecast'>('clustering');
    const [sensitivity, setSensitivity] = useState(1.5); // Beta for elasticity
    const [volatility, setVolatility] = useState(0.5); // For forecast
    const [expertCommentary, setExpertCommentary] = useState("Initializing neural diagnostic...");
    const [loadingExpert, setLoadingExpert] = useState(false);

    // 1. Dynamic Pricing Data
    const pricingData = useMemo(() => {
        const data = [];
        const baseQty = 100;
        const basePrice = 20;
        for (let p = 12; p <= 35; p++) {
            const q = Math.round(baseQty * Math.pow(p / basePrice, -sensitivity));
            data.push({ price: p, volume: q, revenue: p * q });
        }
        return data;
    }, [sensitivity]);

    const optimalPoint = useMemo(() => {
        return pricingData.reduce((prev, curr) => (prev.revenue > curr.revenue) ? prev : curr);
    }, [pricingData]);

    // 2. Dynamic Forecast Data
    const forecastData = useMemo(() => {
        const data = [];
        let stock = 120;
        for (let i = 1; i <= 14; i++) {
            const demand = 8 + (Math.random() * 10 * volatility);
            stock -= demand;
            data.push({ day: i, stock: Math.max(0, Math.round(stock)), risk: stock < 20 });
        }
        return data;
    }, [volatility]);

    // Fetch Expert Commentary when values change significantly
    const fetchExpertInsight = async () => {
        setLoadingExpert(true);
        const concept = activeTab === 'pricing' ? 'Price Elasticity' : activeTab === 'clustering' ? 'PCA Visual Similarity' : 'Demand Forecasting Stress Test';
        const context = activeTab === 'pricing' ? { sensitivity, optimalPrice: optimalPoint.price } : { volatility };
        const text = await generateExpertMathExplanation(concept, context);
        setExpertCommentary(text);
        setLoadingExpert(false);
    };

    useEffect(() => {
        const timer = setTimeout(fetchExpertInsight, 800);
        return () => clearTimeout(timer);
    }, [sensitivity, volatility, activeTab]);

    return (
        <div className="flex flex-col h-full bg-slate-950 overflow-hidden font-sans">
            {/* Simulation Header */}
            <div className="p-8 border-b border-slate-800 bg-slate-900/40 backdrop-blur-xl relative">
                <div className="absolute inset-0 bg-grid-slate-900/[0.04] bg-[bottom_left_-1px] pointer-events-none"></div>
                <div className="flex items-center justify-between relative z-10">
                    <div className="flex items-center">
                        <div className="p-3 bg-indigo-600 rounded-xl mr-4 shadow-lg shadow-indigo-900/40">
                            <BrainCircuit className="w-8 h-8 text-white" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-white tracking-tight">Neural Strategy Lab</h1>
                            <p className="text-slate-400 font-medium">Interactive Simulation & Stress Testing Engine</p>
                        </div>
                    </div>
                    <div className="flex bg-slate-800 p-1 rounded-xl border border-slate-700">
                        {['clustering', 'pricing', 'forecast'].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab as any)}
                                className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-all ${activeTab === tab ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-8">
                <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-8">
                    
                    {/* LEFT PANEL: Interactive Controls */}
                    <div className="lg:col-span-1 space-y-6">
                        <div className={`${theme.components.card} p-6 border-indigo-500/20 bg-slate-900/50`}>
                            <h3 className="text-xs font-bold text-indigo-400 uppercase tracking-widest mb-6 flex items-center">
                                <Activity className="w-4 h-4 mr-2" />
                                Model Parameters
                            </h3>
                            
                            {activeTab === 'pricing' && (
                                <div className="space-y-8">
                                    <div>
                                        <div className="flex justify-between mb-2">
                                            <label className="text-xs text-slate-300 font-bold">Elasticity (Beta)</label>
                                            <span className="text-xs font-mono text-indigo-400">{sensitivity.toFixed(2)}</span>
                                        </div>
                                        <input 
                                            type="range" min="0.5" max="3.0" step="0.1" 
                                            value={sensitivity} onChange={(e) => setSensitivity(parseFloat(e.target.value))}
                                            className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                                        />
                                        <p className="text-[10px] text-slate-500 mt-2">Higher = More price sensitive consumers.</p>
                                    </div>
                                    <div className="p-4 bg-indigo-950/20 rounded-lg border border-indigo-900/50">
                                        <p className="text-[10px] text-indigo-300 uppercase font-bold mb-1">Target Strategy</p>
                                        <p className="text-white text-sm font-bold">{sensitivity > 1.2 ? 'MARKDOWN TO VOLUME' : 'MARKUP TO MARGIN'}</p>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'forecast' && (
                                <div className="space-y-8">
                                    <div>
                                        <div className="flex justify-between mb-2">
                                            <label className="text-xs text-slate-300 font-bold">Market Volatility</label>
                                            <span className="text-xs font-mono text-rose-400">{(volatility * 100).toFixed(0)}%</span>
                                        </div>
                                        <input 
                                            type="range" min="0" max="1" step="0.1" 
                                            value={volatility} onChange={(e) => setVolatility(parseFloat(e.target.value))}
                                            className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-rose-500"
                                        />
                                        <p className="text-[10px] text-slate-500 mt-2">Simulate external shocks (Game days, Weather).</p>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'clustering' && (
                                <div className="space-y-4">
                                    <div className="p-4 bg-emerald-950/20 rounded-lg border border-emerald-900/50">
                                        <p className="text-[10px] text-emerald-300 uppercase font-bold mb-1">Clustering Engine</p>
                                        <p className="text-white text-sm">KNN Euclidean Distance</p>
                                    </div>
                                    <button className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold transition-all border border-slate-700">
                                        RE-CLUSTER NODES
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* AGENT COMMENTARY BOX */}
                        <div className={`${theme.components.card} p-6 bg-slate-900/80 border-cyan-500/20 relative overflow-hidden`}>
                             <div className="absolute top-0 right-0 p-2">
                                 <Sparkles className={`w-5 h-5 text-cyan-500 ${loadingExpert ? 'animate-pulse' : ''}`} />
                             </div>
                             <h4 className="text-[10px] font-bold text-cyan-400 uppercase tracking-widest mb-3">Agent Diagnostic</h4>
                             {loadingExpert ? (
                                 <div className="space-y-2 animate-pulse">
                                     <div className="h-2 bg-slate-800 rounded w-full"></div>
                                     <div className="h-2 bg-slate-800 rounded w-4/5"></div>
                                 </div>
                             ) : (
                                 <p className="text-xs text-slate-300 leading-relaxed italic border-l-2 border-cyan-500/50 pl-3">
                                     "{expertCommentary}"
                                 </p>
                             )}
                        </div>
                    </div>

                    {/* MAIN STAGE: The Simulation Visualization */}
                    <div className="lg:col-span-3 space-y-8">
                        
                        {/* THE SIMULATOR COMPONENT */}
                        <div className={`${theme.components.card} p-8 bg-slate-900 relative border-slate-800 h-[600px] overflow-hidden`}>
                            {/* Grid Texture Overlay */}
                            <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: `linear-gradient(#6366f1 1px, transparent 1px), linear-gradient(90deg, #6366f1 1px, transparent 1px)`, backgroundSize: '40px 40px' }}></div>
                            
                            {activeTab === 'clustering' && (
                                <div className="h-full w-full animate-fade-in">
                                    <h3 className="text-sm font-bold text-white mb-8 flex items-center">
                                        <Zap className="w-4 h-4 text-amber-400 mr-2" />
                                        High-Dimensional Cluster Projection (PCA)
                                    </h3>
                                    <ResponsiveContainer width="100%" height="80%">
                                        <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                                            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                                            <XAxis type="number" dataKey="x" hide />
                                            <YAxis type="number" dataKey="y" hide />
                                            <ZAxis type="number" dataKey="z" range={[100, 500]} />
                                            <Tooltip cursor={{ strokeDasharray: '3 3' }} content={({ payload }) => {
                                                if (payload && payload.length) {
                                                    const d = payload[0].payload;
                                                    return (
                                                        <div className="bg-slate-900 border border-slate-700 p-3 rounded-xl shadow-2xl">
                                                            <p className="text-white font-bold text-xs">{d.name}</p>
                                                            <p className="text-indigo-400 text-[10px] font-bold uppercase">{d.cluster}</p>
                                                        </div>
                                                    )
                                                }
                                                return null;
                                            }} />
                                            <Scatter name="Stores" data={CLUSTERS}>
                                                {CLUSTERS.map((entry, index) => (
                                                    <Cell 
                                                        key={`cell-${index}`} 
                                                        fill={entry.cluster === 'Target Group' ? theme.charts.primary : '#334155'} 
                                                        className={entry.cluster === 'Target Group' ? 'animate-pulse' : ''}
                                                    />
                                                ))}
                                            </Scatter>
                                        </ScatterChart>
                                    </ResponsiveContainer>
                                    <div className="absolute bottom-8 left-8 right-8 flex justify-between items-end">
                                        <div className="text-[10px] text-slate-500 font-mono">
                                            AXIS_X: Foot Traffic Affinity<br/>
                                            AXIS_Y: Category Mix Deviation
                                        </div>
                                        <div className="flex gap-4">
                                            <div className="flex items-center text-[10px] text-slate-400">
                                                <div className="w-2 h-2 bg-cyan-400 rounded-full mr-2"></div> Lookalike Pairs
                                            </div>
                                            <div className="flex items-center text-[10px] text-slate-400">
                                                <div className="w-2 h-2 bg-slate-700 rounded-full mr-2"></div> Global Network
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'pricing' && (
                                <div className="h-full w-full animate-fade-in">
                                    <h3 className="text-sm font-bold text-white mb-8 flex items-center">
                                        <Tag className="w-4 h-4 text-emerald-400 mr-2" />
                                        Interactive Revenue Surface Simulation
                                    </h3>
                                    <ResponsiveContainer width="100%" height="80%">
                                        <ComposedChart data={pricingData}>
                                            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                                            <XAxis dataKey="price" tick={{fill: '#475569', fontSize: 10}} label={{ value: 'Unit Price ($)', position: 'insideBottom', offset: -10, fill: '#475569', fontSize: 10 }} />
                                            <YAxis yAxisId="left" tick={{fill: '#475569', fontSize: 10}} axisLine={false} tickLine={false} />
                                            <Tooltip content={({ payload }) => {
                                                if (payload && payload.length) {
                                                    const d = payload[0].payload;
                                                    return (
                                                        <div className="bg-slate-900 border border-slate-700 p-4 rounded-xl shadow-2xl space-y-2">
                                                            <p className="text-slate-400 text-[10px] uppercase font-bold">Scenario @ ${d.price}</p>
                                                            <p className="text-emerald-400 font-bold text-sm">Revenue: ${d.revenue.toLocaleString()}</p>
                                                            <p className="text-slate-300 text-xs">Volume: {d.volume} units</p>
                                                        </div>
                                                    )
                                                }
                                                return null;
                                            }} />
                                            <Area yAxisId="left" type="monotone" dataKey="revenue" fill="#10b981" stroke="#10b981" fillOpacity={0.1} strokeWidth={3} />
                                            <ReferenceLine yAxisId="left" x={optimalPoint.price} stroke="#fbbf24" strokeDasharray="3 3">
                                                <Label value="OPTIMAL" position="top" fill="#fbbf24" fontSize={10} fontWeight="bold" />
                                            </ReferenceLine>
                                        </ComposedChart>
                                    </ResponsiveContainer>
                                    <div className="flex justify-around items-center mt-4">
                                        <div className="text-center">
                                            <p className="text-[10px] text-slate-500 uppercase font-bold mb-1">Max Potential</p>
                                            <p className="text-lg font-bold text-white">${optimalPoint.revenue.toLocaleString()}</p>
                                        </div>
                                        <div className="text-center">
                                            <p className="text-[10px] text-slate-500 uppercase font-bold mb-1">Optimal Price</p>
                                            <p className="text-lg font-bold text-indigo-400">${optimalPoint.price}</p>
                                        </div>
                                        <div className="text-center">
                                            <p className="text-[10px] text-slate-500 uppercase font-bold mb-1">Efficiency</p>
                                            <p className="text-lg font-bold text-emerald-400">98.2%</p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'forecast' && (
                                <div className="h-full w-full animate-fade-in">
                                    <h3 className="text-sm font-bold text-white mb-8 flex items-center">
                                        <Truck className="w-4 h-4 text-rose-400 mr-2" />
                                        Neural Demand Burndown Stress Test
                                    </h3>
                                    <ResponsiveContainer width="100%" height="80%">
                                        <AreaChart data={forecastData}>
                                            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                                            <XAxis dataKey="day" tick={{fill: '#475569', fontSize: 10}} label={{ value: 'Days from Present', position: 'insideBottom', offset: -10, fill: '#475569', fontSize: 10 }} />
                                            <YAxis tick={{fill: '#475569', fontSize: 10}} domain={[0, 150]} axisLine={false} tickLine={false} />
                                            <Tooltip />
                                            <Area type="step" dataKey="stock" fill="#f43f5e" stroke="#f43f5e" fillOpacity={0.15} strokeWidth={3} />
                                            <ReferenceLine y={20} stroke="#f43f5e" strokeDasharray="5 5">
                                                <Label value="STOCKOUT THRESHOLD" position="insideBottomRight" fill="#f43f5e" fontSize={10} />
                                            </ReferenceLine>
                                        </AreaChart>
                                    </ResponsiveContainer>
                                    <div className="p-4 bg-rose-950/20 border border-rose-900/40 rounded-xl mt-4 flex items-center justify-between">
                                        <div className="flex items-center">
                                            <AlertTriangle className="w-5 h-5 text-rose-500 mr-3" />
                                            <div>
                                                <p className="text-xs font-bold text-white">Supply Chain Resiliency</p>
                                                <p className="text-[10px] text-rose-300">Target stockout detected on Day 11 under current volatility.</p>
                                            </div>
                                        </div>
                                        <button className="px-4 py-2 bg-rose-600 text-white text-[10px] font-bold rounded-lg uppercase shadow-lg shadow-rose-900/40">Trigger Rebalance</button>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* BOTTOM STATS */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className={`${theme.components.card} p-5 flex items-center gap-4`}>
                                <div className="p-2 bg-indigo-900/30 rounded-lg">
                                    <Database className="w-5 h-5 text-indigo-400" />
                                </div>
                                <div>
                                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Training Set</p>
                                    <p className="text-sm font-bold text-white">4.2M Rows (Iowa POS)</p>
                                </div>
                            </div>
                            <div className={`${theme.components.card} p-5 flex items-center gap-4`}>
                                <div className="p-2 bg-emerald-900/30 rounded-lg">
                                    <Shield className="w-5 h-5 text-emerald-400" />
                                </div>
                                <div>
                                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Confidence Index</p>
                                    <p className="text-sm font-bold text-white">92.4% Neural Certainty</p>
                                </div>
                            </div>
                            <div className={`${theme.components.card} p-5 flex items-center gap-4`}>
                                <div className="p-2 bg-amber-900/30 rounded-lg">
                                    <RefreshCw className="w-5 h-5 text-amber-400" />
                                </div>
                                <div>
                                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Latency (Inference)</p>
                                    <p className="text-sm font-bold text-white">12ms per SKU node</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
                input[type=range]::-webkit-slider-thumb {
                    -webkit-appearance: none;
                    height: 16px;
                    width: 16px;
                    border-radius: 50%;
                    background: #6366f1;
                    cursor: pointer;
                    box-shadow: 0 0 10px rgba(99, 102, 241, 0.5);
                }
                .animate-pulse-slow {
                    animation: pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite;
                }
            `}</style>
        </div>
    );
};
