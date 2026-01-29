
import React from 'react';
import { StoreIcon, Map, Sparkles, AlertTriangle, CheckCircle, ChevronRight } from './Icons';
import { ALL_STORES } from '../constants';
import { theme } from '../theme';

interface ShelfNode {
    id: string;
    storeId: string;
    name: string;
    status: 'COMPLIANT' | 'VIOLATION' | 'PENDING';
}

interface NodeSidebarItemProps {
    node: ShelfNode;
    isActive: boolean;
    onClick: (id: string) => void;
}

const NodeSidebarItem: React.FC<NodeSidebarItemProps> = ({ node, isActive, onClick }) => (
    <button
        onClick={() => onClick(node.id)}
        title={`Select camera feed for ${node.name}`}
        className={`w-full text-left p-3 rounded-xl border transition-all flex items-center justify-between group
            ${isActive
                ? 'bg-slate-800 border-indigo-500 shadow-lg ring-1 ring-indigo-500/30'
                : 'bg-transparent border-slate-800/50 hover:border-slate-700 hover:bg-slate-800/30'}
        `}
    >
        <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-lg ${node.status === 'VIOLATION' ? 'bg-rose-950/50 text-rose-500' : 'bg-emerald-950/50 text-emerald-500'}`}>
                {node.status === 'VIOLATION' ? <AlertTriangle className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
            </div>
            <div>
                <p className={`text-xs font-bold ${isActive ? 'text-white' : 'text-slate-400'}`}>{node.name}</p>
                <p className="text-[10px] text-slate-500 font-medium font-mono">{node.id}</p>
            </div>
        </div>
        <ChevronRight className={`w-4 h-4 ${isActive ? 'text-indigo-400' : 'text-slate-700 opacity-0 group-hover:opacity-100 transition-opacity'}`} />
    </button>
);


interface ShelfVisionSidebarProps {
    nodesByStore: Record<string, ShelfNode[]>;
    activeNodeId: string;
    onNodeSelect: (id: string) => void;
    totalNodes: number;
    networkHealth: number;
}

export const ShelfVisionSidebar: React.FC<ShelfVisionSidebarProps> = ({ nodesByStore, activeNodeId, onNodeSelect, totalNodes, networkHealth }) => {
    
    const getStoreName = (id: string) => {
        const s = ALL_STORES.find(st => st.store_id === id);
        return s ? s.name : `Store #${id}`;
    };

    return (
        <div className={`w-full md:w-80 ${theme.colors.background.sidebar} border-r ${theme.colors.border.base} flex flex-col flex-shrink-0 md:h-full`}>
            <div className="p-4 md:p-6 border-b border-slate-800">
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4 flex items-center">
                    <Map className="w-4 h-4 mr-2" />
                    Network Cameras
                </h3>
                
                <div className="space-y-4 md:space-y-6 overflow-y-auto max-h-48 md:max-h-[60vh] pr-2 custom-scrollbar">
                    {Object.entries(nodesByStore).map(([storeId, nodes]) => (
                        <div key={storeId} className="animate-in slide-in-from-left-2 duration-300">
                            <div className="px-1 mb-2 flex items-center justify-between group cursor-default">
                                <div className="flex items-center text-slate-400">
                                    <StoreIcon className="w-3 h-3 mr-2 text-indigo-500" />
                                    <span className="text-xs font-bold uppercase tracking-wider group-hover:text-slate-200 transition-colors">{getStoreName(storeId)}</span>
                                </div>
                                <span className="text-[9px] bg-slate-800 text-slate-500 px-1.5 py-0.5 rounded border border-slate-700">{nodes.length}</span>
                            </div>
                            <div className="space-y-2 pl-2 border-l border-slate-800 ml-1.5">
                                {nodes.map(node => (
                                    <NodeSidebarItem 
                                        key={node.id} 
                                        node={node} 
                                        isActive={activeNodeId === node.id} 
                                        onClick={onNodeSelect} 
                                    />
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            
            <div className="p-4 md:p-6 flex-1 bg-slate-900/20 hidden md:block">
                <div className="flex items-center space-x-2 mb-4">
                    <Sparkles className="w-4 h-4 text-indigo-400" />
                    <h4 className="text-[10px] font-bold text-white uppercase tracking-widest">Global Compliance</h4>
                </div>
                <div className="space-y-4">
                    <div className="flex justify-between items-center">
                        <span className="text-xs text-slate-500">Monitored Nodes</span>
                        <span className="text-xs font-bold text-white">{totalNodes} Active</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-xs text-slate-500">Avg Score</span>
                        <span className={`text-xs font-bold ${networkHealth > 80 ? 'text-emerald-400' : 'text-amber-400'}`}>{networkHealth}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                        <div className={`h-full ${networkHealth > 80 ? 'bg-emerald-500' : 'bg-amber-500'}`} style={{ width: `${networkHealth}%` }}></div>
                    </div>
                </div>
            </div>
        </div>
    );
};
