
import React, { useState, useEffect } from 'react';
import { Opportunity, Store } from '../types';
import { useStore } from '../store/useStore';
import { ALL_STORES } from '../constants';
import { generateOpportunityInsight } from '../services/geminiService';
import { AiCopilot } from './AiCopilot';
import { AssortmentSwapDetails } from './AssortmentSwapDetails';
import { InventoryForecastDetails } from './InventoryForecastDetails';
import { PriceOptimizationDetails } from './PriceOptimizationDetails';
import { WeatherTriggerDetails } from './WeatherTriggerDetails';
import { ShelfComplianceDetails } from './ShelfComplianceDetails';
import { GenericOpportunityDetails } from './GenericOpportunityDetails';
import { CheckCircle } from './Icons';
import { theme } from '../theme';

interface AnalysisViewProps {
  opportunity: Opportunity;
}

export const AnalysisView: React.FC<AnalysisViewProps> = ({ opportunity }) => {
  const { goBack } = useStore();
  const [insight, setInsight] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [executing, setExecuting] = useState(false);
  const [executed, setExecuted] = useState(false);

  const targetStore = ALL_STORES.find(s => s.store_id === opportunity.target_store_id) as Store;
  const lookalikeStore = ALL_STORES.find(s => s.store_id === opportunity.lookalike_store_id) as Store;

  useEffect(() => {
    let isMounted = true;
    const fetchInsight = async () => {
      setLoading(true);
      const text = await generateOpportunityInsight(opportunity, targetStore, lookalikeStore);
      if (isMounted) {
        setInsight(text);
        setLoading(false);
      }
    };
    fetchInsight();
    return () => { isMounted = false; };
  }, [opportunity, targetStore, lookalikeStore]);

  const handleExecute = () => {
    setExecuting(true);
    setTimeout(() => {
        setExecuting(false);
        setExecuted(true);
    }, 1500);
  };
  
  const getActionText = () => {
      switch(opportunity.type) {
          case 'INVENTORY_REBALANCE': return 'Initiate Transfer';
          case 'ASSORTMENT_SWAP': return 'Execute Planogram Update';
          case 'WEATHER_TRIGGER': return 'Authorize Stock Surge';
          case 'SHELF_COMPLIANCE': return 'Alert Store Manager';
          default: return 'Apply New Price';
      }
  };

  const renderDetails = () => {
    switch (opportunity.type) {
      case 'ASSORTMENT_SWAP':
        return <AssortmentSwapDetails opportunity={opportunity} targetStore={targetStore} lookalikeStore={lookalikeStore} />;
      case 'INVENTORY_REBALANCE':
        return <InventoryForecastDetails opportunity={opportunity} targetStore={targetStore} lookalikeStore={lookalikeStore} />;
      case 'PRICE_OPTIMIZATION':
        return <PriceOptimizationDetails opportunity={opportunity} />;
      case 'WEATHER_TRIGGER':
        return <WeatherTriggerDetails opportunity={opportunity} />;
      case 'SHELF_COMPLIANCE':
        return <ShelfComplianceDetails opportunity={opportunity} />;
      default:
        return <GenericOpportunityDetails opportunity={opportunity} />;
    }
  };

  return (
    <div className={`flex flex-col h-full ${theme.colors.background.main} overflow-y-auto`}>
      <header className={`${theme.components.header} px-6 py-4 flex justify-between items-center sticky top-0 z-30`}>
        <div>
          <button onClick={goBack} className={`text-sm ${theme.colors.text.secondary} mb-1 flex items-center hover:text-white transition-colors`}>
             <span className="mr-1">←</span> Dashboard
          </button>
          <h1 className={`text-xl font-bold ${theme.colors.text.primary} flex items-center`}>
            {opportunity.type.replace(/_/g, ' ')}
            <span className={`ml-3 px-2 py-0.5 ${theme.semantic.primary.bgLight} ${theme.semantic.primary.text} text-xs rounded-full border ${theme.semantic.primary.border}`}>#{opportunity.id}</span>
          </h1>
        </div>
        <div className="flex space-x-3">
            {!executed ? (
                <button onClick={handleExecute} disabled={executing} className={`px-6 py-2.5 bg-gradient-to-r ${theme.semantic.primary.gradient} text-white rounded-lg shadow-md font-medium hover:shadow-cyan-900/30 transition-all`}>
                    {executing ? 'Processing...' : getActionText()}
                </button>
            ) : (
                <div className={`px-6 py-2.5 ${theme.semantic.success.bgLight} ${theme.semantic.success.text} rounded-lg border ${theme.semantic.success.border} flex items-center`}>
                    <CheckCircle className="w-4 h-4 mr-2" /> Action Applied
                </div>
            )}
        </div>
      </header>

      <div className="p-8 max-w-7xl mx-auto w-full space-y-8 animate-fade-in">
        <AiCopilot 
            opportunity={opportunity} 
            targetStore={targetStore}
            lookalikeStore={lookalikeStore}
            initialInsight={insight} 
            isLoading={loading}
        />
        {renderDetails()}
      </div>
    </div>
  );
};
