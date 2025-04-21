import React from "react";
import { useGameState } from "@/context/GameStateContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Lock } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const AccountantShop: React.FC = () => {
  const { state, dispatch } = useGameState();

  const purchaseAccountant = (id: string) => {
    dispatch({ type: "PURCHASE_ACCOUNTANT", id });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Cabinet de Recrutement</CardTitle>
        <CardDescription>Recrutez des comptables célèbres pour booster votre productivité</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {state.famousAccountants.map((accountant) => (
          <div key={accountant.id} className="relative">
            {!accountant.unlocked && (
              <div className="absolute inset-0 bg-background/80 backdrop-blur-sm z-10 flex items-center justify-center rounded-lg">
                <Lock className="w-8 h-8 text-muted-foreground" />
              </div>
            )}
            <Card>
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
                      <p className="text-sm text-muted-foreground mt-1">
                        Temps de recharge : {accountant.cooldown / 60} minutes
                      </p>
                    </div>
                  </div>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          onClick={() => purchaseAccountant(accountant.id)}
                          disabled={!accountant.unlocked || accountant.purchased}
                          variant={accountant.purchased ? "secondary" : "default"}
                        >
                          {accountant.purchased ? "Recruté" : "Recruter"}
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        {!accountant.unlocked && (
                          <>
                            {accountant.id === "jean_compta_van_damme" && 
                              `Débloqué après ${state.debugMode ? "10" : "5000"} clics`}
                            {accountant.id === "debit_vador" && "Débloqué après 1 million d'écritures"}
                            {accountant.id === "credit_suisse" && "Débloqué après 100,000 écritures"}
                            {accountant.id === "warren_buffeuille" && "Débloqué après avoir recruté 50 collaborateurs"}
                          </>
                        )}
                        {accountant.unlocked && !accountant.purchased && "Cliquez pour recruter"}
                        {accountant.purchased && "Déjà recruté"}
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </CardContent>
            </Card>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default AccountantShop; 