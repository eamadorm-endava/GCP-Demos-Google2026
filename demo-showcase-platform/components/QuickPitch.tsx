
import React from 'react';
import { useStore } from '../store/useStore';
import { X, Play, Lightbulb, CheckCircle, FileText } from 'lucide-react';

const QuickPitch: React.FC = () => {
  const pitchVerticalId = useStore((state) => state.pitchVerticalId);
  const setVertical = useStore((state) => state.setVertical);
  const setPitchVertical = useStore((state) => state.setPitchVertical);
  const toggleQuickPitch = useStore((state) => state.toggleQuickPitch);
  const availableVerticals = useStore((state) => state.availableVerticals);

  const vertical = availableVerticals.find(v => v.id === pitchVerticalId);

  if (!vertical) return null;

  const handleLaunch = () => {
    setVertical(vertical.id);
    toggleQuickPitch(false);
    setPitchVertical(null);
  };

  const handleClose = () => {
    toggleQuickPitch(false);
    setPitchVertical(null);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8 bg-black/70 backdrop-blur-xl animate-in fade-in duration-300">
      <div className="w-full max-w-5xl bg-endava-dark/95 border border-white/10 rounded-2xl overflow-hidden flex flex-col max-h-[88vh] relative shadow-[0_40px_120px_-20px_rgba(0,0,0,0.7)]">

        {/* Header */}
        <div className="flex items-center justify-between px-6 md:px-8 py-5 md:py-6 border-b border-white/[0.06] flex-shrink-0">
          <div className="flex items-center gap-4 md:gap-5">
            <div className="p-3 rounded-xl bg-endava-orange/10 border border-endava-orange/20">
              <FileText className="w-5 h-5 md:w-6 md:h-6 text-endava-orange" />
            </div>
            <div>
              <h2 className="text-xl md:text-2xl font-semibold tracking-tight">{vertical.title} <span className="text-endava-orange">Overview</span></h2>
              <p className="text-endava-blue-60 text-[11px] md:text-xs font-semibold tracking-[0.2em] uppercase mt-0.5">Strategic Solution Brief</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-2.5 hover:bg-white/5 rounded-xl transition-colors text-endava-blue-50 hover:text-white"
          >
            <X className="w-6 h-6 md:w-7 md:h-7" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-grow overflow-y-auto custom-scrollbar px-6 md:px-8 py-6 md:py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
            {/* Left Column */}
            <div className="space-y-6">
              {/* Executive Summary */}
              <section className="border-l-2 border-endava-orange/40 pl-5 md:pl-6">
                <div className="flex items-center gap-2 mb-2.5 text-endava-orange font-bold uppercase tracking-[0.15em] text-[10px] md:text-xs">
                  <FileText className="w-3.5 h-3.5" /> Executive Summary
                </div>
                <p className="text-sm md:text-base text-endava-blue-20 leading-relaxed">
                  {vertical.pitch.problem}
                </p>
              </section>

              {/* Endava Solution */}
              <section className="bg-white/[0.03] rounded-xl p-5 md:p-6 border border-white/[0.04]">
                <div className="flex items-center gap-2 mb-2.5 text-white font-bold uppercase tracking-[0.15em] text-[10px] md:text-xs">
                  <Lightbulb className="w-3.5 h-3.5 text-endava-orange" /> Endava Solution
                </div>
                <p className="text-sm md:text-base text-endava-blue-30 leading-relaxed">
                  {vertical.pitch.solution}
                </p>
              </section>
            </div>

            {/* Right Column — Success Metrics */}
            <div className="bg-white/[0.02] rounded-xl p-5 md:p-6 border border-white/[0.04]">
              <div className="flex items-center gap-2 mb-5 text-endava-orange font-bold uppercase tracking-[0.15em] text-[10px] md:text-xs">
                <CheckCircle className="w-3.5 h-3.5" /> Success Metrics
              </div>
              <ul className="space-y-4">
                {vertical.pitch.talkingPoints.map((point, idx) => (
                  <li key={idx} className="flex gap-3.5 items-start">
                    <div className="flex-shrink-0 w-6 h-6 rounded-lg bg-endava-orange/10 text-endava-orange flex items-center justify-center font-bold text-xs border border-endava-orange/15 mt-0.5">
                      {idx + 1}
                    </div>
                    <p className="text-sm md:text-base text-endava-blue-30 leading-relaxed">{point}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 md:px-8 py-4 md:py-5 flex items-center justify-between gap-4 flex-shrink-0 border-t border-white/[0.06] bg-endava-dark">
          <button
            onClick={handleClose}
            className="text-endava-blue-50 hover:text-white font-medium text-sm md:text-base transition-colors uppercase tracking-[0.15em]"
          >
            Close
          </button>

          <button
            onClick={handleLaunch}
            className="flex items-center gap-3 bg-endava-orange text-white px-6 md:px-10 py-3 md:py-4 rounded-xl font-medium text-sm md:text-base hover:bg-[#e84a35] transition-all active:scale-[0.97] shadow-[0_12px_40px_rgba(255,86,64,0.35)] relative overflow-hidden group"
          >
            <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
            <Play className="w-4 h-4 md:w-5 md:h-5 fill-current relative z-10" />
            <span className="relative z-10 uppercase tracking-[0.12em]">Launch Demo</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuickPitch;
