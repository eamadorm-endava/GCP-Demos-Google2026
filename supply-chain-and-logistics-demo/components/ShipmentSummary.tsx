import React, { useState, useEffect } from 'react';
import type { Shipment, ShipmentSummary as ShipmentSummaryType } from '../types';
import { getShipmentSummary } from '../services/geminiService';
import { useLanguage } from '../contexts/LanguageContext';
import { SpinnerIcon, DocumentTextIcon, LightBulbIcon } from './icons';

interface ShipmentSummaryProps {
    shipment: Shipment;
}

export const ShipmentSummary: React.FC<ShipmentSummaryProps> = ({ shipment }) => {
    const { language, t } = useLanguage();
    const [summary, setSummary] = useState<ShipmentSummaryType | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchSummary = async () => {
            setIsLoading(true);
            setError('');
            setSummary(null);
            try {
                const result = await getShipmentSummary(shipment, language);
                setSummary(result);
            } catch (err) {
                setError(t('summaryError'));
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchSummary();
    }, [shipment, language, t]);

    return (
        <div className="bg-rose-50 border-l-4 border-rose-500 p-4 rounded-r-lg">
            <h3 className="text-sm font-bold uppercase tracking-wider text-rose-800 flex items-center gap-2">
                <DocumentTextIcon className="w-5 h-5" />
                {t('aiSummary')}
            </h3>
            <div className="mt-3 text-sm text-rose-900">
                {isLoading && (
                    <div className="flex items-center gap-2">
                        <SpinnerIcon className="w-5 h-5 animate-spin"/>
                        <span>{t('summaryLoading')}</span>
                    </div>
                )}
                {error && <p>{error}</p>}
                {summary && (
                    <div>
                        <p className="italic">{summary.summary}</p>
                        {summary.highlights && summary.highlights.length > 0 && (
                            <div className="mt-3">
                                <h4 className="font-semibold text-xs text-rose-800">{t('keyHighlights')}:</h4>
                                <ul className="mt-1 space-y-1">
                                    {summary.highlights.map((item, index) => (
                                        <li key={index} className="flex items-start gap-2">
                                            <LightBulbIcon className="w-4 h-4 text-yellow-500 shrink-0 mt-0.5" />
                                            <span>{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};