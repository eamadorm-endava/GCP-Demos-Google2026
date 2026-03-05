import React, { useState, useEffect, useMemo } from 'react';
import type { Shipment, RiskAnalysisResponse } from '../types';
import { getRiskAnalysis } from '../services/geminiService';
import { useLanguage } from '../contexts/LanguageContext';
import { SpinnerIcon, ShieldCheckIcon, ShieldExclamationIcon, ExclamationTriangleIcon, LightBulbIcon } from './icons';

interface RiskAnalysisProps {
    shipment: Shipment;
}

const RiskLevelIndicator: React.FC<{ level: 'Low' | 'Medium' | 'High' }> = ({ level }) => {
    const { t } = useLanguage();
    
    const config = useMemo(() => {
        switch (level) {
            case 'High':
                return {
                    text: t('riskHigh'),
                    icon: <ExclamationTriangleIcon className="w-5 h-5 text-red-400" />,
                    className: 'bg-red-900/30 text-red-400 border-red-800/50',
                };
            case 'Medium':
                return {
                    text: t('riskMedium'),
                    icon: <ShieldExclamationIcon className="w-5 h-5 text-amber-400" />,
                    className: 'bg-amber-900/30 text-amber-400 border-amber-800/50',
                };
            case 'Low':
            default:
                return {
                    text: t('riskLow'),
                    icon: <ShieldCheckIcon className="w-5 h-5 text-green-400" />,
                    className: 'bg-green-900/30 text-green-400 border-green-800/50',
                };
        }
    }, [level, t]);

    return (
        <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-semibold border ${config.className}`}>
            {config.icon}
            <span>{config.text}</span>
        </div>
    );
};

export const RiskAnalysis: React.FC<RiskAnalysisProps> = ({ shipment }) => {
    const { language, t } = useLanguage();
    const [analysis, setAnalysis] = useState<RiskAnalysisResponse | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchAnalysis = async () => {
            setIsLoading(true);
            setError('');
            setAnalysis(null);
            try {
                const result = await getRiskAnalysis(shipment, language);
                setAnalysis(result);
            } catch (err) {
                setError(t('errorRiskAnalysis'));
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchAnalysis();
    }, [shipment, language, t]);

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center p-10 bg-endava-dark/80 rounded-2xl border-2 border-dashed border-white/10">
                <SpinnerIcon className="w-8 h-8 text-endava-blue-40 animate-spin" />
                <p className="mt-4 text-sm font-semibold text-endava-blue-30">{t('riskAnalysisLoading')}</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-10 text-center bg-red-900/20 text-red-400 rounded-2xl border border-red-800/50">
                {error}
            </div>
        );
    }

    if (!analysis) {
        return null; // Should not happen if not loading and no error, but good practice
    }

    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-endava-blue-40 mb-2">{t('riskLevel')}</h3>
                <RiskLevelIndicator level={analysis.riskLevel} />
            </div>

            <div>
                 <h3 className="text-sm font-bold uppercase tracking-wider text-endava-blue-40 mb-3">{t('potentialRisks')}</h3>
                 {analysis.analysisPoints.length > 0 ? (
                    <ul className="space-y-3">
                        {analysis.analysisPoints.map((point, index) => (
                            <li key={index} className="flex items-start gap-3">
                                <LightBulbIcon className="w-5 h-5 text-yellow-500 shrink-0 mt-0.5" />
                                <p className="text-sm text-endava-blue-20">{point}</p>
                            </li>
                        ))}
                    </ul>
                 ) : (
                    <p className="text-sm text-endava-blue-40">{t('noRisksDetected')}</p>
                 )}
            </div>
        </div>
    );
};