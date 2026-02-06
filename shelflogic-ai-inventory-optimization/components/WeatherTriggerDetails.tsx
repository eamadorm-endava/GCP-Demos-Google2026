
import React from 'react';
import { Opportunity } from '../types';
import { ComposedChart, Bar, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Sun, TrendingUp } from './Icons';
import { theme } from '../theme';

interface WeatherTriggerDetailsProps {
  opportunity: Opportunity;
}

const weatherData = [
    { day: 'Mon', temp: 82, sales: 45, projected: 45 },
    { day: 'Tue', temp: 84, sales: 48, projected: 48 },
    { day: 'Wed', temp: 88, sales: 52, projected: 65 },
    { day: 'Thu', temp: 95, sales: 55, projected: 92 },
    { day: 'Fri', temp: 98, sales: 65, projected: 110 },
    { day: 'Sat', temp: 96, sales: 85, projected: 135 },
    { day: 'Sun', temp: 91, sales: 70, projected: 95 },
];

export const WeatherTriggerDetails: React.FC<WeatherTriggerDetailsProps> = ({ opportunity }) => {
    return (
        <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className={`${theme.components.card} p-6 relative overflow-hidden`}>
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                        <Sun className="w-32 h-32 text-amber-500" />
                    </div>
                    <div className="relative z-10">
                        <h3 className={`font-bold ${theme.colors.text.primary} mb-2 flex items-center`}>
                            <Sun className="w-5 h-5 mr-2 text-amber-500" />
                            Weather Event Forecast
                        </h3>
                        <div className="flex items-end gap-4 mt-4">
                            <span className="text-6xl font-bold text-white tracking-tighter">95°</span>
                            <div className="mb-2">
                                <span className="block text-amber-400 font-bold uppercase tracking-wide">Heatwave Alert</span>
                                <span className="text-slate-400 text-sm">Dubuque, IA</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className={`${theme.components.card} p-6 flex flex-col justify-center`}>
                    <div className="flex items-start gap-4 mb-6">
                        <div className={`${theme.components.imageContainer} w-20 h-20`}>
                            {opportunity.product && <img src={opportunity.product.image} className="w-full h-full object-contain" alt={opportunity.product.name} />}
                        </div>
                        <div>
                            <p className={`text-xs font-bold ${theme.semantic.primary.text} uppercase tracking-wide mb-1`}>Primary Beneficiary</p>
                            <h3 className={`font-bold ${theme.colors.text.primary} text-lg`}>{opportunity.product?.name}</h3>
                        </div>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-slate-800 rounded-lg border border-slate-700">
                        <span className="text-slate-400 text-sm">Projected Lift</span>
                        <span className="text-emerald-400 font-bold text-lg">+${opportunity.projected_lift.toLocaleString()}</span>
                    </div>
                </div>
            </div>

            <div className={`${theme.components.card} p-6`}>
                <h3 className={`font-bold ${theme.colors.text.primary} mb-6 flex items-center`}>
                    <TrendingUp className="w-5 h-5 mr-2 text-[var(--color-brand-secondary-200)]" />
                    Demand Surge Projection
                </h3>
                <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <ComposedChart data={weatherData}>
                            <CartesianGrid stroke={theme.charts.grid} vertical={false} opacity={0.3} />
                            <XAxis dataKey="day" tick={{fill: theme.charts.neutral, fontSize: 10}} />
                            <YAxis yAxisId="left" stroke={theme.charts.neutral} tick={{fontSize: 10}} label={{ value: 'Units', angle: -90, position: 'insideLeft', fill: theme.charts.neutral }} />
                            <YAxis yAxisId="right" orientation="right" stroke={theme.charts.warning} tick={{fontSize: 10}} unit="°F" />
                            <Tooltip {...theme.components.chartTooltip} />
                            <Legend />
                            <Bar yAxisId="left" dataKey="sales" name="Baseline Sales" fill={theme.charts.neutral} barSize={20} opacity={0.5} />
                            <Line yAxisId="left" dataKey="projected" name="Heatwave Sales" stroke={theme.charts.success} strokeWidth={3} dot={{r:4}} />
                            <Line yAxisId="right" dataKey="temp" name="Temperature" stroke={theme.charts.warning} strokeWidth={2} strokeDasharray="5 5" dot={false} />
                        </ComposedChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};
