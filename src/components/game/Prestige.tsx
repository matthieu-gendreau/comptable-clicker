import { useGameState } from "@/context/GameStateContext";
import { calculatePrestigePoints } from "@/reducers/gameReducer";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

export const Prestige = () => {
  const { state, dispatch } = useGameState();
  const possiblePrestigePoints = calculatePrestigePoints(state.totalEntries);
  const canPrestige = possiblePrestigePoints > state.prestige.points;

  const handlePrestige = () => {
    if (!canPrestige) return;
    dispatch({ type: "PRESTIGE" });
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat("fr-FR").format(num);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Prestige</CardTitle>
            <CardDescription>
              Recommencez avec des bonus permanents !
            </CardDescription>
          </div>
          <Badge variant="outline" className="text-lg">
            {formatNumber(state.prestige.points)} points
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Points de prestige actuels</p>
              <p className="text-2xl font-bold">{formatNumber(state.prestige.points)}</p>
            </div>
            <div>
              <p className="text-sm font-medium">Points après prestige</p>
              <p className="text-2xl font-bold">{formatNumber(possiblePrestigePoints)}</p>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Multiplicateur actuel</p>
              <p className="text-xl font-semibold">×{state.prestige.multiplier.toFixed(2)}</p>
            </div>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="lg"
                  variant={canPrestige ? "default" : "outline"}
                  onClick={handlePrestige}
                  disabled={!canPrestige}
                >
                  Prestige {canPrestige ? `(+${possiblePrestigePoints - state.prestige.points})` : ""}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                {canPrestige
                  ? "Recommencez avec des bonus permanents !"
                  : `Il vous faut ${formatNumber(1e6)} écritures totales pour votre premier point de prestige`}
              </TooltipContent>
            </Tooltip>
          </div>

          <div className="space-y-2">
            <p className="text-sm font-medium">Améliorations de prestige</p>
            {state.prestige.upgrades.map((upgrade) => (
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
                <Button
                  variant={upgrade.purchased ? "outline" : "default"}
                  disabled={
                    upgrade.purchased ||
                    !upgrade.unlocked ||
                    state.prestige.points < upgrade.cost
                  }
                  onClick={() =>
                    dispatch({
                      type: "BUY_PRESTIGE_UPGRADE",
                      id: upgrade.id,
                    })
                  }
                >
                  {upgrade.purchased
                    ? "Acheté"
                    : `${formatNumber(upgrade.cost)} points`}
                </Button>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}; 