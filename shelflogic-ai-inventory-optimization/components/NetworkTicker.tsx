
import React, { useState, useEffect } from 'react';
import { Radio } from './Icons';

export const NetworkTicker = () => {
    const messages = [
        "Network revenue tracking +12% YoY",
        "Dubuque Node: Inventory Rebalance Complete",
        "Ames: Local Event 'Homecoming' Detected - Demand Surge",
        "Davenport: 98% Compliance Score Achieved",
        "Cedar Rapids: Competitor Price Cut Detected (Total Wine)",
        "System: 34 Optimization Jobs running...",
        "Market Alert: Heatwave incoming Midwest Region"
    ];

    const [offset, setOffset] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setOffset(prev => prev + 1);
        }, 50);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="w-full bg-slate-900 border-b border-slate-800 h-8 overflow-hidden flex items-center relative z-20">
            <div className="bg-[var(--color-brand-primary-50)] px-3 h-full flex items-center z-10 font-bold text-[10px] text-white uppercase tracking-widest shadow-lg">
                <Radio className="w-3 h-3 mr-2 animate-pulse" /> Live Pulse
            </div>
            <div className="flex whitespace-nowrap overflow-hidden flex-1 mask-linear-fade">
                <div 
                    className="flex items-center space-x-12 px-4 animate-ticker text-xs font-mono text-slate-400"
                    style={{ animation: 'ticker 60s linear infinite' }}
                >
                    {[...messages, ...messages, ...messages].map((msg, i) => (
                        <span key={i} className="flex items-center">
                            <span className="w-1.5 h-1.5 bg-slate-600 rounded-full mr-3"></span>
                            {msg}
                        </span>
                    ))}
                </div>
            </div>
             <style>{`
                @keyframes ticker {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-50%); }
                }
                .animate-ticker {
                    animation: ticker 60s linear infinite;
                }
             `}</style>
        </div>
    );
};
