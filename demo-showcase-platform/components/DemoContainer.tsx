
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
      <div className="h-full w-full flex flex-col items-center justify-center bg-[#0b0c0d] relative overflow-hidden">
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-[#DE411B]/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-[#DE411B]/5 rounded-full blur-[120px] animate-pulse delay-700" />

        <div className="relative z-10 flex flex-col items-center max-w-lg w-full px-10">
          <div className="relative mb-12">
            <svg className="w-48 h-48 md:w-64 md:h-64 transform -rotate-90">
              <circle cx="50%" cy="50%" r="45%" className="stroke-white/5 fill-none" strokeWidth="4" />
              <circle cx="50%" cy="50%" r="45%" className="stroke-[#DE411B] fill-none transition-all duration-75 ease-linear" strokeWidth="4" strokeDasharray="283%" strokeDashoffset={`${283 - (283 * progress) / 100}%`} strokeLinecap="round" />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative">
                 <div className="absolute inset-0 bg-[#DE411B] blur-2xl opacity-20 animate-pulse" />
                 <div className="relative w-16 h-16 md:w-24 md:h-24 bg-[#121417] border border-white/10 rounded-3xl flex items-center justify-center shadow-2xl">
                    {progress < 30 && <Globe className="w-8 h-8 md:w-12 md:h-12 text-[#DE411B] animate-bounce" />}
                    {progress >= 30 && progress < 60 && <Database className="w-8 h-8 md:w-12 md:h-12 text-[#DE411B] animate-pulse" />}
                    {progress >= 60 && progress < 90 && <Cpu className="w-8 h-8 md:w-12 md:h-12 text-[#DE411B] animate-spin" />}
                    {progress >= 90 && <Zap className="w-8 h-8 md:w-12 md:h-12 text-[#DE411B] animate-ping" />}
                 </div>
              </div>
            </div>
            <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-[#0b0c0d] px-4 py-1 border border-white/10 rounded-full">
               <span className="text-xl md:text-2xl font-black text-white tabular-nums">{Math.round(progress)}%</span>
            </div>
          </div>

          <div className="text-center space-y-4 w-full">
            <h2 className="text-3xl md:text-5xl font-black tracking-tighter uppercase italic flex items-center justify-center gap-4">
              {verticalConfig?.title.split(' ')[0]} <span className="text-[#DE411B]">{verticalConfig?.title.split(' ').slice(1).join(' ') || 'Demo'}</span>
            </h2>
            <div className="h-6 overflow-hidden">
               <p className="text-gray-500 font-bold tracking-[0.2em] uppercase text-xs md:text-sm animate-in slide-in-from-bottom-2 duration-300">
                 {getStatusMessage(progress)}
               </p>
            </div>
            <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden mt-8">
              <div className="h-full bg-gradient-to-r from-[#DE411B] to-[#ff6b4a] transition-all duration-75 ease-linear" style={{ width: `${progress}%` }} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (verticalConfig?.externalUrl) {
    return (
      <div className="h-full w-full flex flex-col animate-in fade-in duration-700">
        <div className="bg-[#1a1c1e] px-6 py-2 border-b border-white/5 flex items-center justify-between text-[10px] font-black tracking-[0.2em] text-gray-600 uppercase">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-3 h-3 text-[#DE411B]" /> Endava Sandboxed Session
          </div>
          {/* <div className="flex items-center gap-4">
            <span>{verticalConfig.externalUrl}</span>
            <a href={verticalConfig.externalUrl} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
              <ExternalLink className="w-3 h-3" />
            </a>
          </div> */}
        </div>
        <div className="flex-grow relative bg-white">
          <iframe src={verticalConfig.externalUrl} className="absolute inset-0 w-full h-full border-none" title={verticalConfig.title} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
        </div>
      </div>
    );
  }

  if (verticalConfig?.isAiGenerated) {
    return <DynamicAIDemo config={verticalConfig} />;
  }

  const renderDemo = () => {
    switch (currentVerticalId) {
      case 'retail': return <RetailDemo />;
      case 'healthcare': return <HealthcareDemo />;
      case 'fintech': return <FinTechDemo />;
      default: return (
        <div className="p-12 h-full flex flex-col items-center justify-center text-center">
          <div className="bg-white/5 p-12 rounded-full mb-8">
             <ExternalLink className="w-20 h-20 text-gray-700" strokeWidth={1} />
          </div>
          <h2 className="text-4xl font-black text-gray-400 uppercase tracking-tighter">Vertical Offline</h2>
          <p className="text-xl mt-4 text-gray-600 font-light max-w-md">Maintenance mode enabled for this showcase module.</p>
        </div>
      );
    }
  };

  return <div className="h-full w-full animate-in fade-in slide-in-from-bottom-4 duration-500">{renderDemo()}</div>;
};

export default DemoContainer;
