
import React, { useState, useEffect, useMemo } from 'react';
import { Camera, CheckCircle, AlertTriangle, Shield, RefreshCw, LayoutGrid, Sparkles, Activity, ChevronRight, Map, ArrowRight, X, StoreIcon, Eye } from './Icons';
import { ALL_STORES } from '../constants';
import { theme } from '../theme';
import { generatePlanogramImage, generateLiveStoreFeed } from '../services/geminiService';

interface ShelfNode {
    id: string;
    storeId: string;
    name: string;
    category: string;
    status: 'COMPLIANT' | 'VIOLATION' | 'PENDING';
    complianceScore: number;
    violationDetail?: string;
    sku?: string;
    imageRef: string; // Path to static fallback reference image
    imageLive: string; // Path to static fallback live feed image
}

const NODES: ShelfNode[] = [
    // --- DUBUQUE (Store 104) ---
    {
        id: "CAM-104-A1",
        storeId: "104",
        name: "Aisle 4: Spirits",
        category: "Liqueurs & Schnapps",
        status: 'VIOLATION',
        complianceScore: 62,
        violationDetail: "SKU-400 (Apple Liqueur) Missing from Slot 4B.",
        sku: "AL-400",
        imageRef: 'assets/vision-ref-liqueur.svg',
        imageLive: 'assets/vision-live-liqueur-violation.svg',
    },
    {
        id: "CAM-104-B2",
        storeId: "104",
        name: "Aisle 12: Craft Beer",
        category: "IPA & Imports",
        status: 'COMPLIANT',
        complianceScore: 98,
        imageRef: 'assets/vision-ref-beer.svg',
        imageLive: 'assets/vision-live-beer-compliant.svg',
    },
    {
        id: "CAM-104-C3",
        storeId: "104",
        name: "Aisle 8: Mixers",
        category: "Syrups & Tonics",
        status: 'VIOLATION',
        complianceScore: 45,
        violationDetail: "Facing Mismatch: Tonic Water occupies Syrup slots.",
        sku: "MX-202",
        imageRef: 'assets/vision-ref-mixers.svg',
        imageLive: 'assets/vision-live-mixers-violation.svg',
    },
    
    // --- DAVENPORT (Store 202) ---
    {
        id: "CAM-202-Z1",
        storeId: "202",
        name: "Endcap: Seasonal",
        category: "Summer Coolers",
        status: 'COMPLIANT',
        complianceScore: 94,
        imageRef: 'assets/vision-ref-endcap.svg',
        imageLive: 'assets/vision-live-endcap-compliant.svg',
    },
    {
        id: "CAM-202-A4",
        storeId: "202",
        name: "Aisle 2: Wine",
        category: "Red Blends",
        status: 'VIOLATION',
        complianceScore: 78,
        violationDetail: "Planogram outdated. Old vintage displayed.",
        imageRef: 'assets/vision-ref-wine.svg',
        imageLive: 'assets/vision-live-wine-violation.svg',
    },

    // --- DES MOINES (Store 401) ---
    {
        id: "CAM-401-D9",
        storeId: "401",
        name: "Checkout Zone",
        category: "Impulse / Miniatures",
        status: 'COMPLIANT',
        complianceScore: 99,
        imageRef: 'assets/vision-ref-checkout.svg',
        imageLive: 'assets/vision-live-checkout-compliant.svg',
    }
];

// Tooltip Component
const SimpleTooltip = ({ children, content, className = '' }: { children: React.ReactNode, content: string, className?: string }) => (
    <div className={`relative group ${className}`}>
        {children}
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1.5 bg-slate-900 text-slate-200 text-[10px] font-medium rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap border border-slate-700 shadow-xl z-50 backdrop-blur-sm hidden md:block">
            {content}
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1 border-4 border-transparent border-t-slate-700"></div>
        </div>
    </div>
);

const ImageSkeleton = () => (
    <div className="absolute inset-0 bg-slate-800 animate-pulse rounded-lg flex items-center justify-center">
      <div className="flex flex-col items-center text-slate-700">
        <Camera className="w-12 h-12" />
        <span className="text-xs font-bold mt-2">GENERATING IMAGE...</span>
      </div>
    </div>
);

