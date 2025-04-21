import React from "react";
import { useGameState } from "@/context/GameStateContext";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Info, X } from "lucide-react";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { calculateCollaboratorCost } from "@/reducers/calculations/collaboratorCalculations";

const Collaborators: React.FC = () => {
  const { state, dispatch } = useGameState();

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat("fr-FR").format(num);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Collaborateurs</CardTitle>
            <CardDescription>
              Automatisez votre production d'écritures !
            </CardDescription>
          </div>
          <Badge variant="outline" className="text-lg">
            {formatNumber(state.entriesPerSecond)}/s
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {state.collaborators?.filter((collaborator) => collaborator.unlocked)
            .map((collaborator) => {
              const cost = calculateCollaboratorCost(collaborator.baseCost, collaborator.count);
              const canBuy = state.entries >= cost;
              const output = collaborator.baseOutput * collaborator.count;
              const hasFeature = collaborator.pennylaneFeature;
              const featureShown = hasFeature && collaborator.pennylaneFeature?.shown;

              return (
                <motion.div 
                  key={collaborator.id} 
                  className={`p-3 rounded-md border ${canBuy ? "border-pennylane-light-gray" : "border-gray-200 opacity-80"}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="flex flex-col sm:flex-row sm:items-start gap-3">
                    <div className="flex-1">
                      <div className="flex items-center mb-1">
                        <h3 className="font-medium">{collaborator.name}</h3>
                        {hasFeature && !featureShown && (
                          <button 
                            onClick={() => dispatch({
                              type: "SHOW_FEATURE",
                              id: `collaborator:${collaborator.id}`,
                            })}
                            className="ml-2 text-[#003d3d] hover:text-green-800 transition-colors"
                          >
                            <Info size={16} />
                          </button>
                        )}
                      </div>
                      <p className="text-xs text-pennylane-gray">{collaborator.description}</p>
                      <div className="text-sm mt-1">
                        <span className="font-medium">{collaborator.count}</span> possédés
                        {output > 0 && (
                          <span className="ml-2 text-[#003d3d]">
                            {formatNumber(Math.floor(output))} écritures/sec
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex-shrink-0">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button 
                              onClick={() => dispatch({
                                type: "BUY_COLLABORATOR",
                                id: collaborator.id,
                              })} 
                              disabled={!canBuy}
                              size="sm" 
                              className={canBuy 
                                ? "bg-[#003d3d] hover:bg-green-800 w-full sm:w-auto" 
                                : "bg-gray-300 w-full sm:w-auto"
                              }
                            >
                              {formatNumber(Math.floor(cost))} écritures
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent side="top">
                            <p>Génère {formatNumber(collaborator.baseOutput)} écritures par seconde</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </div>

                  {hasFeature && featureShown && (
                    <motion.div 
                      className="mt-3 p-2 bg-pennylane-yellow rounded border border-yellow-300 text-sm relative"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      transition={{ duration: 0.3 }}
                    >
                      <button 
                        onClick={() => dispatch({
                          type: "SHOW_FEATURE",
                          id: `collaborator:${collaborator.id}`,
                        })}
                        className="absolute right-1 top-1 text-[#003d3d] hover:text-green-800 transition-colors"
                      >
                        <X size={14} />
                      </button>
                      <div className="font-medium text-[#003d3d]">
                        ✨ {collaborator.pennylaneFeature?.title}
                      </div>
                      <div className="text-xs mt-1">{collaborator.pennylaneFeature?.description}</div>
                    </motion.div>
                  )}
                </motion.div>
              );
            })}
        </div>
      </CardContent>
    </Card>
  );
};

export default Collaborators;
