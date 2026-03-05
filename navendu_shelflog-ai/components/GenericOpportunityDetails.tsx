
import React from 'react';
import { Opportunity } from '../types';
import { Package } from './Icons';
import { theme } from '../theme';

interface GenericOpportunityDetailsProps {
    opportunity: Opportunity;
}

export const GenericOpportunityDetails: React.FC<GenericOpportunityDetailsProps> = ({ opportunity }) => {
    return (
        <div className={`${theme.components.card} p-12 text-center border-dashed`}>
            <Package className="w-16 h-16 text-slate-700 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">{opportunity.type.replace(/_/g, ' ')}</h3>
            <p className="text-slate-400">Detailed analytics for this opportunity type are currently being compiled by the agent.</p>
        </div>
    );
};
