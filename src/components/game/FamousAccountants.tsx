import React from "react";
import { useGameState } from "@/context/GameStateContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const FamousAccountants: React.FC = () => {
  const { state, dispatch } = useGameState();
  const now = Date.now();

  const activateAccountant = (id: string) => {
    dispatch({ type: "ACTIVATE_ACCOUNTANT", id });
  };

  const purchasedAccountants = state.famousAccountants.filter(a => a.purchased);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Comptables Célèbres</CardTitle>
        <CardDescription>Activez les pouvoirs de vos comptables légendaires</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {purchasedAccountants.map((accountant) => {
          const isOnCooldown = accountant.lastUsed && (now - accountant.lastUsed) < accountant.cooldown * 1000;
          const cooldownProgress = isOnCooldown 
            ? ((now - accountant.lastUsed) / (accountant.cooldown * 1000)) * 100 
            : 100;
          const remainingTime = isOnCooldown 
            ? Math.ceil((accountant.cooldown * 1000 - (now - accountant.lastUsed)) / 1000) 
            : 0;

          return (
            <Card key={accountant.id}>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="font-semibold">{accountant.name}</h3>
                    <p className="text-sm text-muted-foreground">{accountant.description}</p>
                    <div className="mt-2">
                      <p className="text-sm font-medium">Pouvoir :</p>
                      <p className="text-sm text-muted-foreground">
                        {accountant.power.type === "click" && `Multiplie les clics par ${accountant.power.multiplier} pendant ${accountant.power.duration} secondes`}
                        {accountant.power.type === "generator" && `Multiplie la production par ${accountant.power.multiplier} pendant ${accountant.power.duration} secondes`}
                        {accountant.power.type === "global" && `Multiplie tous les gains par ${accountant.power.multiplier} pendant ${accountant.power.duration} secondes`}
                      </p>
                    </div>
                  </div>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          onClick={() => activateAccountant(accountant.id)}
                          disabled={isOnCooldown}
                        >
                          Activer
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        {isOnCooldown 
                          ? `Disponible dans ${remainingTime} secondes`
                          : "Cliquez pour activer le pouvoir"
                        }
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <Progress value={cooldownProgress} className="mt-4" />
              </CardContent>
            </Card>
          );
        })}
      </CardContent>
    </Card>
  );
};

export default FamousAccountants; 