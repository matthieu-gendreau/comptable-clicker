import React from "react";
import { useGameState } from "@/context/GameStateContext";
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { calculateGeneratorCost } from "@/reducers/gameReducer";
import { formatNumber } from "@/lib/utils";
import { Info } from "lucide-react";

const Collaborators: React.FC = () => {
  const { state, dispatch } = useGameState();

  const handleBuyGenerator = (id: string) => {
    dispatch({ type: "BUY_GENERATOR", id });
  };

  const handleShowFeature = (id: string) => {
    dispatch({ type: "SHOW_FEATURE", id: `generator:${id}` });
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Collaborateurs</CardTitle>
            <CardDescription>
              Recrutez des collaborateurs pour votre cabinet !
            </CardDescription>
          </div>
        </div>

        <div className="mt-4 space-y-4">
          {state.generators
            .filter((generator) => generator.unlocked)
            .map((generator) => {
              const cost = calculateGeneratorCost(
                generator.baseCost,
                generator.count
              );
              const canAfford = state.entries >= cost;

              return (
                <div
                  key={generator.id}
                  className="flex items-center justify-between gap-4"
                >
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium leading-none">
                        {generator.name}
                      </h4>
                      {generator.pennylaneFeature && !generator.pennylaneFeature.shown && (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-4 w-4 text-blue-500"
                                onClick={() => handleShowFeature(generator.id)}
                              >
                                <Info className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Découvrez une fonctionnalité Pennylane !</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {generator.description}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>
                        Production : {formatNumber(generator.baseOutput)}/s
                      </span>
                      <span>•</span>
                      <span>Possédés : {generator.count}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Badge variant="outline">
                      {formatNumber(cost)} entrées
                    </Badge>
                    <Button
                      variant={canAfford ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleBuyGenerator(generator.id)}
                      disabled={!canAfford}
                    >
                      Recruter
                    </Button>
                  </div>
                </div>
              );
            })}
        </div>
      </CardContent>
    </Card>
  );
};

export default Collaborators;
