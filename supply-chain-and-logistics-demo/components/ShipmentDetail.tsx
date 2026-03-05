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
    <div className="bg-endava-blue-90/50 backdrop-blur-sm p-4 rounded-2xl border border-white/10 shadow-lg shadow-black\/40">
        <div className="flex items-center gap-2 mb-2">
            {icon}
            <h4 className="font-semibold text-sm text-endava-blue-30">{title}</h4>
        </div>
        <div className="text-sm text-white">{children}</div>
    </div>
);


export const ShipmentDetail: React.FC<ShipmentDetailProps> = ({ shipment, farm, currentUser, onUpdateMilestone, onAddMessage, onAddDocument, onCancelShipment, onRealtimeUpdate, onBack }) => {
    const [activeTab, setActiveTab] = useState<Tab>('workflow');
    const [copied, setCopied] = useState<string | null>(null);
    const { t } = useLanguage();
    
    const statusColors: { [key: string]: string } = {
        'In Transit': 'bg-blue-900/30 text-blue-400',
        'Pending': 'bg-yellow-900/30 text-yellow-400',
        'Delivered': 'bg-green-900/30 text-green-400',
        'Delayed': 'bg-red-900/30 text-red-400',
        'Requires Action': 'bg-amber-900/30 text-amber-400',
        'Cancelled': 'bg-endava-blue-80 text-endava-blue-40',
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
        <div className="p-4 sm:p-6">
            <div className="border-b border-white/10 pb-4 mb-6">
                <div className="flex justify-between items-start gap-4">
                    <div className="flex-1 flex items-center">
                        <button 
                            onClick={onBack} 
                            className="lg:hidden -ml-2 mr-2 p-2 rounded-full text-endava-blue-40 hover:bg-endava-blue-70 transition-colors"
                            aria-label="Back to shipment list"
                        >
                            <ArrowLeftIcon className="w-6 h-6" />
                        </button>
                        <div className="flex-1">
                            <h2 className="text-xl sm:text-2xl font-bold text-white truncate" title={shipment.id}>{shipment.id}</h2>
                            <p className="text-sm text-endava-blue-40 truncate">{t('forCustomer', { customer: shipment.customer })}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 sm:gap-4 ml-2 flex-shrink-0">
                        <span className={`px-3 py-1 text-xs sm:text-sm font-medium rounded-full ${statusColors[shipment.status] || 'bg-endava-blue-80 text-white'}`}>
                            {translatedStatus}
                        </span>
                    </div>
                </div>
                
                
                 <div className="mt-4 flex flex-wrap gap-2">
                     {isActionable && (
                        <button onClick={() => onRealtimeUpdate(shipment.id)} className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-400 hover:text-blue-400 bg-blue-900/20 hover:bg-blue-900/30 px-3 py-1.5 rounded-md transition-colors">
                            <WifiIcon className="w-4 h-4" />
                            {t('realtimeUpdate')}
                        </button>
                     )}
                    {currentUser.role === 'Manager' && isActionable && (
                        <button onClick={handleCancel} className="inline-flex items-center gap-1.5 text-xs font-semibold text-red-400 hover:text-red-400 bg-red-900/20 hover:bg-red-900/30 px-3 py-1.5 rounded-md transition-colors">
                            <BanIcon className="w-4 h-4" />
                            {t('cancelShipment')}
                        </button>
                    )}
                </div>
            </div>

            <div className="space-y-6">
                 <ShipmentSummary shipment={shipment} />
            
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                     <InfoCard title={t('originFarm')} icon={<FlowerIcon className="w-4 h-4 text-endava-blue-40" />}>
                        <p className="font-medium truncate" title={farm?.name}>{farm?.name || 'N/A'}</p>
                        <p className="text-endava-blue-40">{farm?.originCountry}</p>
                    </InfoCard>
                     <InfoCard title={t('destination')} icon={<MapPinIcon className="w-4 h-4 text-endava-blue-40" />}>
                        <p className="font-medium">{shipment.destination.city}</p>
                        <p className="text-endava-blue-40">{shipment.destination.country}</p>
                    </InfoCard>
                    <InfoCard title={t('edd')} icon={<CalendarDaysIcon className="w-4 h-4 text-endava-blue-40" />}>
                        <p className="font-bold text-lg">{shipment.estimatedDeliveryDate}</p>
                        <p className="text-xs text-endava-blue-40">{t('estimated')}</p>
                    </InfoCard>
                     <InfoCard title={t('commodity')} icon={<CubeIcon className="w-4 h-4 text-endava-blue-40" />}>
                        <p className="font-medium truncate" title={shipment.commodity}>{shipment.commodity}</p>
                    </InfoCard>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="bg-endava-dark/80 border border-white/10 p-3 rounded-md flex items-center justify-between">
                        <p className="text-xs text-endava-blue-30 font-mono overflow-hidden text-ellipsis whitespace-nowrap">
                            <span className="font-semibold text-white">{t('mawb')}:</span> {shipment.mawb}
                        </p>
                        <button onClick={() => handleCopy(shipment.mawb, 'mawb')} className="ml-4 px-2 py-1 text-xs font-semibold text-endava-blue-20 bg-endava-blue-90/50 backdrop-blur-sm border border-white/5 rounded-md shadow-lg shadow-black\/40 hover:bg-endava-blue-70 transition-colors">
                            {copied === 'mawb' ? t('copied') : t('copyLink')}
                        </button>
                    </div>
                     <div className="bg-endava-dark/80 border border-white/10 p-3 rounded-md flex items-center justify-between">
                        <p className="text-xs text-endava-blue-30 font-mono overflow-hidden text-ellipsis whitespace-nowrap">
                            <span className="font-semibold text-white">{t('hawb')}:</span> {shipment.hawb}
                        </p>
                        <button onClick={() => handleCopy(shipment.hawb, 'hawb')} className="ml-4 px-2 py-1 text-xs font-semibold text-endava-blue-20 bg-endava-blue-90/50 backdrop-blur-sm border border-white/5 rounded-md shadow-lg shadow-black\/40 hover:bg-endava-blue-70 transition-colors">
                            {copied === 'hawb' ? t('copied') : t('copyLink')}
                        </button>
                    </div>
                </div>

                <div>
                    <div className="border-b border-white/10">
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
                    ? 'border-endava-orange text-endava-orange'
                    : 'border-transparent text-endava-blue-40 hover:text-endava-blue-20 hover:border-white/5'
                }
                whitespace-nowrap py-4 px-1 sm:px-2 border-b-2 font-medium text-sm transition-colors duration-150 inline-flex items-center gap-2
            `}
        >
            {icon}
            {label}
        </button>
    )
}
