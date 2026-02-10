import React, { useState, useCallback, useEffect } from 'react';
import type { Shipment, Farm } from '../types';
import { COUNTRIES } from '../constants';
import { getSuggestedDocuments } from '../services/geminiService';
import { XMarkIcon, LightBulbIcon, SpinnerIcon } from './icons';
import { useLanguage } from '../contexts/LanguageContext';

interface NewOrderFormProps {
  farms: Farm[];
  onClose: () => void;
  onAddShipment: (shipment: Omit<Shipment, 'id' | 'milestones' | 'documents' | 'communication' | 'cost' | 'trackingUrl' | 'status' | 'attachedParties'>, selectedDocs: string[]) => void;
}

const getDefaultEdd = () => {
    const date = new Date();
    date.setDate(date.getDate() + 7);
    return date.toISOString().split('T')[0];
};

export const NewOrderForm: React.FC<NewOrderFormProps> = ({ farms, onClose, onAddShipment }) => {
  const { t, language } = useLanguage();
  const [customer, setCustomer] = useState('');
  const [farmId, setFarmId] = useState(farms[0]?.id || '');
  
  const [originCountry, setOriginCountry] = useState('Colombia');
  const [originCity, setOriginCity] = useState('Bogotá');
  const [destinationCountry, setDestinationCountry] = useState('USA');
  const [destinationCity, setDestinationCity] = useState('Miami');
  
  const [estimatedDeliveryDate, setEstimatedDeliveryDate] = useState(getDefaultEdd());
  const [commodity, setCommodity] = useState('Fresh Cut Flowers');
  const [mawb, setMawb] = useState('');
  const [hawb, setHawb] = useState('');
  
  const [suggestedDocs, setSuggestedDocs] = useState<string[]>([]);
  const [selectedDocs, setSelectedDocs] = useState<string[]>([]);
  const [isLoadingDocs, setIsLoadingDocs] = useState(false);
  const [error, setError] = useState('');
  
  useEffect(() => {
    const selectedFarm = farms.find(f => f.id === farmId);
    if (selectedFarm) {
        setOriginCountry(selectedFarm.originCountry);
        setOriginCity(selectedFarm.address.municipality);
    }
  }, [farmId, farms]);

  const fetchDocs = useCallback(async () => {
    if (originCountry && destinationCountry) {
        setIsLoadingDocs(true);
        setError('');
        setSuggestedDocs([]);
        setSelectedDocs([]);
        try {
            const docs = await getSuggestedDocuments(originCountry, destinationCountry, language);
            setSuggestedDocs(docs);
        } catch (err) {
            setError(t('errorFetchDocs'));
            console.error(err);
        } finally {
            setIsLoadingDocs(false);
        }
    }
  }, [originCountry, destinationCountry, language, t]);

  useEffect(() => {
    fetchDocs();
  }, [fetchDocs]);

  const handleDocSelectionChange = (docName: string) => {
    setSelectedDocs(prev =>
      prev.includes(docName)
        ? prev.filter(d => d !== docName)
        : [...prev, docName]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!farmId) {
        alert(t('errorSelectFarm'));
        return;
    }
    onAddShipment({
      customer,
      farmId,
      origin: { country: originCountry, city: originCity, lat: 4.71, lng: -74.07 },
      destination: { country: destinationCountry, city: destinationCity, lat: 25.76, lng: -80.19 },
      estimatedDeliveryDate,
      commodity,
      mawb,
      hawb,
    }, selectedDocs);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col">
        <div className="flex justify-between items-center p-5 border-b border-slate-200">
          <h2 className="text-xl font-bold text-slate-800">{t('createNewShipment')}</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        <form id="new-shipment-form" onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          <fieldset className="border border-slate-200 p-4 rounded-md">
            <legend className="text-sm font-semibold px-2 text-slate-600">{t('bookingDetails')}</legend>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="customer" className="block text-sm font-medium text-slate-700">{t('customerName')}</label>
                <input type="text" id="customer" value={customer} onChange={(e) => setCustomer(e.target.value)} required className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-rose-500 focus:border-rose-500" />
              </div>
              <div>
                <label htmlFor="farm" className="block text-sm font-medium text-slate-700">{t('originFarm')}</label>
                 <select id="farm" value={farmId} onChange={(e) => setFarmId(e.target.value)} required className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-rose-500 focus:border-rose-500 bg-white">
                    <option value="" disabled>{t('selectFarm')}</option>
                    {farms.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
                  </select>
              </div>
              <div>
                <label htmlFor="commodity" className="block text-sm font-medium text-slate-700">{t('commodity')}</label>
                <input type="text" id="commodity" value={commodity} onChange={(e) => setCommodity(e.target.value)} required className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-rose-500 focus:border-rose-500" />
              </div>
               <div>
                <label htmlFor="edd" className="block text-sm font-medium text-slate-700">{t('edd')}</label>
                <input type="date" id="edd" value={estimatedDeliveryDate} onChange={(e) => setEstimatedDeliveryDate(e.target.value)} required className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-rose-500 focus:border-rose-500" />
              </div>
              <div>
                <label htmlFor="mawb" className="block text-sm font-medium text-slate-700">{t('mawb')}</label>
                <input type="text" id="mawb" value={mawb} onChange={(e) => setMawb(e.target.value)} placeholder="123-45678901" required className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-rose-500 focus:border-rose-500" />
              </div>
              <div>
                <label htmlFor="hawb" className="block text-sm font-medium text-slate-700">{t('hawb')}</label>
                <input type="text" id="hawb" value={hawb} onChange={(e) => setHawb(e.target.value)} placeholder="HPL-BOGMIA-001" required className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-rose-500 focus:border-rose-500" />
              </div>
            </div>
          </fieldset>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <fieldset className="border border-slate-200 p-4 rounded-md bg-slate-50">
              <legend className="text-sm font-semibold px-2 text-slate-600">{t('origin')}</legend>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700">{t('country')}</label>
                  <p className="mt-1 text-sm text-slate-900 font-semibold">{originCountry}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700">{t('city')}</label>
                  <p className="mt-1 text-sm text-slate-900 font-semibold">{originCity}</p>
                </div>
              </div>
            </fieldset>

            <fieldset className="border border-slate-200 p-4 rounded-md">
              <legend className="text-sm font-semibold px-2 text-slate-600">{t('destination')}</legend>
              <div className="space-y-4">
                <div>
                  <label htmlFor="destination-country" className="block text-sm font-medium text-slate-700">{t('country')}</label>
                  <select id="destination-country" value={destinationCountry} onChange={(e) => setDestinationCountry(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-rose-500 focus:border-rose-500 bg-white">
                    {COUNTRIES.map(c => <option key={c.code} value={c.name}>{c.name}</option>)}
                  </select>
                </div>
                <div>
                  <label htmlFor="destination-city" className="block text-sm font-medium text-slate-700">{t('city')}</label>
                  <input type="text" id="destination-city" value={destinationCity} onChange={(e) => setDestinationCity(e.target.value)} required className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-rose-500 focus:border-rose-500" />
                </div>
              </div>
            </fieldset>
          </div>

          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r-lg">
            <div className="flex">
              <div className="flex-shrink-0">
                <LightBulbIcon className="h-5 w-5 text-yellow-400" aria-hidden="true" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-yellow-800">{t('aiDocsTitle')}</p>
                <div className="mt-2 text-sm text-yellow-700">
                  {isLoadingDocs ? (
                    <div className="flex items-center gap-2">
                        <SpinnerIcon className="w-5 h-5 animate-spin"/>
                        <span>{t('aiDocsLoading')}</span>
                    </div>
                  ) : error ? (
                    <p>{error}</p>
                  ) : (
                    <div className="space-y-2">
                      {suggestedDocs.map(doc => (
                        <div key={doc} className="relative flex items-start">
                          <div className="flex h-6 items-center">
                            <input id={`doc-${doc.replace(/\s+/g, '-')}`} name="suggested-docs" type="checkbox" checked={selectedDocs.includes(doc)} onChange={() => handleDocSelectionChange(doc)} className="h-4 w-4 rounded border-slate-300 text-rose-600 focus:ring-rose-600" />
                          </div>
                          <div className="ml-3 text-sm leading-6">
                            <label htmlFor={`doc-${doc.replace(/\s+/g, '-')}`} className="font-medium text-yellow-800 cursor-pointer">{doc}</label>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </form>
        
        <div className="flex justify-end items-center p-5 border-t border-slate-200 bg-slate-50 rounded-b-lg">
          <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-md shadow-sm hover:bg-slate-50">{t('cancel')}</button>
          <button type="submit" form="new-shipment-form" className="ml-3 px-4 py-2 text-sm font-medium text-white bg-brand-primary-50 border border-transparent rounded-md shadow-sm hover:bg-brand-primary-100">{t('createShipment')}</button>
        </div>
      </div>
    </div>
  );
};
