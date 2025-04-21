import React from "react";
import { useGameState } from "@/context";
import { Button } from "@/components/ui/button";
import { formatEntries } from "@/utils/formatters";
import { Badge } from "@/components/ui/badge";
import { calculateClickMultiplier } from "@/reducers/gameReducer";
import { Flame } from "lucide-react";

const Clicker: React.FC = () => {
  const { state, dispatch } = useGameState();

  const handleClick = () => {
    dispatch({ type: "CLICK" });
  };

  const clickMultiplier = calculateClickMultiplier(state);
  const totalPerClick = state.entriesPerClick * clickMultiplier;

  // Combo info
  const comboActive = state.combo.active && state.totalEntries >= 10;
  const comboMultiplier = state.combo.multiplier;
  const clicksInCombo = state.combo.clicksInCombo;
  const timeLeft = Math.max(0, (state.combo.lastClickTime + state.combo.comboTimeWindow - Date.now()) / 1000);

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

      {/* Combo indicator */}
      {state.totalEntries >= 10 && (
        <div className={`flex items-center justify-center gap-2 p-2 rounded-lg transition-colors ${
          comboActive ? "bg-orange-100 text-orange-700" : "bg-gray-100 text-gray-500"
        }`}>
          <Flame className={`w-5 h-5 ${comboActive ? "animate-pulse" : ""}`} />
          <div className="text-sm">
            {comboActive ? (
              <>
                <span className="font-bold">Combo x{comboMultiplier.toFixed(1)}</span>
                <span className="mx-2">•</span>
                <span>{clicksInCombo} clics</span>
                <span className="mx-2">•</span>
                <span>{timeLeft.toFixed(1)}s</span>
              </>
            ) : (
              "Cliquez rapidement pour activer le combo !"
            )}
          </div>
        </div>
      )}

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
