
import React from 'react';

interface KioskButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'glass' | 'ghost';
    size?: 'sm' | 'md' | 'lg' | 'xl';
    icon?: React.ReactNode;
    children: React.ReactNode;
}

const KioskButton: React.FC<KioskButtonProps> = ({
    variant = 'primary',
    size = 'md',
    icon,
    children,
    className = '',
    ...props
}) => {
    const baseStyles = "inline-flex items-center justify-center gap-3 rounded-2xl font-medium transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none";

    const variants = {
        primary: "bg-white text-black hover:bg-endava-orange hover:text-white shadow-lg shadow-black/20 border border-white/10",
        secondary: "bg-endava-orange text-white hover:bg-[#d13f2d] shadow-[0_20px_50px_rgba(255,86,64,0.3)]",
        glass: "kiosk-card-glass hover:bg-white/10 text-endava-blue-30 hover:text-white border border-white/5",
        ghost: "bg-white/5 hover:bg-white/10 text-endava-blue-30 hover:text-white border border-white/5"
    };

    const sizes = {
        sm: "p-3 text-xs",
        md: "p-4 md:p-5 text-sm md:text-lg",
        lg: "p-5 md:p-6 lg:p-7 text-lg md:text-xl",
        xl: "p-6 md:p-8 lg:p-10 text-xl md:text-3xl"
    };

    return (
        <button
            className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
            {...props}
        >
            {icon && <span className="flex-shrink-0">{icon}</span>}
            {children}
        </button>
    );
};

export default KioskButton;
