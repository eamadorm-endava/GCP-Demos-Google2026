
import React from 'react';

interface KioskCardProps {
    children: React.ReactNode;
    className?: string;
    glass?: boolean;
}

const KioskCard: React.FC<KioskCardProps> = ({ children, className = '', glass = true }) => {
    return (
        <div className={`
      relative overflow-hidden transition-all duration-500
      ${glass ? 'kiosk-card-glass border border-white/10 hover:border-endava-orange/40' : 'bg-endava-blue-90 border border-white/5'}
      ${className}
    `}>
            {children}
        </div>
    );
};

export default KioskCard;
