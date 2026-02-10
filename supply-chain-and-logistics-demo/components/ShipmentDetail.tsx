import React, { useState } from 'react';
import type { Shipment, Message, MilestoneStatus, Document, ShipmentStatus, User, Farm } from '../types';
import { MilestoneTracker } from './MilestoneTracker';
import { DocumentManager } from './DocumentManager';
import { CollaborationChat } from './CollaborationChat';
import { MilestoneMap } from './MilestoneMap';
import { RiskAnalysis } from './RiskAnalysis';
import { ShipmentSummary } from './ShipmentSummary';
import { InfoIcon, DocumentIcon, ChatIcon, BanIcon, MapPinIcon, ArrowLeftIcon, CalendarDaysIcon, WifiIcon, CubeIcon, ShieldExclamationIcon, FlowerIcon } from './icons';
import { useLanguage } from '../contexts/LanguageContext';

interface ShipmentDetailProps {
  shipment: Shipment;
  farm?: Farm;
  currentUser: User;
  onUpdateMilestone: (shipmentId: string, milestoneName: string, status: MilestoneStatus, details?: string) => void;
  onAddMessage: (shipmentId: string, message: Message) => void;
  onAddDocument: (shipmentId: string, document: Document) => void;
  onCancelShipment: (shipmentId: string) => void;
  onRealtimeUpdate: (shipmentId: string) => void;
  onBack: () => void;
}

type Tab = 'workflow' | 'documents' | 'collaboration' | 'risk';

const statusTranslationKeys: Record<ShipmentStatus, string> = {
  'Pending': 'statusPending',
  'In Transit': 'statusInTransit',
  'Delivered': 'statusDelivered',
  'Delayed': 'statusDelayed',
  'Requires Action': 'statusRequiresAction',
  'Cancelled': 'statusCancelled',
};

const InfoCard: React.FC<{ title: string; icon: React.ReactNode; children: React.ReactNode }> = ({ title, icon, children }) => (
    <div className="bg-brand-sb-shade-90 p-4 rounded-lg border border-brand-sb-shade-80 shadow-sm">
        <div className="flex items-center gap-2 mb-2">
            {icon}
            <h4 className="font-semibold text-sm text-brand-sb-shade-30">{title}</h4>
        </div>
        <div className="text-sm text-brand-primary-300">{children}</div>
    </div>
);


