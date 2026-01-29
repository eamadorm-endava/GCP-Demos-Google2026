
import React, { useState } from 'react';
import { Opportunity } from '../types';
import { ALL_STORES } from '../constants';
import { Sparkles, StoreIcon, ChevronRight, ChevronDown, ChevronUp, BrainCircuit } from './Icons';
import { theme } from '../theme';

interface OpportunityCardProps {
    opportunity: Opportunity;
    onOpen: () => void;
}

const getUrgencyTag = (opp: Opportunity) => {
    if (opp.projected_lift > 3000 || opp.type === 'WEATHER_TRIGGER' || opp.type === 'SHELF_COMPLIANCE') {
        return { label: 'CRITICAL', color: theme.semantic.danger };
    }
    if (opp.projected_lift > 1500) {
        return { label: 'HIGH ROI', color: theme.semantic.warning };
    }
    return { label: 'OPPORTUNITY', color: theme.semantic.info };
};

export const OpportunityCard: React.FC<OpportunityCardProps> = ({ opportunity, onOpen }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const store = ALL_STORES.find(s => s.store_id === opportunity.target_store_id);
    const urgency = getUrgencyTag(opportunity);

    const toggleRationale = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsExpanded(prev => !prev);
    };

    const getTitle = (opp: Opportunity) => {
        switch (opp.type) {
            case 'WEATHER_TRIGGER': return 'Demand Surge Detected';
            case 'LOCAL_EVENT': return `Event Proximity Alert`;
            case 'COMPETITOR_GAP': return 'Competitor Price Cut';
            default: return opp.type.replace(/_/g, ' ');
        }
    };

    return (
        <div
            onClick={onOpen}
            className={`${theme.components.card} ${theme.components.cardHover} flex flex-col cursor-pointer border-l-4 transition-all duration-300 ${opportunity.projected_lift > 3000 ? 'border-l-rose-500' : 'border-l-slate-800'} glass-panel`}
        >
            <div className="p-5 grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_auto_auto] lg:items-center gap-4 lg:gap-6 group">
                {/* Left: Icon, Title */}
                <div className="flex items-center gap-5">
                    <div className={`p-3 rounded-2xl bg-slate-800 border border-slate-700 group-hover:scale-110 transition-transform`}>
                        <Sparkles className="w-6 h-6 text-cyan-400" />
                    </div>
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${urgency.color.bgLight} ${urgency.color.text} border ${urgency.color.border}`}>
                                {urgency.label}
                            </span>
                            <span className="text-[10px] text-slate-500 font-mono tracking-widest">{opportunity.id}</span>
                        </div>
                        <h3 className="text-base font-bold text-white group-hover:text-cyan-400 transition-colors">
                            {getTitle(opportunity)}
                        </h3>
                        {store && (
                            <p className="text-xs text-slate-400 flex items-center">
                                <StoreIcon className="w-3 h-3 mr-1" />
                                {store.name} • {store.cluster}
                            </p>
                        )}
                    </div>
                </div>

                {/* Middle: AI Confidence */}
                <div className="flex flex-col items-start lg:items-center justify-center w-full lg:w-auto lg:px-6 lg:border-l lg:border-r border-slate-800">
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">AI Confidence</p>
                    <div className="flex items-center gap-2 w-full lg:w-auto">
                        <div className="flex-1 lg:w-24 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                            <div className="h-full bg-cyan-500" style={{ width: `${opportunity.match_score * 100}%` }}></div>
                        </div>
                        <span className="text-xs font-bold text-slate-300">{(opportunity.match_score * 100).toFixed(0)}%</span>
                    </div>
                    <button
                        onClick={toggleRationale}
                        className="mt-2 text-slate-500 hover:text-cyan-400 transition-colors"
                        aria-label={isExpanded ? 'Hide AI rationale' : 'Show AI rationale'}
                    >
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                </div>

                {/* Right: Impact, Buttons */}
                <div className="flex items-center justify-between lg:justify-end gap-4 w-full lg:w-auto">
                    <div className="text-left lg:text-right">
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-0.5">Estimated Impact</p>
                        <p className={`text-2xl font-bold ${opportunity.projected_lift > 3000 ? 'text-emerald-400' : 'text-white'} tracking-tight`}>
                            +${opportunity.projected_lift.toLocaleString()}
                        </p>
                    </div>
                    
                    <div className="p-2 rounded-full bg-slate-800 border border-slate-700 group-hover:bg-cyan-600 transition-colors">
                        <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-white" />
                    </div>
                </div>
            </div>

            {isExpanded && (
                <div className="bg-slate-900/50 border-t border-slate-800 p-5 animate-in slide-in-from-top-2">
                    <div className="flex items-start gap-3">
                        <BrainCircuit className="w-5 h-5 text-indigo-400 mt-0.5" />
                        <div className="flex-1">
                            <h4 className="text-xs font-bold text-indigo-400 uppercase tracking-widest mb-2">AI Logic & Match Reasoning</h4>
                            <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                {opportunity.match_reasons.map((reason, idx) => (
                                    <li key={idx} className="flex items-start gap-2 text-sm text-slate-300">
                                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1.5 flex-shrink-0"></span>
                                        {reason}
                                    </li>
                                ))}
                            </ul>
                            <p className="mt-3 text-[10px] text-slate-500 font-mono">
                                Model: Gemini Pro • Vector Similarity: {opportunity.match_score.toFixed(3)}
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
