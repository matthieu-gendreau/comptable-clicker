import type { GameState } from "@/types/game";

export const calculateCollaboratorCost = (baseCost: number, count: number): number => {
  return Math.floor(baseCost * Math.pow(1.15, count));
};

export const calculateEntriesPerSecond = (collaborators: GameState["collaborators"]): number => {
  return collaborators?.reduce(
    (total, collaborator) => total + collaborator.baseOutput * collaborator.count,
    0
  ) || 0;
};

export const calculateCollaboratorBoost = (state: GameState): number => {
  let boost = 1;
  
  state.collaborators.forEach(boostCollaborator => {
    if (boostCollaborator.count > 0 && boostCollaborator.effects?.boost) {
      boost *= 1 + boostCollaborator.effects.boost * boostCollaborator.count;
    }
  });
  
  return boost;
};

export const calculateTrainingPoints = (state: GameState): number => {
  return state.collaborators
    .filter(g => g.effects?.training && g.count > 0)
    .reduce((total, g) => total + (g.effects?.training || 0) * g.count, 0);
}; 