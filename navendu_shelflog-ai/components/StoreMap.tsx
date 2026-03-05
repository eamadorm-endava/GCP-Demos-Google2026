
import React from 'react';
import { Store } from '../types';
import { ALL_STORES } from '../constants';
import { StoreIcon } from './Icons';
import { theme } from '../theme';

interface StoreMapProps {
  targetStore: Store;
  lookalikeStore: Store;
}

export const StoreMap: React.FC<StoreMapProps> = ({ targetStore, lookalikeStore }) => {
  return (
    <div className={`relative w-full h-64 ${theme.colors.background.active} rounded-xl overflow-hidden border ${theme.colors.border.base} shadow-inner`}>
      {/* Background Map Effect (Abstract) */}
      <div className="absolute inset-0 opacity-10" 
           style={{ backgroundImage: `radial-gradient(circle, ${theme.charts.neutral} 1px, transparent 1px)`, backgroundSize: '20px 20px' }}>
      </div>

      <svg className="absolute inset-0 w-full h-full pointer-events-none">
        {/* Connection Line */}
        <line 
          x1={targetStore.coordinates.x} 
          y1={targetStore.coordinates.y} 
          x2={lookalikeStore.coordinates.x} 
          y2={lookalikeStore.coordinates.y} 
          stroke={theme.charts.secondary} 
          strokeWidth="3" 
          strokeDasharray="6 4"
          className="animate-pulse"
        />
        {/* Data flowing dots */}
        <circle r="4" fill={theme.charts.secondary}>
          <animateMotion 
            dur="2s" 
            repeatCount="indefinite"
            path={`M${targetStore.coordinates.x},${targetStore.coordinates.y} L${lookalikeStore.coordinates.x},${lookalikeStore.coordinates.y}`}
          />
        </circle>
      </svg>

      {/* Render Stores */}
      {ALL_STORES.map((store) => {
        const isTarget = store.store_id === targetStore.store_id;
        const isLookalike = store.store_id === lookalikeStore.store_id;
        const isRelated = isTarget || isLookalike;

        // Skip non-related stores to keep view clean, or render them faintly
        if (!isRelated) return null;

        return (
          <div 
            key={store.store_id}
            className={`absolute transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center group transition-all duration-500`}
            style={{ left: store.coordinates.x, top: store.coordinates.y }}
          >
            <div className={`p-2 rounded-full shadow-lg border-2 ${
              isTarget ? `${theme.colors.background.card} ${theme.semantic.primary.border} z-20` : 
              isLookalike ? `${theme.colors.background.card} ${theme.semantic.secondary.border} z-20` : `${theme.colors.background.active} ${theme.colors.border.base}`
            }`}>
               <StoreIcon className={`${isTarget ? theme.semantic.primary.base : theme.semantic.secondary.base} w-6 h-6`} />
            </div>
            
            <div className={`mt-2 px-3 py-1 rounded shadow-md text-xs font-semibold whitespace-nowrap ${theme.colors.background.card} border ${
              isTarget ? `${theme.semantic.primary.border} ${theme.semantic.primary.base}` : `${theme.semantic.secondary.border} ${theme.semantic.secondary.base}`
            }`}>
              {store.name}
              {isTarget && <span className={`block text-[10px] font-normal ${theme.colors.text.tertiary}`}>Target Location</span>}
              {isLookalike && <span className={`block text-[10px] font-normal ${theme.colors.text.tertiary}`}>Lookalike Match (94%)</span>}
            </div>
          </div>
        );
      })}

      {/* Legend / Overlay info */}
      <div className={`absolute top-4 right-4 ${theme.colors.background.card} bg-opacity-90 backdrop-blur-sm p-3 rounded-lg shadow border ${theme.colors.border.base} text-xs`}>
         <div className="flex items-center mb-1">
            <span className={`w-2 h-2 rounded-full ${theme.semantic.primary.bg} mr-2`}></span>
            <span className={theme.colors.text.secondary}>Target Store</span>
         </div>
         <div className="flex items-center">
            <span className={`w-2 h-2 rounded-full ${theme.semantic.secondary.bg} mr-2`}></span>
            <span className={theme.colors.text.secondary}>Digital Twin</span>
         </div>
      </div>
    </div>
  );
};
