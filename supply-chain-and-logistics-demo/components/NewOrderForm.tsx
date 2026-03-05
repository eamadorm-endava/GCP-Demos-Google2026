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
    <div className="modal-backdrop">
      <div className="bg-endava-blue-90/50 backdrop-blur-sm rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col border border-white/10">
        <div className="flex justify-between items-center p-5 border-b border-white/10">
          <h2 className="text-xl font-bold text-white">{t('createNewShipment')}</h2>
          <button onClick={onClose} className="text-endava-blue-40 hover:text-endava-blue-30">
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        <form id="new-shipment-form" onSubmit={handleSubmit} className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-6">
          <fieldset className="border border-white/10 p-4 rounded-md">
            <legend className="text-sm font-semibold px-2 text-endava-blue-30">{t('bookingDetails')}</legend>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="customer" className="block text-sm font-medium text-endava-blue-20">{t('customerName')}</label>
                <input type="text" id="customer" value={customer} onChange={(e) => setCustomer(e.target.value)} required className="mt-1 block w-full px-3 py-2 border border-white/5 rounded-md shadow-lg shadow-black\/40 focus:outline-none focus:ring-endava-orange focus:border-endava-orange" />
              </div>
              <div>
                <label htmlFor="farm" className="block text-sm font-medium text-endava-blue-20">{t('originFarm')}</label>
                <select id="farm" value={farmId} onChange={(e) => setFarmId(e.target.value)} required className="mt-1 block w-full px-3 py-2 border border-white/5 rounded-md shadow-lg shadow-black\/40 focus:outline-none focus:ring-endava-orange focus:border-endava-orange bg-endava-blue-90/50 backdrop-blur-sm">
                  <option value="" disabled>{t('selectFarm')}</option>
                  {farms.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
                </select>
              </div>
              <div>
                <label htmlFor="commodity" className="block text-sm font-medium text-endava-blue-20">{t('commodity')}</label>
                <input type="text" id="commodity" value={commodity} onChange={(e) => setCommodity(e.target.value)} required className="mt-1 block w-full px-3 py-2 border border-white/5 rounded-md shadow-lg shadow-black\/40 focus:outline-none focus:ring-endava-orange focus:border-endava-orange" />
              </div>
              <div>
                <label htmlFor="edd" className="block text-sm font-medium text-endava-blue-20">{t('edd')}</label>
                <input type="date" id="edd" value={estimatedDeliveryDate} onChange={(e) => setEstimatedDeliveryDate(e.target.value)} required className="mt-1 block w-full px-3 py-2 border border-white/5 rounded-md shadow-lg shadow-black\/40 focus:outline-none focus:ring-endava-orange focus:border-endava-orange" />
              </div>
              <div>
                <label htmlFor="mawb" className="block text-sm font-medium text-endava-blue-20">{t('mawb')}</label>
                <input type="text" id="mawb" value={mawb} onChange={(e) => setMawb(e.target.value)} placeholder="123-45678901" required className="mt-1 block w-full px-3 py-2 border border-white/5 rounded-md shadow-lg shadow-black\/40 focus:outline-none focus:ring-endava-orange focus:border-endava-orange" />
              </div>
              <div>
                <label htmlFor="hawb" className="block text-sm font-medium text-endava-blue-20">{t('hawb')}</label>
                <input type="text" id="hawb" value={hawb} onChange={(e) => setHawb(e.target.value)} placeholder="HPL-BOGMIA-001" required className="mt-1 block w-full px-3 py-2 border border-white/5 rounded-md shadow-lg shadow-black\/40 focus:outline-none focus:ring-endava-orange focus:border-endava-orange" />
              </div>
            </div>
          </fieldset>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <fieldset className="border border-white/10 p-4 rounded-md bg-endava-dark/80">
              <legend className="text-sm font-semibold px-2 text-endava-blue-30">{t('origin')}</legend>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-endava-blue-20">{t('country')}</label>
                  <p className="mt-1 text-sm text-white font-semibold">{originCountry}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-endava-blue-20">{t('city')}</label>
                  <p className="mt-1 text-sm text-white font-semibold">{originCity}</p>
                </div>
              </div>
            </fieldset>

            <fieldset className="border border-white/10 p-4 rounded-md">
              <legend className="text-sm font-semibold px-2 text-endava-blue-30">{t('destination')}</legend>
              <div className="space-y-4">
                <div>
                  <label htmlFor="destination-country" className="block text-sm font-medium text-endava-blue-20">{t('country')}</label>
                  <select id="destination-country" value={destinationCountry} onChange={(e) => setDestinationCountry(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-white/5 rounded-md shadow-lg shadow-black\/40 focus:outline-none focus:ring-endava-orange focus:border-endava-orange bg-endava-blue-90/50 backdrop-blur-sm">
                    {COUNTRIES.map(c => <option key={c.code} value={c.name}>{c.name}</option>)}
                  </select>
                </div>
                <div>
                  <label htmlFor="destination-city" className="block text-sm font-medium text-endava-blue-20">{t('city')}</label>
                  <input type="text" id="destination-city" value={destinationCity} onChange={(e) => setDestinationCity(e.target.value)} required className="mt-1 block w-full px-3 py-2 border border-white/5 rounded-md shadow-lg shadow-black\/40 focus:outline-none focus:ring-endava-orange focus:border-endava-orange" />
                </div>
              </div>
            </fieldset>
          </div>

          <div className="ai-suggestion-box">
            <div className="flex">
              <div className="flex-shrink-0">
                <LightBulbIcon className="h-5 w-5 text-yellow-400" aria-hidden="true" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-yellow-400">{t('aiDocsTitle')}</p>
                <div className="mt-2 text-sm text-yellow-400">
                  {isLoadingDocs ? (
                    <div className="flex items-center gap-2">
                      <SpinnerIcon className="w-5 h-5 animate-spin" />
                      <span>{t('aiDocsLoading')}</span>
                    </div>
                  ) : error ? (
                    <p>{error}</p>
                  ) : (
                    <div className="space-y-2">
                      {suggestedDocs.map(doc => (
                        <div key={doc} className="relative flex items-start">
                          <div className="flex h-6 items-center">
                            <input id={`doc-${doc.replace(/\s+/g, '-')}`} name="suggested-docs" type="checkbox" checked={selectedDocs.includes(doc)} onChange={() => handleDocSelectionChange(doc)} className="h-4 w-4 rounded border-white/5 text-endava-orange focus:ring-rose-600" />
                          </div>
                          <div className="ml-3 text-sm leading-6">
                            <label htmlFor={`doc-${doc.replace(/\s+/g, '-')}`} className="font-medium text-amber-400 cursor-pointer">{doc}</label>
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

        <div className="flex justify-end items-center p-5 border-t border-white/10 bg-endava-dark/80 rounded-b-lg">
          <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-endava-blue-20 bg-endava-blue-90/50 backdrop-blur-sm border border-white/5 rounded-md shadow-lg shadow-black\/40 hover:bg-white/5">{t('cancel')}</button>
          <button type="submit" form="new-shipment-form" className="ml-3 px-4 py-2 text-sm font-medium text-white bg-endava-orange border border-transparent rounded-md shadow-lg shadow-black\/40 hover:bg-rose-700">{t('createShipment')}</button>
        </div>
      </div>
    </div>
  );
};
