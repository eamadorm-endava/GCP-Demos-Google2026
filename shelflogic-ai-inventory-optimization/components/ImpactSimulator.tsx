
import React, { useState } from 'react';
import { Sliders } from './Icons';
import { theme } from '../theme';

export const ImpactSimulator = () => {
    const [adoptionRate, setAdoptionRate] = useState(50);
    
    // Derived metrics
    const baseRevenue = 8.42; // Millions
    const maxLift = 1.2; // 1.2 Million max lift
    const projectedLift = (maxLift * (adoptionRate / 100)).toFixed(2);
    const totalProj = (baseRevenue + parseFloat(projectedLift)).toFixed(2);

    return (
        <div className={`${theme.components.card} p-5 bg-gradient-to-br from-slate-900 to-slate-900 border-l-4 border-l-[var(--color-brand-primary-500)] relative overflow-hidden group`}>
             <div className="absolute top-0 right-0 p-4 opacity-5">
                 <Sliders className="w-24 h-24" />
             </div>
             <div className="relative z-10">
                 <h3 className="text-xs font-bold text-[var(--color-brand-primary-500)] uppercase tracking-widest mb-4 flex items-center">
                     <Sliders className="w-4 h-4 mr-2" />
                     Revenue Impact Simulator
                 </h3>
                 
                 <div className="flex items-end justify-between mb-2">
                     <div>
                         <p className="text-[10px] text-slate-500 font-bold uppercase">Adoption Rate</p>
                         <p className="text-2xl font-bold text-white">{adoptionRate}%</p>
                     </div>
                     <div className="text-right">
                         <p className="text-[10px] text-slate-500 font-bold uppercase">Projected Network Revenue</p>
                         <p className="text-2xl font-bold text-emerald-400">${totalProj}M</p>
                         <p className="text-xs text-emerald-600 font-bold">+{projectedLift}M Lift</p>
                     </div>
                 </div>

                 <input 
                    type="range" 
                    min="0" 
                    max="100" 
                    value={adoptionRate} 
                    onChange={(e) => setAdoptionRate(parseInt(e.target.value))}
                    className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-[var(--color-brand-primary-500)]"
                 />
                 <div className="flex justify-between mt-2 text-[10px] text-slate-500 font-mono">
                     <span>0% (Current)</span>
                     <span>50% (Recommended)</span>
                     <span>100% (Max)</span>
                 </div>
             </div>
        </div>
    );
};
