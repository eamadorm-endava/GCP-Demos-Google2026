
import React from 'react';
import { useStore } from '../store/useStore';
import { X, Play, ScrollText, Lightbulb, CheckCircle, ChevronRight, FileText } from 'lucide-react';

const QuickPitch: React.FC = () => {
  const pitchVerticalId = useStore((state) => state.pitchVerticalId);
  const setVertical = useStore((state) => state.setVertical);
  const setPitchVertical = useStore((state) => state.setPitchVertical);
  const toggleQuickPitch = useStore((state) => state.toggleQuickPitch);
  const availableVerticals = useStore((state) => state.availableVerticals);
  
  const vertical = availableVerticals.find(v => v.id === pitchVerticalId);
  
  if (!vertical) return null;

  const handleLaunch = () => {
    // Navigate to the demo
    setVertical(vertical.id);
    // Close the pitch modal
    toggleQuickPitch(false);
    // Clear the pitch vertical state
    setPitchVertical(null);
  };

  const handleClose = () => {
    toggleQuickPitch(false);
    setPitchVertical(null);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6 bg-black/95 backdrop-blur-xl animate-in fade-in duration-300">
      <div className="w-full max-w-5xl bg-[#121417] rounded-3xl border border-white/10 overflow-hidden shadow-[0_0_100px_rgba(0,0,0,0.5)] flex flex-col max-h-[95vh] relative">
        {/* Header */}
        <div className="flex items-center justify-between p-6 md:p-10 border-b border-white/5 flex-shrink-0">
          <div className="flex items-center gap-6">
            <div className={`p-4 md:p-5 rounded-2xl bg-[#DE411B] shadow-lg shadow-[#DE411B]/20`}>
              <ScrollText className="w-6 h-6 md:w-8 md:h-8 text-white" />
            </div>
            <div>
              <h2 className="text-3xl md:text-4xl font-black tracking-tight uppercase">{vertical.title} <span className="text-[#DE411B]">Overview</span></h2>
              <p className="text-gray-500 text-sm md:text-lg font-bold tracking-widest uppercase opacity-60">Strategic Solution Brief</p>
            </div>
          </div>
          <button 
            onClick={handleClose}
            className="p-3 hover:bg-white/5 rounded-full transition-colors text-gray-500 hover:text-white"
          >
            <X className="w-8 h-8 md:w-10 md:h-10" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-grow overflow-y-auto custom-scrollbar p-6 md:p-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
            <div className="space-y-10">
              <section className="bg-white/5 p-8 rounded-3xl border border-white/5 shadow-inner">
                <div className="flex items-center gap-2 mb-4 text-[#DE411B] font-black uppercase tracking-[0.2em] text-xs md:text-sm">
                  <FileText className="w-5 h-5" /> Executive Summary
                </div>
                <p className="text-lg md:text-2xl text-gray-200 leading-relaxed font-light italic">
                  "{vertical.pitch.problem}"
                </p>
              </section>

              <section className="p-8 border-l-2 border-[#DE411B]/30">
                <div className="flex items-center gap-2 mb-4 text-white font-black uppercase tracking-[0.2em] text-xs md:text-sm">
                  <Lightbulb className="w-5 h-5 text-[#DE411B]" /> Endava Solution
                </div>
                <p className="text-lg md:text-xl text-gray-400 leading-relaxed font-light">
                  {vertical.pitch.solution}
                </p>
              </section>
            </div>

            <div className="bg-[#1a1c1e] p-8 md:p-10 rounded-3xl border border-white/5 shadow-inner flex flex-col">
              <div className="flex items-center gap-2 mb-8 text-[#DE411B] font-black uppercase tracking-[0.2em] text-xs md:text-sm">
                <CheckCircle className="w-5 h-5" /> Success Metrics
              </div>
              <ul className="space-y-6 md:space-y-10 mb-12">
                {vertical.pitch.talkingPoints.map((point, idx) => (
                  <li key={idx} className="flex gap-6">
                    <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-[#DE411B]/10 text-[#DE411B] flex items-center justify-center font-black text-lg border border-[#DE411B]/20">
                      {idx + 1}
                    </div>
                    <p className="text-lg md:text-xl text-gray-300 font-light leading-relaxed">{point}</p>
                  </li>
                ))}
              </ul>
              
              {/* Contextual Launch Button */}
              <button 
                onClick={handleLaunch}
                className="mt-auto group flex items-center justify-between bg-white/5 hover:bg-[#DE411B]/10 text-white p-6 rounded-2xl transition-all border border-white/10 hover:border-[#DE411B]/50"
              >
                <div className="flex flex-col items-start">
                  <span className="text-xs font-black text-[#DE411B] uppercase tracking-widest mb-1">Ready to explore?</span>
                  <span className="text-lg font-bold">Launch {vertical.title}</span>
                </div>
                <ChevronRight className="w-8 h-8 text-[#DE411B] group-hover:translate-x-2 transition-transform" />
              </button>
            </div>
          </div>
        </div>

        {/* Footer with Master Launch Action */}
        <div className="p-8 md:p-10 bg-[#0b0c0d] flex flex-col md:flex-row items-center justify-center gap-6 flex-shrink-0 border-t border-white/5">
          <button 
            onClick={handleLaunch}
            className="w-full md:w-auto flex items-center justify-center gap-4 bg-[#DE411B] text-white px-10 md:px-20 py-5 md:py-6 rounded-2xl font-black text-xl md:text-2xl hover:bg-[#c43616] transition-all active:scale-95 shadow-[0_20px_50px_rgba(222,65,27,0.4)] relative overflow-hidden group"
          >
            <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
            <Play className="w-6 h-6 md:w-8 md:h-8 fill-current relative z-10" />
            <span className="relative z-10 uppercase tracking-widest">LAUNCH {vertical.title.toUpperCase()} DEMO</span>
          </button>
          
          <button 
            onClick={handleClose}
            className="text-gray-500 hover:text-white font-bold text-lg md:text-xl transition-colors uppercase tracking-widest"
          >
            Close Overview
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuickPitch;
