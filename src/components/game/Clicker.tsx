import React from "react";
import { useGameState } from "@/context/GameStateContext";
import { Button } from "@/components/ui/button";
import { formatEntries } from "@/utils/formatters";
import { Badge } from "@/components/ui/badge";
import { calculateClickMultiplier } from "@/reducers/gameReducer";

const Clicker: React.FC = () => {
  const { state, dispatch } = useGameState();

  const handleClick = () => {
    dispatch({ type: "CLICK" });
  };

  const clickMultiplier = calculateClickMultiplier(state);
  const totalPerClick = state.entriesPerClick * clickMultiplier;

  return (
    <div className="flex flex-col gap-4 p-6 border rounded-lg">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Écritures</h2>
          <p className="text-sm text-muted-foreground">
            Cliquez pour créer des écritures !
          </p>
        </div>
        <Badge variant="outline" className="text-lg">
          {formatEntries(totalPerClick)}/clic
        </Badge>
      </div>
      <div className="flex flex-col items-center gap-4">
        <div className="text-4xl font-bold">
          {formatEntries(state.entries)}
        </div>
        <Button
          size="lg"
          className="w-full h-24 text-xl"
          onClick={handleClick}
        >
          Créer une écriture
        </Button>
      </div>
    </div>
  );
};

export default Clicker;
