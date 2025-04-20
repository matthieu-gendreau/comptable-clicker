
import React, { useState } from "react";
import { useGame } from "@/context/GameContext";
import { Badge } from "@/components/ui/badge";
import { Trophy } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const Achievements: React.FC = () => {
  const { state } = useGame();
  const [isOpen, setIsOpen] = useState(false);
  
  const unlockedCount = state.achievements.filter(a => a.unlocked).length;
  const totalCount = state.achievements.length;

  return (
    <div className="border rounded-md p-3">
      <div 
        className="flex justify-between items-center cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center">
          <Trophy className="w-5 h-5 mr-2 text-pennylane-orange" />
          <h2 className="font-medium">Trophées</h2>
        </div>
        <Badge variant="outline" className="bg-pennylane-light-gray">
          {unlockedCount}/{totalCount}
        </Badge>
      </div>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            className="mt-3 space-y-2"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
          >
            {state.achievements.map((achievement) => (
              <div 
                key={achievement.id} 
                className={`p-2 rounded-md border flex items-center ${
                  achievement.unlocked 
                    ? "border-pennylane-yellow bg-pennylane-yellow bg-opacity-20" 
                    : "border-gray-200 bg-gray-50 opacity-70"
                }`}
              >
                <div className={`w-6 h-6 rounded-full flex items-center justify-center mr-2 ${
                  achievement.unlocked 
                    ? "bg-pennylane-orange text-white" 
                    : "bg-gray-200"
                }`}>
                  {achievement.unlocked ? "✓" : "?"}
                </div>
                <div>
                  <h3 className="text-sm font-medium">
                    {achievement.unlocked || !achievement.hidden 
                      ? achievement.name 
                      : "???"
                    }
                  </h3>
                  <p className="text-xs text-pennylane-gray">
                    {achievement.unlocked || !achievement.hidden 
                      ? achievement.description 
                      : "Trophée caché"
                    }
                  </p>
                </div>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Achievements;
