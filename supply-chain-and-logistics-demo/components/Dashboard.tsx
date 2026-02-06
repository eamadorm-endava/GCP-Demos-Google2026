import React, { useMemo } from 'react';
import type { Shipment, Farm, User, MilestoneName } from '../types';
import { CubeIcon, ShieldCheckIcon, ExclamationTriangleIcon, ExclamationCircleIcon, ChartPieIcon, ArrowRightIcon, BanknotesIcon, ChartBarIcon, FlowerIcon, CheckCircleIcon, ClockIcon } from './icons';
import { useLanguage } from '../contexts/LanguageContext';

interface RoleNarrativeProps {
    user: User;
}

const RoleNarrative: React.FC<RoleNarrativeProps> = ({ user }) => {
    const { t } = useLanguage();
    const isManager = user.role === 'Manager';

    const title = isManager ? t('managerWelcomeTitle') : t('specialistWelcomeTitle');
    const body = isManager ? t('managerWelcomeBody') : t('specialistWelcomeBody');

    return (
        <div className="mb-8 bg-brand-sb-shade-90 p-6 rounded-lg shadow-sm border border-brand-sb-shade-80">
            <h1 className="text-2xl font-bold text-brand-primary-300">{title}, {user.name}!</h1>
            <p className="text-brand-primary-300 mt-2">{body}</p>
        </div>
    )
}

interface DashboardProps {
    shipments: Shipment[];
    farms: Farm[];
    user: User;
    onDrilldown: (status: string) => void;
    onSelectShipment: (id: string) => void;
    onNavigateToFarms: (statusFilter: string) => void;
}

const KpiCard: React.FC<{
    title: string;
    value: string;
    icon: React.ReactNode;
    color: string;
    onClick?: () => void;
}> = ({ title, value, icon, color, onClick }) => {
    const clickableStyles = onClick ? 'cursor-pointer hover:bg-brand-sb-shade-10 transition-colors' : '';
    return (
        <div className={`bg-brand-sb-shade-80 p-5 rounded-lg shadow-sm border border-brand-sb-shade-70 flex items-start ${clickableStyles}`} onClick={onClick}>
            <div className={`rounded-full p-3 mr-4 ${color}`}>
                {icon}
            </div>
            <div>
                <p className="text-sm font-medium text-brand-sb-shade-30">{title}</p>
                <p className="text-3xl font-bold text-brand-primary-300">{value}</p>
            </div>
        </div>
    );
};

const AtRiskShipmentItem: React.FC<{ shipment: Shipment; onSelect: (id: string) => void }> = ({ shipment, onSelect }) => {
    const statusConfig = {
        'Delayed': { icon: <ExclamationCircleIcon className="w-5 h-5 text-red-500"/>, color: 'bg-red-100' },
        'Requires Action': { icon: <ExclamationTriangleIcon className="w-5 h-5 text-amber-500"/>, color: 'bg-amber-100' },
    };
    const config = statusConfig[shipment.status as 'Delayed' | 'Requires Action'];

    return (
        <li onClick={() => onSelect(shipment.id)} className="flex items-center justify-between p-3 -m-3 rounded-lg hover:bg-brand-sb-shade-10 transition-colors cursor-pointer">
            <div className="flex items-center gap-3">
                <span className={`p-2 rounded-full ${config.color}`}>
                    {config.icon}
                </span>
                <div>
                    <p className="font-semibold text-sm text-brand-primary-300">{shipment.id}</p>
                    <p className="text-xs text-brand-sb-shade-30">{shipment.customer}</p>
                </div>
            </div>
            <ArrowRightIcon className="w-5 h-5 text-brand-sb-shade-50" />
        </li>
    )
}

const DelayHotspotsChart: React.FC<{ data: { nameKey: string; count: number }[] }> = ({ data }) => {
    const { t } = useLanguage();
    if (data.length === 0) {
        return <p className="text-sm text-slate-500">{t('noDelaysLogged')}</p>
    }
    const maxCount = Math.max(...data.map(d => d.count), 0);

    return (
        <div className="space-y-3">
            {data.map(({ nameKey, count }) => (
                <div key={nameKey} className="group">
                    <div className="flex justify-between items-center text-xs mb-1">
                        <span className="font-semibold text-brand-sb-shade-30">{t(nameKey)}</span>
                        <span className="text-brand-sb-shade-30">{t('delayCount', { count })}</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2.5">
                        <div
                            className="bg-red-400 h-2.5 rounded-full group-hover:bg-red-500 transition-colors"
                            style={{ width: `${(count / maxCount) * 100}%` }}
                        />
                    </div>
                </div>
            ))}
        </div>
    );
}

