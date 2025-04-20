import { GameState } from "@/types/game";

export const calculatePrestigePoints = (totalEntries: number, objectives: GameState["prestige"]["objectives"]): number => {
  // Points de base : plus difficile à obtenir
  const basePoints = Math.floor(Math.sqrt(totalEntries / 1e6));
  
  // Points bonus des objectifs
  const objectivePoints = objectives
    .filter(obj => obj.completed)
    .reduce((total, obj) => total + obj.reward, 0);
  
  return Math.max(0, basePoints + objectivePoints);
};

export const calculateTotalMultiplier = (state: GameState): number => {
  const seasonMultiplier = state.prestige.currentSeason.multiplier;
  
  // Multiplicateur des spécialisations réduit
  const specializationMultiplier = state.prestige.specializations
    .filter(spec => spec.purchased)
    .reduce((total, spec) => {
      if (spec.type === "global") return total * (1 + (spec.multiplier - 1) * 0.5);
      if (spec.type === "bonus") return total * (1 + (spec.multiplier - 1) * 0.25);
      return total;
    }, 1);
  
  return seasonMultiplier * specializationMultiplier;
};

export const calculatePrestigeMultiplier = (prestigeUpgrades: GameState["prestige"]["upgrades"]): number => {
  return prestigeUpgrades
    .filter(u => u.purchased)
    .reduce((total, upgrade) => total * upgrade.multiplier, 1);
};

export const calculateClickMultiplier = (state: GameState): number => {
  const baseMultiplier = 1;
  
  // Multiplicateur des spécialisations de type "click"
  const clickSpecializationMultiplier = state.prestige.specializations
    .filter(spec => spec.purchased && spec.type === "click")
    .reduce((total, spec) => total * spec.multiplier, 1);
  
  // Multiplicateur global des spécialisations
  const globalSpecializationMultiplier = state.prestige.specializations
    .filter(spec => spec.purchased && spec.type === "global")
    .reduce((total, spec) => total * spec.multiplier, 1);
  
  return baseMultiplier * clickSpecializationMultiplier * globalSpecializationMultiplier;
}; 