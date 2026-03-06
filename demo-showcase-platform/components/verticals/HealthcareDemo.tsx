
import React, { useState } from 'react';
import { useStore } from '../../store/useStore';
import KioskCard from '../shared/KioskCard';
import KioskButton from '../shared/KioskButton';
import { Stethoscope, ClipboardList, Activity, Sparkles, MessageSquare } from 'lucide-react';

const HealthcareDemo: React.FC = () => {
  const demoData = useStore((state) => state.demoData.healthcare);
  const [activePatient, setActivePatient] = useState<string | null>(null);
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [summary, setSummary] = useState<string | null>(null);

  const currentPatient = demoData.patients.find(p => p.id === activePatient);

  const handleSummarize = () => {
    setIsSummarizing(true);
    setSummary(null);
    setTimeout(() => {
      setIsSummarizing(false);
      setSummary("Patient presents with chronic stable vitals. Recent labs show slightly elevated cortisol. Recommendation: Adjust dosage by 5mg and monitor for 2 weeks. AI assessment: 98% confidence in recovery trajectory.");
    }, 1500);
  };

  return (
    <div className="p-4 md:p-8 h-full flex flex-col gap-6 md:gap-8 custom-scrollbar overflow-y-auto">
      <header className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <h2 className="text-3xl md:text-4xl font-medium">Patient <span className="text-endava-orange">Intelligence</span></h2>
          <p className="text-lg md:text-xl text-endava-blue-40 font-light tracking-tight">Gemini Pro Clinical Summary Analysis</p>
        </div>
        <div className="self-start md:self-center bg-endava-orange/10 text-endava-orange px-4 md:px-6 py-2 md:py-3 rounded-full font-black flex items-center gap-2 border border-endava-orange/20 text-sm md:text-base whitespace-nowrap tracking-widest uppercase">
          <Activity className="w-5 h-5 md:w-6 md:h-6" /> SECURE DATA PORTAL
        </div>
      </header>

      <div className="flex flex-col lg:flex-row gap-8 pb-40">
        <KioskCard className="lg:w-80 flex-shrink-0 p-6 space-y-4 shadow-xl">
          <h3 className="text-xl font-medium mb-4 flex items-center gap-3 text-endava-blue-30">
            <ClipboardList className="text-endava-orange w-5 h-5" /> Admissions
          </h3>
          <div className="flex flex-row lg:flex-col gap-4 overflow-x-auto lg:overflow-x-visible pb-2 lg:pb-0 custom-scrollbar">
            {demoData.patients.map((p) => (
              <button
                key={p.id}
                onClick={() => { setActivePatient(p.id); setSummary(null); }}
                className={`min-w-[220px] lg:min-w-0 flex-shrink-0 text-left p-5 rounded-2xl transition-all border ${activePatient === p.id
                  ? 'bg-endava-orange border-endava-orange shadow-lg shadow-endava-orange/20 text-white'
                  : 'bg-white/5 border-transparent hover:bg-white/10 text-endava-blue-40'
                  }`}
              >
                <div className="font-medium text-lg mb-1">{p.name}</div>
                <div className={`text-xs font-bold uppercase tracking-widest ${activePatient === p.id ? 'text-white/80' : 'text-endava-blue-50'}`}>
                  {p.condition} • {p.age} YRS
                </div>
              </button>
            ))}
          </div>
        </KioskCard>

        <main className="flex-grow space-y-8">
          {currentPatient ? (
            <KioskCard className="p-6 md:p-10 min-h-[550px] flex flex-col shadow-2xl">
              <div className="flex flex-col sm:flex-row justify-between items-start mb-10 gap-6">
                <div>
                  <h3 className="text-3xl md:text-4xl font-medium tracking-tight">{currentPatient.name}</h3>
                  <p className="text-endava-orange text-lg font-bold uppercase tracking-widest mt-1">ID: {currentPatient.id} | Cardiology Unit</p>
                </div>
                <div className="flex gap-4 flex-shrink-0">
                  <button className="p-4 bg-white/5 hover:bg-white/10 rounded-2xl transition-all border border-white/5">
                    <MessageSquare className="w-6 h-6 text-endava-orange" />
                  </button>
                  <button className="p-4 bg-white/5 hover:bg-white/10 rounded-2xl transition-all border border-white/5">
                    <Activity className="w-6 h-6 text-endava-orange" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 md:gap-8 mb-12">
                {[
                  { label: 'Heart Rate', value: '72 bpm', status: 'Healthy' },
                  { label: 'Blood Pressure', value: '118/79', status: 'Stable' },
                  { label: 'Temperature', value: '98.6°F', status: 'Normal' },
                  { label: 'Oxygen Sat.', value: '99%', status: 'Optimal' }
                ].map((v, i) => (
                  <div key={i} className="bg-endava-dark p-6 rounded-3xl border border-white/5 hover:border-endava-orange/30 transition-all group">
                    <div className="text-endava-blue-50 text-[10px] md:text-xs font-black uppercase tracking-widest mb-3 group-hover:text-endava-orange transition-colors">{v.label}</div>
                    <div className="text-2xl md:text-3xl font-black mb-1">{v.value}</div>
                    <div className="text-[10px] font-bold text-green-500 uppercase tracking-tighter">{v.status}</div>
                  </div>
                ))}
              </div>

              <div className="mt-auto bg-endava-orange/5 rounded-3xl p-8 md:p-10 border border-endava-orange/20 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-20 transition-opacity">
                  <Sparkles className="w-32 h-32 text-endava-orange" />
                </div>

                <h4 className="text-xl md:text-2xl font-medium mb-6 flex items-center gap-3">
                  <Sparkles className="text-endava-orange w-6 h-6 animate-pulse" /> Gemini Clinical Insights
                </h4>

                {summary ? (
                  <div className="text-lg md:text-2xl leading-relaxed text-endava-blue-20 animate-in fade-in slide-in-from-top-2 font-light">
                    {summary}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-10">
                    <KioskButton
                      onClick={handleSummarize}
                      disabled={isSummarizing}
                      variant="secondary"
                      size="lg"
                    >
                      {isSummarizing ? (
                        <>
                          <Activity className="w-6 h-6 animate-spin" />
                          ANALYZING CLINICAL LOGS...
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-6 h-6 group-hover:animate-bounce transition-all" />
                          GENERATE AI SUMMARY
                        </>
                      )}
                    </KioskButton>
                    <p className="text-endava-blue-50 mt-6 font-bold uppercase tracking-widest text-xs">Cross-referencing EMR logs with patient history</p>
                  </div>
                )}
              </div>
            </KioskCard>
          ) : (
            <KioskCard className="border-dashed border-white/10 h-full min-h-[450px] flex flex-col items-center justify-center text-center shadow-inner p-10">
              <div className="bg-white/5 p-10 rounded-full mb-8">
                <Stethoscope className="w-20 h-20 text-endava-blue-60" strokeWidth={1} />
              </div>
              <h3 className="text-3xl font-medium text-endava-blue-40">Select Admission</h3>
              <p className="text-xl text-endava-blue-50 mt-4 max-w-sm font-light">Choose a patient from the registry to begin high-fidelity clinical summarization.</p>
            </KioskCard>
          )}
        </main>
      </div>
    </div>
  );
};

export default HealthcareDemo;
