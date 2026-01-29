
import React, { useState, useMemo } from 'react';
import { Store } from '../types';
import { ALL_STORES } from '../constants';
import { useStore } from '../store/useStore';
import { LayoutGrid, Map, StoreIcon, DollarSign, Users, Package, Shield, ChevronRight, X, Search } from './Icons';
import { theme } from '../theme';

interface StoreListViewProps {
  className?: string;
}

export const StoreListView: React.FC<StoreListViewProps> = ({ className = '' }) => {
  const { viewStore } = useStore();
  const [viewMode, setViewMode] = useState<'grid' | 'map'>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [clusterFilter, setClusterFilter] = useState<string>('All');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12; // Limit for scalability

  // Network Summary Stats
  const totalStores = ALL_STORES.length;
  const totalRevenue = ALL_STORES.reduce((sum, s) => sum + s.metrics.monthly_revenue, 0);
  const avgTraffic = Math.round(ALL_STORES.reduce((sum, s) => sum + s.metrics.foot_traffic, 0) / totalStores);

  // Get unique clusters for filter
  const clusters = useMemo(() => {
      const unique = new Set(ALL_STORES.map(s => s.cluster));
      return ['All', ...Array.from(unique)];
  }, []);

  // Filter Logic
  const filteredStores = useMemo(() => {
      return ALL_STORES.filter(store => {
          const matchesSearch = store.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                                store.location.toLowerCase().includes(searchTerm.toLowerCase());
          const matchesCluster = clusterFilter === 'All' || store.cluster === clusterFilter;
          return matchesSearch && matchesCluster;
      });
  }, [searchTerm, clusterFilter]);

  // Pagination Logic
  const totalPages = Math.ceil(filteredStores.length / itemsPerPage);
  const currentStores = useMemo(() => {
      const start = (currentPage - 1) * itemsPerPage;
      return filteredStores.slice(start, start + itemsPerPage);
  }, [filteredStores, currentPage]);

  return (
    <div className={`max-w-7xl mx-auto px-4 md:px-8 py-8 animate-fade-in ${className}`}>
      <header className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
                <h1 className={`text-3xl font-bold ${theme.colors.text.primary} tracking-tight`}>Store Network</h1>
                <p className={`text-lg ${theme.colors.text.secondary} mt-2`}>
                Overview of managed locations and their performance clusters.
                </p>
            </div>
            
            <div className={`flex items-center space-x-3 ${theme.colors.background.card} p-1 rounded-xl border ${theme.colors.border.base} shadow-sm self-start md:self-auto`}>
                <button 
                    onClick={() => setViewMode('grid')}
                    className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all ${viewMode === 'grid' ? `${theme.colors.background.active} text-white shadow-sm border ${theme.colors.border.light}` : `text-slate-400 hover:text-white ${theme.colors.background.hover}`}`}
                >
                    <LayoutGrid className="w-4 h-4 mr-2" />
                    Cards
                </button>
                <button 
                    onClick={() => setViewMode('map')}
                    className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all ${viewMode === 'map' ? `${theme.colors.background.active} text-white shadow-sm border ${theme.colors.border.light}` : `text-slate-400 hover:text-white ${theme.colors.background.hover}`}`}
                >
                    <Map className="w-4 h-4 mr-2" />
                    Topology
                </button>
            </div>
        </div>
      </header>

      {/* Network Metrics Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className={`${theme.components.card} p-5 flex items-center justify-between`}>
              <div>
                  <p className={`text-xs font-bold ${theme.colors.text.tertiary} uppercase tracking-wide`}>Total Locations</p>
                  <p className={`text-2xl font-bold ${theme.colors.text.primary} mt-1`}>{totalStores.toLocaleString()}</p>
              </div>
              <div className={`w-10 h-10 ${theme.semantic.primary.bgLight} rounded-full flex items-center justify-center ${theme.semantic.primary.base}`}>
                  <StoreIcon className="w-5 h-5" />
              </div>
          </div>
          <div className={`${theme.components.card} p-5 flex items-center justify-between`}>
              <div>
                  <p className={`text-xs font-bold ${theme.colors.text.tertiary} uppercase tracking-wide`}>Network Revenue (Mo)</p>
                  <p className={`text-2xl font-bold ${theme.colors.text.primary} mt-1`}>${(totalRevenue/1000000).toFixed(1)}M</p>
              </div>
              <div className={`w-10 h-10 ${theme.semantic.success.bgLight} rounded-full flex items-center justify-center ${theme.semantic.success.base}`}>
                  <DollarSign className="w-5 h-5" />
              </div>
          </div>
          <div className={`${theme.components.card} p-5 flex items-center justify-between`}>
              <div>
                  <p className={`text-xs font-bold ${theme.colors.text.tertiary} uppercase tracking-wide`}>Avg Foot Traffic</p>
                  <p className={`text-2xl font-bold ${theme.colors.text.primary} mt-1`}>{avgTraffic.toLocaleString()}</p>
              </div>
              <div className={`w-10 h-10 ${theme.semantic.secondary.bgLight} rounded-full flex items-center justify-center ${theme.semantic.secondary.base}`}>
                  <Users className="w-5 h-5" />
              </div>
          </div>
      </div>

      {/* Search and Filter Bar */}
      <div className={`flex flex-col md:flex-row gap-4 mb-6 justify-between items-center ${theme.components.card} p-4`}>
          <div className="relative w-full md:w-96">
              <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${theme.colors.text.tertiary} w-4 h-4`} />
              <input 
                  type="text" 
                  placeholder="Search stores by name or city..." 
                  className={theme.components.input}
                  value={searchTerm}
                  onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
              />
              {searchTerm && (
                  <button 
                    onClick={() => { setSearchTerm(''); setCurrentPage(1); }}
                    className={`absolute right-3 top-1/2 transform -translate-y-1/2 ${theme.colors.text.tertiary} hover:text-white`}
                  >
                      <X className="w-4 h-4" />
                  </button>
              )}
          </div>
          
          <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-4 w-full md:w-auto">
              <div className="flex items-center space-x-2 w-full md:w-auto">
                  <span className={`text-sm ${theme.colors.text.secondary} font-medium`}>Cluster:</span>
                  <select 
                    className={`border ${theme.colors.border.base} rounded-lg px-3 py-2 text-sm focus:outline-none ${theme.colors.border.focus} ${theme.colors.background.input} text-slate-200 flex-1 md:flex-none`}
                    value={clusterFilter}
                    onChange={(e) => { setClusterFilter(e.target.value); setCurrentPage(1); }}
                  >
                      {clusters.map(c => (
                          <option key={c} value={c}>{c}</option>
                      ))}
                  </select>
              </div>
              <div className={`text-sm ${theme.colors.text.tertiary} border-t md:border-t-0 md:border-l pt-4 md:pt-0 md:pl-4 ${theme.colors.border.base} w-full md:w-auto text-center md:text-left`}>
                  Showing {currentStores.length} of {filteredStores.length}
              </div>
          </div>
      </div>
      
      {viewMode === 'grid' ? (
          <>
            {currentStores.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
                    {currentStores.map(store => (
                    <div key={store.store_id} className={`${theme.components.card} ${theme.components.cardHover} p-6 transition-all duration-300 group flex flex-col h-full`}>
                        <div className="flex items-start justify-between mb-4">
                            <div>
                                <h3 className={`text-base font-bold ${theme.colors.text.primary} group-hover:${theme.semantic.primary.base} transition-colors line-clamp-1`} title={store.name}>{store.name}</h3>
                                <div className={`flex items-center ${theme.colors.text.secondary} text-xs mt-1`}>
                                    <StoreIcon className="w-3 h-3 mr-1.5" />
                                    {store.location}
                                </div>
                            </div>
                            <span className={`px-2 py-0.5 ${theme.semantic.info.bgLight} ${theme.semantic.info.base} text-[10px] rounded font-semibold border ${theme.semantic.info.border} whitespace-nowrap`}>
                                {store.cluster}
                            </span>
                        </div>
                        
                        <div className={`space-y-3 flex-1 border-t ${theme.colors.border.light} pt-4`}>
                            <div className="flex justify-between items-center">
                                <span className={`text-xs font-medium ${theme.colors.text.secondary} flex items-center`}><DollarSign className={`w-3 h-3 mr-1.5 ${theme.colors.text.tertiary}`}/> Monthly Revenue</span>
                                <span className={`font-bold ${theme.colors.text.primary} text-sm`}>${store.metrics.monthly_revenue.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className={`text-xs font-medium ${theme.colors.text.secondary} flex items-center`}><Users className={`w-3 h-3 mr-1.5 ${theme.colors.text.tertiary}`}/> Foot Traffic</span>
                                <span className={`font-bold ${theme.colors.text.primary} text-sm`}>{store.metrics.foot_traffic.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className={`text-xs font-medium ${theme.colors.text.secondary} flex items-center`}><Package className={`w-3 h-3 mr-1.5 ${theme.colors.text.tertiary}`}/> Avg. Basket Size</span>
                                <span className={`font-bold ${theme.colors.text.primary} text-sm`}>${store.metrics.avg_basket_size.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className={`text-xs font-medium ${theme.colors.text.secondary} flex items-center`}><Shield className={`w-3 h-3 mr-1.5 ${theme.colors.text.tertiary}`}/> Compliance</span>
                                <span className={`font-bold text-sm ${
                                    (store.compliance_score || 0) >= 90 ? theme.semantic.success.base :
                                    (store.compliance_score || 0) >= 80 ? theme.semantic.warning.base :
                                    theme.semantic.danger.base
                                }`}>
                                    {store.compliance_score || 'N/A'}%
                                </span>
                            </div>
                        </div>

                        <button 
                            onClick={() => viewStore(store.store_id)}
                            className={`w-full mt-6 py-2 ${theme.components.button.secondary} text-xs font-bold rounded-lg group-hover:bg-cyan-600 group-hover:text-white group-hover:border-cyan-600 transition-colors flex items-center justify-center`}
                        >
                            View Details <ChevronRight className="w-3 h-3 ml-1" />
                        </button>
                    </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-20 bg-slate-900/50 rounded-2xl border border-dashed border-slate-800">
                    <p className="text-slate-500 font-medium">No stores matching your filters.</p>
                </div>
            )}
          </>
      ) : (
          <div className="bg-slate-900 rounded-2xl border border-slate-800 h-[600px] flex items-center justify-center relative overflow-hidden">
               {/* Placeholder for map view */}
               <div className="relative z-10 text-center">
                   <Map className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                   <p className="text-slate-400 font-bold">Geospatial Topology View</p>
                   <p className="text-xs text-slate-500 mt-2">Interactive map module is initializing...</p>
               </div>
          </div>
      )}
    </div>
  );
};
