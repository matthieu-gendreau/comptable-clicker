
import React, { useState } from "react";
import { useGame } from "@/context/GameContext";
import { Clock, ChevronDown, ChevronUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const Stats: React.FC = () => {
  const { state } = useGame();
  const [isOpen, setIsOpen] = useState(false);
  
  const formatEntries = (num: number): string => {
    return new Intl.NumberFormat('fr-FR').format(num);
  };
  
  // Calculate time played
  const timePlayed = Math.floor((Date.now() - state.gameStartedAt) / 1000); // in seconds
  const hours = Math.floor(timePlayed / 3600);
  const minutes = Math.floor((timePlayed % 3600) / 60);
  const seconds = timePlayed % 60;
  
  // Format time
  const formatTime = (hours: number, minutes: number, seconds: number) => {
    if (hours > 0) {
      return `${hours}h ${minutes}m ${seconds}s`;
    } else if (minutes > 0) {
      return `${minutes}m ${seconds}s`;
    } else {
      return `${seconds}s`;
    }
  };
  
  // Calculate total generators and upgrades
  const totalGenerators = state.generators.reduce((acc, gen) => acc + gen.count, 0);
  const totalUpgrades = state.upgrades.filter(u => u.purchased).length;
  
  return (
    <div className="border rounded-md p-3">
      <div 
        className="flex justify-between items-center cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center">
          <Clock className="w-5 h-5 mr-2 text-pennylane-purple" />
          <h2 className="font-medium">Statistiques</h2>
        </div>
        {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
      </div>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            className="mt-3 grid grid-cols-2 gap-2 text-sm"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="col-span-2 p-2 bg-pennylane-light-gray bg-opacity-30 rounded-md">
              <div className="font-medium">Temps de jeu</div>
              <div>{formatTime(hours, minutes, seconds)}</div>
            </div>
            
            <div className="p-2 bg-pennylane-light-gray bg-opacity-30 rounded-md">
              <div className="font-medium">Écritures totales</div>
              <div>{formatEntries(state.totalEntries)}</div>
            </div>
            
            <div className="p-2 bg-pennylane-light-gray bg-opacity-30 rounded-md">
              <div className="font-medium">Clics totaux</div>
              <div>{state.clickCount.toLocaleString('fr-FR')}</div>
            </div>
            
            <div className="p-2 bg-pennylane-light-gray bg-opacity-30 rounded-md">
              <div className="font-medium">Personnel</div>
              <div>{totalGenerators}</div>
            </div>
            
            <div className="p-2 bg-pennylane-light-gray bg-opacity-30 rounded-md">
              <div className="font-medium">Améliorations</div>
              <div>{totalUpgrades}</div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Stats;
