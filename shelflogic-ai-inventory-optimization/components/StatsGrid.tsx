
import React from 'react';
import { Opportunity } from '../types';
import { useStore } from '../store/useStore';
import { Activity } from './Icons';
import { theme } from '../theme';

interface StatsGridProps {
    opportunities: Opportunity[];
}

export const StatsGrid: React.FC<StatsGridProps> = ({ opportunities }) => {
    const currentVertical = useStore((state) => state.currentVertical);
    
    const stats = currentVertical.dynamicData?.stats && currentVertical.dynamicData.stats.length > 0
        ? currentVertical.dynamicData.stats
        : [
            { label: 'Network Revenue', value: '$8.42M', trend: 'up', trendValue: '+12%' },
            { label: 'Inventory Health', value: '91.4%', trend: 'up', trendValue: '+2.1%' },
            { label: 'Urgent Actions', value: opportunities.length.toString(), trend: 'neutral', trendValue: 'NEW' },
            { label: 'Dead Stock Risk', value: '$24.2k', trend: 'down', trendValue: '-8%' },
        ];

    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-12">
            {stats.map((stat: any, i: number) => (
                <div key={i} className={`${theme.components.card} p-4 md:p-6 relative overflow-hidden group hover:border-[var(--color-brand-primary-500)] transition-all glass-panel`}>
                    <div className={`absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform duration-500`}>
                        <Activity className="w-16 h-16" />
                    </div>
                    <p className={`text-[10px] font-bold ${theme.colors.text.tertiary} uppercase tracking-widest mb-2`}>{stat.label}</p>
                    <div className="flex flex-col md:flex-row items-baseline justify-between gap-1">
                        <p className={`text-2xl md:text-3xl font-bold ${theme.colors.text.primary} tracking-tight`}>{stat.value}</p>
                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded 
                  ${stat.trend === 'up' ? 'bg-emerald-950 text-emerald-400 border-emerald-900' :
                            stat.trend === 'down' ? 'bg-rose-950 text-rose-400 border-rose-900' :
                                'bg-slate-800 text-slate-300 border-slate-700'} border`}>
                  {stat.trendValue}
                </span>
                    </div>
                </div>
            ))}
        </div>
    );
};
