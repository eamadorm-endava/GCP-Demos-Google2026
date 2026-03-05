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
        <div className="mb-8 bg-gradient-to-r from-endava-dark to-endava-blue-90/50 p-6 md:p-8 rounded-2xl shadow-lg shadow-black\/40 border border-white/10 border-l-4 border-l-endava-orange">
            <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">{title}, {user.name}!</h1>
            <p className="text-endava-blue-30 mt-2 text-lg">{body}</p>
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
    const clickableStyles = onClick ? 'cursor-pointer hover:bg-white/5 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 ring-1 ring-transparent hover:ring-white/10' : '';
    return (
        <div className={`bg-endava-blue-90/50 backdrop-blur-sm p-6 rounded-2xl shadow-lg shadow-black\/40 border border-white/10 flex items-start ${clickableStyles}`} onClick={onClick}>
            <div className={`rounded-2xl p-3.5 mr-5 shadow-inner ${color}`}>
                {icon}
            </div>
            <div>
                <p className="text-sm font-medium text-endava-blue-40 uppercase tracking-wide">{title}</p>
                <p className="text-3xl font-bold text-white mt-1">{value}</p>
            </div>
        </div>
    );
};

const AtRiskShipmentItem: React.FC<{ shipment: Shipment; onSelect: (id: string) => void }> = ({ shipment, onSelect }) => {
    const statusConfig = {
        'Delayed': { icon: <ExclamationCircleIcon className="w-5 h-5 text-red-400" />, color: 'bg-red-900/20 ring-1 ring-red-900/50' },
        'Requires Action': { icon: <ExclamationTriangleIcon className="w-5 h-5 text-amber-400" />, color: 'bg-amber-900/20 ring-1 ring-amber-900/50' },
    };
    const config = statusConfig[shipment.status as 'Delayed' | 'Requires Action'];

    return (
        <li onClick={() => onSelect(shipment.id)} className="group flex items-center justify-between p-4 -mx-4 rounded-2xl hover:bg-white/5 border border-transparent hover:border-white/5 hover:shadow-lg shadow-black\/40 transition-all duration-200 cursor-pointer">
            <div className="flex items-center gap-4">
                <span className={`p-2.5 rounded-2xl shadow-lg shadow-black\/40 ${config.color}`}>
                    {config.icon}
                </span>
                <div>
                    <p className="font-semibold text-sm text-white group-hover:text-endava-orange transition-colors">{shipment.id}</p>
                    <p className="text-xs text-endava-blue-40">{shipment.customer}</p>
                </div>
            </div>
            <ArrowRightIcon className="w-5 h-5 text-endava-blue-30 group-hover:text-endava-orange group-hover:translate-x-1 transition-all" />
        </li>
    )
}

