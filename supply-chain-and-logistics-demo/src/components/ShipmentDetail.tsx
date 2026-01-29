import React, { useState } from 'react';
import type { Shipment, Message, MilestoneStatus, Document, ShipmentStatus, User, Farm } from '../types';
import { MilestoneTracker } from './MilestoneTracker';
import { DocumentManager } from './DocumentManager';
import { CollaborationChat } from './CollaborationChat';
import { MilestoneMap } from './MilestoneMap';
import { RiskAnalysis } from './RiskAnalysis';
import { ShipmentSummary } from './ShipmentSummary';
import { CustomsFormModal } from './CustomsFormModal';
import { InfoIcon, DocumentIcon, ChatIcon, CurrencyDollarIcon, BanIcon, ClipboardIcon, CheckCircleIcon, MapPinIcon, UsersIcon, ShieldExclamationIcon, ArrowLeftIcon, CalendarDaysIcon, WifiIcon, ClipboardDocumentCheckIcon } from './icons';
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
    <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
        <div className="flex items-center gap-2 mb-2">
            {icon}
            <h4 className="font-semibold text-sm text-slate-600">{title}</h4>
        </div>
        <div className="text-sm text-slate-800">{children}</div>
    </div>
);


export const ShipmentDetail: React.FC<ShipmentDetailProps> = ({ shipment, farm, currentUser, onUpdateMilestone, onAddMessage, onAddDocument, onCancelShipment, onRealtimeUpdate, onBack }) => {
    const [activeTab, setActiveTab] = useState<Tab>('workflow');
    const [copied, setCopied] = useState(false);
    const [isCustomsModalOpen, setIsCustomsModalOpen] = useState(false);
    const { t } = useLanguage();
    
    const statusColors: { [key: string]: string } = {
        'In Transit': 'bg-blue-100 text-blue-800',
        'Pending': 'bg-yellow-100 text-yellow-800',
        'Delivered': 'bg-green-100 text-green-800',
        'Delayed': 'bg-red-100 text-red-800',
        'Requires Action': 'bg-amber-100 text-amber-800',
        'Cancelled': 'bg-slate-100 text-slate-500',
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(shipment.trackingUrl).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    };

    const handleCancel = () => {
        if(window.confirm(t('cancelConfirmation', { id: shipment.id }))) {
            onCancelShipment(shipment.id);
        }
    }
    
    const handleSaveCustomsDeclaration = (docName: string) => {
        const newDocument: Document = {
            id: `doc-customs-${Date.now()}`,
            name: docName,
            url: '#',
            uploadedAt: new Date().toISOString().split('T')[0],
        };
        onAddDocument(shipment.id, newDocument);
        alert(t('declarationSaved'));
        setActiveTab('documents');
    }

    const isActionable = shipment.status !== 'Delivered' && shipment.status !== 'Cancelled';
    const translatedStatus = t(statusTranslationKeys[shipment.status] || shipment.status);

    return (
        <div className="p-4 sm:p-6">
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
                            <h2 className="text-xl sm:text-2xl font-bold text-slate-800 truncate" title={shipment.id}>{shipment.id}</h2>
                            <p className="text-sm text-slate-500 truncate">{t('forCustomer', { customer: shipment.customer })}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 sm:gap-4 ml-2 flex-shrink-0">
                        <span className={`px-3 py-1 text-xs sm:text-sm font-medium rounded-full ${statusColors[shipment.status] || 'bg-slate-100 text-slate-800'}`}>
                            {translatedStatus}
                        </span>
                    </div>
                </div>
                
                {isActionable && (
                 <div className="mt-4 flex flex-wrap gap-2">
                     <button onClick={() => onRealtimeUpdate(shipment.id)} className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-md transition-colors">
                        <WifiIcon className="w-4 h-4" />
                        {t('realtimeUpdate')}
                    </button>
                    {currentUser.role === 'Manager' && (
                        <button onClick={() => setIsCustomsModalOpen(true)} className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-md transition-colors">
                            <ClipboardDocumentCheckIcon className="w-4 h-4" />
                            {t('generateCustoms')}
                        </button>
                    )}
                    {currentUser.role === 'Manager' && (
                        <button onClick={handleCancel} className="inline-flex items-center gap-1.5 text-xs font-semibold text-red-600 hover:text-red-800 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-md transition-colors">
                            <BanIcon className="w-4 h-4" />
                            {t('cancelShipment')}
                        </button>
                    )}
                </div>
                )}
            </div>

            <div className="space-y-6">
                 <ShipmentSummary shipment={shipment} />
            
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                     <InfoCard title={t('origin')} icon={<MapPinIcon className="w-4 h-4 text-slate-400" />}>
                        <p className="font-medium">{shipment.origin.city}</p>
                        <p className="text-slate-500">{shipment.origin.country}</p>
                    </InfoCard>
                     <InfoCard title={t('destination')} icon={<MapPinIcon className="w-4 h-4 text-slate-400" />}>
                        <p className="font-medium">{shipment.destination.city}</p>
                        <p className="text-slate-500">{shipment.destination.country}</p>
                    </InfoCard>
                    <InfoCard title={t('edd')} icon={<CalendarDaysIcon className="w-4 h-4 text-slate-400" />}>
                        <p className="font-bold text-lg">{shipment.estimatedDeliveryDate}</p>
                        <p className="text-xs text-slate-500">{t('estimated')}</p>
                    </InfoCard>
                    <InfoCard title={t('totalCost')} icon={<CurrencyDollarIcon className="w-4 h-4 text-slate-400" />}>
                        <p className="font-bold text-lg">${shipment.cost.total.toLocaleString()}</p>
                        <p className="text-xs text-slate-500" title={`Freight: $${shipment.cost.freight}, Insurance: $${shipment.cost.insurance}, Customs: $${shipment.cost.customs}`}>{t('viewBreakdown')}</p>
                    </InfoCard>
                </div>
                
                <div className="bg-slate-50 border border-slate-200 p-3 rounded-md flex items-center justify-between">
                    <p className="text-xs text-slate-600 font-mono overflow-hidden text-ellipsis whitespace-nowrap">
                        <span className="font-semibold text-slate-800">{t('tracking')}:</span> {shipment.trackingUrl}
                    </p>
                    <button onClick={handleCopy} className="ml-4 px-3 py-1 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-md shadow-sm hover:bg-slate-100 transition-colors flex items-center gap-1.5">
                        {copied ? <CheckCircleIcon className="w-4 h-4 text-green-500" /> : <ClipboardIcon className="w-4 h-4" />}
                        {copied ? t('copied') : t('copyLink')}
                    </button>
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
             {isCustomsModalOpen && (
                <CustomsFormModal 
                    shipment={shipment} 
                    farmName={farm?.name || 'Unknown Farm'}
                    onClose={() => setIsCustomsModalOpen(false)} 
                    onSave={handleSaveCustomsDeclaration} 
                />
            )}
        </div>
    );
};


const TabButton: React.FC<{icon: React.ReactNode, label: string, isActive: boolean, onClick: () => void}> = ({icon, label, isActive, onClick}) => {
    return (
        <button
            onClick={onClick}
            className={`
                ${isActive
                    ? 'border-rose-500 text-rose-600'
                    : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                }
                whitespace-nowrap py-4 px-1 sm:px-2 border-b-2 font-medium text-sm transition-colors duration-150 inline-flex items-center gap-2
            `}
        >
            {icon}
            {label}
        </button>
    )
}