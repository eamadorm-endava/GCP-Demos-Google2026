
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
          <div className="flex justify-center mb-4">
             {/* Official Endava Wordmark SVG */}
             <div className="relative animate-in zoom-in duration-700">
                <div className="absolute inset-0 bg-[#DE411B] blur-3xl opacity-20 animate-pulse" />
                <svg width="320" height="100" viewBox="0 0 200 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-64 md:w-[400px] lg:w-[500px] h-auto relative z-10">
                  <path d="M15 42C10.5 42 7 38.5 7 34C7 29.5 10.5 26 15 26C19.5 26 23 29.5 23 34H12C12 35.5 13.5 37 15 37C16.5 37 17.5 36.5 18 35.5L22.5 37C21.5 39.5 18.5 42 15 42ZM12 31H18C17.5 29.5 16.5 28.5 15 28.5C13.5 28.5 12.5 29.5 12 31Z" fill="#DE411B" />
                  <path d="M28 26.5V28.5C29 27 31 26 33.5 26C38 26 41 29 41 33.5V41.5H36V34C36 31.5 34.5 30.5 32.5 30.5C30.5 30.5 28.5 32 28.5 34.5V41.5H23.5V26.5H28Z" fill="#DE411B" />
                  <path d="M57 41.5H52.5V39.5C51.5 41 49.5 42 47 42C42.5 42 39 38.5 39 34C39 29.5 42.5 26 47 26C49.5 26 51.5 27 52.5 28.5V18H57V41.5ZM48 37.5C50.5 37.5 52.5 35.5 52.5 33.5C52.5 31.5 50.5 29.5 48 29.5C45.5 29.5 43.5 31.5 43.5 33.5C43.5 35.5 45.5 37.5 48 37.5Z" fill="#DE411B" />
                  <path d="M72 42C68 42 65 40 64 37L68 35.5C68.5 36.5 69.5 37.5 71.5 37.5C73.5 37.5 74.5 36.5 74.5 35.5C74.5 34.5 73.5 34 71 33.5C67.5 33 64.5 31.5 64.5 28C64.5 24.5 67.5 22 71.5 22C75 22 77.5 23.5 78.5 26.5L74.5 28C74 27 73 26 71.5 26C70 26 69 26.5 69 27.5C69 28.5 70 29 72.5 29.5C76 30 79 31.5 79 35C79 38.5 76 42 72 42Z" fill="#DE411B" />
                  <path d="M96 26.5L89 41.5H84L77 26.5H82.5L86.5 36L90.5 26.5H96Z" fill="#DE411B" />
                  <path d="M111 41.5H106.5V39.5C105.5 41 103.5 42 101 42C96.5 42 93 38.5 93 34C93 29.5 96.5 26 101 26C103.5 26 105.5 27 106.5 28.5V18H111V41.5ZM102 37.5C104.5 37.5 106.5 35.5 106.5 33.5C106.5 31.5 104.5 29.5 102 29.5C99.5 29.5 97.5 31.5 97.5 33.5C97.5 35.5 99.5 37.5 102 37.5Z" fill="#DE411B" />
                </svg>
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
          Mandalay Bay • Booth #204
        </span>
      </div>
    </div>
  );
};

export default AttractMode;