const DelayHotspotsChart: React.FC<{ data: { nameKey: string; count: number }[] }> = ({ data }) => {
    const { t } = useLanguage();
    if (data.length === 0) {
        return <p className="text-sm text-endava-blue-40">{t('noDelaysLogged')}</p>
    }
    const maxCount = Math.max(...data.map(d => d.count), 0);

    return (
        <div className="space-y-3">
            {data.map(({ nameKey, count }) => (
                <div key={nameKey} className="group">
                    <div className="flex justify-between items-center text-xs mb-1">
                        <span className="font-semibold text-endava-blue-30">{t(nameKey)}</span>
                        <span className="text-endava-blue-40">{t('delayCount', { count })}</span>
                    </div>
                    <div className="w-full bg-endava-blue-80 rounded-full h-2.5">
                        <div
                            className="bg-red-400 h-2.5 rounded-full group-hover:bg-red-900/200 transition-colors"
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
        return <p className="text-sm text-endava-blue-40">{t('notEnoughData')}</p>
    }
    return (
        <ul className="space-y-3">
            {lanes.map(({ lane, count, onTimePercent }) => (
                <li key={lane} className="flex justify-between items-center">
                    <div className="text-sm">
                        <p className="font-semibold text-white">{lane}</p>
                        <p className="text-xs text-endava-blue-40">{t('shipmentCount', { count })}</p>
                    </div>
                    <div className={`text-sm font-bold ${onTimePercent > 90 ? 'text-green-400' : 'text-amber-400'}`}>
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
        <div className="w-full bg-endava-dark/80 overflow-y-auto custom-scrollbar p-6 lg:p-8">
            <div className="max-w-7xl mx-auto">
                <RoleNarrative user={user} />

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <KpiCard title={t('activeShipments')} value={metrics.totalShipments.toString()} icon={<CubeIcon className="w-6 h-6 text-endava-blue-40" />} color="bg-endava-blue-80" />
                    <KpiCard title={t('onTimeDelivery')} value={`${metrics.onTimeDelivery}%`} icon={<ShieldCheckIcon className="w-6 h-6 text-green-500" />} color="bg-green-900/30" />
                    <KpiCard title={t('requiresAction')} value={metrics.requiresActionCount.toString()} icon={<ExclamationTriangleIcon className="w-6 h-6 text-amber-500" />} color="bg-amber-900/30" onClick={() => onDrilldown('Requires Action')} />
                    <KpiCard title={t('delayedShipments')} value={metrics.delayedCount.toString()} icon={<ExclamationCircleIcon className="w-6 h-6 text-red-500" />} color="bg-red-900/30" onClick={() => onDrilldown('Delayed')} />
                </div>

                <div className="mt-6 bg-endava-blue-90/50 backdrop-blur-sm p-6 rounded-2xl shadow-lg shadow-black\/40 border border-white/10">
                    <h2 className="text-lg font-bold text-white flex items-center gap-2 mb-4">{t('farmOverview')}</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <KpiCard title={t('totalFarms')} value={metrics.farmMetrics.totalFarms.toString()} icon={<FlowerIcon className="w-6 h-6 text-endava-orange" />} color="bg-rose-900/30" onClick={() => onNavigateToFarms('All')} />
                        <KpiCard title={t('approvedFarms')} value={metrics.farmMetrics.approvedFarms.toString()} icon={<CheckCircleIcon className="w-6 h-6 text-green-500" />} color="bg-green-900/30" onClick={() => onNavigateToFarms('Approved')} />
                        <KpiCard title={t('pendingFarms')} value={metrics.farmMetrics.pendingFarms.toString()} icon={<ClockIcon className="w-6 h-6 text-yellow-500" />} color="bg-yellow-900/30" onClick={() => onNavigateToFarms('Pending Review')} />
                    </div>
                </div>

                <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-8">
                        <div className="bg-endava-blue-90/50 backdrop-blur-sm p-6 rounded-2xl shadow-lg shadow-black\/40 border border-white/10">
                            <h2 className="text-lg font-bold text-white flex items-center gap-2">
                                <ExclamationTriangleIcon className="w-6 h-6 text-amber-500" />
                                {t('attentionRequired')}
                            </h2>
                            {metrics.atRiskShipments.length > 0 ? (
                                <ul className="mt-4 space-y-2">
                                    {metrics.atRiskShipments.map(s => <AtRiskShipmentItem key={s.id} shipment={s} onSelect={onSelectShipment} />)}
                                </ul>
                            ) : (
                                <p className="mt-4 text-sm text-endava-blue-40">{t('noAttentionRequired')}</p>
                            )}
                        </div>
                        <div className="bg-endava-blue-90/50 backdrop-blur-sm p-6 rounded-2xl shadow-lg shadow-black\/40 border border-white/10">
                            <h2 className="text-lg font-bold text-white flex items-center gap-2">
                                <ChartBarIcon className="w-6 h-6 text-endava-blue-40" />
                                {t('topTradeLanes')}
                            </h2>
                            <div className="mt-4">
                                <TopTradeLanes lanes={metrics.topTradeLanes} />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-8">
                        {user.role === 'Manager' && (
                            <div className="bg-endava-blue-90/50 backdrop-blur-sm p-6 rounded-2xl shadow-lg shadow-black\/40 border border-white/10">
                                <h2 className="text-lg font-bold text-white flex items-center gap-2 mb-4">
                                    <BanknotesIcon className="w-6 h-6 text-endava-blue-40" />
                                    {t('financials')}
                                </h2>
                                <div className="space-y-4">
                                    <div>
                                        <p className="text-sm text-endava-blue-40">{t('totalLandedCost')}</p>
                                        <p className="text-2xl font-bold text-white">${metrics.totalLandedCost.toLocaleString()}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-endava-blue-40">{t('avgCostPerShipment')}</p>
                                        <p className="text-2xl font-bold text-white">${metrics.avgCostPerShipment.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="bg-endava-blue-90/50 backdrop-blur-sm p-6 rounded-2xl shadow-lg shadow-black\/40 border border-white/10">
                            <h2 className="text-lg font-bold text-white flex items-center gap-2">
                                <ChartPieIcon className="w-6 h-6 text-red-500" />
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