import React from 'react';
import type { Shipment, ShipmentStatus } from '../types';
import { ArrowRightIcon, PinIcon, SearchIcon, CalendarDaysIcon } from './icons';
import { useLanguage } from '../contexts/LanguageContext';

interface ShipmentListProps {
  shipments: Shipment[];
  selectedShipmentId: string | null;
  onSelectShipment: (shipmentId: string) => void;
  statusFilter: string;
  onFilterChange: (status: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

const statusTranslationKeys: Record<ShipmentStatus, string> = {
  'Pending': 'statusPending',
  'In Transit': 'statusInTransit',
  'Delivered': 'statusDelivered',
  'Delayed': 'statusDelayed',
  'Requires Action': 'statusRequiresAction',
  'Cancelled': 'statusCancelled',
};

const ShipmentListItem: React.FC<{ shipment: Shipment; isSelected: boolean; onSelect: () => void }> = ({ shipment, isSelected, onSelect }) => {
  const { t } = useLanguage();

  const statusColors: { [key: string]: string } = {
    'In Transit': 'bg-blue-900/30/80 text-blue-400 ring-1 ring-blue-200',
    'Pending': 'bg-yellow-900/30/80 text-yellow-400 ring-1 ring-yellow-200',
    'Delivered': 'bg-green-900/30/80 text-green-400 ring-1 ring-green-200',
    'Delayed': 'bg-red-900/30/80 text-red-400 ring-1 ring-red-200',
    'Requires Action': 'bg-amber-900/30/80 text-amber-400 ring-1 ring-amber-200',
    'Cancelled': 'bg-endava-blue-80/80 text-endava-blue-40 line-through ring-1 ring-white/10',
  };

  const translatedStatus = t(statusTranslationKeys[shipment.status] || shipment.status);

  return (
    <li
      onClick={onSelect}
      className={`cursor-pointer p-5 border-b border-white/10 hover:bg-white/5 transition-all duration-200 relative ${isSelected ? 'bg-rose-900/20/60 shadow-inner' : ''}`}
    >
      {isSelected && <div className="absolute left-0 top-0 bottom-0 w-1 bg-rose-900/200 rounded-r shadow-lg shadow-black\/40"></div>}
      <div className="flex justify-between items-start">
        <div>
          <p className={`text-sm font-bold tracking-tight ${isSelected ? 'text-endava-orange' : 'text-white'}`}>{shipment.id}</p>
          <p className="text-xs text-endava-blue-40 mt-0.5">{shipment.customer}</p>
        </div>
        <span className={`px-2.5 py-1 text-xs font-semibold rounded-full shadow-lg shadow-black\/40 ${statusColors[shipment.status] || 'bg-endava-blue-80 text-white'}`}>
          {translatedStatus}
        </span>
      </div>
      <div className="flex items-center gap-2 mt-4 text-sm text-endava-blue-30">
        <div className="flex items-center gap-1.5 truncate">
          <PinIcon className="w-4 h-4 text-endava-blue-40 shrink-0" />
          <span className="truncate">{shipment.origin.city}</span>
        </div>
        <ArrowRightIcon className="w-4 h-4 text-endava-blue-30 shrink-0" />
        <div className="flex items-center gap-1.5 truncate">
          <PinIcon className="w-4 h-4 text-endava-blue-40 shrink-0" />
          <span className="truncate">{shipment.destination.city}</span>
        </div>
      </div>
      <div className="mt-3 text-xs text-endava-blue-40 flex items-center gap-1.5">
        <CalendarDaysIcon className="w-3.5 h-3.5 text-endava-blue-40" />
        <span><strong>{t('edd')}:</strong> {shipment.estimatedDeliveryDate}</span>
      </div>
    </li>
  );
};

export const ShipmentList: React.FC<ShipmentListProps> = ({ shipments, selectedShipmentId, onSelectShipment, statusFilter, onFilterChange, searchQuery, onSearchChange }) => {
  const { t } = useLanguage();
  const SHIPMENT_STATUSES = ['All', 'Pending', 'In Transit', 'Delivered', 'Delayed', 'Requires Action', 'Cancelled'];

  return (
    <div>
      <div className="p-4 border-b border-white/10 sticky top-0 bg-endava-dark/80/80 backdrop-blur-sm z-10">
        <h2 className="text-lg font-bold text-white">{t('allShipments')}</h2>
        <p className="text-sm text-endava-blue-40">
          {shipments.length > 0
            ? t('shipmentsFound', { count: shipments.length })
            : t('noShipmentsMatch')}
        </p>
        <div className="mt-3 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-grow">
            <label htmlFor="search-shipment" className="sr-only">{t('searchShipments')}</label>
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <SearchIcon className="h-5 w-5 text-endava-blue-40" />
            </div>
            <input
              type="search"
              id="search-shipment"
              className="block w-full rounded-md border-white/5 py-2 pl-10 shadow-lg shadow-black\/40 focus:border-endava-orange focus:ring-endava-orange sm:text-sm"
              placeholder={t('searchPlaceholder')}
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>
          <div className="shrink-0">
            <label htmlFor="status-filter" className="sr-only">{t('filterByStatus')}</label>
            <select
              id="status-filter"
              name="status-filter"
              className="block w-full pl-3 pr-10 py-2 text-base focus:outline-none focus:ring-endava-orange focus:border-endava-orange sm:text-sm rounded-md shadow-lg shadow-black\/40"
              value={statusFilter}
              onChange={(e) => onFilterChange(e.target.value)}
            >
              {SHIPMENT_STATUSES.map(status => {
                const statusKey = status.replace(/\s+/g, '');
                return <option key={status} value={status}>{t(`status${statusKey}`)}</option>
              })}
            </select>
          </div>
        </div>
      </div>
      {shipments.length > 0 ? (
        <ul>
          {shipments.map((shipment) => (
            <ShipmentListItem
              key={shipment.id}
              shipment={shipment}
              isSelected={shipment.id === selectedShipmentId}
              onSelect={() => onSelectShipment(shipment.id)}
            />
          ))}
        </ul>
      ) : (
        <div className="text-center py-16 px-4">
          <p className="text-endava-blue-40 font-semibold">{t('noShipmentsFound')}</p>
          <p className="text-sm text-endava-blue-40">{t('adjustFilters')}</p>
        </div>
      )}
    </div>
  );
};