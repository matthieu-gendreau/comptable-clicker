import React, { useEffect, useRef } from "react";
import { useGameState } from "@/context";
import { Button } from "@/components/ui/button";
import { formatEntries } from "@/utils/formatters";
import { Badge } from "@/components/ui/badge";
import { calculateClickMultiplier } from "@/reducers/gameReducer";
import { Flame, Zap, Trophy } from "lucide-react";
import { Progress } from "@/components/ui/progress";

const Clicker: React.FC = () => {
  const { state, dispatch } = useGameState();
  const comboSoundRef = useRef<HTMLAudioElement | null>(null);
  const tierUpSoundRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    comboSoundRef.current = new Audio("/sounds/combo.mp3");
    tierUpSoundRef.current = new Audio("/sounds/tier-up.mp3");
  }, []);

  const handleClick = () => {
    dispatch({ type: "CLICK" });
    
    // Jouer le son du combo si actif
    if (state.combo.active && state.totalEntries >= 10) {
      if (comboSoundRef.current) {
        comboSoundRef.current.currentTime = 0;
        comboSoundRef.current.play().catch(() => {});
      }
    }
  };

  const clickMultiplier = calculateClickMultiplier(state);
  const totalPerClick = state.entriesPerClick * clickMultiplier;

  // Combo info
  const comboActive = state.combo.active && state.totalEntries >= 10;
  const comboMultiplier = state.combo.multiplier;
  const clicksInCombo = state.combo.clicksInCombo;
  const timeLeft = Math.max(0, (state.combo.lastClickTime + state.combo.comboTimeWindow - Date.now()) / 1000);

  // Trouver le palier actuel et le prochain
  const currentTier = state.combo.currentTier;
  const nextTier = state.combo.tiers[currentTier + 1];
  
  // Calculer la progression vers le prochain palier
  const progressToNextTier = nextTier
    ? (clicksInCombo / nextTier.clickThreshold) * 100
    : 100;

  // Déterminer si on a un bonus de vitesse
  const hasSpeedBonus = state.combo.speedBonus > 1;

  // Effet pour jouer le son quand on atteint un nouveau palier
  useEffect(() => {
    if (currentTier >= 0 && tierUpSoundRef.current) {
      tierUpSoundRef.current.currentTime = 0;
      tierUpSoundRef.current.play().catch(() => {});
    }
  }, [currentTier]);

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
          className="w-full h-24 text-xl relative overflow-hidden"
          onClick={handleClick}
        >
          Créer une écriture
          {hasSpeedBonus && (
            <Zap className="absolute top-2 right-2 w-4 h-4 text-yellow-400 animate-pulse" />
          )}
        </Button>
      </div>

      {/* Combo indicator with fixed height */}
      <div className="h-[80px] flex flex-col justify-center">
        {state.totalEntries >= 10 && (
          <div className={`flex flex-col gap-2 p-3 rounded-lg transition-colors w-full ${
            comboActive ? "bg-orange-100 text-orange-700" : "bg-gray-100 text-gray-500"
          }`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Flame className={`w-5 h-5 ${comboActive ? "animate-pulse" : ""}`} />
                <div className="text-sm font-medium">
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
              {currentTier >= 0 && (
                <Trophy className="w-5 h-5 text-yellow-600" />
              )}
            </div>
            
            {comboActive && nextTier && (
              <div className="flex flex-col gap-1">
                <div className="flex justify-between text-xs">
                  <span>Prochain palier : x{nextTier.multiplier}</span>
                  <span>{clicksInCombo}/{nextTier.clickThreshold} clics</span>
                </div>
                <Progress value={progressToNextTier} className="h-1" />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Clicker;