const TopTradeLanes: React.FC<{ lanes: { lane: string; count: number; onTimePercent: number }[] }> = ({ lanes }) => {
    const { t } = useLanguage();
    if (lanes.length === 0) {
        return <p className="text-sm text-slate-500">{t('notEnoughData')}</p>
    }
    return (
        <ul className="space-y-3">
            {lanes.map(({ lane, count, onTimePercent }) => (
                <li key={lane} className="flex justify-between items-center">
                    <div className="text-sm">
                        <p className="font-semibold text-brand-primary-300">{lane}</p>
                        <p className="text-xs text-brand-sb-shade-50">{t('shipmentCount', { count })}</p>
                    </div>
                    <div className={`text-sm font-bold ${onTimePercent > 90 ? 'text-green-600' : 'text-amber-600'}`}>
                        {onTimePercent}% {t('onTime')}
                    </div>
                </li>
            ))}
        </ul>
    );
}


export const Dashboard: React.FC<DashboardProps> = ({ shipments, farms, user, onDrilldown, onSelectShipment, onNavigateToFarms }) => {
    const { t } = useLanguage();
    const metrics = useMemo(() => {
        const activeShipments = shipments.filter(s => s.status !== 'Cancelled');
        const totalShipments = activeShipments.length;
        const deliveredCount = activeShipments.filter(s => s.status === 'Delivered').length;
        const delayedCount = activeShipments.filter(s => s.status === 'Delayed').length;
        const requiresActionCount = activeShipments.filter(s => s.status === 'Requires Action').length;
        
        const onTimeDelivery = deliveredCount + delayedCount > 0 ? (deliveredCount / (deliveredCount + delayedCount)) * 100 : 100;
        
        const totalLandedCost = activeShipments.reduce((sum, s) => sum + s.cost.total, 0);
        const avgCostPerShipment = totalShipments > 0 ? totalLandedCost / totalShipments : 0;

        const atRiskShipments = shipments
            .filter(s => s.status === 'Requires Action' || s.status === 'Delayed')
            .slice(0, 5);

        const delayHotspots = activeShipments
            .flatMap(s => s.milestones.filter(m => m.status === 'Delayed'))
            .reduce<Record<MilestoneName, number>>((acc, m) => {
                acc[m.name] = (acc[m.name] || 0) + 1;
                return acc;
            }, {});

        const delayHotspotsData = Object.entries(delayHotspots)
            .map(([nameKey, count]) => ({ nameKey: nameKey as MilestoneName, count: count as number }))
            .sort((a, b) => b.count - a.count);

        const tradeLanes = activeShipments.reduce<Record<string, { count: number; onTime: number; delayed: number }>>((acc, s) => {
            const lane = `${s.origin.city} → ${s.destination.city}`;
            if (!acc[lane]) {
                acc[lane] = { count: 0, onTime: 0, delayed: 0 };
            }
            const laneData = acc[lane]!;
            laneData.count++;
            if (s.status === 'Delivered') laneData.onTime++;
            if (s.status === 'Delayed') laneData.delayed++;
            return acc;
        }, {});

        const topTradeLanes = Object.entries(tradeLanes)
            .map(([lane, data]) => ({
                lane,
                count: data.count,
                onTimePercent: data.onTime + data.delayed > 0 ? Math.round((data.onTime / (data.onTime + data.delayed)) * 100) : 100
            }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 4);
            
        const farmMetrics = {
            totalFarms: farms.length,
            approvedFarms: farms.filter(f => f.status === 'Approved').length,
            pendingFarms: farms.filter(f => f.status === 'Pending Review').length,
        };

        return {
            totalShipments,
            onTimeDelivery: onTimeDelivery.toFixed(0),
            delayedCount,
            requiresActionCount,
            atRiskShipments,
            totalLandedCost,
            avgCostPerShipment,
            delayHotspotsData,
            topTradeLanes,
            farmMetrics,
        };
    }, [shipments, farms]);

    return (
        <div className="w-full bg-brand-primary-200 overflow-y-auto p-6 lg:p-8">
            <div className="max-w-7xl mx-auto">
                <RoleNarrative user={user} />

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <KpiCard title={t('activeShipments')} value={metrics.totalShipments.toString()} icon={<CubeIcon className="w-6 h-6 text-slate-500"/>} color="bg-slate-100"/>
                    <KpiCard title={t('onTimeDelivery')} value={`${metrics.onTimeDelivery}%`} icon={<ShieldCheckIcon className="w-6 h-6 text-green-500"/>} color="bg-green-100"/>
                    <KpiCard title={t('requiresAction')} value={metrics.requiresActionCount.toString()} icon={<ExclamationTriangleIcon className="w-6 h-6 text-amber-500"/>} color="bg-amber-100" onClick={() => onDrilldown('Requires Action')} />
                    <KpiCard title={t('delayedShipments')} value={metrics.delayedCount.toString()} icon={<ExclamationCircleIcon className="w-6 h-6 text-red-500"/>} color="bg-red-100" onClick={() => onDrilldown('Delayed')} />
                </div>
                
                <div className="mt-6 bg-brand-sb-shade-90 p-6 rounded-lg shadow-sm border border-brand-sb-shade-80">
                    <h2 className="text-lg font-bold text-brand-primary-300 flex items-center gap-2 mb-4">{t('farmOverview')}</h2>
                     <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <KpiCard title={t('totalFarms')} value={metrics.farmMetrics.totalFarms.toString()} icon={<FlowerIcon className="w-6 h-6 text-rose-500"/>} color="bg-rose-100" onClick={() => onNavigateToFarms('All')} />
                        <KpiCard title={t('approvedFarms')} value={metrics.farmMetrics.approvedFarms.toString()} icon={<CheckCircleIcon className="w-6 h-6 text-green-500"/>} color="bg-green-100" onClick={() => onNavigateToFarms('Approved')} />
                        <KpiCard title={t('pendingFarms')} value={metrics.farmMetrics.pendingFarms.toString()} icon={<ClockIcon className="w-6 h-6 text-yellow-500"/>} color="bg-yellow-100" onClick={() => onNavigateToFarms('Pending Review')} />
                    </div>
                </div>

                <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
                     <div className="lg:col-span-2 space-y-8">
                        <div className="bg-brand-sb-shade-90 p-6 rounded-lg shadow-sm border border-brand-sb-shade-80">
                             <h2 className="text-lg font-bold text-brand-primary-300 flex items-center gap-2">
                                <ExclamationTriangleIcon className="w-6 h-6 text-brand-sc-warning"/>
                                {t('attentionRequired')}
                            </h2>
                            {metrics.atRiskShipments.length > 0 ? (
                                <ul className="mt-4 space-y-2">
                                {metrics.atRiskShipments.map(s => <AtRiskShipmentItem key={s.id} shipment={s} onSelect={onSelectShipment} />)}
                                </ul>
                            ) : (
                                <p className="mt-4 text-sm text-slate-500">{t('noAttentionRequired')}</p>
                            )}
                        </div>
                        <div className="bg-brand-sb-shade-90 p-6 rounded-lg shadow-sm border border-brand-sb-shade-80">
                             <h2 className="text-lg font-bold text-brand-primary-300 flex items-center gap-2">
                                <ChartBarIcon className="w-6 h-6 text-slate-500"/>
                                {t('topTradeLanes')}
                            </h2>
                            <div className="mt-4">
                               <TopTradeLanes lanes={metrics.topTradeLanes} />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-8">
                        {user.role === 'Manager' && (
                            <div className="bg-brand-sb-shade-90 p-6 rounded-lg shadow-sm border border-brand-sb-shade-80">
                                <h2 className="text-lg font-bold text-brand-primary-300 flex items-center gap-2 mb-4">
                                    <BanknotesIcon className="w-6 h-6 text-slate-500"/>
                                    {t('financials')}
                                </h2>
                                <div className="space-y-4">
                                    <div>
                                        <p className="text-sm text-brand-sb-shade-30">{t('totalLandedCost')}</p>
                                        <p className="text-2xl font-bold text-brand-primary-300">${metrics.totalLandedCost.toLocaleString()}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-brand-sb-shade-30">{t('avgCostPerShipment')}</p>
                                        <p className="text-2xl font-bold text-brand-primary-300">${metrics.avgCostPerShipment.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                                    </div>
                                </div>
                            </div>
                        )}

                         <div className="bg-brand-sb-shade-90 p-6 rounded-lg shadow-sm border border-brand-sb-shade-80">
                             <h2 className="text-lg font-bold text-brand-primary-300 flex items-center gap-2">
                                <ChartPieIcon className="w-6 h-6 text-red-500"/>
                                {t('delayHotspots')}
                            </h2>
                            <div className="mt-4">
                                <DelayHotspotsChart data={metrics.delayHotspotsData} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};