
import React, { useMemo } from 'react';
import { Opportunity } from '../types';
import { ComposedChart, Area, Line, CartesianGrid, XAxis, YAxis, Tooltip, ReferenceLine, Label, ResponsiveContainer } from 'recharts';
import { TrendingUp, ArrowRight } from './Icons';
import { theme } from '../theme';

interface PriceOptimizationDetailsProps {
  opportunity: Opportunity;
}

export const PriceOptimizationDetails: React.FC<PriceOptimizationDetailsProps> = ({ opportunity }) => {
  const { pricingData, pricingSummary } = useMemo(() => {
    if (!opportunity.product) return { pricingData: [], pricingSummary: null };
    
    const basePrice = opportunity.product.price;
    const isHighElasticity = opportunity.match_reasons.some(r => r.toLowerCase().includes('elastic'));
    const elasticity = isHighElasticity ? 2.2 : 0.6;
    
    const data = [];
    for (let p = basePrice * 0.7; p <= basePrice * 1.3; p += basePrice * 0.05) {
        const pricePoint = parseFloat(p.toFixed(2));
        const currentQ = opportunity.product.velocity_target_store || 20;
        const A = currentQ * Math.pow(basePrice, elasticity);
        const demand = Math.round(A * Math.pow(pricePoint, -elasticity));
        const revenue = pricePoint * demand;
        data.push({
            price: pricePoint,
            revenue: revenue,
            demand: demand,
            isCurrent: Math.abs(pricePoint - basePrice) < 0.5,
            isOptimal: false
        });
    }
    
    const maxRev = Math.max(...data.map(d => d.revenue));
    data.forEach(d => { if (d.revenue === maxRev) d.isOptimal = true; });

    const current = data.find(d => d.isCurrent);
    const optimal = data.find(d => d.isOptimal);
    
    return { pricingData: data, pricingSummary: { current, optimal }};
  }, [opportunity]);

  if (!pricingSummary) return null;

  return (
    <div className="space-y-8">
       <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
           <div className={`${theme.components.card} p-6 lg:col-span-1 flex flex-col justify-between`}>
               <div>
                   <div className="flex items-center gap-3 mb-6">
                       <div className={`${theme.components.imageContainer} w-16 h-16`}>
                           {opportunity.product && <img src={opportunity.product.image} className="w-full h-full object-contain" alt={opportunity.product.name} />}
                       </div>
                       <div>
                           <h3 className={`font-bold ${theme.colors.text.primary}`}>{opportunity.product?.name}</h3>
                           <p className="text-xs text-slate-500">{opportunity.product?.sku_id}</p>
                       </div>
                   </div>
                   <div className="space-y-6">
                       <div className="p-4 bg-slate-800 rounded-xl border border-slate-700">
                           <p className="text-xs text-slate-400 uppercase font-bold mb-1">Current Price</p>
                           <p className="text-2xl font-bold text-slate-200 font-mono">${pricingSummary.current?.price.toFixed(2)}</p>
                           <p className="text-xs text-slate-500 mt-1">Rev: ${pricingSummary.current?.revenue.toFixed(0)}/mo</p>
                       </div>
                       <div className="flex justify-center -my-3 relative z-10">
                           <div className="bg-slate-900 rounded-full p-2 border border-slate-700">
                               <ArrowRight className="w-4 h-4 text-slate-500 transform rotate-90" />
                           </div>
                       </div>
                       <div className={`p-4 rounded-xl border-2 ${theme.semantic.primary.bgLight} ${theme.semantic.primary.border}`}>
                           <p className={`text-xs ${theme.semantic.primary.text} uppercase font-bold mb-1`}>Optimal Price</p>
                           <p className={`text-3xl font-bold ${theme.semantic.primary.base} font-mono`}>${pricingSummary.optimal?.price.toFixed(2)}</p>
                           <div className="flex justify-between items-center mt-2">
                               <p className={`text-xs ${theme.semantic.primary.text}`}>Rev: ${pricingSummary.optimal?.revenue.toFixed(0)}/mo</p>
                               <span className={`text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-900 text-emerald-300`}>
                                   +${((pricingSummary.optimal?.revenue || 0) - (pricingSummary.current?.revenue || 0)).toFixed(0)} Lift
                               </span>
                           </div>
                       </div>
                   </div>
               </div>

               <div className={`${theme.components.card} p-6 lg:col-span-2`}>
                   <h3 className={`font-bold ${theme.colors.text.primary} mb-6 flex items-center`}>
                       <TrendingUp className="w-5 h-5 mr-2 text-[var(--color-brand-secondary-100)]" />
                       Price Elasticity & Revenue Hill
                   </h3>
                   <div className="h-[320px]">
                       <ResponsiveContainer width="100%" height="100%">
                           <ComposedChart data={pricingData}>
                               <CartesianGrid stroke={theme.charts.grid} vertical={false} opacity={0.3} />
                               <XAxis dataKey="price" type="number" domain={['dataMin', 'dataMax']} tick={{fill: theme.charts.neutral, fontSize: 10}} tickFormatter={(val) => `$${val}`} />
                               <YAxis yAxisId="left" orientation="left" stroke={theme.charts.neutral} tick={{fontSize: 10}} label={{ value: 'Revenue ($)', angle: -90, position: 'insideLeft', fill: theme.charts.neutral, fontSize: 10 }} />
                               <YAxis yAxisId="right" orientation="right" stroke={theme.charts.secondary} tick={{fontSize: 10}} label={{ value: 'Demand (Qty)', angle: 90, position: 'insideRight', fill: theme.charts.secondary, fontSize: 10 }} />
                               <Tooltip {...theme.components.chartTooltip} />
                               <Area yAxisId="left" type="monotone" dataKey="revenue" fill={theme.charts.success} stroke={theme.charts.success} fillOpacity={0.2} strokeWidth={2} />
                               <Line yAxisId="right" type="monotone" dataKey="demand" stroke={theme.charts.secondary} strokeWidth={2} dot={false} strokeDasharray="5 5" />
                               {pricingSummary.current && (
                                   <ReferenceLine x={pricingSummary.current.price} stroke={theme.charts.neutral} strokeDasharray="3 3">
                                       <Label value="Current" position="insideTopLeft" fill={theme.charts.neutral} fontSize={10} />
                                   </ReferenceLine>
                               )}
                               {pricingSummary.optimal && (
                                   <ReferenceLine x={pricingSummary.optimal.price} stroke={theme.charts.primary} strokeDasharray="3 3">
                                       <Label value="Optimal" position="insideTopRight" fill={theme.charts.primary} fontSize={10} fontWeight="bold" />
                                   </ReferenceLine>
                               )}
                           </ComposedChart>
                       </ResponsiveContainer>
                   </div>
                   <p className="text-xs text-slate-500 mt-4 italic text-center">
                       Model indicates {opportunity.match_reasons.some(r => r.toLowerCase().includes('elastic')) ? 'High Elasticity' : 'Low Elasticity'}. Revenue is maximized at ${pricingSummary.optimal?.price.toFixed(2)}.
                   </p>
               </div>
           </div>
        </div>
    </div>
  );
};
