
import React, { useState, useEffect } from 'react';
import { useStore } from '../store/useStore';
import RetailDemo from './verticals/RetailDemo';
import HealthcareDemo from './verticals/HealthcareDemo';
import FinTechDemo from './verticals/FinTechDemo';
import DynamicAIDemo from './DynamicAIDemo';
import { Loader2, ExternalLink, ShieldCheck, Zap, Database, Cpu, Globe } from 'lucide-react';

const DemoContainer: React.FC = () => {
  const currentVerticalId = useStore((state) => state.currentVertical);
  const verticals = useStore((state) => state.availableVerticals);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  const verticalConfig = verticals.find(v => v.id === currentVerticalId);

  const getStatusMessage = (p: number) => {
    if (p < 30) return "Establishing Secure Handshake...";
    if (p < 60) return "Provisioning Vertex AI Instance...";
    if (p < 90) return "Synchronizing Model Weights...";
    return "Optimizing Interface...";
  };

  useEffect(() => {
    setLoading(true);
    setProgress(0);

    const duration = 1200;
    const intervalTime = 20;
    const steps = duration / intervalTime;
    const increment = 100 / steps;

    const interval = setInterval(() => {
      setProgress((prev) => {
        const next = prev + increment;
        if (next >= 100) {
          clearInterval(interval);
          setLoading(false);
          return 100;
        }
        return next;
      });
    }, intervalTime);

    return () => clearInterval(interval);
  }, [currentVerticalId]);

  if (loading) {
    return (
      <div className="h-full w-full flex flex-col items-center justify-center bg-endava-dark relative overflow-hidden">
        <div className="absolute top-1/4 -left-20 w-[40rem] h-[40rem] bg-endava-orange/10 rounded-full blur-[150px] animate-pulse" />
        <div className="absolute bottom-1/4 -right-20 w-[40rem] h-[40rem] bg-endava-orange/5 rounded-full blur-[150px] animate-pulse delay-700" />

        <div className="relative z-10 flex flex-col items-center max-w-4xl w-full px-10">
          <div className="relative mb-12">
            <svg className="w-48 h-48 md:w-64 md:h-64 transform -rotate-90">
              <circle cx="50%" cy="50%" r="45%" className="stroke-white/5 fill-none" strokeWidth="4" />
              <circle cx="50%" cy="50%" r="45%" className="stroke-endava-orange fill-none transition-all duration-75 ease-linear" strokeWidth="4" strokeDasharray="283%" strokeDashoffset={`${283 - (283 * progress) / 100}%`} strokeLinecap="round" />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative">
                <div className="absolute inset-0 bg-endava-orange blur-3xl opacity-30 animate-pulse" />
                <div className="relative w-20 h-20 md:w-28 md:h-28 kiosk-card-glass flex items-center justify-center shadow-2xl">
                  {progress < 30 && <Globe className="w-10 h-10 md:w-14 md:h-14 text-endava-orange animate-bounce" />}
                  {progress >= 30 && progress < 60 && <Database className="w-10 h-10 md:w-14 md:h-14 text-endava-orange animate-pulse" />}
                  {progress >= 60 && progress < 90 && <Cpu className="w-10 h-10 md:w-14 md:h-14 text-endava-orange animate-spin" />}
                  {progress >= 90 && <Zap className="w-10 h-10 md:w-14 md:h-14 text-endava-orange animate-ping" />}
                </div>
              </div>
            </div>
            <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 bg-endava-dark/80 backdrop-blur-md px-6 py-1.5 border border-white/10 rounded-full shadow-lg">
              <span className="text-2xl md:text-3xl font-black text-white tabular-nums endava-text-glow">{Math.round(progress)}%</span>
            </div>
          </div>

          <div className="text-center space-y-8 w-full">
            <h2 className="text-3xl md:text-5xl font-medium tracking-tighter uppercase italic flex items-center justify-center gap-4">
              {verticalConfig?.title.split(' ')[0]} <span className="text-endava-orange">{verticalConfig?.title.split(' ').slice(1).join(' ') || 'Demo'}</span>
            </h2>
            <div className="h-10 overflow-hidden">
              <p className="text-endava-blue-50 font-bold tracking-[0.3em] uppercase text-[10px] md:text-sm animate-in slide-in-from-bottom-2 duration-300">
                {getStatusMessage(progress)}
              </p>
            </div>
            <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden mt-8">
              <div className="h-full bg-gradient-to-r from-endava-orange to-[#ff8c7a] transition-all duration-75 ease-linear" style={{ width: `${progress}%` }} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  const renderContent = () => {
    // 1. External IFrame Demo
    if (verticalConfig?.externalUrl) {
      return (
        <div className="flex-grow w-full h-full bg-white relative">
          <iframe
            src={verticalConfig.externalUrl}
            className="w-full h-full border-none"
            title={verticalConfig.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      );
    }

    // 2. AI Generated Dynamic Demo
    if (verticalConfig?.isAiGenerated) {
      return <DynamicAIDemo config={verticalConfig} />;
    }

    // 3. Registered Manual Demo (Plug-and-Play)
    switch (currentVerticalId) {
      case 'retail': return <div className="h-full w-full"><RetailDemo /></div>;
      case 'healthcare': return <div className="h-full w-full"><HealthcareDemo /></div>;
      case 'fintech': return <div className="h-full w-full"><FinTechDemo /></div>;
      default: return (
        // 4. Default Fallback
        <div className="p-12 h-full flex flex-col items-center justify-center text-center">
          <div className="bg-white/5 p-12 rounded-full mb-8">
            <ExternalLink className="w-20 h-20 text-endava-blue-50" strokeWidth={1} />
          </div>
          <h2 className="text-4xl font-medium text-endava-blue-40 uppercase tracking-tighter">Vertical Offline</h2>
          <p className="text-xl mt-4 text-endava-blue-50 font-light max-w-md">Maintenance mode enabled for this showcase module.</p>
        </div>
      );
    }
  };

  return (
    <div className="h-full w-full p-8 flex animate-in fade-in duration-700">
      <div className="flex-grow bg-[#0f172a] rounded-2xl overflow-hidden border border-white/5 relative">
        {renderContent()}
      </div>
    </div>
  );
};

export default DemoContainer;
