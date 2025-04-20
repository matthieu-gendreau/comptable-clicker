import { GameState, GameCollaborator } from "@/types/game";

export const calculateCollaboratorCost = (baseCost: number, count: number): number => {
  return Math.floor(baseCost * Math.pow(1.15, count));
};

export const calculateEntriesPerSecond = (collaborators: GameState["collaborators"]): number => {
  return collaborators?.reduce(
    (total, collaborator) => total + collaborator.baseOutput * collaborator.count,
    0
  ) || 0;
};

export const calculateCollaboratorBoost = (state: GameState, collaborator: GameCollaborator): number => {
  let boost = 1;
  
  // Apply boosts from collaborators with boost effects
  state.collaborators
    .filter(g => g.effects?.boost && g.count > 0)
    .forEach(boostCollaborator => {
      boost *= 1 + (boostCollaborator.effects.boost || 0) * boostCollaborator.count;
    });

  return boost;
};

export const calculateTrainingPoints = (state: GameState): number => {
  return state.collaborators
    .filter(g => g.effects?.training && g.count > 0)
    .reduce((total, g) => total + (g.effects?.training || 0) * g.count, 0);
}; 