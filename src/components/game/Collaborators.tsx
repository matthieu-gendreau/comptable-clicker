import React from "react";
import { useGameState } from "@/context";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import type { GameCollaborator } from "@/types/game";
import { calculateCollaboratorCost } from "@/reducers/calculations/collaboratorCalculations";
import { formatEntries, formatEntriesPerSecond } from "@/utils/formatters";

const Collaborators: React.FC = () => {
  const { state, dispatch } = useGameState();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Collaborateurs</CardTitle>
        <CardDescription>Embauchez des collaborateurs pour automatiser la production d'écritures</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {state.collaborators?.filter((collaborator: GameCollaborator) => collaborator.unlocked)
            .map((collaborator: GameCollaborator) => {
              const cost = calculateCollaboratorCost(collaborator.baseCost, collaborator.count);
              const canBuy = state.entries >= cost;
              const output = collaborator.baseOutput * collaborator.count;

              return (
                <motion.div 
                  key={collaborator.id} 
                  className={`p-3 rounded-md border ${canBuy ? "border-comptableClicker-light-gray" : "border-gray-200 opacity-80"}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="flex flex-col sm:flex-row sm:items-start gap-3">
                    <div className="flex-1">
                      <div className="flex items-center mb-1">
                        <h3 className="font-medium">{collaborator.name}</h3>
                      </div>
                      <p className="text-xs text-comptableClicker-gray">{collaborator.description}</p>
                      <div className="text-sm mt-1">
                        <span className="font-medium">{collaborator.count}</span> possédés
                        {output > 0 && (
                          <span className="ml-2 text-[#003d3d]">
                            {formatEntriesPerSecond(output)} écritures/sec
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <Button
                        onClick={() => dispatch({ type: "BUY_COLLABORATOR", id: collaborator.id })}
                        disabled={!canBuy}
                        variant={canBuy ? "default" : "outline"}
                        className="whitespace-nowrap"
                      >
                        {formatEntries(cost)} écritures
                      </Button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
        </div>
      </CardContent>
    </Card>
  );
};

export default Collaborators;
