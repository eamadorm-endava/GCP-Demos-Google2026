
import React from 'react';
import { useStore } from '../store/useStore';
import { ShoppingCart, Stethoscope, Landmark, Factory, Globe, ScrollText, Play, Sparkles, ShieldCheck, Layers, FileText, ShieldAlert, Truck } from 'lucide-react';

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
};

const Dashboard: React.FC = () => {
  const setVertical = useStore((state) => state.setVertical);
  const setPitchVertical = useStore((state) => state.setPitchVertical);
  const toggleQuickPitch = useStore((state) => state.toggleQuickPitch);
  const verticals = useStore((state) => state.availableVerticals);

  return (
    <div className="p-6 md:p-12 lg:p-16 h-full flex flex-col overflow-y-auto custom-scrollbar">
      <header className="mb-14 md:mb-20 lg:mb-24 relative">
        <div className="absolute -left-16 top-0 w-1 h-32 bg-gradient-to-b from-endava-orange via-transparent to-transparent opacity-50 hidden xl:block" />

        <div className="space-y-4 md:space-y-6">
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-black mb-2 md:mb-4 tracking-tighter uppercase italic leading-[0.9]">
            Innovation <span className="text-endava-orange drop-shadow-[0_0_20px_rgba(255,86,64,0.3)]">Gallery</span>
          </h1>

          <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-8">
            <div className="h-[2px] w-16 bg-endava-orange hidden md:block" />
            <p className="text-lg md:text-2xl lg:text-3xl text-endava-blue-20 font-light leading-snug max-w-4xl tracking-tight">
              Exploring the next frontier of <span className="text-white font-medium border-b border-endava-orange/30">Digital Acceleration</span> through high-performance <span className="italic font-bold text-endava-orange">AI-Powered</span> vertical solutions.
            </p>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-10 lg:gap-12 pb-32 md:pb-48">
        {verticals.map((v) => {
          const Icon = IconMap[v.icon] || Globe;
          return (
            <div
              key={v.id}
              className="group relative overflow-hidden flex flex-col sm:min-h-[500px] lg:min-h-[600px] shadow-2xl kiosk-card-glass border border-white/10 hover:border-endava-orange/40 transition-all duration-500 rounded-2xl md:rounded-3xl"
            >
              {v.isAiGenerated && (
                <div className="absolute top-5 right-5 z-20 bg-endava-orange text-white px-4 py-1.5 rounded-full text-[9px] md:text-xs font-black uppercase tracking-widest flex items-center gap-2 shadow-xl animate-pulse-glow">
                  <Sparkles className="w-4 h-4" /> AI AGENT GEN
                </div>
              )}

              <div className="aspect-[16/10] sm:aspect-square md:aspect-[16/10] lg:aspect-square flex items-center justify-center bg-endava-dark relative overflow-hidden">
                {v.imageUrl ? (
                  <>
                    <img
                      src={v.imageUrl}
                      alt={v.title}
                      className="absolute inset-0 w-full h-full object-cover opacity-60 transition-all group-hover:opacity-80 group-hover:scale-105 duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-endava-dark via-transparent to-transparent opacity-80" />
                    <div className="absolute top-4 left-4 p-2 bg-white/10 backdrop-blur-md rounded-xl border border-white/10 shadow-lg">
                      <Icon className="w-6 h-6 md:w-8 md:h-8 text-endava-orange" strokeWidth={1.5} />
                    </div>
                  </>
                ) : (
                  <>
                    <div className="absolute inset-0 opacity-10 transition-all group-hover:opacity-30 group-hover:scale-110 endava-gradient" />
                    <div className="absolute inset-0 bg-black/20 backdrop-blur-[2px] transition-opacity group-hover:opacity-0" />
                    <Icon className="w-12 h-12 md:w-16 md:h-16 lg:w-24 lg:h-24 text-endava-orange drop-shadow-2xl relative z-10 transition-transform group-hover:scale-110" strokeWidth={1} />
                  </>
                )}
              </div>

              <div className="p-6 md:p-8 lg:p-10 flex-grow flex flex-col">
                <h3 className="text-xl md:text-3xl lg:text-4xl font-medium mb-3 md:mb-5 group-hover:text-endava-orange transition-colors uppercase tracking-tight endava-text-glow">
                  {v.title}
                </h3>
                <p className="text-endava-blue-40 text-xs md:text-lg lg:text-xl mb-6 md:mb-10 line-clamp-3 md:line-clamp-4 font-light leading-relaxed">
                  {v.pitch.problem}
                </p>

                <div className="mt-auto grid grid-cols-1 gap-3 md:gap-5">
                  <button
                    onClick={() => {
                      setPitchVertical(v.id);
                      toggleQuickPitch(true);
                    }}
                    className="flex items-center justify-center gap-2 p-4 md:p-5 lg:p-6 rounded-xl md:rounded-2xl bg-white/5 hover:bg-white/10 text-endava-blue-30 hover:text-white font-medium text-xs md:text-lg lg:text-xl transition-all border border-white/5 active:scale-95 group/btn"
                  >
                    <ScrollText className="w-4 h-4 md:w-6 md:h-6 lg:w-8 lg:h-8 text-endava-blue-40 group-hover/btn:text-endava-orange transition-colors" />
                    OVERVIEW
                  </button>
                  <button
                    onClick={() => setVertical(v.id)}
                    className="flex items-center justify-center gap-2 p-4 md:p-5 lg:p-6 rounded-xl md:rounded-2xl bg-white text-black font-medium text-xs md:text-lg lg:text-xl hover:bg-endava-orange hover:text-white transition-all active:scale-95 shadow-lg shadow-black/40 border border-white/10"
                  >
                    <Play className="w-4 h-4 md:w-6 md:h-6 lg:w-8 lg:h-8 fill-current" />
                    DEMO
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Dashboard;
