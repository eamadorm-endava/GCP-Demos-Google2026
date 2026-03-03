
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
    <div className="p-4 md:p-8 lg:p-12 h-full flex flex-col overflow-y-auto custom-scrollbar">
      <header className="mb-6 md:mb-10 lg:mb-12">
        <h1 className="text-2xl md:text-4xl lg:text-5xl font-black mb-1 md:mb-4 tracking-tight uppercase">
          Select <span className="text-endava-orange">Vertical</span>
        </h1>
        <p className="text-sm md:text-xl lg:text-2xl text-gray-500 font-light leading-relaxed max-w-2xl">
          High-performance digital acceleration prototypes for key industries.
        </p>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8 pb-32 md:pb-40">
        {verticals.map((v) => {
          const Icon = IconMap[v.icon] || Globe;
          return (
            <div
              key={v.id}
              className="group relative bg-endava-blue-90 border border-white/5 rounded-2xl md:rounded-3xl overflow-hidden hover:border-endava-orange/40 transition-all hover:shadow-[0_0_50px_rgba(255,86,64,0.15)] flex flex-col sm:min-h-[450px] lg:min-h-[520px]"
            >
              {v.isAiGenerated && (
                <div className="absolute top-4 right-4 z-20 bg-endava-orange text-white px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest flex items-center gap-1 shadow-lg">
                  <Sparkles className="w-3 h-3" /> AI AGENT GEN
                </div>
              )}

              <div className="aspect-[16/10] sm:aspect-square md:aspect-[16/10] lg:aspect-square flex items-center justify-center bg-endava-dark relative overflow-hidden">
                <div className="absolute inset-0 opacity-10 transition-all group-hover:opacity-30 group-hover:scale-110 endava-gradient" />
                <div className="absolute inset-0 bg-black/20 backdrop-blur-[2px] transition-opacity group-hover:opacity-0" />
                <Icon className="w-12 h-12 md:w-16 md:h-16 lg:w-24 lg:h-24 text-endava-orange drop-shadow-2xl relative z-10 transition-transform group-hover:scale-110" strokeWidth={1} />
              </div>

              <div className="p-4 md:p-6 lg:p-8 flex-grow flex flex-col">
                <h3 className="text-lg md:text-2xl lg:text-3xl font-bold mb-2 md:mb-4 group-hover:text-endava-orange transition-colors uppercase tracking-tight">
                  {v.title}
                </h3>
                <p className="text-gray-500 text-xs md:text-sm lg:text-lg mb-6 md:mb-8 line-clamp-3 md:line-clamp-4 font-light leading-relaxed">
                  {v.pitch.problem}
                </p>

                <div className="mt-auto grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-1 gap-2 md:gap-4">
                  <button
                    onClick={() => {
                      setPitchVertical(v.id);
                      toggleQuickPitch(true);
                    }}
                    className="flex items-center justify-center gap-2 p-3 md:p-4 lg:p-5 rounded-xl md:rounded-2xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white font-bold text-xs md:text-sm lg:text-lg transition-all border border-white/5 active:scale-95"
                  >
                    <ScrollText className="w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6" />
                    OVERVIEW
                  </button>
                  <button
                    onClick={() => setVertical(v.id)}
                    className="flex items-center justify-center gap-2 p-3 md:p-4 lg:p-5 rounded-xl md:rounded-2xl bg-white text-black font-black text-xs md:text-sm lg:text-lg hover:bg-endava-orange hover:text-white transition-all active:scale-95 shadow-lg shadow-black/20"
                  >
                    <Play className="w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6 fill-current" />
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
