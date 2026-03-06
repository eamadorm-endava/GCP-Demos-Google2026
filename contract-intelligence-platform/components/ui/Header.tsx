
import React from 'react';

export const Header: React.FC = () => {
    return (
        <header className="bg-brand-secondary border-b border-brand-accent/40 sticky top-0 z-20 backdrop-blur-md">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo + Brand */}
                    <div className="flex items-center gap-3">
                        <div className="relative flex-shrink-0">
                            <div className="w-9 h-9 rounded-xl bg-brand-highlight/10 border border-brand-highlight/30 flex items-center justify-center coral-glow-sm p-1.5">
                                <img src="./endava-logo.svg" alt="SupplyLens" className="w-full h-full" />
                            </div>
                        </div>
                        <div className="flex flex-col leading-none">
                            <span className="text-lg font-bold text-brand-text tracking-tight">SupplyLens</span>
                            <span className="text-[10px] text-brand-light font-medium tracking-widest uppercase">Contract Intelligence</span>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};