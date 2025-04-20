
import React from "react";
import { useGame } from "@/context/GameContext";
import { Button } from "@/components/ui/button";
import { Info } from "lucide-react";
import { motion } from "framer-motion";

const Upgrades: React.FC = () => {
  const { state, buyUpgrade, showFeature } = useGame();

  const formatEntries = (num: number): string => {
    return new Intl.NumberFormat('fr-FR').format(Math.floor(num));
  };

  const availableUpgrades = state.upgrades.filter(
    (upgrade) => upgrade.unlocked && !upgrade.purchased
  );

  const purchasedUpgrades = state.upgrades.filter(
    (upgrade) => upgrade.purchased
  );

  if (availableUpgrades.length === 0 && purchasedUpgrades.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold border-b pb-2 border-pennylane-light-gray">Améliorations</h2>
      
      {/* Available upgrades */}
      {availableUpgrades.length > 0 && (
        <div className="space-y-3">
          {availableUpgrades.map((upgrade) => {
            const canAfford = state.entries >= upgrade.cost;
            
            return (
              <motion.div 
                key={upgrade.id} 
                className={`p-3 rounded-md border ${canAfford ? "border-pennylane-light-gray" : "border-gray-200 opacity-80"}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium">{upgrade.name}</h3>
                    <p className="text-xs text-pennylane-gray">{upgrade.description}</p>
                  </div>
                  <Button 
                    onClick={() => buyUpgrade(upgrade.id)} 
                    disabled={!canAfford}
                    size="sm" 
                    className={canAfford 
                      ? "bg-[#003d3d] hover:bg-green-800 text-white" 
                      : "bg-gray-300"
                    }
                  >
                    {formatEntries(upgrade.cost)} écritures
                  </Button>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
      
      {/* Purchased upgrades */}
      {purchasedUpgrades.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-pennylane-gray">Améliorations achetées</h3>
          <div className="flex flex-wrap gap-2">
            {purchasedUpgrades.map((upgrade) => {
              const hasFeature = upgrade.pennylaneFeature;
              const featureShown = hasFeature && upgrade.pennylaneFeature?.shown;
              
              return (
                <div key={upgrade.id} className="relative">
                  <div 
                    className="w-10 h-10 bg-pennylane-light-gray rounded-md flex items-center justify-center border border-[#003d3d]"
                    title={upgrade.name}
                  >
                    {upgrade.name.charAt(0).toUpperCase()}
                  </div>
                  
                  {hasFeature && !featureShown && (
                    <button 
                      onClick={() => showFeature(`upgrade:${upgrade.id}`)}
                      className="absolute -top-1 -right-1 bg-[#003d3d] text-white rounded-full w-5 h-5 flex items-center justify-center hover:bg-green-800 transition-colors"
                      title="Voir la fonctionnalité Pennylane"
                    >
                      <Info size={12} />
                    </button>
                  )}
                  
                  {/* Feature popup for purchased upgrades */}
                  {hasFeature && featureShown && (
                    <motion.div 
                      className="absolute z-10 bottom-full left-1/2 transform -translate-x-1/2 -translate-y-2 w-64 p-2 bg-pennylane-yellow rounded border border-yellow-300 text-sm shadow-lg"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="font-medium text-[#003d3d] text-xs">
                        ✨ {upgrade.pennylaneFeature?.title}
                      </div>
                      <div className="text-xs mt-1">{upgrade.pennylaneFeature?.description}</div>
                    </motion.div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default Upgrades;
