import React from "react";
import { useGameState } from "@/context/GameStateContext";
import { Button } from "@/components/ui/button";
import { PackageOpen, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

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

  const EmptyState = () => (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <PackageOpen className="w-12 h-12 mb-4 text-muted-foreground" />
      <h3 className="text-lg font-medium">Pas d'améliorations disponibles</h3>
      <p className="text-sm text-muted-foreground mt-2">
        Continuez à jouer pour débloquer de nouvelles améliorations !
      </p>
    </div>
  );

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Améliorations</CardTitle>
            <CardDescription>
              Améliorez votre productivité !
            </CardDescription>
          </div>
          <Badge variant="secondary">
            {purchasedUpgrades.length} / {state.upgrades.length}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Améliorations disponibles */}
          <div>
            <h3 className="font-medium mb-4">Disponibles</h3>
            {availableUpgrades.length === 0 ? (
              <EmptyState />
            ) : (
              <div className="space-y-4">
                {availableUpgrades.map((upgrade) => (
                  <motion.div
                    key={upgrade.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/5"
                  >
                    <div>
                      <p className="font-medium">{upgrade.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {upgrade.description}
                      </p>
                    </div>
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
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {/* Séparateur */}
          {purchasedUpgrades.length > 0 && (
            <Separator className="my-6" />
          )}

          {/* Améliorations achetées */}
          {purchasedUpgrades.length > 0 && (
            <div>
              <h3 className="font-medium mb-4">Améliorations achetées</h3>
              <div className="space-y-4">
                {purchasedUpgrades.map((upgrade) => (
                  <motion.div
                    key={upgrade.id}
                    className="flex items-start gap-3 p-4 border rounded-lg bg-accent/5"
                  >
                    <CheckCircle2 className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-medium">{upgrade.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {upgrade.description}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default Upgrades;
