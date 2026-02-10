
import React, { useMemo } from 'react';
import { Opportunity, Store } from '../types';
import { ComposedChart, Bar, Line, Area, CartesianGrid, XAxis, YAxis, Tooltip, ReferenceLine, Label, ResponsiveContainer } from 'recharts';
import { StoreMap } from './StoreMap';
import { TrendingUp, Truck } from './Icons';
import { theme } from '../theme';

interface InventoryForecastDetailsProps {
  opportunity: Opportunity;
  targetStore: Store;
  lookalikeStore: Store;
}

export const InventoryForecastDetails: React.FC<InventoryForecastDetailsProps> = ({ opportunity, targetStore, lookalikeStore }) => {
  const forecastData = useMemo(() => {
    const data = [];
    const historyDays = 7;
    const forecastDays = 14;
    const totalDays = historyDays + forecastDays;
    let currentInventory = 65;
    const safetyStock = 20;

    for (let i = 1; i <= totalDays; i++) {
        const day = i - historyDays;
        let historySales = null;
        let forecastSales = null;

        if (day <= 0) {
            historySales = Math.floor(Math.random() * 5) + 5;
        } else {
            forecastSales = Math.floor(8 + (day * 0.8) + (Math.random() * 4));
        }
        
        const sales = historySales ?? forecastSales ?? 0;
        const startInventory = currentInventory;
        currentInventory = Math.max(0, currentInventory - sales);

        data.push({
            name: day === 0 ? 'Today' : day < 0 ? `D${day}` : `D+${day}`,
            day,
            history: historySales,
            forecast: forecastSales,
            inventory: startInventory,
            safetyStock,
        });
    }
    return data;
  }, []);

  const stockoutInfo = useMemo(() => {
    const firstUnsafeDay = forecastData.find(d => d.day > 0 && d.inventory <= d.safetyStock);
    return {
        breachInDays: firstUnsafeDay ? firstUnsafeDay.day : null,
    };
  }, [forecastData]);

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className={`${theme.components.card} p-5`}>
              <p className={`text-xs font-bold ${theme.colors.text.tertiary} uppercase`}>Current Stock</p>
              <p className={`text-2xl font-bold ${theme.colors.text.primary} mt-1`}>{forecastData[7]?.inventory} Units</p>
          </div>
          <div className={`${theme.components.card} p-5`}>
              <p className={`text-xs font-bold ${theme.colors.text.tertiary} uppercase`}>Safety Stock</p>
              <p className={`text-2xl font-bold ${theme.colors.text.primary} mt-1`}>{forecastData[0]?.safetyStock} Units</p>
          </div>
          <div className={`${theme.components.card} p-5 border-l-4 ${theme.semantic.danger.border}`}>
              <p className={`text-xs font-bold ${theme.semantic.danger.text} uppercase`}>Predicted Stockout</p>
              <p className={`text-2xl font-bold ${theme.semantic.danger.base} mt-1`}>
                  In {stockoutInfo?.breachInDays ?? 'N/A'} Days
              </p>
          </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
            <div className={`${theme.components.card} p-6`}>
                <div className="flex flex-col md:flex-row justify-between md:items-center mb-6">
                    <h3 className={`font-bold ${theme.colors.text.primary} flex items-center`}>
                        <TrendingUp className="w-5 h-5 mr-2 text-[var(--color-brand-secondary-100)]" />
                        Demand Forecast & Inventory Burndown
                    </h3>
                    <div className="flex items-center space-x-4 text-xs font-medium mt-3 md:mt-0">
                        <div className="flex items-center"><span className="w-2.5 h-2.5 bg-slate-500 rounded-sm mr-2"></span><span className={`${theme.colors.text.secondary}`}>History</span></div>
                        <div className="flex items-center"><span className="w-2.5 h-2.5 bg-[var(--color-brand-secondary-200)]rounded-sm mr-2"></span><span className={`${theme.colors.text.secondary}`}>Forecast</span></div>
                        <div className="flex items-center"><span className="w-2.5 h-2.5 bg-rose-500/50 rounded-sm mr-2"></span><span className={`${theme.colors.text.secondary}`}>Inventory</span></div>
                    </div>
                </div>
                <div className="h-[350px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <ComposedChart data={forecastData}>
                            <CartesianGrid stroke={theme.charts.grid} vertical={false} opacity={0.3} />
                            <XAxis dataKey="name" tick={{fill: theme.charts.neutral, fontSize: 10}} />
                            <YAxis yAxisId="left" orientation="left" stroke={theme.charts.neutral} tick={{fontSize: 10}} label={{ value: 'Units Sold', angle: -90, position: 'insideLeft', fill: theme.charts.neutral, fontSize: 10 }} />
                            <YAxis yAxisId="right" orientation="right" stroke={theme.charts.danger} tick={{fontSize: 10}} label={{ value: 'On Hand', angle: 90, position: 'insideRight', fill: theme.charts.danger, fontSize: 10 }} />
                            <Tooltip {...theme.components.chartTooltip} />
                            <Bar yAxisId="left" dataKey="history" fill={theme.charts.neutral} barSize={20} />
                            <Line yAxisId="left" type="monotone" dataKey="forecast" stroke={theme.charts.secondary} strokeWidth={2} dot={{r: 4, strokeWidth: 2}} activeDot={{r: 6}}/>
                            <Area yAxisId="right" type="monotone" dataKey="inventory" fill={theme.charts.danger} stroke={theme.charts.danger} opacity={0.2} strokeWidth={2} />
                            <ReferenceLine yAxisId="right" y={20} label={{value: "Safety Stock", position: 'insideTopRight', fill: theme.charts.danger, fontSize: 10}} stroke={theme.charts.danger} strokeDasharray="3 3" />
                            <ReferenceLine x="Today" stroke={theme.charts.primary} strokeDasharray="2 2">
                                <Label value="Today" position="insideTop" fill={theme.charts.primary} fontSize={10} />
                            </ReferenceLine>
                        </ComposedChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>

        <div className="lg:col-span-1 space-y-6">
            <div className={`${theme.components.card} p-6`}>
                <h3 className={`font-bold ${theme.colors.text.primary} mb-4 flex items-center`}>
                    <Truck className="w-5 h-5 mr-2 text-emerald-400" />
                    Logistics Route
                </h3>
                <p className={`text-xs ${theme.colors.text.secondary} mb-4`}>
                    Recommended transfer from nearest surplus location.
                </p>
                <StoreMap targetStore={targetStore} lookalikeStore={lookalikeStore} />
                <div className="mt-4 p-3 bg-slate-800 rounded-lg border border-slate-700">
                     <div className="flex justify-between items-center text-xs mb-2">
                        <span className="text-slate-400">Distance</span>
                        <span className="text-white font-bold">14.2 miles</span>
                     </div>
                     <div className="flex justify-between items-center text-xs">
                        <span className="text-slate-400">Est. Transit</span>
                        <span className="text-white font-bold">45 mins</span>
                     </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};
