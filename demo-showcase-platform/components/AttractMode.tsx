
import React from 'react';
import { useStore } from '../store/useStore';
import EndavaLogo from './EndavaLogo';

const AttractMode: React.FC = () => {
  const updateActivity = useStore((state) => state.updateActivity);

  return (
    <div
      className="fixed inset-0 z-[150] bg-endava-dark flex flex-col items-center justify-center cursor-pointer overflow-hidden animate-in fade-in duration-1000"
      onClick={updateActivity}
    >
      {/* Dynamic Background Layers */}
      <div className="absolute inset-0 z-0">
        {/* Deep Gradient Base */}
        <div className="absolute inset-0 bg-gradient-to-br from-endava-dark via-[#0d161d] to-[#121e26]" />

        {/* Animated Glow Orbs */}
        <div className="absolute top-[10%] right-[20%] w-[600px] h-[600px] bg-endava-orange/10 rounded-full blur-[120px] animate-pulse-slow" />
        <div className="absolute bottom-[20%] left-[10%] w-[400px] h-[400px] bg-sky-500/5 rounded-full blur-[100px] animate-pulse-slow delay-700" />

        {/* Kinetic Tech Pattern Overlays */}
        <div className="absolute inset-0 opacity-[0.03] select-none pointer-events-none">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] scale-150" />
          <div className="absolute inset-0 bg-[radial-gradient(var(--endava-orange)_1.5px,transparent_1.5px)] [background-size:80px_80px] animate-float-slow" />
        </div>

        {/* Floating Accent Lines */}
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
          <div className="absolute top-1/4 left-0 w-[50%] h-[1px] bg-gradient-to-r from-transparent via-endava-orange to-transparent rotate-12 animate-slide-right" />
          <div className="absolute bottom-1/3 right-0 w-[40%] h-[1px] bg-gradient-to-r from-transparent via-sky-400 to-transparent -rotate-6 animate-slide-left" />
        </div>
      </div>

      {/* Main Content Container */}
      <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-5xl">

        {/* Logo Section with Advanced Aura */}
        <div className="relative mb-16 md:mb-24 group">
          <div className="absolute inset-0 bg-endava-orange blur-[140px] opacity-40 group-hover:opacity-60 transition-opacity duration-1000 animate-pulse-glow" />
          <div className="relative z-10 transform transition-all duration-1000 hover:scale-110 drop-shadow-[0_0_30px_rgba(255,86,64,0.4)]">
            <EndavaLogo height={140} className="md:h-[180px] lg:h-[220px] w-auto transition-all" />
          </div>
        </div>

        {/* Typography Shell */}
        <div className="space-y-8 md:space-y-12">
          <div className="space-y-4">
            <h2 className="text-2xl md:text-5xl lg:text-6xl font-black tracking-[0.4em] uppercase text-white drop-shadow-2xl">
              Showcase <span className="text-endava-orange">Platform</span>
            </h2>
            <div className="h-1 w-24 md:w-48 bg-gradient-to-r from-transparent via-endava-orange to-transparent mx-auto opacity-50" />
          </div>

          <p className="text-lg md:text-3xl lg:text-4xl text-endava-blue-20 font-light max-w-4xl mx-auto leading-relaxed tracking-tight">
            Redefining the Future of <span className="font-bold text-white border-b-2 border-endava-orange/30">Digital Enterprise</span> <br className="hidden md:block" />
            powered by <span className="text-endava-orange font-black italic tracking-wide">Google Cloud AI</span>
          </p>
        </div>

        {/* Interaction Call-to-Action */}
        <div className="mt-20 md:mt-32 relative group">
          <div className="absolute -inset-4 bg-endava-orange blur-2xl opacity-0 group-hover:opacity-30 transition-opacity duration-500 rounded-full" />
          <button
            className="relative bg-white text-black px-12 md:px-20 py-6 md:py-10 rounded-full font-black text-xl md:text-4xl tracking-widest uppercase shadow-[0_30px_80px_rgba(0,0,0,0.5)] border-4 border-white active:scale-95 transition-all hover:bg-endava-orange hover:text-white hover:border-endava-orange animate-bounce-subtle"
            onClick={updateActivity}
          >
            Start Exploring
          </button>

          <div className="mt-8 flex items-center justify-center gap-4 text-endava-blue-50 opacity-40">
            <div className="h-[1px] w-8 bg-current" />
            <span className="text-xs md:text-sm font-black tracking-[0.5em] uppercase">Touch to Initialize</span>
            <div className="h-[1px] w-8 bg-current" />
          </div>
        </div>
      </div>

      {/* Decorative Corners */}
      <div className="absolute top-10 left-10 w-24 h-24 border-t-2 border-l-2 border-white/5 md:block hidden" />
      <div className="absolute bottom-10 right-10 w-24 h-24 border-b-2 border-r-2 border-white/5 md:block hidden" />
    </div>
  );
};

export default AttractMode;
