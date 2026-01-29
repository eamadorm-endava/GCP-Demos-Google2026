import React from 'react';
import type { Shipment, MilestoneStatus, MilestoneName } from '../types';
import { CheckCircleIcon, ClockIcon, PlayCircleIcon, ExclamationCircleIcon, ExclamationTriangleIcon, BanIcon } from './icons';
import { useLanguage } from '../contexts/LanguageContext';

interface MilestoneTrackerProps {
  shipment: Shipment;
  onUpdateMilestone: (shipmentId: string, milestoneName: MilestoneName, status: MilestoneStatus, details?: string) => void;
}

const statusConfig: { [key in MilestoneStatus]: { icon: React.ReactNode; color: string; text: string; translationKey: string; } } = {
    'Completed': { icon: <CheckCircleIcon className="w-6 h-6" />, color: 'bg-green-500', text: 'text-green-600', translationKey: 'statusCompleted' },
    'In Progress': { icon: <PlayCircleIcon className="w-6 h-6" />, color: 'bg-blue-500', text: 'text-blue-600', translationKey: 'statusInProgress' },
    'Pending': { icon: <ClockIcon className="w-6 h-6" />, color: 'bg-slate-400', text: 'text-slate-500', translationKey: 'statusPending' },
    'Delayed': { icon: <ExclamationCircleIcon className="w-6 h-6" />, color: 'bg-red-500', text: 'text-red-600', translationKey: 'statusDelayed' },
    'Requires Action': { icon: <ExclamationTriangleIcon className="w-6 h-6" />, color: 'bg-amber-500', text: 'text-amber-600', translationKey: 'statusRequiresAction' },
    'Cancelled': { icon: <BanIcon className="w-6 h-6" />, color: 'bg-slate-300', text: 'text-slate-400 line-through', translationKey: 'statusCancelled' },
};

export const MilestoneTracker: React.FC<MilestoneTrackerProps> = ({ shipment, onUpdateMilestone }) => {
  const { t } = useLanguage();

  const handleDelay = (milestoneName: MilestoneName) => {
    const reason = prompt(t('promptDelayReason'));
    if (reason && reason.trim() !== '') {
      onUpdateMilestone(shipment.id, milestoneName, 'Delayed', reason);
    }
  };

  const isShipmentCancelled = shipment.status === 'Cancelled';

  return (
    <div className="flow-root">
      <ul className="-mb-8">
        {shipment.milestones.map((milestone, milestoneIdx) => (
          <li key={milestone.name}>
            <div className="relative pb-8">
              {milestoneIdx !== shipment.milestones.length - 1 ? (
                <span className="absolute left-4 top-4 -ml-px h-full w-0.5 bg-slate-200" aria-hidden="true" />
              ) : null}
              <div className="relative flex items-start space-x-4">
                <div>
                  <span className={`h-8 w-8 rounded-full flex items-center justify-center text-white ${statusConfig[milestone.status].color}`}>
                    {statusConfig[milestone.status].icon}
                  </span>
                </div>
                <div className="min-w-0 flex-1 pt-1.5">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className={`text-sm font-semibold ${statusConfig[milestone.status].text}`}>
                                {t(milestone.name)}
                            </p>
                            <p className="text-xs text-slate-500">
                                {milestone.date 
                                    ? t('completedOn', { date: milestone.date }) 
                                    : t(statusConfig[milestone.status].translationKey)}
                            </p>
                            {milestone.details && (
                                <div className="mt-2 p-3 text-xs text-slate-700 bg-slate-100 rounded-md border border-slate-200">
                                    <p><strong>{t('details')}:</strong> {milestone.details}</p>
                                </div>
                            )}
                        </div>
                        <div className="flex gap-2 shrink-0 ml-4">
                            {milestone.status === 'Pending' && !isShipmentCancelled && (
                                <button
                                onClick={() => onUpdateMilestone(shipment.id, milestone.name, 'In Progress')}
                                className="px-3 py-1 text-xs font-semibold text-white bg-blue-500 rounded-md hover:bg-blue-600 transition"
                                >
                                {t('start')}
                                </button>
                            )}
                            {milestone.status === 'In Progress' && !isShipmentCancelled && (
                               <>
                                    <button
                                    onClick={() => onUpdateMilestone(shipment.id, milestone.name, 'Completed')}
                                    className="px-3 py-1 text-xs font-semibold text-white bg-green-500 rounded-md hover:bg-green-600 transition"
                                    >
                                    {t('complete')}
                                    </button>
                                     <button
                                    onClick={() => handleDelay(milestone.name)}
                                    className="px-3 py-1 text-xs font-semibold text-white bg-red-500 rounded-md hover:bg-red-600 transition"
                                    >
                                    {t('delay')}
                                    </button>
                                </>
                            )}
                             {milestone.status === 'Requires Action' && !isShipmentCancelled && (
                                <button
                                onClick={() => onUpdateMilestone(shipment.id, milestone.name, 'In Progress')}
                                className="px-3 py-1 text-xs font-semibold text-white bg-green-500 rounded-md hover:bg-green-600 transition"
                                >
                                {t('resolveIssue')}
                                </button>
                            )}
                        </div>
                    </div>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};
