
import React from 'react';
import { Opportunity, Store } from '../types';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { ArrowRight, CheckCircle, X, Activity, Target } from './Icons';
import { StoreMap } from './StoreMap';
import { theme } from '../theme';

interface AssortmentSwapDetailsProps {
  opportunity: Opportunity;
  targetStore: Store;
  lookalikeStore: Store;
}

export const AssortmentSwapDetails: React.FC<AssortmentSwapDetailsProps> = ({ opportunity, targetStore, lookalikeStore }) => {

  const swapData = [
    {
      name: 'Monthly Velocity (Units)',
      [opportunity.delist_candidate?.name || 'Delist']: opportunity.delist_candidate?.velocity_target_store,
      [opportunity.add_candidate?.name || 'Add']: opportunity.add_candidate?.velocity_lookalike_store,
    },
    {
      name: 'Gross Margin ($)',
      [opportunity.delist_candidate?.name || 'Delist']: (opportunity.delist_candidate?.price || 0) * 0.2,
      [opportunity.add_candidate?.name || 'Add']: (opportunity.add_candidate?.price || 0) * 0.35,
    }
  ];

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-7 gap-6 items-center">
        {/* Delist Card */}
        <div className={`md:col-span-3 ${theme.components.card} p-6 border-l-4 ${theme.semantic.danger.border} relative overflow-hidden group`}>
          <div className="absolute top-2 right-2 p-1.5 bg-rose-950/50 rounded-lg">
            <X className="w-4 h-4 text-rose-500" />
          </div>
          <div className="flex gap-4">
            <div className={`${theme.components.imageContainer} w-20 h-20`}>
              {opportunity.delist_candidate && <img src={opportunity.delist_candidate.image} className="w-full h-full object-contain" alt={opportunity.delist_candidate.name} />}
            </div>
            <div>
              <p className={`text-xs font-bold ${theme.semantic.danger.text} uppercase tracking-wide mb-1`}>Delist Candidate</p>
              <h3 className={`font-bold ${theme.colors.text.primary} mb-1`}>{opportunity.delist_candidate?.name}</h3>
              <p className="text-sm text-slate-400 mb-2">{opportunity.delist_candidate?.category}</p>
              <div className="flex gap-2">
                <span className="text-xs bg-slate-800 px-2 py-1 rounded border border-slate-700 text-slate-400">Low Velocity</span>
              </div>
            </div>
          </div>
        </div>

        <div className="md:col-span-1 flex justify-center">
          <div className="p-3 bg-slate-800 rounded-full border border-slate-700 shadow-lg">
            <ArrowRight className="w-6 h-6 text-slate-400 transform rotate-90 md:rotate-0" />
          </div>
        </div>

        {/* Add Card */}
        <div className={`md:col-span-3 ${theme.components.card} p-6 border-l-4 ${theme.semantic.success.border} relative overflow-hidden`}>
          <div className="absolute top-2 right-2 p-1.5 bg-emerald-950/50 rounded-lg">
            <CheckCircle className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="flex gap-4">
            <div className={`${theme.components.imageContainer} w-20 h-20`}>
              {opportunity.add_candidate && <img src={opportunity.add_candidate.image} className="w-full h-full object-contain" alt={opportunity.add_candidate.name} />}
            </div>
            <div>
              <p className={`text-xs font-bold ${theme.semantic.success.text} uppercase tracking-wide mb-1`}>Add Candidate</p>
              <h3 className={`font-bold ${theme.colors.text.primary} mb-1`}>{opportunity.add_candidate?.name}</h3>
              <p className="text-sm text-slate-400 mb-2">{opportunity.add_candidate?.category}</p>
              <div className="flex gap-2">
                <span className="text-xs bg-emerald-900/30 px-2 py-1 rounded border border-emerald-900 text-emerald-400">High Velocity</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className={`${theme.components.card} p-6`}>
          <h3 className={`font-bold ${theme.colors.text.primary} mb-6 flex items-center`}>
            <Activity className="w-5 h-5 mr-2 text-indigo-400" />
            Performance Evidence
          </h3>
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={swapData} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <YAxis dataKey="name" type="category" width={120} tick={{ fill: theme.charts.neutral, fontSize: 11 }} />
                <XAxis type="number" hide />
                <Tooltip {...theme.components.chartTooltip} />
                <Legend />
                <Bar dataKey={opportunity.delist_candidate?.name || 'Delist'} fill={theme.charts.danger} radius={[0, 4, 4, 0]} barSize={20} />
                <Bar dataKey={opportunity.add_candidate?.name || 'Add'} fill={theme.charts.success} radius={[0, 4, 4, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className={`${theme.components.card} p-6`}>
          <h3 className={`font-bold ${theme.colors.text.primary} mb-4 flex items-center`}>
            <Target className="w-5 h-5 mr-2 text-cyan-400" />
            Digital Twin Justification
          </h3>
          <p className={`text-xs ${theme.colors.text.secondary} mb-4`}>
            {lookalikeStore.name} is a 94% statistical match to {targetStore.name}, proving demand viability.
          </p>
          <StoreMap targetStore={targetStore} lookalikeStore={lookalikeStore} />
        </div>
      </div>
    </div>
  );
};
