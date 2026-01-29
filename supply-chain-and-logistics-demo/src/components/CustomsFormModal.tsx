import React, { useState } from 'react';
import type { Shipment, CustomsDeclaration } from '../types';
import { generateCustomsDeclaration } from '../services/geminiService';
import { useLanguage } from '../contexts/LanguageContext';
import { XMarkIcon, SparklesIcon, SpinnerIcon, ClipboardIcon } from './icons';

interface CustomsFormModalProps {
    shipment: Shipment;
    farmName: string;
    onClose: () => void;
    onSave: (docName: string) => void;
}

export const CustomsFormModal: React.FC<CustomsFormModalProps> = ({ shipment, farmName, onClose, onSave }) => {
    const { t, language } = useLanguage();
    const [formData, setFormData] = useState<CustomsDeclaration>({
        description: '',
        hsCode: '',
        value: 0,
        weight: 0,
        exporter: '',
        importer: '',
        reason: ''
    });
    const [isGenerating, setIsGenerating] = useState(false);
    const [error, setError] = useState('');

    const handleAutoFill = async () => {
        setIsGenerating(true);
        setError('');
        try {
            const result = await generateCustomsDeclaration(shipment, farmName, language);
            setFormData(result);
        } catch (err) {
            console.error(err);
            setError(t('errorGeneratingCustoms'));
        } finally {
            setIsGenerating(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // In a real app, this would generate a PDF and upload it.
        // Here we simulate by just triggering the save callback.
        onSave(`Customs_Declaration_${shipment.id}.pdf`);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
                <div className="flex justify-between items-center p-5 border-b border-slate-200">
                    <h2 className="text-xl font-bold text-slate-800">{t('customsDeclaration')}</h2>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
                        <XMarkIcon className="w-6 h-6" />
                    </button>
                </div>

                <div className="p-5 bg-indigo-50 border-b border-indigo-100 flex items-center justify-between">
                    <div>
                        <h3 className="text-sm font-bold text-indigo-900">{t('aiAssistance')}</h3>
                        <p className="text-xs text-indigo-700">{t('aiCustomsHelperText')}</p>
                    </div>
                    <button
                        onClick={handleAutoFill}
                        disabled={isGenerating}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white text-sm font-semibold rounded-lg shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all disabled:opacity-70"
                    >
                        {isGenerating ? (
                            <>
                                <SpinnerIcon className="w-4 h-4 animate-spin" />
                                {t('generating')}
                            </>
                        ) : (
                            <>
                                <SparklesIcon className="w-4 h-4 text-yellow-300" />
                                {t('autoFillAI')}
                            </>
                        )}
                    </button>
                </div>

                <form id="customs-form" onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">
                    {error && (
                        <div className="p-3 bg-red-50 text-red-700 text-sm rounded-md border border-red-200">
                            {error}
                        </div>
                    )}
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="md:col-span-2">
                             <label className="block text-sm font-medium text-slate-700">{t('commercialDescription')}</label>
                             <textarea 
                                name="description" 
                                value={formData.description} 
                                onChange={handleChange} 
                                required 
                                rows={2}
                                className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                             />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700">{t('hsCode')}</label>
                            <input 
                                type="text" 
                                name="hsCode" 
                                value={formData.hsCode} 
                                onChange={handleChange} 
                                required 
                                className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            />
                             {formData.reason && (
                                <p className="mt-1 text-xs text-slate-500 italic">{formData.reason}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700">{t('totalValue')} (USD)</label>
                            <input 
                                type="number" 
                                name="value" 
                                value={formData.value} 
                                onChange={handleChange} 
                                required 
                                className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            />
                        </div>

                        <div>
                             <label className="block text-sm font-medium text-slate-700">{t('grossWeight')} (KG)</label>
                             <input 
                                type="number" 
                                name="weight" 
                                value={formData.weight} 
                                onChange={handleChange} 
                                required 
                                className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                             />
                        </div>
                        
                         <div>
                            <label className="block text-sm font-medium text-slate-700">{t('exporter')}</label>
                            <input 
                                type="text" 
                                name="exporter" 
                                value={formData.exporter} 
                                onChange={handleChange} 
                                required 
                                className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            />
                        </div>

                         <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-slate-700">{t('importer')}</label>
                            <input 
                                type="text" 
                                name="importer" 
                                value={formData.importer} 
                                onChange={handleChange} 
                                required 
                                className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            />
                        </div>
                    </div>
                </form>

                 <div className="flex justify-end items-center p-5 border-t border-slate-200 bg-slate-50 rounded-b-lg gap-3">
                    <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-md shadow-sm hover:bg-slate-50">{t('cancel')}</button>
                    <button 
                        type="submit" 
                        form="customs-form" 
                        className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700"
                    >
                        <ClipboardIcon className="w-4 h-4"/>
                        {t('saveDeclaration')}
                    </button>
                </div>
            </div>
        </div>
    );
};