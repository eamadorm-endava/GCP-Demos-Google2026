
import React from 'react';
import { Opportunity, Store } from '../types';
import { ALL_OPPORTUNITIES } from '../constants';
import { useStore } from '../store/useStore';
import { User, Clipboard, Tag, Truck, RefreshCw, CheckCircle } from './Icons';
import { theme } from '../theme';

interface StoreDashboardProps {
  store: Store;
  className?: string;
}

export const StoreDashboard: React.FC<StoreDashboardProps> = ({ store, className = '' }) => {
    const { viewOpportunity } = useStore();
    // Filter opportunities strictly for this store
    const myTasks = ALL_OPPORTUNITIES.filter(o => o.target_store_id === store.store_id);

    return (
        <div className={`max-w-7xl mx-auto px-4 md:px-8 py-8 animate-fade-in ${className}`}>
             <header className="mb-8">
               <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                  <div>
                    <h1 className={`text-2xl md:text-3xl font-bold ${theme.colors.text.primary} tracking-tight`}>Store Portal: {store.name.split(' (')[0]}</h1>
                    <p className={`text-lg ${theme.colors.text.secondary} mt-1 font-medium`}>Daily Execution Briefing</p>
                  </div>
                  <div className={`flex items-center space-x-2 text-sm ${theme.colors.text.secondary} ${theme.colors.background.card} px-4 py-2 rounded-lg border ${theme.colors.border.base} shadow-sm self-start md:self-auto`}>
                      <User className="w-4 h-4 text-slate-400 mr-2" />
                      <span>Manager: <strong>Alex Chen</strong></span>
                  </div>
               </div>
            </header>

            {/* Quick Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-10">
                <div className={theme.components.card + " p-5"}>
                    <p className={`text-xs font-bold ${theme.colors.text.tertiary} uppercase`}>Today's Sales (Proj)</p>
                    <p className={`text-2xl font-bold ${theme.colors.text.primary} mt-1`}>$42,500</p>
                </div>
                 <div className={theme.components.card + " p-5"}>
                    <p className={`text-xs font-bold ${theme.colors.text.tertiary} uppercase`}>Pending Tasks</p>
                    <p className={`text-2xl font-bold ${theme.semantic.primary.base} mt-1`}>{myTasks.length}</p>
                </div>
                 <div className={theme.components.card + " p-5"}>
                    <p className={`text-xs font-bold ${theme.colors.text.tertiary} uppercase`}>Incoming Truck</p>
                    <p className={`text-2xl font-bold ${theme.colors.text.primary} mt-1`}>Tomorrow, 6AM</p>
                </div>
                 <div className={theme.components.card + " p-5"}>
                    <p className={`text-xs font-bold ${theme.colors.text.tertiary} uppercase`}>Customer Sat.</p>
                    <p className={`text-2xl font-bold ${theme.semantic.success.base} mt-1`}>4.8/5.0</p>
                </div>
            </div>

            <h2 className={`text-xl font-bold ${theme.colors.text.primary} mb-6 flex items-center`}>
                <Clipboard className={`w-5 h-5 mr-3 ${theme.semantic.primary.base}`} />
                Action Required
            </h2>

            <div className="space-y-4">
                {myTasks.length > 0 ? (
                    myTasks.map(task => {
                        const isPrice = task.type === 'PRICE_OPTIMIZATION';
                        const isInventory = task.type === 'INVENTORY_REBALANCE';
                        
                        return (
                            <div 
                                key={task.id} 
                                onClick={() => viewOpportunity(task.id)}
                                className={`${theme.components.card} ${theme.components.cardHover} p-6 cursor-pointer transition-all flex flex-col md:flex-row items-center justify-between group`}
                            >
                                <div className="flex items-center gap-5 w-full md:w-auto">
                                    <div className={`p-3 rounded-full flex-shrink-0 ${isPrice ? theme.semantic.success.bgLight : isInventory ? theme.semantic.secondary.bgLight : theme.semantic.warning.bgLight}`}>
                                        {isPrice ? <Tag className={`w-6 h-6 ${theme.semantic.success.base}`} /> : isInventory ? <Truck className={`w-6 h-6 ${theme.semantic.secondary.base}`} /> : <RefreshCw className={`w-6 h-6 ${theme.semantic.warning.base}`} />}
                                    </div>
                                    <div>
                                        <h3 className={`text-lg font-bold ${theme.colors.text.primary} group-hover:text-[var(--color-brand-primary-500)] transition-colors`}>
                                            {isPrice ? 'Price Update Required' : isInventory ? 'Incoming Stock Transfer' : 'Assortment Reset'}
                                        </h3>
                                        <p className={`${theme.colors.text.secondary} text-sm`}>
                                            {task.product ? task.product.name : task.delist_candidate?.name} 
                                            <span className="mx-2">•</span> 
                                            <span className={`font-mono ${theme.colors.text.tertiary}`}>#{task.id}</span>
                                        </p>
                                    </div>
                                </div>
                                
                                <button className={`mt-4 md:mt-0 w-full md:w-auto px-4 py-2 ${theme.components.button.secondary} text-sm font-semibold rounded-lg group-hover:text-white transition-colors`}>
                                    View Details
                                </button>
                            </div>
                        )
                    })
                ) : (
                    <div className={`text-center py-12 ${theme.colors.background.card} rounded-xl border border-dashed ${theme.colors.border.base}`}>
                        <CheckCircle className={`w-12 h-12 ${theme.semantic.success.text} opacity-50 mx-auto mb-3`} />
                        <p className={`${theme.colors.text.secondary} font-medium`}>All tasks completed. Great job!</p>
                    </div>
                )}
            </div>
        </div>
    );
};
