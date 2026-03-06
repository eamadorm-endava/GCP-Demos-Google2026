
import React from 'react';
import { useStore } from '../store/useStore';
import { ShoppingCart, Stethoscope, Landmark, Factory, Globe, ScrollText, Play, Sparkles, ShieldCheck, Layers, FileText, ShieldAlert, Truck, ClipboardCheck } from 'lucide-react';

const IconMap: Record<string, React.ElementType> = {
  'shopping-cart': ShoppingCart,
  'stethoscope': Stethoscope,
  'landmark': Landmark,
  'factory': Factory,
  'globe': Globe,
  'shield-check': ShieldCheck,
  'shield-alert': ShieldAlert,
  'file-text': FileText,
  'layers': Layers,
  'truck': Truck,
  'clipboard-check': ClipboardCheck,
};

const Dashboard: React.FC = () => {
  const setVertical = useStore((state) => state.setVertical);
  const setPitchVertical = useStore((state) => state.setPitchVertical);
  const toggleQuickPitch = useStore((state) => state.toggleQuickPitch);
  const verticals = useStore((state) => state.availableVerticals);

  return (
    <div className="p-3 md:p-6 lg:p-8 h-full flex flex-col overflow-y-auto custom-scrollbar">
      <header className="mb-4 md:mb-6 lg:mb-8 relative">
        <div className="absolute -left-16 top-0 w-1 h-24 bg-gradient-to-b from-endava-orange via-transparent to-transparent opacity-50 hidden xl:block" />

        <div className="space-y-1 md:space-y-2">
          <h1 className="text-xl md:text-3xl lg:text-5xl font-black mb-1 tracking-tighter uppercase leading-[0.9]">
            Innovation <span className="bg-gradient-to-br from-endava-orange via-[#ff7e6b] to-[#ffb3a8] text-transparent bg-clip-text drop-shadow-[0_0_30px_rgba(255,86,64,0.4)]">Gallery</span>
          </h1>

          <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
            <div className="h-[1px] w-10 bg-endava-orange hidden md:block" />
            <p className="text-sm md:text-lg lg:text-xl text-endava-blue-20 font-light leading-snug max-w-4xl tracking-tight">
              Exploring the next frontier of <span className="text-white font-medium">Digital Acceleration</span> through high-performance <span className="bg-gradient-to-r from-endava-orange to-[#ff8c7a] text-transparent bg-clip-text font-bold">AI-Powered</span> vertical solutions.
            </p>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6 lg:gap-8 pb-6 md:pb-12">
        {verticals.map((v) => {
          const Icon = IconMap[v.icon] || Globe;
          return (
            <div
              key={v.id}
              className="group relative overflow-hidden flex flex-col sm:min-h-[400px] lg:min-h-[480px] rounded-[1.25rem] bg-white/[0.02] border border-white/[0.05] hover:bg-white/[0.04] hover:border-white/[0.1] backdrop-blur-xl transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.6)] shadow-[0_10px_40px_-10px_rgba(0,0,0,0.4)] kiosk-card-glass hover:border-endava-orange/40"
            >
              {v.isAiGenerated && (
                <div className="absolute top-3 right-3 z-20 bg-endava-orange text-white px-2 py-1 rounded-full text-[7px] md:text-[9px] font-black uppercase tracking-widest flex items-center gap-1.5 shadow-xl animate-pulse-glow">
                  <Sparkles className="w-2.5 h-2.5" /> AI AGENT GEN
                </div>
              )}

              <div className="aspect-[16/8] sm:aspect-[16/9] md:aspect-[16/8] flex items-center justify-center bg-transparent relative overflow-hidden border-b border-white/[0.05]">
                {v.imageUrl ? (
                  <>
                    <img
                      src={v.imageUrl}
                      alt={v.title}
                      className="absolute inset-0 w-full h-full object-cover opacity-60 transition-all group-hover:opacity-80 group-hover:scale-105 duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-endava-dark via-transparent to-transparent opacity-80" />
                    <div className="absolute top-3 left-3 p-2.5 rounded-lg bg-white/[0.05] backdrop-blur-xl border border-white/10 shadow-2xl group-hover:bg-white/10 group-hover:scale-105 transition-all duration-500">
                      <Icon className="w-5 h-5 md:w-7 md:h-7 lg:w-9 lg:h-9 text-endava-orange" strokeWidth={1.5} />
                    </div>
                  </>
                ) : (
                  <>
                    <div className="absolute inset-0 opacity-10 transition-all group-hover:opacity-40 group-hover:scale-110 endava-gradient-premium" />
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-[4px] transition-opacity group-hover:opacity-20" />
                    <Icon className="w-10 h-10 md:w-14 md:h-14 lg:w-20 lg:h-20 text-endava-orange drop-shadow-[0_0_30px_rgba(255,86,64,0.5)] relative z-10 transition-transform duration-500 group-hover:scale-110" strokeWidth={1} />
                  </>
                )}
              </div>

              <div className="p-4 md:p-5 lg:p-6 flex-grow flex flex-col">
                <h3 className="text-base md:text-xl lg:text-2xl font-semibold mb-1.5 md:mb-2 group-hover:text-endava-orange transition-colors uppercase tracking-tight">
                  {v.title}
                </h3>
                <p className="text-endava-blue-40 text-[9px] md:text-sm lg:text-base mb-3 md:mb-4 font-light leading-snug line-clamp-2">
                  {v.pitch.problem}
                </p>

                <div className="mt-auto grid grid-cols-1 gap-2 md:gap-3">
                  <button
                    onClick={() => {
                      setPitchVertical(v.id);
                      toggleQuickPitch(true);
                    }}
                    className="flex items-center justify-center gap-2 p-2.5 md:p-3.5 rounded-lg bg-white/5 hover:bg-white/10 text-endava-blue-30 hover:text-white font-medium text-[9px] md:text-sm lg:text-base transition-all border border-white/5 active:scale-95 group/btn"
                  >
                    <ScrollText className="w-3 h-3 md:w-4 md:h-4 lg:w-5 lg:h-5 text-endava-blue-40 group-hover/btn:text-endava-orange transition-colors" />
                    OVERVIEW
                  </button>
                  <button
                    onClick={() => setVertical(v.id)}
                    className="flex items-center justify-center gap-2 p-2.5 md:p-3.5 rounded-lg bg-white text-black font-medium text-[9px] md:text-sm lg:text-base hover:bg-endava-orange hover:text-white transition-all active:scale-95 shadow-lg shadow-black/40 border border-white/10"
                  >
                    <Play className="w-3 h-3 md:w-4 md:h-4 lg:w-5 lg:h-5 fill-current" />
                    DEMO
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Copyright Footer */}
      <div className="mt-auto pt-8 pb-4 w-full text-center pointer-events-none hidden md:block">
        <p className="text-[10px] md:text-xs text-endava-blue-60/40 font-bold uppercase tracking-[0.4em]">
          @2026 ENDAVA | ALL RIGHTS RESERVED
        </p>
      </div>
    </div>
  );
};

export default Dashboard;