export const ShipmentDetail: React.FC<ShipmentDetailProps> = ({ shipment, farm, currentUser, onUpdateMilestone, onAddMessage, onAddDocument, onCancelShipment, onRealtimeUpdate, onBack }) => {
    const [activeTab, setActiveTab] = useState<Tab>('workflow');
    const [copied, setCopied] = useState<string | null>(null);
    const { t } = useLanguage();
    
    const statusColors: { [key: string]: string } = {
        'In Transit': 'bg-blue-100 text-blue-800',
        'Pending': 'bg-yellow-100 text-yellow-800',
        'Delivered': 'bg-green-100 text-green-800',
        'Delayed': 'bg-red-100 text-red-800',
        'Requires Action': 'bg-amber-100 text-amber-800',
        'Cancelled': 'bg-slate-100 text-slate-500',
    };

    const handleCopy = (text: string, type: string) => {
        navigator.clipboard.writeText(text).then(() => {
            setCopied(type);
            setTimeout(() => setCopied(null), 2000);
        });
    };

    const handleCancel = () => {
        if(window.confirm(t('cancelConfirmation', { id: shipment.id }))) {
            onCancelShipment(shipment.id);
        }
    }
    
    const isActionable = shipment.status !== 'Delivered' && shipment.status !== 'Cancelled';
    const translatedStatus = t(statusTranslationKeys[shipment.status] || shipment.status);

    return (
        <div className="p-4 sm:p-6 bg-brand-primary-200">
            <div className="border-b border-slate-200 pb-4 mb-6">
                <div className="flex justify-between items-start gap-4">
                    <div className="flex-1 flex items-center">
                        <button 
                            onClick={onBack} 
                            className="lg:hidden -ml-2 mr-2 p-2 rounded-full text-slate-500 hover:bg-slate-100 transition-colors"
                            aria-label="Back to shipment list"
                        >
                            <ArrowLeftIcon className="w-6 h-6" />
                        </button>
                        <div className="flex-1">
                            <h2 className="text-xl sm:text-2xl font-bold text-brand-primary-300 truncate" title={shipment.id}>{shipment.id}</h2>
                            <p className="text-sm text-brand-sb-shade-30 truncate">{t('forCustomer', { customer: shipment.customer })}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 sm:gap-4 ml-2 flex-shrink-0">
                        <span className={`px-3 py-1 text-xs sm:text-sm font-medium rounded-full ${statusColors[shipment.status] || 'bg-slate-100 text-slate-800'}`}>
                            {translatedStatus}
                        </span>
                    </div>
                </div>
                
                
                 <div className="mt-4 flex flex-wrap gap-2">
                     {isActionable && (
                        <button onClick={() => onRealtimeUpdate(shipment.id)} className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-md transition-colors">
                            <WifiIcon className="w-4 h-4" />
                            {t('realtimeUpdate')}
                        </button>
                     )}
                    {currentUser.role === 'Manager' && isActionable && (
                        <button onClick={handleCancel} className="inline-flex items-center gap-1.5 text-xs font-semibold text-red-600 hover:text-red-800 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-md transition-colors">
                            <BanIcon className="w-4 h-4" />
                            {t('cancelShipment')}
                        </button>
                    )}
                </div>
            </div>

            <div className="space-y-6">
                 <ShipmentSummary shipment={shipment} />
            
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                     <InfoCard title={t('originFarm')} icon={<FlowerIcon className="w-4 h-4 text-slate-400" />}>
                        <p className="font-medium truncate" title={farm?.name}>{farm?.name || 'N/A'}</p>
                        <p className="text-brand-sb-shade-50">{farm?.originCountry}</p>
                    </InfoCard>
                     <InfoCard title={t('destination')} icon={<MapPinIcon className="w-4 h-4 text-slate-400" />}>
                        <p className="font-medium">{shipment.destination.city}</p>
                        <p className="text-brand-sb-shade-50">{shipment.destination.country}</p>
                    </InfoCard>
                    <InfoCard title={t('edd')} icon={<CalendarDaysIcon className="w-4 h-4 text-slate-400" />}>
                        <p className="font-bold text-lg">{shipment.estimatedDeliveryDate}</p>
                        <p className="text-xs text-brand-sb-shade-50">{t('estimated')}</p>
                    </InfoCard>
                     <InfoCard title={t('commodity')} icon={<CubeIcon className="w-4 h-4 text-slate-400" />}>
                        <p className="font-medium truncate" title={shipment.commodity}>{shipment.commodity}</p>
                    </InfoCard>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="bg-brand-sb-shade-90 border border-brand-sb-shade-80 p-3 rounded-md flex items-center justify-between">
                        <p className="text-xs text-brand-sb-shade-30 font-mono overflow-hidden text-ellipsis whitespace-nowrap">
                            <span className="font-semibold text-brand-primary-300">{t('mawb')}:</span> {shipment.mawb}
                        </p>
                        <button onClick={() => handleCopy(shipment.mawb, 'mawb')} className="ml-4 px-2 py-1 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-md shadow-sm hover:bg-slate-100 transition-colors">
                            {copied === 'mawb' ? t('copied') : t('copyLink')}
                        </button>
                    </div>
                     <div className="bg-brand-sb-shade-90 border border-brand-sb-shade-80 p-3 rounded-md flex items-center justify-between">
                        <p className="text-xs text-brand-sb-shade-30 font-mono overflow-hidden text-ellipsis whitespace-nowrap">
                            <span className="font-semibold text-brand-primary-300">{t('hawb')}:</span> {shipment.hawb}
                        </p>
                        <button onClick={() => handleCopy(shipment.hawb, 'hawb')} className="ml-4 px-2 py-1 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-md shadow-sm hover:bg-slate-100 transition-colors">
                            {copied === 'hawb' ? t('copied') : t('copyLink')}
                        </button>
                    </div>
                </div>

                <div>
                    <div className="border-b border-slate-200">
                        <nav className="-mb-px flex space-x-2 sm:space-x-6 overflow-x-auto" aria-label="Tabs">
                            <TabButton icon={<InfoIcon className="w-5 h-5"/>} label={t('workflow')} isActive={activeTab === 'workflow'} onClick={() => setActiveTab('workflow')} />
                            <TabButton icon={<DocumentIcon className="w-5 h-5"/>} label={t('documents')} isActive={activeTab === 'documents'} onClick={() => setActiveTab('documents')} />
                            <TabButton icon={<ChatIcon className="w-5 h-5"/>} label={t('collaboration')} isActive={activeTab === 'collaboration'} onClick={() => setActiveTab('collaboration')} />
                            <TabButton icon={<ShieldExclamationIcon className="w-5 h-5"/>} label={t('riskAnalysis')} isActive={activeTab === 'risk'} onClick={() => setActiveTab('risk')} />
                        </nav>
                    </div>
                    <div className="mt-6">
                        {activeTab === 'workflow' && (
                            <div className="space-y-8">
                                <MilestoneMap shipment={shipment} />
                                <MilestoneTracker shipment={shipment} onUpdateMilestone={onUpdateMilestone} />
                            </div>
                        )}
                        {activeTab === 'documents' && <DocumentManager shipmentId={shipment.id} documents={shipment.documents} onAddDocument={onAddDocument} />}
                        {activeTab === 'collaboration' && <CollaborationChat shipment={shipment} currentUser={currentUser} onAddMessage={onAddMessage}/>}
                        {activeTab === 'risk' && <RiskAnalysis shipment={shipment} />}
                    </div>
                </div>
            </div>
        </div>
    );
};


const TabButton: React.FC<{icon: React.ReactNode, label: string, isActive: boolean, onClick: () => void}> = ({icon, label, isActive, onClick}) => {
    return (
        <button
            onClick={onClick}
            className={`
                ${isActive
                    ? 'border-rose-500 text-brand-primary-50'
                    : 'border-transparent text-brand-sb-shade-50 hover:text-brand-sb-shade-60 hover:border-slate-300'
                }
                whitespace-nowrap py-4 px-1 sm:px-2 border-b-2 font-medium text-sm transition-colors duration-150 inline-flex items-center gap-2
            `}
        >
            {icon}
            {label}
        </button>
    )
}
