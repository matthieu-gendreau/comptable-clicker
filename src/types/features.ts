import type { GameState } from "./game";

export type FeatureId = "taxOptimizer" | "autoFiling" | "linkedinPremium";

export interface FeatureRequirement {
  type: "totalEntries" | "prestigePoints" | "achievements";
  value: number;
}

export interface Feature {
  id: FeatureId;
  name: string;
  description: string;
  unlocked: boolean;
  active: boolean;
  requirements: FeatureRequirement[];
  effects: {
    type: "multiplier" | "bonus" | "automation";
    value: number;
  }[];
}

export interface FeaturesState {
  features: Record<FeatureId, Feature>;
}

export interface FeatureAction {
  type: "UNLOCK_FEATURE" | "ACTIVATE_FEATURE" | "DEACTIVATE_FEATURE";
  featureId: FeatureId;
}

export const checkFeatureRequirements = (state: GameState, feature: Feature): boolean => {
  return feature.requirements.every(requirement => {
    switch (requirement.type) {
      case "totalEntries":
        return state.totalEntries >= requirement.value;
      case "prestigePoints":
        return state.prestige.points >= requirement.value;
      case "achievements":
        return state.achievements.filter(a => a.unlocked).length >= requirement.value;
      default:
        return false;
    }
  });
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