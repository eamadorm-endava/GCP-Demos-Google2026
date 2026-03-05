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
    'Approved': 'bg-green-900/30 text-green-400',
    'Pending Review': 'bg-yellow-900/30 text-yellow-400',
    'Rejected': 'bg-red-900/30 text-red-400',
  };

  const translatedStatus = t(statusTranslationKeys[farm.status] || farm.status);

  return (
    <li
      onClick={onSelect}
      className={`cursor-pointer p-5 border-b border-white/10 hover:bg-white/5 transition-all duration-200 relative ${isSelected ? 'bg-rose-900/20 shadow-inner' : ''}`}
    >
      {isSelected && <div className="absolute left-0 top-0 bottom-0 w-1 bg-endava-orange rounded-r shadow-lg shadow-black/40"></div>}
      <div className="flex justify-between items-start">
        <div>
          <p className={`text-sm font-bold tracking-tight ${isSelected ? 'text-endava-orange' : 'text-white'}`}>{farm.name}</p>
          <p className="text-xs text-endava-blue-40 mt-0.5">{farm.originCountry}</p>
        </div>
        <span className={`px-2.5 py-1 text-xs font-semibold rounded-full shadow-lg shadow-black/40 ${statusColors[farm.status] || 'bg-endava-blue-80 text-white'}`}>
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
      <div className="p-4 border-b border-white/10 sticky top-0 bg-endava-dark/80/80 backdrop-blur-sm z-10">
        <h2 className="text-lg font-bold text-white">{t('farmManagement')}</h2>
        <p className="text-sm text-endava-blue-40">{t('farmManagementSubtitle')}</p>
        <div className="mt-3 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-grow">
            <label htmlFor="search-farm" className="sr-only">{t('searchFarms')}</label>
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <SearchIcon className="h-5 w-5 text-endava-blue-40" />
            </div>
            <input
              type="search"
              id="search-farm"
              className="block w-full rounded-md border-white/5 py-2 pl-10 shadow-lg shadow-black\/40 focus:border-endava-orange focus:ring-endava-orange sm:text-sm"
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
              className="block w-full pl-3 pr-10 py-2 text-base border-white/5 focus:outline-none focus:ring-endava-orange focus:border-endava-orange sm:text-sm rounded-md shadow-lg shadow-black\/40"
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
          <p className="text-endava-blue-40 font-semibold">{t('noFarmsFound')}</p>
          <p className="text-sm text-endava-blue-40">{t('adjustFilters')}</p>
        </div>
      )}
    </div>
  );
};