
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

                    {/* Right: Gemini Badge */}
                    <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-brand-highlight/20 bg-brand-highlight/5 backdrop-blur-sm">
                            <span className="relative flex h-1.5 w-1.5">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-highlight opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-brand-highlight"></span>
                            </span>
                            <span className="text-[10px] font-semibold text-brand-highlight uppercase tracking-widest">Gemini 3.1 Flash Image</span>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};