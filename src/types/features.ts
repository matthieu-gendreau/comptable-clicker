import type { GameState } from "./game";

export type FeatureId = "autoSave" | "darkMode";

export type FeatureRequirementType = "entries" | "clicks" | "collaborators" | "upgrades" | "achievements";

export interface FeatureRequirement {
  type: FeatureRequirementType;
  value: number;
}

export interface Feature {
  id: FeatureId;
  name: string;
  description: string;
  unlocked: boolean;
  active: boolean;
  requirement?: FeatureRequirement;
  effect?: (state: GameState) => GameState;
}

export interface FeaturesState {
  features: Record<FeatureId, Feature>;
}

export type FeatureAction =
  | { type: "UNLOCK_FEATURE"; featureId: FeatureId }
  | { type: "ACTIVATE_FEATURE"; featureId: FeatureId }
  | { type: "DEACTIVATE_FEATURE"; featureId: FeatureId };

export const checkFeatureRequirements = (state: GameState, feature: Feature): boolean => {
  if (!feature.requirement) return true;

  switch (feature.requirement.type) {
    case "entries":
      return state.entries >= feature.requirement.value;
    case "clicks":
      return state.clickCount >= feature.requirement.value;
    case "collaborators":
      return Object.keys(state.collaborators).length >= feature.requirement.value;
    case "upgrades":
      return Object.values(state.upgrades).filter(u => u.unlocked).length >= feature.requirement.value;
    case "achievements":
      return Object.values(state.achievements).filter(a => a.unlocked).length >= feature.requirement.value;
    default:
      return false;
  }
};

export type GameAction =
  | { type: "TICK"; timestamp: number }
  | { type: "CLICK" }
  | { type: "BUY_COLLABORATOR"; id: string }
  | { type: "BUY_UPGRADE"; id: string }
  | { type: "PRESTIGE" }
  | { type: "BUY_SPECIALIZATION"; id: string }
  | { type: "COMPLETE_OBJECTIVE"; id: string }
  | { type: "CHANGE_SEASON"; id: string }
  | { type: "BUY_PRESTIGE_UPGRADE"; id: string }
  | { type: "START_MINIGAME"; id: string }
  | { type: "COMPLETE_MINIGAME"; id: string }
  | { type: "ACTIVATE_ACCOUNTANT"; id: string }
  | { type: "PURCHASE_ACCOUNTANT"; id: string }
  | { type: "LOAD_GAME"; state: GameState }
  | { type: "RESET_GAME" }
  | { type: "TOGGLE_DEBUG_MODE" }
  | { type: "ACTIVATE_FEATURE"; featureId: FeatureId }
  | { type: "DEACTIVATE_FEATURE"; featureId: FeatureId }
  | { type: "UNLOCK_FEATURE"; featureId: FeatureId }
  | { type: "UNLOCK_TAB"; id: string }
  | { type: "CHECK_UNLOCKS" }; 