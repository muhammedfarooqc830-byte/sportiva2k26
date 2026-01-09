import React, { useEffect, useState } from 'react';

interface Particle {
  id: number;
  x: number;
  y: number;
  rotation: number;
  speed: number;
  delay: number;
  type: 'ribbon' | 'confetti';
  color: string;
  size: number;
  side?: 'left' | 'right'; // For ribbons
}

const Celebration: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    const particleCount = 150;
    const newParticles: Particle[] = [];

    // Generate Red Ribbon Pieces (Sharp, clean cuts)
    for (let i = 0; i < 60; i++) {
      const side = i % 2 === 0 ? 'left' : 'right';
      // Start from sides, slightly above viewport
      const startX = side === 'left' ? Math.random() * 30 : 70 + Math.random() * 30;
      
      newParticles.push({
        id: i,
        x: startX, // percentage
        y: -10 - Math.random() * 20, // Start above screen
        rotation: Math.random() * 360,
        speed: 2 + Math.random() * 3, // Slow motion fall
        delay: Math.random() * 2,
        type: 'ribbon',
        color: Math.random() > 0.5 ? '#b91c1c' : '#dc2626', // Red-700 and Red-600
        size: 10 + Math.random() * 15,
        side
      });
    }

    // Generate Golden Confetti (Soft glow)
    for (let i = 0; i < 100; i++) {
      newParticles.push({
        id: i + 100,
        x: Math.random() * 100,
        y: -20 - Math.random() * 50,
        rotation: Math.random() * 360,
        speed: 1 + Math.random() * 2,
        delay: Math.random() * 3,
        type: 'confetti',
        color: '#fbbf24', // Amber-400
        size: 4 + Math.random() * 6,
      });
    }

    setParticles(newParticles);

    // Auto close after animation finishes (approx 8 seconds)
    const timer = setTimeout(onClose, 8000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 pointer-events-none flex items-center justify-center overflow-hidden">
      {/* Dimmed Background */}
      <div className="absolute inset-0 bg-black/60 animate-fade-in" />

      {/* Celebration Text Overlay */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center z-50 animate-bounce-in">
        <h1 className="text-6xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-yellow-100 to-yellow-300 drop-shadow-lg tracking-tighter">
          CONGRATULATIONS
        </h1>
        <p className="text-white text-xl md:text-2xl font-light tracking-[0.5em] mt-4 uppercase drop-shadow-md">
          Grand Total Announced
        </p>
      </div>

      {/* CSS for Keyframes */}
      <style>{`
        @keyframes fall {
          0% { transform: translateY(0) rotate(0deg); opacity: 0; }
          10% { opacity: 1; }
          100% { transform: translateY(110vh) rotate(720deg); opacity: 0; }
        }
        @keyframes sway {
          0%, 100% { transform: translateX(0); }
          50% { transform: translateX(25px); }
        }
        .animate-fade-in { animation: fadeIn 1s ease-out forwards; }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        
        .animate-bounce-in { animation: bounceIn 1.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards; }
        @keyframes bounceIn {
          0% { transform: translate(-50%, -50%) scale(0.5); opacity: 0; }
          100% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
        }
      `}</style>

      {/* Particles */}
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute shadow-sm"
          style={{
            left: `${p.x}%`,
            top: `-20px`, // Initial position before animation
            width: p.type === 'ribbon' ? `${p.size}px` : `${p.size}px`,
            height: p.type === 'ribbon' ? `${p.size * 0.6}px` : `${p.size}px`,
            backgroundColor: p.color,
            borderRadius: p.type === 'confetti' ? '50%' : '2px',
            boxShadow: p.type === 'confetti' ? '0 0 10px 2px rgba(251, 191, 36, 0.4)' : 'none',
            opacity: 0,
            animation: `fall ${p.speed + 4}s linear ${p.delay}s forwards`,
          }}
        />
      ))}
    </div>
  );
};

export default Celebration;