
import React, { useState } from "react";
import { useGame } from "@/context/GameContext";
import { motion } from "framer-motion";
import { CircleDollarSign } from "lucide-react";

interface ClickParticle {
  id: number;
  x: number;
  y: number;
  value: number;
}

const Clicker: React.FC = () => {
  const { clickEuro: clickEntry, state } = useGame();
  const [particles, setParticles] = useState<ClickParticle[]>([]);
  const [isClicking, setIsClicking] = useState(false);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    clickEntry();
    setIsClicking(true);
    setTimeout(() => setIsClicking(false), 100);

    // Create particle at click position within the button
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const newParticle = {
      id: Date.now(),
      x,
      y,
      value: state.entriesPerClick,
    };

    setParticles((prev) => [...prev, newParticle]);
    setTimeout(() => {
      setParticles((prev) => prev.filter((p) => p.id !== newParticle.id));
    }, 1000);
  };

  const formatEntries = (num: number): string => {
    return new Intl.NumberFormat('fr-FR').format(num);
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-2">
      <div className="text-3xl md:text-4xl font-bold text-[#003d3d] mb-2">
        {formatEntries(Math.floor(state.entries))} écritures
      </div>
      <div className="text-sm text-pennylane-gray">
        Par clic: {formatEntries(state.entriesPerClick)}
      </div>
      <div className="text-sm text-pennylane-gray">
        Par seconde: {formatEntries(Math.floor(state.entriesPerSecond))}
      </div>
      
      <div className="relative">
        <motion.button
          className="w-32 h-32 md:w-40 md:h-40 bg-[#003d3d] rounded-full flex items-center justify-center 
                    shadow-lg hover:shadow-xl transition-shadow relative overflow-hidden"
          animate={isClicking ? { scale: 0.95 } : { scale: 1 }}
          transition={{ type: "spring", stiffness: 500, damping: 15 }}
          onClick={handleClick}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
            <path d="M18 3 7 4 3 8v13h18V8l-3-5Z"/>
            <path d="M9 11h6"/>
            <path d="M12 15h3"/>
            <path d="M9 15h.01"/>
          </svg>
          
          {/* Ripple effect */}
          {isClicking && (
            <motion.div
              className="absolute inset-0 bg-white rounded-full"
              initial={{ opacity: 0.3, scale: 0.5 }}
              animate={{ opacity: 0, scale: 1.5 }}
              transition={{ duration: 0.5 }}
            />
          )}
        </motion.button>

        {/* Click particles */}
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute pointer-events-none text-xs font-medium text-[#003d3d]"
            initial={{ x: particle.x, y: particle.y, opacity: 1, scale: 0.8 }}
            animate={{ y: particle.y - 50, opacity: 0, scale: 1.2 }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            +{formatEntries(particle.value)}
          </motion.div>
        ))}
      </div>

      <div className="text-xs text-pennylane-gray mt-2">
        Clics totaux: {state.clickCount.toLocaleString('fr-FR')}
      </div>
    </div>
  );
};

export default Clicker;