// Modular Sub-component for Sidebar Item
const NodeSidebarItem = ({ node, isActive, onClick }: { node: ShelfNode, isActive: boolean, onClick: (id: string) => void }) => (
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

export const ShelfVisionView: React.FC = () => {
    const [activeNodeId, setActiveNodeId] = useState<string>(NODES[0].id);
    const [planogramSrc, setPlanogramSrc] = useState<string>('');
    const [liveFeedSrc, setLiveFeedSrc] = useState<string>('');
    const [isPlanogramLoading, setIsPlanogramLoading] = useState(true);
    const [isLiveFeedLoading, setIsLiveFeedLoading] = useState(true);
    const [scanning, setScanning] = useState(false);
    const [showHeatmap, setShowHeatmap] = useState(false);
    
    const activeNode = useMemo(() => 
        NODES.find(n => n.id === activeNodeId) || NODES[0], 
    [activeNodeId]);

    const activeStore = useMemo(() => 
        ALL_STORES.find(s => s.store_id === activeNode.storeId),
    [activeNode]);

    useEffect(() => {
        const fetchImages = async () => {
            if (!activeNode) return;

            setIsPlanogramLoading(true);
            setIsLiveFeedLoading(true);

            try {
                // Construct prompts
                const planogramPrompt = `Focus on the ${activeNode.category} section. The planogram should show a specific slot highlighted for SKU ${activeNode.sku || 'N/A'}.`;
                
                let liveFeedPrompt = `Focus on the ${activeNode.category} section.`;
                if (activeNode.status === 'VIOLATION') {
                    liveFeedPrompt += ` There is a compliance issue: ${activeNode.violationDetail}`;
                } else {
                    liveFeedPrompt += ` The shelves are perfectly compliant with the planogram.`;
                }

                // Call services in parallel
                const [pSrc, lSrc] = await Promise.all([
                    generatePlanogramImage(planogramPrompt, activeNode.imageRef),
                    generateLiveStoreFeed(liveFeedPrompt, activeNode.imageLive),
                ]);

                setPlanogramSrc(pSrc);
                setLiveFeedSrc(lSrc);
            } catch (error) {
                console.error("Failed to generate vision images, using fallbacks:", error);
                setPlanogramSrc(activeNode.imageRef);
                setLiveFeedSrc(activeNode.imageLive);
            } finally {
                setIsPlanogramLoading(false);
                setIsLiveFeedLoading(false);
            }
        };

        fetchImages();
    }, [activeNode]);

    // Group nodes by Store ID
    const nodesByStore = useMemo(() => {
        const groups: Record<string, ShelfNode[]> = {};
        NODES.forEach(node => {
            if (!groups[node.storeId]) {
                groups[node.storeId] = [];
            }
            groups[node.storeId].push(node);
        });
        return groups;
    }, []);

    const timestamp = useMemo(() => new Date().toLocaleTimeString(), [activeNodeId, isLiveFeedLoading]);

    useEffect(() => {
        setShowHeatmap(false);
    }, [activeNodeId]);

    const handleScan = () => {
        setScanning(true);
        setShowHeatmap(false);
        setTimeout(() => {
            setScanning(false);
            alert(`Compliance Verified for ${activeNode.id}. Resetting Planogram status.`);
        }, 2500);
    };

    const getStoreName = (id: string) => {
        const s = ALL_STORES.find(st => st.store_id === id);
        return s ? s.name : `Store #${id}`;
    };

    // Calculate network health
    const totalNodes = NODES.length;
    const compliantNodes = NODES.filter(n => n.status === 'COMPLIANT').length;
    const networkHealth = Math.round((compliantNodes / totalNodes) * 100);

    return (
        <div className="flex flex-col md:flex-row h-auto md:h-screen md:overflow-hidden">
            {/* Sidebar: Store & Node Selector */}
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
                                            onClick={setActiveNodeId} 
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

            {/* Main Content Area */}
            <div className={`flex-1 overflow-y-auto ${theme.colors.background.main} p-4 md:p-8 h-full`}>
                <header className="flex flex-col md:flex-row md:justify-between md:items-center mb-8 gap-4">
                    <div>
                        <div className="flex items-center space-x-3 mb-1">
                            <div className="flex items-center text-slate-400 text-xs font-bold uppercase tracking-wide bg-slate-800/50 px-2 py-1 rounded border border-slate-700/50">
                                <StoreIcon className="w-3 h-3 mr-1.5" />
                                {activeStore?.name}
                            </div>
                            <span className="text-slate-600">/</span>
                            <span className="text-indigo-400 text-xs font-bold uppercase tracking-wide">{activeNode.category}</span>
                        </div>
                        <div className="flex items-center space-x-3">
                            <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">{activeNode.name}</h1>
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold border 
                                ${activeNode.status === 'VIOLATION' ? 'bg-rose-950 text-rose-400 border-rose-900' : 'bg-emerald-950 text-emerald-400 border-emerald-900'}
                            `}>
                                {activeNode.status}
                            </span>
                        </div>
                        <p className="text-slate-400 mt-1 text-sm md:text-base">Cross-referencing live pixel stream from node {activeNode.id} against Master Planogram.</p>
                    </div>
                    
                    <div className="flex items-center gap-4 self-start md:self-auto">
                         <div className="flex items-center gap-2">
                             <span className="text-xs text-slate-400 font-bold uppercase hidden md:inline">Gaze Tracking</span>
                             <button 
                                onClick={() => setShowHeatmap(!showHeatmap)}
                                className={`w-12 h-6 rounded-full p-1 transition-colors ${showHeatmap ? 'bg-indigo-600' : 'bg-slate-700'}`}
                                aria-label="Toggle Heatmap"
                             >
                                 <div className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform ${showHeatmap ? 'translate-x-6' : 'translate-x-0'}`}></div>
                             </button>
                         </div>
                        
                        <SimpleTooltip content={scanning ? "Analysis in progress..." : activeNode.status === 'VIOLATION' ? "Verify fix with live camera feed" : "Run routine compliance scan"}>
                            <button 
                                onClick={handleScan}
                                disabled={scanning}
                                className={`flex items-center px-4 md:px-6 py-2 md:py-3 rounded-xl shadow-lg transition-all font-bold tracking-wide text-sm
                                    ${activeNode.status === 'VIOLATION' 
                                        ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-900/20' 
                                        : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-900/20'}
                                `}
                            >
                                {scanning ? <RefreshCw className="w-5 h-5 mr-2 animate-spin" /> : <Camera className="w-5 h-5 mr-2" />}
                                {scanning ? 'Analyzing...' : activeNode.status === 'VIOLATION' ? 'Verify Fix' : 'Re-verify'}
                            </button>
                        </SimpleTooltip>
                    </div>
                </header>

                <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mb-8">
                    {/* Reference (Left) */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xs font-bold text-indigo-400 uppercase tracking-widest flex items-center">
                                <LayoutGrid className="w-4 h-4 mr-2" />
                                Master Reference Model
                            </h2>
                        </div>
                        <div className={`${theme.components.card} p-1 overflow-hidden relative min-h-[300px] md:min-h-[450px] bg-slate-900 border-dashed border-2 border-indigo-500/20 flex items-center justify-center`}>
                            <div className="relative w-full h-full">
                                {isPlanogramLoading ? <ImageSkeleton /> : <img src={planogramSrc} className="w-full h-full object-cover rounded-lg opacity-80" alt="Ref" />}
                                
                                {!isPlanogramLoading && !scanning && activeNode.status === 'VIOLATION' && (
                                    <div className="absolute top-[30%] left-[40%] w-[180px] h-[120px] border-2 border-emerald-500/50 rounded-lg bg-emerald-500/5 border-dashed flex items-center justify-center">
                                         <div className="bg-emerald-600/90 text-white text-[9px] font-bold px-1.5 py-0.5 absolute -top-3 left-1/2 transform -translate-x-1/2 uppercase backdrop-blur-md rounded border border-white/20 shadow-lg">
                                            EXPECTED: {activeNode.sku || 'ITEM'}
                                         </div>
                                    </div>
                                )}
                            </div>
                            <div className="absolute top-4 left-4 bg-black/60 backdrop-blur px-2 py-1 rounded text-[10px] text-white font-mono border border-white/10">
                                {isPlanogramLoading ? 'AI_MODEL_LOADING' : 'PLAN_V2.0_EXP'}
                            </div>
                        </div>
                    </div>

                    {/* Live Feed (Right) */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xs font-bold text-rose-400 uppercase tracking-widest flex items-center">
                                <Activity className="w-4 h-4 mr-2" />
                                Live Node Feed: {activeNode.id}
                            </h2>
                            <span className="text-[10px] text-slate-500 font-mono">{timestamp} • FHD • ENCRYPTED</span>
                        </div>
                        <div className={`${theme.components.card} p-1 overflow-hidden relative min-h-[300px] md:min-h-[450px] bg-slate-900 flex items-center justify-center border-2 
                            ${activeNode.status === 'VIOLATION' ? 'border-rose-500/40' : 'border-emerald-500/40'}`}>
                            <div className="relative w-full h-full">
                                {isLiveFeedLoading ? (
                                    <ImageSkeleton /> 
                                ) : (
                                    <img 
                                        src={liveFeedSrc} 
                                        className={`w-full h-full object-cover rounded-lg transition-all duration-700 ${scanning ? 'blur-lg grayscale' : ''}`} 
                                        alt="Live" 
                                    />
                                )}
                                <div className="absolute inset-0 pointer-events-none border-[15px] border-black/5"></div>

                                {showHeatmap && !isLiveFeedLoading && !scanning && (
                                    <div className="absolute inset-0 z-10 opacity-60 mix-blend-overlay pointer-events-none" 
                                         style={{background: 'radial-gradient(circle at 40% 60%, rgba(255,0,0,0.8) 0%, rgba(255,255,0,0.5) 20%, rgba(0,255,0,0.2) 50%, transparent 70%)'}}>
                                    </div>
                                )}
                                
                                {!isLiveFeedLoading && !scanning && activeNode.status === 'VIOLATION' && (
                                    <div className="absolute top-[30%] left-[40%] w-[180px] h-[120px] border-2 border-rose-500 rounded-lg animate-pulse bg-rose-500/5 shadow-[0_0_30px_rgba(244,113,116,0.2)]">
                                        <div className="bg-rose-600 text-white text-[9px] font-bold px-1.5 py-0.5 absolute -top-5 left-0 uppercase">DISCREPANCY</div>
                                        <div className="absolute bottom-2 left-2 text-[10px] text-rose-300 font-bold drop-shadow-lg">Confidence: 94.7%</div>
                                    </div>
                                )}

                                {!isLiveFeedLoading && !scanning && activeNode.status === 'COMPLIANT' && (
                                    <div className="absolute top-[30%] left-[40%] w-[180px] h-[120px] border-2 border-emerald-500 rounded-lg bg-emerald-500/5 shadow-[0_0_30px_rgba(52,211,153,0.1)]">
                                        <div className="bg-emerald-600 text-white text-[9px] font-bold px-1.5 py-0.5 absolute -top-5 left-0 uppercase">MATCHED</div>
                                    </div>
                                )}
                                
                                {showHeatmap && (
                                     <div className="absolute top-4 left-4 bg-black/60 backdrop-blur px-2 py-1 rounded text-[10px] text-white font-mono border border-white/10 z-20 flex items-center">
                                        <Eye className="w-3 h-3 mr-2 text-red-500" /> <span className="hidden md:inline">SHOPPER_GAZE_TRACKING_ON</span><span className="md:hidden">GAZE ON</span>
                                     </div>
                                )}

                                <div className="absolute bottom-4 right-4 flex items-center space-x-2">
                                    <div className="w-2 h-2 bg-red-600 rounded-full animate-pulse"></div>
                                    <span className="text-[10px] text-white font-mono drop-shadow-lg uppercase tracking-tighter">IoT_FEED_SECURE</span>
                                </div>
                            </div>

                            {scanning && (
                                <div className="absolute inset-0 bg-indigo-500/10 flex items-center justify-center backdrop-blur-sm z-20">
                                    <div className="w-full h-1 bg-cyan-400 absolute animate-[scan_2s_ease-in-out_infinite] shadow-[0_0_15px_rgba(34,211,238,1)]"></div>
                                    <div className="bg-black/80 px-6 py-3 rounded-2xl border border-cyan-500/30 text-cyan-400 font-mono text-xs flex flex-col items-center">
                                        <RefreshCw className="w-4 h-4 mb-2 animate-spin" />
                                        <span>CROSS-REFERENCING PIXELS...</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className={`${theme.components.card} p-6 relative overflow-hidden flex flex-col justify-center`}>
                        <div className="absolute top-0 right-0 p-4 opacity-5">
                            <Activity className="w-20 h-20" />
                        </div>
                        <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4">Node Health Analytics</h3>
                        <div className="flex items-baseline space-x-3">
                            <p className={`text-4xl font-bold ${activeNode.status === 'VIOLATION' ? 'text-rose-500' : 'text-emerald-500'}`}>
                                {activeNode.complianceScore}%
                            </p>
                            <p className="text-xs text-slate-400 font-medium">Compliance Index</p>
                        </div>
                        <div className="w-full h-1.5 bg-slate-800 rounded-full mt-4">
                            <div 
                                className={`h-full transition-all duration-1000 rounded-full ${activeNode.status === 'VIOLATION' ? 'bg-rose-500' : 'bg-emerald-500'}`} 
                                style={{ width: `${activeNode.complianceScore}%` }}
                            ></div>
                        </div>
                    </div>

                    <div className={`${theme.components.card} p-6 border-l-4 ${activeNode.status === 'VIOLATION' ? 'border-l-rose-500' : 'border-l-emerald-500'} flex flex-col`}>
                        <h4 className={`text-xs font-bold uppercase tracking-widest mb-4 ${activeNode.status === 'VIOLATION' ? 'text-rose-400' : 'text-emerald-400'}`}>
                            {activeNode.status === 'VIOLATION' ? 'Visual Discrepancy Detail' : 'Verification Complete'}
                        </h4>
                        
                        {activeNode.status === 'VIOLATION' ? (
                            <div className="space-y-4 flex-1">
                                <p className="text-sm text-slate-300">{activeNode.violationDetail}</p>
                                
                                {/* Visual Detail Comparison */}
                                <div className="bg-slate-950/50 rounded-lg p-3 border border-slate-800 flex items-center justify-between mt-auto">
                                    <div className="text-center group">
                                        <p className="text-[10px] text-slate-500 uppercase font-bold mb-2">Planogram</p>
                                        <div className="w-16 h-16 bg-white/5 rounded-md border border-slate-700 flex items-center justify-center group-hover:border-emerald-500/50 transition-colors">
                                            {/* Abstract Bottle Icon */}
                                            <svg width="24" height="40" viewBox="0 0 24 40" fill="none" className="text-emerald-500/50">
                                                <path d="M7 0H17V10H20C21.1 10 22 10.9 22 12V36C22 38.2 20.2 40 18 40H6C3.8 40 2 38.2 2 36V12C2 10.9 2.9 10 4 10H7V0Z" fill="currentColor"/>
                                            </svg>
                                        </div>
                                        <p className="text-[10px] text-emerald-400 font-mono mt-1">{activeNode.sku || 'ITEM'}</p>
                                    </div>

                                    <div className="flex flex-col items-center px-4">
                                        <div className="h-px w-12 bg-slate-700 mb-2"></div>
                                        <div className="p-1 rounded-full bg-rose-500/20 border border-rose-500 text-rose-500 mb-1">
                                            <X className="w-3 h-3" />
                                        </div>
                                        <span className="text-[9px] font-bold text-rose-400 uppercase tracking-wider">Mismatch</span>
                                        <div className="h-px w-12 bg-slate-700 mt-2"></div>
                                    </div>

                                    <div className="text-center group">
                                        <p className="text-[10px] text-slate-500 uppercase font-bold mb-2">Camera Feed</p>
                                        <div className="w-16 h-16 bg-white/5 rounded-md border border-rose-500/30 flex items-center justify-center relative overflow-hidden group-hover:border-rose-500 transition-colors">
                                            <div className="absolute inset-0 opacity-20" style={{backgroundImage: 'repeating-linear-gradient(45deg, #f43f5e 0, #f43f5e 1px, transparent 0, transparent 50%)', backgroundSize: '10px 10px'}}></div>
                                            <span className="text-rose-500 text-xs font-bold relative z-10">VOID</span>
                                        </div>
                                        <p className="text-[10px] text-rose-400 font-mono mt-1">DETECTED: EMPTY</p>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="flex items-center justify-center h-full text-center">
                                <div>
                                    <CheckCircle className="w-12 h-12 text-emerald-500/20 mx-auto mb-2" />
                                    <p className="text-sm text-slate-400">Node {activeNode.id} verified as compliant.</p>
                                    <p className="text-xs text-slate-500 mt-1">No action required for this store segment.</p>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className={`${theme.components.card} p-6 bg-indigo-950/20 border-indigo-900/50 flex flex-col justify-between`}>
                        <div>
                            <Sparkles className="w-6 h-6 text-indigo-400 mb-3" />
                            <h4 className="font-bold text-white text-sm mb-1">Neural Vision Engine</h4>
                            <p className="text-[11px] text-slate-400 leading-relaxed">
                                System uses generative AI to compare real-world pixel streams against synthetic ground-truth models.
                            </p>
                        </div>
                        <div className="pt-4 mt-4 border-t border-indigo-900/50 flex justify-between items-center text-[10px] font-mono text-indigo-300">
                            <span>LATENCY: 450MS</span>
                            <span className="flex items-center">
                                <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full mr-2 animate-pulse"></div>
                                AI ACTIVE
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
                @keyframes scan {
                    0% { top: 0%; }
                    50% { top: 100%; }
                    100% { top: 0%; }
                }
            `}</style>
        </div>
    );
};
