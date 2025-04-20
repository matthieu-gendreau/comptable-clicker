import React from "react";
import { useGameState } from "@/context/GameStateContext";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const Clicker: React.FC = () => {
  const { state, dispatch } = useGameState();

  const handleClick = () => {
    dispatch({ type: "CLICK" });
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat("fr-FR").format(num);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Écritures</CardTitle>
            <CardDescription>
              Cliquez pour créer des écritures !
            </CardDescription>
          </div>
          <Badge variant="outline" className="text-lg">
            {formatNumber(state.entriesPerClick)}/clic
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center gap-4">
          <div className="text-4xl font-bold">
            {formatNumber(state.entries)}
          </div>
          <Button
            size="lg"
            className="w-full h-24 text-xl"
            onClick={handleClick}
          >
            Créer une écriture
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default Clicker;
