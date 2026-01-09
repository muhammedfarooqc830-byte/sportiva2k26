import React, { useEffect, useState } from 'react';

interface IntroScreenProps {
  onComplete: () => void;
}

const IntroScreen: React.FC<IntroScreenProps> = ({ onComplete }) => {
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    // Start exit animation after 2.5 seconds
    const exitTimer = setTimeout(() => {
      setIsExiting(true);
    }, 2500);

    // Unmount after animation finishes (3.5s total)
    const completeTimer = setTimeout(() => {
      onComplete();
    }, 3700); // Slightly longer than CSS transition to ensure clean cut

    return () => {
      clearTimeout(exitTimer);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  return (
    <div 
      className={`fixed inset-0 z-[100] bg-white dark:bg-gray-900 flex flex-col items-center justify-center transition-all duration-1000 ease-in-out ${
        isExiting ? 'opacity-0 pointer-events-none scale-105' : 'opacity-100 scale-100'
      }`}
    >
      <div className="relative text-center px-6 animate-fade-in-up">
        {/* Decorative Top Line */}
        <div className="w-16 h-1 bg-indigo-600 mx-auto mb-8 rounded-full opacity-80"></div>

        {/* Institution Name */}
        <p className="text-gray-500 dark:text-gray-400 font-bold tracking-[0.25em] uppercase text-xs sm:text-sm mb-6">
          Jamia Islamiya Arts and Science College
        </p>

        {/* Event Name (Ceremonial Title) */}
        <h1 className="text-5xl sm:text-7xl md:text-8xl font-black text-gray-900 dark:text-white tracking-tighter mb-4 leading-none">
          SPORTIVA <span className="text-transparent bg-clip-text bg-gradient-to-br from-indigo-600 to-blue-500 dark:from-indigo-400 dark:to-blue-400">2K26</span>
        </h1>

        {/* Subtitle */}
        <p className="text-xl sm:text-2xl text-gray-400 dark:text-gray-500 font-light tracking-[0.2em] uppercase mt-4">
          Annual Sports Meet
        </p>
      </div>

      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
          animation: fadeInUp 1.4s cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }
      `}</style>
    </div>
  );
};

export default IntroScreen;