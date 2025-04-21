import { GameState } from "./game";

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