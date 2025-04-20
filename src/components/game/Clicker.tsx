import React, { useState } from "react";
import { useGame } from "@/context/GameContext";
import { motion } from "framer-motion";
import { Receipt, FileCheck2, Bot } from "lucide-react";

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
  const [currentIcon, setCurrentIcon] = useState<number>(0);
  
  const icons = [
    <Receipt key="receipt" className="w-16 h-16 text-white" />,
    <FileCheck2 key="filecheck" className="w-16 h-16 text-white" />,
    <Bot key="bot" className="w-16 h-16 text-white" />
  ];

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    clickEntry();
    setIsClicking(true);
    setCurrentIcon((prev) => (prev + 1) % icons.length);
    setTimeout(() => setIsClicking(false), 100);

    // Create particle at click position
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
        {formatEntries(Math.floor(state.entries))} écritures automatisées
      </div>
      <div className="text-sm text-pennylane-gray">
        Automatisation par clic: {formatEntries(state.entriesPerClick)}
      </div>
      <div className="text-sm text-pennylane-gray">
        Automatisation par seconde: {formatEntries(Math.floor(state.entriesPerSecond))}
      </div>
      
      <div className="relative">
        <motion.button
          className="w-32 h-32 md:w-40 md:h-40 bg-gradient-to-br from-[#003d3d] to-[#006666] rounded-full 
                    flex items-center justify-center shadow-lg hover:shadow-xl transition-all 
                    hover:from-[#004d4d] hover:to-[#007f7f] relative overflow-hidden"
          animate={isClicking ? { scale: 0.95 } : { scale: 1 }}
          transition={{ type: "spring", stiffness: 500, damping: 15 }}
          onClick={handleClick}
        >
          <motion.div
            key={currentIcon}
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.5, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {icons[currentIcon]}
          </motion.div>
          
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
        Documents traités: {state.clickCount.toLocaleString('fr-FR')}
      </div>
    </div>
  );
};

export default Clicker;
