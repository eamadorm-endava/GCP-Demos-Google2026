import React from 'react';
import type { Farm, FarmStatus, User } from '../types';
import { useLanguage } from '../contexts/LanguageContext';
import { CheckCircleIcon, ClockIcon, XCircleIcon, BanIcon, DocumentCheckIcon, DocumentMinusIcon, BuildingOfficeIcon, UserCircleIcon, ArrowLeftIcon } from './icons';

interface FarmDetailProps {
    farm: Farm;
    user: User;
    onUpdateStatus: (farmId: string, status: 'Approved' | 'Rejected') => void;
    onUpdateDocumentStatus: (farmId: string, docName: string, uploaded: boolean) => void;
    onBack: () => void;
}

const statusConfig: { [key in FarmStatus]: { icon: React.ReactNode; color: string; translationKey: string; } } = {
    'Approved': { icon: <CheckCircleIcon className="w-5 h-5" />, color: 'text-green-600 bg-green-100', translationKey: 'statusApproved' },
    'Pending Review': { icon: <ClockIcon className="w-5 h-5" />, color: 'text-yellow-600 bg-yellow-100', translationKey: 'statusPendingReview' },
    'Rejected': { icon: <XCircleIcon className="w-5 h-5" />, color: 'text-red-600 bg-red-100', translationKey: 'statusRejected' },
};

export const FarmDetail: React.FC<FarmDetailProps> = ({ farm, user, onUpdateStatus, onUpdateDocumentStatus, onBack }) => {
    const { t } = useLanguage();
    const config = statusConfig[farm.status];

    const handleApprove = () => {
        if (window.confirm(`Are you sure you want to approve the farm "${farm.name}"?`)) {
            onUpdateStatus(farm.id, 'Approved');
        }
    };
    
    const handleReject = () => {
        if (window.confirm(`Are you sure you want to reject the farm "${farm.name}"? This action may impact active shipments.`)) {
            onUpdateStatus(farm.id, 'Rejected');
        }
    };

    return (
        <div className="p-4 sm:p-6">
            <div className="border-b border-slate-200 pb-4 mb-6">
                <div className="flex justify-between items-start gap-4">
                     <div className="flex-1 flex items-center">
                        <button 
                            onClick={onBack} 
                            className="lg:hidden -ml-2 mr-2 p-2 rounded-full text-slate-500 hover:bg-slate-100 transition-colors"
                            aria-label="Back to farm list"
                        >
                            <ArrowLeftIcon className="w-6 h-6" />
                        </button>
                        <h2 className="text-2xl font-bold text-brand-primary-300">{farm.name}</h2>
                    </div>
                    <span className={`inline-flex items-center gap-2 px-3 py-1 text-sm font-medium rounded-full ${config.color}`}>
                        {config.icon}
                        {t(config.translationKey)}
                    </span>
                </div>
                 {user.role === 'Manager' && farm.status === 'Pending Review' && (
                     <div className="mt-4 flex gap-2 pl-10 lg:pl-0">
                        <button onClick={handleApprove} className="inline-flex items-center gap-1.5 text-xs font-semibold text-white bg-green-600 hover:bg-green-700 px-3 py-1.5 rounded-md transition-colors">
                            <CheckCircleIcon className="w-4 h-4"/>
                            {t('approve')}
                        </button>
                         <button onClick={handleReject} className="inline-flex items-center gap-1.5 text-xs font-semibold text-white bg-red-600 hover:bg-red-700 px-3 py-1.5 rounded-md transition-colors">
                            <BanIcon className="w-4 h-4"/>
                            {t('reject')}
                        </button>
                    </div>
                 )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                    <InfoSection icon={<UserCircleIcon className="w-5 h-5 text-brand-primary-300"/>} title={t('contactInfo')}>
                        <p><span className="font-semibold">{t('name')}:</span> {farm.contact.name}</p>
                        <p><span className="font-semibold">{t('email')}:</span> <a href={`mailto:${farm.contact.email}`} className="text-brand-primary-50 hover:underline">{farm.contact.email}</a></p>
                    </InfoSection>
                     <InfoSection icon={<BuildingOfficeIcon className="w-5 h-5 text-brand-primary-300"/>} title={t('address')}>
                        <p>{farm.address.line1}</p>
                        <p>{farm.address.municipality}, {farm.originCountry}</p>
                        {farm.address.postalCode && <p>{t('postalCode')}: {farm.address.postalCode}</p>}
                    </InfoSection>
                </div>
                <div>
                     <InfoSection icon={<DocumentCheckIcon className="w-5 h-5 text-brand-primary-300"/>} title={t('requiredDocs', { country: farm.originCountry })}>
                         <ul className="divide-y divide-slate-200 border border-brand-sb-shade-80 rounded-md mt-2">
                            {/* FIX: Explicitly type docInfo to resolve property access errors on type 'unknown'. */}
                            {Object.entries(farm.registrationDocs).map(([docName, docInfo]: [string, { required: boolean; uploaded: boolean }]) => (
                                <li key={docName} className="flex items-center justify-between p-3">
                                    <p className={`text-sm font-medium ${docInfo.required ? 'text-brand-sb-shade-20' : 'text-brand-sb-shade-60'}`}>
                                        {docName}
                                        {!docInfo.required && <span className="text-xs text-brand-sb-shade-60"> (Optional)</span>}
                                    </p>
                                    <div className="flex items-center gap-2">
                                        {docInfo.uploaded ? (
                                            <span className="inline-flex items-center gap-1.5 text-xs text-green-700">
                                                <DocumentCheckIcon className="w-4 h-4" /> {t('docUploaded')}
                                            </span>
                                        ) : (
                                             <span className={`inline-flex items-center gap-1.5 text-xs ${docInfo.required ? 'text-red-700' : 'text-slate-500'}`}>
                                                <DocumentMinusIcon className="w-4 h-4" /> {t('docMissing')}
                                            </span>
                                        )}
                                        {user.role === 'Manager' && !docInfo.uploaded && farm.status === 'Pending Review' && (
                                            <button 
                                                onClick={() => onUpdateDocumentStatus(farm.id, docName, true)}
                                                className="px-2 py-1 text-xs font-semibold text-slate-600 bg-slate-100 rounded-md hover:bg-slate-200 transition-colors"
                                            >
                                                {t('markUploaded')}
                                            </button>
                                        )}
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </InfoSection>
                </div>
            </div>
        </div>
    );
};

const InfoSection: React.FC<{icon: React.ReactNode, title: string, children: React.ReactNode}> = ({ icon, title, children }) => (
    <div>
        <h3 className="text-lg font-bold text-brand-primary-300 flex items-center gap-2 mb-2">
           {icon}
           {title}
        </h3>
        <div className="text-sm text-brand-sb-shade-20 pl-7 space-y-1">
            {children}
        </div>
    </div>
);