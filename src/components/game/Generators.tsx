
import React from "react";
import { useGame } from "@/context/GameContext";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Info } from "lucide-react";
import { motion } from "framer-motion";

const Generators: React.FC = () => {
  const { state, buyGenerator, showFeature } = useGame();

  const calculateGeneratorCost = (baseCost: number, count: number): number => {
    return Math.floor(baseCost * Math.pow(1.15, count));
  };

  const formatEntries = (num: number): string => {
    return new Intl.NumberFormat('fr-FR').format(num);
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold border-b pb-2 border-pennylane-light-gray">Personnel Comptable</h2>
      <div className="space-y-3">
        {state.generators
          .filter((generator) => generator.unlocked)
          .map((generator) => {
            const cost = calculateGeneratorCost(generator.baseCost, generator.count);
            const canAfford = state.entries >= cost;
            const output = generator.baseOutput * generator.count;
            const hasFeature = generator.pennylaneFeature && generator.count > 0;
            const featureShown = hasFeature && generator.pennylaneFeature?.shown;

            return (
              <motion.div 
                key={generator.id} 
                className={`p-3 rounded-md border ${canAfford ? "border-pennylane-light-gray" : "border-gray-200 opacity-80"}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center">
                      <h3 className="font-medium">{generator.name}</h3>
                      {hasFeature && !featureShown && (
                        <button 
                          onClick={() => showFeature(`generator:${generator.id}`)}
                          className="ml-2 text-[#003d3d] hover:text-green-800 transition-colors"
                        >
                          <Info size={16} />
                        </button>
                      )}
                    </div>
                    <p className="text-xs text-pennylane-gray">{generator.description}</p>
                    <div className="text-sm mt-1">
                      <span className="font-medium">{generator.count}</span> possédés
                      {output > 0 && (
                        <span className="ml-2 text-[#003d3d]">
                          {formatEntries(Math.floor(output))} écritures/sec
                        </span>
                      )}
                    </div>
                  </div>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button 
                          onClick={() => buyGenerator(generator.id)} 
                          disabled={!canAfford}
                          size="sm" 
                          className={canAfford 
                            ? "bg-[#003d3d] hover:bg-green-800" 
                            : "bg-gray-300"
                          }
                        >
                          {formatEntries(Math.floor(cost))} écritures
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent side="top">
                        <p>Génère {formatEntries(generator.baseOutput)} écritures par seconde</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>

                {/* Pennylane Feature Banner */}
                {hasFeature && featureShown && (
                  <motion.div 
                    className="mt-3 p-2 bg-pennylane-yellow rounded border border-yellow-300 text-sm"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="font-medium text-[#003d3d]">
                      ✨ {generator.pennylaneFeature?.title}
                    </div>
                    <div className="text-xs mt-1">{generator.pennylaneFeature?.description}</div>
                  </motion.div>
                )}
              </motion.div>
            );
          })}
      </div>
    </div>
  );
};

export default Generators;
