
import React from 'react';
import { useStore } from '../store/useStore';

const AttractMode: React.FC = () => {
  const updateActivity = useStore((state) => state.updateActivity);

  return (
    <div 
      className="fixed inset-0 z-[100] bg-[#0b0c0d] flex flex-col items-center justify-center cursor-pointer animate-in fade-in duration-1000"
      onClick={updateActivity}
    >
      <div className="relative w-full h-full overflow-hidden flex items-center justify-center">
        {/* Endava Themed Background */}
        <div className="absolute inset-0 bg-gradient-to-tr from-[#DE411B]/20 via-black to-black animate-pulse" />
        
        {/* Kinetic Tech Patterns */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(#DE411B_1px,transparent_1px)] [background-size:40px_40px]" />
        </div>

        <div className="z-10 text-center space-y-8 md:space-y-12 px-6 max-w-5xl">
          <div className="flex justify-center mb-6">
            <div className="relative animate-in zoom-in duration-700">
              <div className="absolute inset-0 bg-[#DE411B] blur-3xl opacity-20 animate-pulse rounded-2xl" />
              <div className="relative flex items-center gap-4">
                <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl overflow-hidden">
                  <img
                    src="https://cdn.brandfetch.io/id4YZ7PWEj/w/200/h/200/theme/dark/icon.jpeg?c=1bxid64Mup7aczewSAYMX&t=1761617484712"
                    alt="Endava Logo"
                    className="w-full h-full object-cover"
                  />
                </div>
                <span className="text-3xl md:text-4xl font-black tracking-tight text-white">
                  Endava
                </span>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <h2 className="text-xl md:text-4xl lg:text-5xl font-light tracking-[0.25em] text-gray-400 uppercase">
              Showcase Platform
            </h2>
          </div>
          
          <p className="text-lg md:text-2xl lg:text-3xl text-gray-300 font-medium max-w-3xl mx-auto leading-relaxed px-4">
            Accelerating Digital Evolution with <span className="text-[#DE411B] font-black">Google Cloud</span>
          </p>

          <div className="mt-8 md:mt-16 animate-bounce">
            <div className="bg-[#DE411B] text-white px-8 md:px-12 py-4 md:py-6 rounded-full shadow-[0_0_50px_rgba(222,65,27,0.3)] font-black text-xl md:text-3xl tracking-wide uppercase">
              Start Exploring
            </div>
          </div>
        </div>
      </div>
      
      <div className="absolute bottom-12 left-0 right-0 text-center flex flex-col items-center gap-3">
        <div className="w-16 h-1 bg-[#DE411B] rounded-full" />
        <span className="text-gray-600 text-[10px] md:text-xs font-black tracking-[0.4em] uppercase">
          Endava
        </span>
      </div>
    </div>
  );
};

export default AttractMode;
