import React from 'react';
import type { Farm, FarmStatus } from '../types';
import { useLanguage } from '../contexts/LanguageContext';
import { SearchIcon } from './icons';

interface FarmListProps {
  farms: Farm[];
  selectedFarmId: string | null;
  onSelectFarm: (farmId: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  statusFilter: string;
  onFilterChange: (status: string) => void;
}

const statusTranslationKeys: Record<FarmStatus, string> = {
  'Approved': 'statusApproved',
  'Pending Review': 'statusPendingReview',
  'Rejected': 'statusRejected',
};

const FarmListItem: React.FC<{ farm: Farm; isSelected: boolean; onSelect: () => void }> = ({ farm, isSelected, onSelect }) => {
    const { t } = useLanguage();

    const statusColors: { [key in FarmStatus]: string } = {
        'Approved': 'bg-green-100 text-green-800',
        'Pending Review': 'bg-yellow-100 text-yellow-800',
        'Rejected': 'bg-red-100 text-red-800',
    };

    const translatedStatus = t(statusTranslationKeys[farm.status] || farm.status);

    return (
        <li 
            onClick={onSelect}
            className={`cursor-pointer p-4 border-b border-slate-200 hover:bg-slate-100 transition-colors duration-150 ${isSelected ? 'bg-rose-50 border-l-4 border-rose-500' : 'border-brand-primary-50'}`}
        >
            <div className="flex justify-between items-start">
                <div>
                    <p className={`text-sm font-bold ${isSelected ? 'text-brand-primary-50' : 'text-brand-primary-300'}`}>{farm.name}</p>
                    <p className="text-xs text-brand-sb-shade-30">{farm.originCountry}</p>
                </div>
                <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${statusColors[farm.status]}`}>
                    {translatedStatus}
                </span>
            </div>
        </li>
    );
};

export const FarmList: React.FC<FarmListProps> = ({ farms, selectedFarmId, onSelectFarm, searchQuery, onSearchChange, statusFilter, onFilterChange }) => {
  const { t } = useLanguage();
  const FARM_STATUSES = ['All', 'Approved', 'Pending Review', 'Rejected'];
  
  return (
    <div>
        <div className="p-4 border-b border-slate-200 sticky top-0 bg-brand-sb-shade-90 backdrop-blur-sm z-10">
            <h2 className="text-lg font-bold text-brand-primary-300">{t('farmManagement')}</h2>
            <p className="text-sm text-brand-sb-shade-30">{t('farmManagementSubtitle')}</p>
             <div className="mt-3 flex flex-col sm:flex-row gap-3">
              <div className="relative flex-grow">
                <label htmlFor="search-farm" className="sr-only">{t('searchFarms')}</label>
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <SearchIcon className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="search"
                  id="search-farm"
                  className="block w-full rounded-md border-slate-300 py-2 pl-10 shadow-sm focus:border-rose-500 focus:ring-rose-500 sm:text-sm"
                  placeholder={t('searchFarms')}
                  value={searchQuery}
                  onChange={(e) => onSearchChange(e.target.value)}
                />
              </div>
              <div className="shrink-0">
                <label htmlFor="farm-status-filter" className="sr-only">{t('filterByStatus')}</label>
                <select
                  id="farm-status-filter"
                  name="farm-status-filter"
                  className="block w-full pl-3 pr-10 py-2 text-base border-slate-300 focus:outline-none focus:ring-rose-500 focus:border-rose-500 sm:text-sm rounded-md shadow-sm"
                  value={statusFilter}
                  onChange={(e) => onFilterChange(e.target.value)}
                >
                  {FARM_STATUSES.map(status => {
                     const statusKey = status.replace(/\s+/g, '');
                     return <option key={status} value={status}>{t(`status${statusKey}`)}</option>
                  })}
                </select>
              </div>
            </div>
        </div>
        {farms.length > 0 ? (
          <ul>
              {farms.map((farm) => (
                  <FarmListItem
                      key={farm.id}
                      farm={farm}
                      isSelected={farm.id === selectedFarmId}
                      onSelect={() => onSelectFarm(farm.id)}
                  />
              ))}
          </ul>
        ) : (
          <div className="text-center py-16 px-4">
            <p className="text-slate-500 font-semibold">{t('noFarmsFound')}</p>
            <p className="text-sm text-slate-400">{t('adjustFilters')}</p>
          </div>
        )}
    </div>
  );
};