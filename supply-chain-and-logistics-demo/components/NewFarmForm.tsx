import React, { useState } from 'react';
import type { Farm } from '../types';
import { useLanguage } from '../contexts/LanguageContext';
import { XMarkIcon } from './icons';
import { COUNTRIES, FARM_DOCS_BY_COUNTRY } from '../constants';

interface NewFarmFormProps {
    onClose: () => void;
    onRegisterFarm: (farm: Farm) => void;
}

export const NewFarmForm: React.FC<NewFarmFormProps> = ({ onClose, onRegisterFarm }) => {
    const { t } = useLanguage();
    const [farmName, setFarmName] = useState('');
    const [contactName, setContactName] = useState('');
    const [contactEmail, setContactEmail] = useState('');
    const [originCountry, setOriginCountry] = useState<'Colombia' | 'Ecuador' | 'Costa Rica' | 'Honduras'>('Colombia');
    const [addressLine1, setAddressLine1] = useState('');
    const [municipality, setMunicipality] = useState('');
    const [postalCode, setPostalCode] = useState('');
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        const countryDocs = FARM_DOCS_BY_COUNTRY[originCountry] || FARM_DOCS_BY_COUNTRY['default'];
        const registrationDocs = Object.entries(countryDocs).reduce((acc, [docName, { required }]) => {
            acc[docName] = { required, uploaded: false };
            return acc;
        }, {} as Farm['registrationDocs']);

        const newFarm: Farm = {
            id: `FARM-${originCountry.substring(0,3).toUpperCase()}-${Math.random().toString(36).substr(2, 4).toUpperCase()}`,
            name: farmName,
            originCountry,
            contact: {
                name: contactName,
                email: contactEmail,
            },
            address: {
                line1: addressLine1,
                municipality,
                postalCode: postalCode || undefined,
            },
            status: 'Pending Review',
            registrationDocs,
        };
        
        onRegisterFarm(newFarm);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
                <div className="flex justify-between items-center p-5 border-b border-slate-200">
                    <h2 className="text-xl font-bold text-slate-800">{t('registerNewFarm')}</h2>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
                        <XMarkIcon className="w-6 h-6" />
                    </button>
                </div>

                <form id="new-farm-form" onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
                     <fieldset className="border border-slate-200 p-4 rounded-md">
                        <legend className="text-sm font-semibold px-2 text-slate-600">{t('farmInfo')}</legend>
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label htmlFor="farmName" className="block text-sm font-medium text-slate-700">{t('farmName')}</label>
                                <input type="text" id="farmName" value={farmName} onChange={(e) => setFarmName(e.target.value)} required className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-rose-500 focus:border-rose-500" />
                            </div>
                             <div>
                                <label htmlFor="originCountry" className="block text-sm font-medium text-slate-700">{t('country')}</label>
                                <select id="originCountry" value={originCountry} onChange={(e) => setOriginCountry(e.target.value as any)} required className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-rose-500 focus:border-rose-500 bg-white">
                                    <option value="Colombia">Colombia</option>
                                    <option value="Ecuador">Ecuador</option>
                                    <option value="Costa Rica">Costa Rica</option>
                                    <option value="Honduras">Honduras</option>
                                </select>
                            </div>
                        </div>
                    </fieldset>
                    
                     <fieldset className="border border-slate-200 p-4 rounded-md">
                        <legend className="text-sm font-semibold px-2 text-slate-600">{t('contactInfo')}</legend>
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label htmlFor="contactName" className="block text-sm font-medium text-slate-700">{t('contactName')}</label>
                                <input type="text" id="contactName" value={contactName} onChange={(e) => setContactName(e.target.value)} required className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-rose-500 focus:border-rose-500" />
                            </div>
                            <div>
                                <label htmlFor="contactEmail" className="block text-sm font-medium text-slate-700">{t('contactEmail')}</label>
                                <input type="email" id="contactEmail" value={contactEmail} onChange={(e) => setContactEmail(e.target.value)} required className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-rose-500 focus:border-rose-500" />
                            </div>
                        </div>
                    </fieldset>

                     <fieldset className="border border-slate-200 p-4 rounded-md">
                        <legend className="text-sm font-semibold px-2 text-slate-600">{t('address')}</legend>
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                             <div className="md:col-span-2">
                                <label htmlFor="addressLine1" className="block text-sm font-medium text-slate-700">{t('addressLine1')}</label>
                                <input type="text" id="addressLine1" value={addressLine1} onChange={(e) => setAddressLine1(e.target.value)} required className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-rose-500 focus:border-rose-500" />
                            </div>
                            <div>
                                <label htmlFor="municipality" className="block text-sm font-medium text-slate-700">{t('municipality')}</label>
                                <input type="text" id="municipality" value={municipality} onChange={(e) => setMunicipality(e.target.value)} required className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-rose-500 focus:border-rose-500" />
                            </div>
                             <div>
                                <label htmlFor="postalCode" className="block text-sm font-medium text-slate-700">{t('postalCode')}</label>
                                <input type="text" id="postalCode" value={postalCode} onChange={(e) => setPostalCode(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-rose-500 focus:border-rose-500" />
                            </div>
                        </div>
                    </fieldset>

                </form>

                <div className="flex justify-end items-center p-5 border-t border-slate-200 bg-slate-50 rounded-b-lg">
                    <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-md shadow-sm hover:bg-slate-50">{t('cancel')}</button>
                    <button type="submit" form="new-farm-form" className="ml-3 px-4 py-2 text-sm font-medium text-white bg-brand-primary-50 border border-transparent rounded-md shadow-sm hover:bg-brand-primary-100">{t('registerFarm')}</button>
                </div>
            </div>
        </div>
    );
};
