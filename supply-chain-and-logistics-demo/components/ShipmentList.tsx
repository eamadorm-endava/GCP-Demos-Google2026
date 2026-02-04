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
        'In Transit': 'bg-blue-100 text-blue-800',
        'Pending': 'bg-yellow-100 text-yellow-800',
        'Delivered': 'bg-green-100 text-green-800',
        'Delayed': 'bg-red-100 text-red-800',
        'Requires Action': 'bg-amber-100 text-amber-800',
        'Cancelled': 'bg-slate-100 text-slate-500 line-through',
    };

    const translatedStatus = t(statusTranslationKeys[shipment.status] || shipment.status);

    return (
        <li 
            onClick={onSelect}
            className={`cursor-pointer p-4 border-b border-brand-primary-50 hover:bg-slate-100 transition-colors duration-150 ${isSelected ? 'bg-rose-50 border-l-4 border-brand-primary-50' : ''}`}
        >
            <div className="flex justify-between items-start">
                <div>
                    <p className={`text-sm font-bold ${isSelected ? 'text-brand-primary-50' : 'text-slate-800'}`}>{shipment.id}</p>
                    <p className="text-xs text-slate-500">{shipment.customer}</p>
                </div>
                <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${statusColors[shipment.status] || 'bg-slate-100 text-slate-800'}`}>
                    {translatedStatus}
                </span>
            </div>
            <div className="flex items-center gap-2 mt-3 text-sm text-slate-600">
                <div className="flex items-center gap-1.5 truncate">
                    <PinIcon className="w-4 h-4 text-slate-400 shrink-0"/>
                    <span className="truncate">{shipment.origin.city}</span>
                </div>
                <ArrowRightIcon className="w-4 h-4 text-slate-400 shrink-0" />
                <div className="flex items-center gap-1.5 truncate">
                    <PinIcon className="w-4 h-4 text-slate-400 shrink-0"/>
                    <span className="truncate">{shipment.destination.city}</span>
                </div>
            </div>
            <div className="mt-2 text-xs text-slate-500 flex items-center gap-1.5">
                <CalendarDaysIcon className="w-3.5 h-3.5 text-slate-400"/>
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
        <div className="p-4 border-b border-brand-sb-shade-80 sticky top-0 bg-brand-primary-200 backdrop-blur-sm z-10">
            <h2 className="text-lg font-bold text-brand-primary-300">{t('allShipments')}</h2>
            <p className="text-sm text-brand-sb-shade-30">
              {shipments.length > 0 
                ? t('shipmentsFound', { count: shipments.length })
                : t('noShipmentsMatch')}
            </p>
            <div className="mt-3 flex flex-col sm:flex-row gap-3">
              <div className="relative flex-grow">
                <label htmlFor="search-shipment" className="sr-only">{t('searchShipments')}</label>
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <SearchIcon className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="search"
                  id="search-shipment"
                  className="block w-full rounded-md border-slate-300 py-2 pl-10 shadow-sm focus:border-rose-500 focus:ring-rose-500 sm:text-sm"
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
                  className="block w-full pl-3 pr-10 py-2 text-base border-slate-300 focus:outline-none focus:ring-rose-500 focus:border-rose-500 sm:text-sm rounded-md shadow-sm"
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
            <p className="text-slate-500 font-semibold">{t('noShipmentsFound')}</p>
            <p className="text-sm text-slate-400">{t('adjustFilters')}</p>
          </div>
        )}
    </div>
  );
};