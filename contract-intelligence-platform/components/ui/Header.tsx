import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-brand-accent/20 bg-brand-dark/80 backdrop-blur-xl supports-[backdrop-filter]:bg-brand-dark/60">
      <div className="container mx-auto px-4 h-20 flex items-center">
        
        {/* Logo & Title Block - Aligned Left */}
        <div className="flex items-center gap-4">
            {/* Logo */}
            <div className="w-10 h-10 rounded-xl overflow-hidden shadow-lg shadow-brand-primary/20 ring-1 ring-white/10">
              <img
                src="https://cdn.brandfetch.io/id4YZ7PWEj/w/200/h/200/theme/dark/icon.jpeg?c=1bxid64Mup7aczewSAYMX&t=1761617484712"
                alt="Agentic Vendor Governance"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Title */}
            <div className="flex flex-col leading-tight">
              <span className="text-xl font-black tracking-tight text-brand-text">
                Contract Intelligence
              </span>
              <span className="text-sm font-bold tracking-wide text-brand-light uppercase">
                Platform
              </span>
            </div>
        </div>

      </div>
    </header>
  );
};