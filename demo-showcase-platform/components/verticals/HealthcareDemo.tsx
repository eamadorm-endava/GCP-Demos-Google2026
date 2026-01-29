
import React, { useState } from 'react';
import { useStore } from '../../store/useStore';
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
          <h2 className="text-3xl md:text-4xl font-black">Patient <span className="text-[#DE411B]">Intelligence</span></h2>
          <p className="text-lg md:text-xl text-gray-500 font-light tracking-tight">Gemini Pro Clinical Summary Analysis</p>
        </div>
        <div className="self-start md:self-center bg-[#DE411B]/10 text-[#DE411B] px-4 md:px-6 py-2 md:py-3 rounded-full font-black flex items-center gap-2 border border-[#DE411B]/20 text-sm md:text-base whitespace-nowrap tracking-widest uppercase">
          <Activity className="w-5 h-5 md:w-6 md:h-6" /> SECURE DATA PORTAL
        </div>
      </header>

      <div className="flex flex-col lg:flex-row gap-8 pb-40">
        <aside className="lg:w-80 flex-shrink-0 bg-[#121417] rounded-3xl p-6 border border-white/5 space-y-4 shadow-xl">
          <h3 className="text-xl font-bold mb-4 flex items-center gap-3 text-gray-300">
            <ClipboardList className="text-[#DE411B] w-5 h-5" /> Admissions
          </h3>
          <div className="flex flex-row lg:flex-col gap-4 overflow-x-auto lg:overflow-x-visible pb-2 lg:pb-0 custom-scrollbar">
            {demoData.patients.map((p) => (
              <button
                key={p.id}
                onClick={() => { setActivePatient(p.id); setSummary(null); }}
                className={`min-w-[220px] lg:min-w-0 flex-shrink-0 text-left p-5 rounded-2xl transition-all border ${
                  activePatient === p.id 
                    ? 'bg-[#DE411B] border-[#DE411B] shadow-lg shadow-[#DE411B]/20 text-white' 
                    : 'bg-white/5 border-transparent hover:bg-white/10 text-gray-400'
                }`}
              >
                <div className="font-black text-lg mb-1">{p.name}</div>
                <div className={`text-xs font-bold uppercase tracking-widest ${activePatient === p.id ? 'text-white/80' : 'text-gray-600'}`}>
                   {p.condition} • {p.age} YRS
                </div>
              </button>
            ))}
          </div>
        </aside>

        <main className="flex-grow space-y-8">
          {currentPatient ? (
            <div className="bg-[#121417] rounded-3xl p-6 md:p-10 border border-white/5 min-h-[550px] flex flex-col shadow-2xl">
              <div className="flex flex-col sm:flex-row justify-between items-start mb-10 gap-6">
                <div>
                  <h3 className="text-3xl md:text-4xl font-black tracking-tight">{currentPatient.name}</h3>
                  <p className="text-[#DE411B] text-lg font-bold uppercase tracking-widest mt-1">ID: {currentPatient.id} | Cardiology Unit</p>
                </div>
                <div className="flex gap-4 flex-shrink-0">
                  <button className="p-4 bg-white/5 hover:bg-white/10 rounded-2xl transition-all border border-white/5">
                    <MessageSquare className="w-6 h-6 text-[#DE411B]" />
                  </button>
                  <button className="p-4 bg-white/5 hover:bg-white/10 rounded-2xl transition-all border border-white/5">
                    <Activity className="w-6 h-6 text-[#DE411B]" />
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
                  <div key={i} className="bg-[#1a1c1e] p-6 rounded-3xl border border-white/5 hover:border-[#DE411B]/30 transition-all group">
                    <div className="text-gray-600 text-[10px] md:text-xs font-black uppercase tracking-widest mb-3 group-hover:text-[#DE411B] transition-colors">{v.label}</div>
                    <div className="text-2xl md:text-3xl font-black mb-1">{v.value}</div>
                    <div className="text-[10px] font-bold text-green-500 uppercase tracking-tighter">{v.status}</div>
                  </div>
                ))}
              </div>

              <div className="mt-auto bg-[#DE411B]/5 rounded-3xl p-8 md:p-10 border border-[#DE411B]/20 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-20 transition-opacity">
                  <Sparkles className="w-32 h-32 text-[#DE411B]" />
                </div>
                
                <h4 className="text-xl md:text-2xl font-black mb-6 flex items-center gap-3">
                  <Sparkles className="text-[#DE411B] w-6 h-6 animate-pulse" /> Gemini Clinical Insights
                </h4>

                {summary ? (
                  <div className="text-lg md:text-2xl leading-relaxed text-gray-200 animate-in fade-in slide-in-from-top-2 font-light">
                    {summary}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-10">
                    <button 
                      onClick={handleSummarize}
                      disabled={isSummarizing}
                      className="group flex items-center gap-4 bg-[#DE411B] text-white px-8 md:px-12 py-5 md:py-6 rounded-2xl font-black text-xl hover:bg-[#c43616] transition-all disabled:opacity-50 shadow-xl shadow-[#DE411B]/20"
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
                    </button>
                    <p className="text-gray-600 mt-6 font-bold uppercase tracking-widest text-xs">Cross-referencing EMR logs with patient history</p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-[#121417] rounded-3xl p-10 border border-dashed border-white/10 h-full min-h-[450px] flex flex-col items-center justify-center text-center shadow-inner">
              <div className="bg-white/5 p-10 rounded-full mb-8">
                <Stethoscope className="w-20 h-20 text-gray-700" strokeWidth={1} />
              </div>
              <h3 className="text-3xl font-black text-gray-500">Select Admission</h3>
              <p className="text-xl text-gray-700 mt-4 max-w-sm font-light">Choose a patient from the registry to begin high-fidelity clinical summarization.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default HealthcareDemo;
