
import React, { useState, useMemo } from 'react';
import { Opportunity } from '../types';
import { ALL_STORES, STORE_DUBUQUE, STORE_DAVENPORT } from '../constants';
import { Tag, Truck, CheckCircle, RefreshCw, ArrowRight, TrendingUp } from './Icons';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { theme } from '../theme';

interface PlaceholderViewProps {
  opportunity: Opportunity;
  onClose: () => void;
  className?: string;
}

export const PlaceholderView: React.FC<PlaceholderViewProps> = ({ opportunity, onClose, className = '' }) => {
  const [transferStatus, setTransferStatus] = useState<'idle' | 'moving' | 'done'>('idle');
  const [priceStatus, setPriceStatus] = useState<'idle' | 'analyzing' | 'applied'>('idle');
  
  const typeLabel = opportunity.type === 'PRICE_OPTIMIZATION' ? 'Price Optimization' : 'Inventory Rebalance';
  const Icon = opportunity.type === 'PRICE_OPTIMIZATION' ? Tag : Truck;
  const product = opportunity.product || opportunity.delist_candidate;

  // Data helpers
  const isInventory = opportunity.type === 'INVENTORY_REBALANCE';
  const isPrice = opportunity.type === 'PRICE_OPTIMIZATION';
  const targetStore = ALL_STORES.find(s => s.store_id === opportunity.target_store_id) || STORE_DUBUQUE;
  const sourceStore = ALL_STORES.find(s => s.store_id === opportunity.lookalike_store_id) || STORE_DAVENPORT;

  // --- Inventory Logic ---
  const initialTargetStock = 4;
  const initialSourceStock = 124;
  const transferAmount = 48; // e.g., 2 cases

  const currentTargetStock = transferStatus === 'done' ? initialTargetStock + transferAmount : initialTargetStock;
  const currentSourceStock = transferStatus === 'done' ? initialSourceStock - transferAmount : initialSourceStock;

  const handleTransfer = () => {
    setTransferStatus('moving');
    // Simulate network delay and movement
    setTimeout(() => {
      setTransferStatus('done');
    }, 2500);
  };

  // --- Price Logic (Core Implementation) ---
  const optimizationLogic = useMemo(() => {
    if (!product) return null;

    const currentPrice = product.price;
    const currentVelocity = product.velocity_target_store || 10; 
    const currentMonthlyRevenue = currentPrice * currentVelocity;

    // 1. Analyze Elasticity Signal from AI Reasons
    // In a real app, this would query a demand curve model.
    const isHighElasticity = opportunity.match_reasons.some(r => r.toLowerCase().includes('high elasticity'));
    
    let strategy;

    if (isHighElasticity) {
        // Strategy: Markdown to drive volume (Elasticity > 1)
        // Simulation: -15% Price -> +40% Volume
        strategy = {
            type: 'MARKDOWN',
            label: 'Volume Driver',
            priceChange: -0.15,
            volumeChange: 0.40,
            reason: 'High elasticity detected. 15% price cut projected to increase unit velocity by 40%.'
        };
    } else {
        // Strategy: Markup to capture margin (Elasticity < 1)
        // Simulation: +8% Price -> -3% Volume
        strategy = {
            type: 'MARKUP',
            label: 'Margin Expander',
            priceChange: 0.08,
            volumeChange: -0.03,
            reason: 'Low elasticity. 8% price increase projected to have minimal impact on sales volume.'
        };
    }

    const recommendedPrice = currentPrice * (1 + strategy.priceChange);
    const projectedVelocity = currentVelocity * (1 + strategy.volumeChange);
    const projectedMonthlyRevenue = recommendedPrice * projectedVelocity;
    const monthlyLift = projectedMonthlyRevenue - currentMonthlyRevenue;

    return {
        currentPrice,
        recommendedPrice,
        currentMonthlyRevenue,
        projectedMonthlyRevenue,
        monthlyLift,
        strategy
    };
  }, [product, opportunity.match_reasons]);

  const handleApplyPrice = () => {
    setPriceStatus('analyzing');
    setTimeout(() => {
      setPriceStatus('applied');
    }, 1500);
  };

  // Generate Dynamic Chart Data based on Logic
  const priceChartData = useMemo(() => {
    if (!optimizationLogic) return [];
    
    const { currentMonthlyRevenue, projectedMonthlyRevenue } = optimizationLogic;
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'];
    const currentMonthIndex = 3; // Apr is transition point

    return months.map((month, index) => {
        // Add realistic variance (noise)
        const noise = 0.92 + Math.random() * 0.16; 
        
        if (index < currentMonthIndex) {
            return {
                month,
                revenue: Math.round(currentMonthlyRevenue * noise),
                projected: Math.round(currentMonthlyRevenue * noise)
            };
        } else if (index === currentMonthIndex) {
            // Transition month
            return {
                month,
                revenue: Math.round(currentMonthlyRevenue),
                projected: Math.round((currentMonthlyRevenue + projectedMonthlyRevenue) / 2) 
            };
        } else {
            // Future projection
             return {
                month,
                revenue: Math.round(currentMonthlyRevenue * noise), // Baseline if no action taken
                projected: Math.round(projectedMonthlyRevenue * noise) // Optimised path
            };
        }
    });
  }, [optimizationLogic]);

  return (
    <div className={`flex flex-col h-full ${theme.colors.background.main} overflow-y-auto ${className}`}>
      {/* Header */}
      <div className={`${theme.components.header} px-6 py-4 flex justify-between items-center sticky top-0 z-30 shadow-sm`}>
        <div>
          <button onClick={onClose} className={`text-sm ${theme.colors.text.secondary} hover:text-white flex items-center mb-1 transition-colors`}>
             <span className="mr-1">←</span> Back to Dashboard
          </button>
          <h1 className={`text-xl font-bold ${theme.colors.text.primary} flex items-center`}>
            {typeLabel}
            <span className={`ml-3 px-2.5 py-0.5 ${theme.semantic.info.bgLight} ${theme.semantic.info.base} text-xs rounded-full font-medium border ${theme.semantic.info.border}`}>#{opportunity.id}</span>
          </h1>
        </div>
      </div>

      <div className="flex-1 p-8 max-w-5xl mx-auto w-full space-y-8 animate-fade-in">
        
        {/* === INVENTORY REBALANCE UI === */}
        {isInventory ? (
          <div className="space-y-8">
             {/* Product Header */}
             <div className={`${theme.components.card} p-6 flex items-center space-x-6`}>
                <div className={`${theme.components.imageContainer} w-20 h-20 border-2 ${theme.colors.border.base}`}>
                   {product && <img src={product.image} alt={product.name} className="w-full h-full object-contain" />}
                </div>
                <div className="flex-1">
                   <h2 className={`text-lg font-bold ${theme.colors.text.primary}`}>{product?.name}</h2>
                   <p className={`${theme.colors.text.secondary} text-sm mb-2`}>SKU: {product?.sku_id} • {product?.category}</p>
                   <div className="flex space-x-2">
                      <span className={`px-2 py-0.5 ${theme.semantic.danger.bgLight} ${theme.semantic.danger.text} text-xs font-bold rounded border ${theme.semantic.danger.border}`}>Critical Low Stock</span>
                      <span className={`px-2 py-0.5 ${theme.semantic.secondary.bgLight} ${theme.semantic.secondary.text} text-xs font-medium rounded border ${theme.semantic.secondary.border}`}>High Demand Forecast</span>
                   </div>
                </div>
                <div className="ml-auto text-right">
                   <p className={`text-xs ${theme.colors.text.secondary} uppercase font-semibold tracking-wide`}>Projected Lift</p>
                   <p className={`text-3xl font-bold ${theme.semantic.success.base} tracking-tight`}>+${opportunity.projected_lift}</p>
                   <p className={`text-xs ${theme.colors.text.tertiary}`}>/ month</p>
                </div>
             </div>

             {/* Stock Transfer Visualizer */}
             <div className={`${theme.components.card} p-8 relative overflow-hidden`}>
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-400 to-rose-400 opacity-20"></div>
                
                <h3 className={`text-md font-bold ${theme.colors.text.primary} mb-8 flex items-center uppercase tracking-wider text-sm`}>
                  <Truck className={`w-5 h-5 mr-2 ${theme.semantic.secondary.base}`} />
                  Inter-Store Logistics Plan
                </h3>

                <div className="flex flex-col md:flex-row items-center justify-between relative gap-8">
                    {/* Source Store */}
                    <div className={`w-full md:w-1/3 ${theme.semantic.success.bgLight} border ${theme.semantic.success.border} rounded-xl p-6 text-center transition-all duration-500 relative shadow-sm`}>
                        <div className={`absolute -top-3 left-1/2 transform -translate-x-1/2 ${theme.semantic.success.bgLight} ${theme.semantic.success.text} text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wide border ${theme.semantic.success.border}`}>Source (Surplus)</div>
                        <h4 className={`font-bold ${theme.colors.text.primary} text-base mb-1 mt-2`}>{sourceStore.name}</h4>
                        <p className={`text-xs ${theme.semantic.success.text} font-medium mb-4`}>Healthy Inventory Levels</p>
                        <div className={`text-4xl font-bold ${theme.colors.text.primary} mb-1`}>{currentSourceStock}</div>
                        <p className={`text-xs ${theme.colors.text.secondary} font-medium uppercase`}>Units Available</p>
                    </div>

                    {/* Connection Animation */}
                    <div className="flex-1 w-full relative flex flex-col items-center justify-center min-h-[100px]">
                        {/* Road Line */}
                        <div className={`w-full h-0 border-t-2 border-dashed ${theme.colors.border.base} absolute top-1/2 transform -translate-y-1/2`}></div>
                        
                        {/* Progress Line */}
                        <div className="w-full h-1 absolute top-1/2 transform -translate-y-1/2 rounded-full overflow-hidden">
                           <div className={`absolute left-0 top-0 bottom-0 ${theme.semantic.primary.bg} transition-all duration-[2500ms] ease-out ${transferStatus === 'moving' ? 'w-full' : transferStatus === 'done' ? 'w-full' : 'w-0'}`}></div>
                        </div>
                        
                        {/* Truck Icon that moves */}
                        <div className={`absolute top-1/2 transform -translate-y-1/2 transition-all duration-[2500ms] ease-in-out z-10 p-2 ${theme.colors.background.active} rounded-full border ${theme.colors.border.base} shadow-md
                            ${transferStatus === 'idle' ? `left-0 text-slate-500` : ''}
                            ${transferStatus === 'moving' ? `left-[calc(100%-3rem)] ${theme.semantic.primary.base} ${theme.semantic.primary.border}` : ''}
                            ${transferStatus === 'done' ? `left-[calc(100%-3rem)] ${theme.semantic.success.base} ${theme.semantic.success.border}` : ''}
                        `}>
                             {transferStatus === 'done' ? <CheckCircle className="w-6 h-6" /> : <Truck className="w-6 h-6" />}
                        </div>

                        <div className={`mt-10 text-xs font-bold px-3 py-1 rounded-full transition-colors ${transferStatus === 'moving' ? `${theme.semantic.primary.bgLight} ${theme.semantic.primary.text} border ${theme.semantic.primary.border}` : `${theme.colors.background.active} ${theme.colors.text.secondary} border ${theme.colors.border.light}`}`}>
                            {transferStatus === 'moving' ? 'Transit: 48 Units' : transferStatus === 'done' ? 'Delivered' : `${transferAmount} Units Scheduled`}
                        </div>
                    </div>

                    {/* Target Store Card */}
                    <div className={`w-full md:w-1/3 border rounded-xl p-6 text-center transition-all duration-500 relative shadow-sm ${transferStatus === 'done' ? `${theme.colors.background.card} ${theme.colors.border.base}` : `${theme.semantic.danger.bgLight} ${theme.semantic.danger.border}`}`}>
                        <div className={`absolute -top-3 left-1/2 transform -translate-x-1/2 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wide border ${transferStatus === 'done' ? `${theme.semantic.info.bgLight} ${theme.semantic.info.base} ${theme.semantic.info.border}` : `${theme.semantic.danger.bgLight} ${theme.semantic.danger.text} ${theme.semantic.danger.border}`}`}>Target (Deficit)</div>
                        <h4 className={`font-bold ${theme.colors.text.primary} text-base mb-1 mt-2`}>{targetStore.name}</h4>
                        <p className={`text-xs font-medium mb-4 ${transferStatus === 'done' ? theme.colors.text.secondary : theme.semantic.danger.text}`}>
                            {transferStatus === 'done' ? 'Stock Restored' : 'Stockout Imminent'}
                        </p>
                        <div className={`text-4xl font-bold mb-1 ${transferStatus === 'done' ? theme.colors.text.primary : theme.semantic.danger.text}`}>{currentTargetStock}</div>
                        <p className={`text-xs ${theme.colors.text.secondary} font-medium uppercase`}>Units On Hand</p>
                    </div>
                </div>

                {/* Action Footer */}
                <div className={`mt-10 flex justify-center border-t ${theme.colors.border.light} pt-8`}>
                    {transferStatus === 'idle' ? (
                        <button 
                            onClick={handleTransfer}
                            className={`flex items-center px-8 py-3.5 ${theme.components.button.primary} rounded-lg shadow-md transition-all font-semibold text-sm tracking-wide`}
                        >
                            <Truck className="w-5 h-5 mr-2" />
                            Initiate Stock Transfer
                        </button>
                    ) : transferStatus === 'moving' ? (
                        <button disabled className={`flex items-center px-8 py-3.5 ${theme.colors.background.active} ${theme.colors.text.tertiary} rounded-lg font-semibold cursor-not-allowed border ${theme.colors.border.base}`}>
                            <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                            Processing Logistics...
                        </button>
                    ) : (
                        <div className="flex flex-col items-center animate-fade-in">
                            <div className={`flex items-center px-8 py-3.5 ${theme.semantic.success.bgLight} ${theme.semantic.success.text} rounded-lg border ${theme.semantic.success.border} font-semibold mb-2 shadow-sm`}>
                                <CheckCircle className="w-5 h-5 mr-2" />
                                Transfer Order Created: #TR-8821
                            </div>
                            <p className={`text-xs ${theme.colors.text.tertiary}`}>Inventory counts will update automatically upon receipt.</p>
                        </div>
                    )}
                </div>
             </div>
          </div>
        ) : isPrice && optimizationLogic ? (
          /* === PRICE OPTIMIZATION UI === */
          <div className="space-y-8">
             {/* Product Header */}
             <div className={`${theme.components.card} p-6 flex items-center space-x-6`}>
                <div className={`${theme.components.imageContainer} w-20 h-20 border-2 ${theme.colors.border.base}`}>
                   {product && <img src={product.image} alt={product.name} className="w-full h-full object-contain" />}
                </div>
                <div>
                   <h2 className={`text-lg font-bold ${theme.colors.text.primary}`}>{product?.name}</h2>
                   <p className={`${theme.colors.text.secondary} text-sm mb-3`}>SKU: {product?.sku_id} • {product?.category}</p>
                   <div className="flex space-x-2">
                      <span className={`px-2.5 py-1 text-xs font-bold rounded-md border ${optimizationLogic.strategy.type === 'MARKDOWN' ? `${theme.semantic.success.bgLight} ${theme.semantic.success.text} ${theme.semantic.success.border}` : `${theme.semantic.primary.bgLight} ${theme.semantic.primary.text} ${theme.semantic.primary.border}`}`}>
                         {optimizationLogic.strategy.label}
                      </span>
                      <span className={`px-2.5 py-1 ${theme.semantic.info.bgLight} ${theme.semantic.info.base} text-xs font-medium rounded-md border ${theme.semantic.info.border}`}>
                         Elasticity Analysis
                      </span>
                   </div>
                </div>
             </div>

             <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Control Panel */}
                <div className={`lg:col-span-1 ${theme.components.card} p-6 flex flex-col justify-between h-full`}>
                    <div>
                      <h3 className={`font-bold ${theme.colors.text.primary} mb-6 flex items-center text-sm uppercase tracking-wide`}>
                        <Tag className={`w-4 h-4 mr-2 ${theme.colors.text.tertiary}`} />
                        Price Adjustment
                      </h3>
                      
                      <div className="space-y-6">
                        <div className={`p-4 ${theme.colors.background.active} rounded-xl border ${theme.colors.border.light}`}>
                          <p className={`text-xs ${theme.colors.text.secondary} uppercase font-semibold mb-1`}>Current Retail</p>
                          <p className={`text-2xl font-bold ${theme.colors.text.primary} font-mono`}>${optimizationLogic.currentPrice.toFixed(2)}</p>
                        </div>
                        
                        <div className="flex justify-center -my-2 relative z-10">
                          <div className={`${theme.colors.background.card} rounded-full p-1.5 border ${theme.colors.border.base} shadow-sm`}>
                            <ArrowRight className={`w-4 h-4 ${theme.colors.text.tertiary} transform rotate-90`} />
                          </div>
                        </div>

                        <div className={`p-4 rounded-xl border ${optimizationLogic.strategy.type === 'MARKDOWN' ? `${theme.semantic.success.bgLight} ${theme.semantic.success.border}` : `${theme.semantic.primary.bgLight} ${theme.semantic.primary.border}`}`}>
                          <p className={`text-xs uppercase font-bold mb-1 ${optimizationLogic.strategy.type === 'MARKDOWN' ? theme.semantic.success.text : theme.semantic.primary.text}`}>Recommended</p>
                          <div className="flex items-baseline justify-between">
                            <p className={`text-3xl font-bold font-mono ${optimizationLogic.strategy.type === 'MARKDOWN' ? theme.semantic.success.base : theme.semantic.primary.base}`}>
                                ${optimizationLogic.recommendedPrice.toFixed(2)}
                            </p>
                            <span className={`text-xs font-bold px-2 py-1 rounded-md ${optimizationLogic.strategy.type === 'MARKDOWN' ? 'bg-emerald-900 text-emerald-200' : 'bg-blue-900 text-blue-200'}`}>
                                {Math.abs(optimizationLogic.strategy.priceChange * 100).toFixed(0)}% {optimizationLogic.strategy.type === 'MARKDOWN' ? 'OFF' : 'UP'}
                            </span>
                          </div>
                        </div>
                        
                        <div className={`text-xs ${theme.colors.text.secondary} italic mt-2 ${theme.colors.background.active} p-3 rounded-lg border ${theme.colors.border.light} leading-relaxed`}>
                             "{optimizationLogic.strategy.reason}"
                        </div>
                      </div>
                    </div>

                    <div className="mt-8">
                       {priceStatus === 'idle' ? (
                          <button 
                              onClick={handleApplyPrice}
                              className={`w-full flex items-center justify-center px-4 py-3.5 ${theme.components.button.primary} rounded-lg shadow-md transition-all font-semibold text-sm`}
                          >
                             Apply New Price
                          </button>
                       ) : priceStatus === 'analyzing' ? (
                          <button disabled className={`w-full flex items-center justify-center px-4 py-3.5 ${theme.colors.background.active} ${theme.colors.text.tertiary} rounded-lg font-semibold cursor-not-allowed border ${theme.colors.border.base}`}>
                             <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                             Updating Labels...
                          </button>
                       ) : (
                          <div className={`w-full flex items-center justify-center px-4 py-3.5 ${theme.semantic.success.bgLight} ${theme.semantic.success.text} rounded-lg border ${theme.semantic.success.border} font-semibold shadow-sm`}>
                             <CheckCircle className="w-5 h-5 mr-2" />
                             Price Updated
                          </div>
                       )}
                       <p className={`text-[10px] ${theme.colors.text.tertiary} text-center mt-3`}>Updates electronic shelf labels (ESL) instantly.</p>
                    </div>
                </div>

                {/* Chart */}
                <div className={`lg:col-span-2 ${theme.components.card} p-6 flex flex-col`}>
                   <div className="flex justify-between items-center mb-6">
                      <h3 className={`font-bold ${theme.colors.text.primary} flex items-center text-sm uppercase tracking-wide`}>
                        <TrendingUp className={`w-4 h-4 mr-2 ${theme.colors.text.tertiary}`} />
                        Revenue Projection
                      </h3>
                      <div className="flex items-center space-x-4 text-xs font-medium">
                          <div className="flex items-center">
                              <span className="w-2.5 h-2.5 bg-slate-500 rounded-sm mr-2"></span>
                              <span className={`${theme.colors.text.secondary}`}>Historical</span>
                          </div>
                          <div className="flex items-center">
                              <span className="w-2.5 h-2.5 bg-emerald-500 rounded-sm mr-2"></span>
                              <span className={`${theme.semantic.success.text}`}>Optimized Forecast</span>
                          </div>
                      </div>
                   </div>

                   <div className="flex-1 min-h-[250px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={priceChartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                          <defs>
                            <linearGradient id="colorProjected" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor={theme.charts.success} stopOpacity={0.1}/>
                              <stop offset="95%" stopColor={theme.charts.success} stopOpacity={0}/>
                            </linearGradient>
                            <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor={theme.charts.neutral} stopOpacity={0.1}/>
                              <stop offset="95%" stopColor={theme.charts.neutral} stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={theme.charts.grid} />
                          <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: theme.charts.neutral}} dy={10} />
                          <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: theme.charts.neutral}} tickFormatter={(value) => `$${value}`} />
                          <Tooltip 
                            {...theme.components.chartTooltip}
                            formatter={(value: number) => [`$${value}`, 'Revenue']}
                          />
                          <ReferenceLine x="Apr" stroke={theme.charts.grid} strokeDasharray="3 3" label={{ position: 'top',  value: 'Optimization', fill: theme.charts.neutral, fontSize: 10, fontWeight: 600 }} />
                          <Area type="monotone" dataKey="revenue" stroke={theme.charts.neutral} fillOpacity={1} fill="url(#colorRev)" strokeWidth={2} />
                          <Area type="monotone" dataKey="projected" stroke={theme.charts.success} fillOpacity={1} fill="url(#colorProjected)" strokeWidth={2} />
                        </AreaChart>
                      </ResponsiveContainer>
                   </div>
                   <div className={`mt-6 p-4 bg-gradient-to-r from-slate-900 to-slate-800 rounded-lg text-sm ${theme.colors.text.secondary} border ${theme.colors.border.light} flex items-center justify-center`}>
                      <TrendingUp className={`w-4 h-4 ${theme.semantic.success.base} mr-2`} />
                      <span>Projected Revenue Lift: <strong className={`${theme.semantic.success.base}`}>+${optimizationLogic.monthlyLift.toFixed(0)}/mo</strong> over next quarter.</span>
                   </div>
                </div>
             </div>
          </div>
        ) : (
          // Default Placeholder (Generic)
          <div className={`${theme.components.card} p-8 text-center relative overflow-hidden`}>
            <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${theme.semantic.primary.gradient} opacity-20`}></div>
            
            <div className={`w-20 h-20 ${theme.colors.background.active} rounded-full flex items-center justify-center mx-auto mb-6 border ${theme.colors.border.base}`}>
              <Icon className={`w-10 h-10 ${theme.colors.text.tertiary}`} />
            </div>
            
            <h2 className={`text-2xl font-bold ${theme.colors.text.primary} mb-2`}>{typeLabel} Module</h2>
            <p className={`${theme.colors.text.secondary} max-w-lg mx-auto mb-8`}>
              The advanced autonomous agent for {typeLabel.toLowerCase()} is currently being trained on your network's data.
            </p>
            
             <div className={`inline-flex items-center px-4 py-2 ${theme.semantic.info.bgLight} ${theme.semantic.info.base} rounded-md text-sm font-mono border ${theme.semantic.info.border}`}>
              <span className="w-2 h-2 bg-amber-400 rounded-full mr-2 animate-pulse"></span>
              Status: Feature Coming Soon
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
