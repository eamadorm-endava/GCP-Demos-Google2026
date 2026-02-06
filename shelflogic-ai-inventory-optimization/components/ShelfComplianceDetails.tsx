
import React from 'react';
import { Opportunity } from '../types';
import { AlertTriangle, FileText, Camera, Activity, Truck } from './Icons';
import { theme } from '../theme';

interface ShelfComplianceDetailsProps {
  opportunity: Opportunity;
}

export const ShelfComplianceDetails: React.FC<ShelfComplianceDetailsProps> = ({ opportunity }) => {
    return (
        <div className="space-y-8">
            <div className={`${theme.components.card} p-6 border-l-4 ${theme.semantic.danger.border}`}>
                <div className="flex items-start justify-between">
                    <div>
                        <h3 className={`font-bold ${theme.colors.text.primary} flex items-center mb-2`}>
                            <AlertTriangle className={`w-5 h-5 mr-2 ${theme.semantic.danger.base}`} />
                            Compliance Violation Detected
                        </h3>
                        <p className="text-sm text-slate-400">
                            IoT Camera detected a discrepancy against the active Planogram.
                        </p>
                    </div>
                    <div className="text-right">
                        <p className="text-[10px] uppercase font-bold text-slate-500">Revenue Risk</p>
                        <p className={`text-2xl font-bold ${theme.semantic.danger.base}`}>-${opportunity.projected_lift}</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className={`${theme.components.card} p-6 relative`}>
                    <div className="absolute top-0 left-0 w-full h-1 bg-emerald-500"></div>
                    <h4 className="font-bold text-white flex items-center mb-4">
                        <FileText className="w-4 h-4 mr-2 text-emerald-400" />
                        Master Planogram (Expected)
                    </h4>
                    <div className="bg-slate-950 rounded-xl p-4 border border-slate-800 flex justify-center items-center h-64 bg-cover bg-center" style={{backgroundImage: `url(${opportunity.product?.image})`}}>
                        <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 bg-emerald-600 text-white text-[9px] font-bold px-2 py-0.5 rounded shadow-lg whitespace-nowrap">
                            SKU: {opportunity.product?.sku_id}
                        </div>
                    </div>
                </div>

                <div className={`${theme.components.card} p-6 relative`}>
                    <div className="absolute top-0 left-0 w-full h-1 bg-rose-500 animate-pulse"></div>
                    <h4 className="font-bold text-white flex items-center mb-4">
                        <Camera className="w-4 h-4 mr-2 text-rose-400" />
                        Real-time Camera Feed (Actual)
                    </h4>
                    <div className="bg-slate-950 rounded-xl p-4 border border-slate-800 flex justify-center items-center h-64 relative overflow-hidden">
                        <div className="absolute inset-0 bg-[url('assets/vision-shelf-background.svg')] bg-cover opacity-20 grayscale"></div>
                        <div className="relative z-10 p-6 border-2 border-rose-500 border-dashed rounded-lg bg-rose-950/30 backdrop-blur-sm flex flex-col items-center justify-center">
                            <AlertTriangle className="w-8 h-8 text-rose-500 mb-2" />
                            <span className="text-rose-400 font-bold text-sm uppercase">Item Missing</span>
                        </div>
                    </div>
                </div>
            </div>
            
            <div className={`${theme.components.card} p-6`}>
                <h3 className={`font-bold ${theme.colors.text.primary} mb-4 flex items-center`}>
                    <Activity className="w-5 h-5 mr-2 text-[var(--color-brand-secondary-100)]" />
                    Recommended Remediation
                </h3>
                <div className="flex items-center gap-4 bg-slate-800/50 p-4 rounded-xl border border-slate-700">
                    <div className="p-3 bg-slate-700 rounded-lg">
                        <Truck className="w-6 h-6 text-slate-300" />
                    </div>
                    <div className="flex-1">
                        <h4 className="font-bold text-white text-sm">Review Last Delivery</h4>
                        <p className="text-xs text-slate-400">ERP indicates 12 units delivered yesterday. Check backroom for unstocked pallets.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};
