import React, { useState, useEffect, useMemo } from 'react';
import type { Farm, User } from '../types';
import { FarmList } from './FarmList';
import { FarmDetail } from './FarmDetail';
import { useLanguage } from '../contexts/LanguageContext';
import { FlowerIcon } from './icons';

interface FarmManagementProps {
    user: User;
    farms: Farm[];
    onUpdateFarmStatus: (farmId: string, status: 'Approved' | 'Rejected') => void;
    onUpdateFarmDocumentStatus: (farmId: string, docName: string, uploaded: boolean) => void;
}

export const FarmManagement: React.FC<FarmManagementProps> = ({ user, farms, onUpdateFarmStatus, onUpdateFarmDocumentStatus }) => {
    const [selectedFarmId, setSelectedFarmId] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const { t } = useLanguage();

    const filteredFarms = useMemo(() => farms
        .filter(farm => statusFilter === 'All' || farm.status === statusFilter)
        .filter(farm => {
            const query = searchQuery.toLowerCase().trim();
            if (!query) return true;
            return (
                farm.name.toLowerCase().includes(query) ||
                farm.originCountry.toLowerCase().includes(query) ||
                farm.id.toLowerCase().includes(query)
            );
        }), [farms, statusFilter, searchQuery]);
        
    useEffect(() => {
        if (!selectedFarmId && filteredFarms.length > 0) {
            setSelectedFarmId(filteredFarms[0].id);
        }
        if (selectedFarmId && !filteredFarms.some(f => f.id === selectedFarmId)) {
            setSelectedFarmId(filteredFarms[0]?.id || null);
        }
    }, [filteredFarms, selectedFarmId]);

    const selectedFarm = useMemo(() => farms.find(f => f.id === selectedFarmId), [farms, selectedFarmId]);

    return (
        <div className="w-full h-full flex overflow-hidden">
            <div className={`w-full lg:w-1/3 xl:w-1/4 border-r border-slate-200 overflow-y-auto bg-slate-50 ${selectedFarm ? 'hidden lg:block' : 'block'}`}>
               <FarmList 
                 farms={filteredFarms}
                 selectedFarmId={selectedFarmId}
                 onSelectFarm={setSelectedFarmId}
                 searchQuery={searchQuery}
                 onSearchChange={setSearchQuery}
                 statusFilter={statusFilter}
                 onFilterChange={setStatusFilter}
               />
            </div>
            <div className={`flex-1 overflow-y-auto bg-white ${selectedFarm ? 'block' : 'hidden lg:block'}`}>
                {selectedFarm ? (
                    <FarmDetail 
                        farm={selectedFarm} 
                        user={user}
                        onUpdateStatus={onUpdateFarmStatus}
                        onUpdateDocumentStatus={onUpdateFarmDocumentStatus}
                        onBack={() => setSelectedFarmId(null)}
                    />
                ) : (
                    <div className="flex-col items-center justify-center h-full w-full text-slate-500 hidden lg:flex">
                        <FlowerIcon className="w-16 h-16 mb-4 text-slate-400" />
                        <h2 className="text-xl font-semibold">{t('selectFarmToView')}</h2>
                    </div>
                )}
            </div>
        </div>
    );
};