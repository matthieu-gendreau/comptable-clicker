import React, { useEffect } from "react";
import { useGameState } from "@/context/GameStateContext";
import { Button } from "@/components/ui/button";
import { Info, X } from "lucide-react";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

const Upgrades: React.FC = () => {
  const { state, dispatch } = useGameState();

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
    <Card>
      <CardHeader>
        <CardTitle>Améliorations</CardTitle>
        <CardDescription>
          Améliorez votre productivité !
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {state.upgrades
            .filter((upgrade) => upgrade.unlocked && !upgrade.purchased)
            .map((upgrade) => (
              <div
                key={upgrade.id}
                className="flex items-center justify-between p-2 border rounded-lg"
              >
                <div>
                  <p className="font-medium">{upgrade.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {upgrade.description}
                  </p>
                </div>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant={state.entries >= upgrade.cost ? "default" : "outline"}
                      onClick={() =>
                        dispatch({
                          type: "BUY_UPGRADE",
                          id: upgrade.id,
                        })
                      }
                      disabled={state.entries < upgrade.cost}
                    >
                      {formatEntries(upgrade.cost)} écritures
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    {upgrade.description}
                  </TooltipContent>
                </Tooltip>
              </div>
            ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default Upgrades;
