import React, { useMemo, useRef, useEffect, useState } from 'react';
import type { Shipment, MilestoneStatus } from '../types';
import { MapIcon } from './icons';
import { useLanguage } from '../contexts/LanguageContext';

interface MilestoneMapProps {
    shipment: Shipment;
}

const statusColorMap: Record<MilestoneStatus, string> = {
    'Completed': 'rgb(34 197 94)',      // text-green-500
    'In Progress': 'rgb(59 130 246)',   // text-blue-500
    'Pending': 'rgb(156 163 175)',      // text-slate-400
    'Delayed': 'rgb(239 68 68)',        // text-red-500
    'Requires Action': 'rgb(245 158 11)', // text-amber-500
    'Cancelled': 'rgb(100 116 139)',    // text-slate-500
};

const statusTranslationKeys: Record<MilestoneStatus, string> = {
  'Pending': 'statusPending',
  'In Progress': 'statusInProgress',
  'Completed': 'statusCompleted',
  'Delayed': 'statusDelayed',
  'Requires Action': 'statusRequiresAction',
  'Cancelled': 'statusCancelled',
};

export const MilestoneMap: React.FC<MilestoneMapProps> = ({ shipment }) => {
    const { t } = useLanguage();
    const pathRef = useRef<SVGPathElement>(null);
    const [pathLength, setPathLength] = useState(0);

    useEffect(() => {
        if (pathRef.current) {
            // Delay to ensure DOM is ready for measurement
            const timer = setTimeout(() => {
                if (pathRef.current) {
                    setPathLength(pathRef.current.getTotalLength());
                }
            }, 100);
            return () => clearTimeout(timer);
        }
    }, [shipment.id]); // Re-run if shipment changes

    const milestonePositions = useMemo(() => {
        if (!pathRef.current || pathLength === 0 || !shipment.milestones) return [];
        const positions = [];
        const totalMilestones = shipment.milestones.length;
        if (totalMilestones <= 1) {
             const point = pathRef.current.getPointAtLength(0);
             return [{ x: point.x, y: point.y }];
        }
        for (let i = 0; i < totalMilestones; i++) {
            const point = pathRef.current.getPointAtLength((i / (totalMilestones - 1)) * pathLength);
            positions.push({ x: point.x, y: point.y });
        }
        return positions;
    }, [pathLength, shipment.milestones]);

    const completedMilestones = useMemo(() => shipment.milestones.filter(m => m.status === 'Completed').length, [shipment.milestones]);
    const totalMilestones = shipment.milestones.length;
    
    const progressPercentage = useMemo(() => {
        if (totalMilestones <= 1) return completedMilestones > 0 ? 100 : 0;
        return ((completedMilestones > 0 ? completedMilestones - 1 : 0) / (totalMilestones - 1)) * 100;
    }, [completedMilestones, totalMilestones]);

    const progressDashOffset = pathLength * (1 - (progressPercentage / 100));

    const activeMilestoneIndex = useMemo(() => {
        if (shipment.status === 'Cancelled') return -1;
        let index = shipment.milestones.findIndex(m => ['In Progress', 'Requires Action', 'Delayed'].includes(m.status));
        if (index === -1) {
            index = shipment.milestones.findIndex(m => m.status === 'Pending');
        }
        if (index === -1 && shipment.status === 'Delivered') {
            return shipment.milestones.length - 1;
        }
        return index;
    }, [shipment.milestones, shipment.status]);

    const pathD = "M 60 80 Q 400 20 740 80";

    return (
        <div className="bg-slate-50 border border-slate-200 rounded-lg p-6">
            <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2 mb-4">
                <MapIcon className="w-6 h-6 text-slate-500" />
                {t('shipmentJourney')}
            </h3>
            <div className="relative w-full">
                <svg viewBox="0 0 800 130" className="w-full h-auto overflow-visible">
                    <path
                        ref={pathRef}
                        d={pathD}
                        fill="none"
                        stroke="rgb(203 213 225)"
                        strokeWidth="3"
                        strokeDasharray="5 5"
                    />
                    {pathLength > 0 && (
                        <path
                            d={pathD}
                            fill="none"
                            stroke="rgb(34 197 94)"
                            strokeWidth="3"
                            strokeLinecap="round"
                            strokeDasharray={pathLength}
                            strokeDashoffset={progressDashOffset}
                            style={{ transition: 'stroke-dashoffset 1s ease-in-out' }}
                        />
                    )}

                    {milestonePositions.map(({ x, y }, index) => {
                        const milestone = shipment.milestones[index];
                        const color = statusColorMap[milestone.status] || statusColorMap['Pending'];
                        const isActive = index === activeMilestoneIndex;

                        return (
                            <g key={milestone.name} className="group" style={{ cursor: 'pointer' }}>
                                <circle
                                    cx={x}
                                    cy={y}
                                    r={isActive ? "10" : "7"}
                                    fill={color}
                                    strokeWidth="3"
                                    stroke="rgba(255,255,255,0.8)"
                                    className="transition-all duration-300"
                                />
                                {isActive && (
                                    <circle
                                        cx={x}
                                        cy={y}
                                        r="10"
                                        fill="none"
                                        stroke={color}
                                        strokeWidth="2"
                                    >
                                        <animate
                                            attributeName="r"
                                            from="10"
                                            to="16"
                                            dur="1.5s"
                                            begin="0s"
                                            repeatCount="indefinite"
                                        />
                                        <animate
                                            attributeName="opacity"
                                            from="1"
                                            to="0"
                                            dur="1.5s"
                                            begin="0s"
                                            repeatCount="indefinite"
                                        />
                                    </circle>
                                )}
                                {/* Tooltip using foreignObject for rich HTML content */}
                                <foreignObject x={x - 125} y={y - 100} width="250" height="100" className="opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none duration-300">
                                   <div className="w-full flex justify-center">
                                        <div className="bg-slate-800 text-white text-xs rounded py-1.5 px-3 shadow-lg text-center max-w-xs">
                                            <p className="font-bold">{t(milestone.name)}</p>
                                            <p className="capitalize" style={{ color }}>{t(statusTranslationKeys[milestone.status])}</p>
                                            {milestone.date && <p className="text-slate-300">{milestone.date}</p>}
                                            {milestone.details && <p className="mt-1 text-slate-400 italic">"{milestone.details}"</p>}
                                        </div>
                                    </div>
                                </foreignObject>
                            </g>
                        );
                    })}
                </svg>

                <div className="absolute -bottom-4 left-0 text-center w-28">
                    <p className="text-sm font-bold text-slate-700 truncate">{shipment.origin.city}</p>
                    <p className="text-xs text-slate-500 truncate">{shipment.origin.country}</p>
                </div>
                <div className="absolute -bottom-4 right-0 text-center w-28">
                    <p className="text-sm font-bold text-slate-700 truncate">{shipment.destination.city}</p>
                    <p className="text-xs text-slate-500 truncate">{shipment.destination.country}</p>
                </div>
            </div>
        </div>
    );
};