import type { GameState } from "@/types/game";
import type { Feature, FeatureId } from "@/types/features";

export const initialFeatures: Record<FeatureId, Feature> = {
  autoSave: {
    id: "autoSave",
    name: "Sauvegarde Automatique",
    description: "Sauvegarde automatiquement votre progression",
    unlocked: true,
    active: true,
    requirement: {
      type: "entries",
      value: 0
    }
  },
  darkMode: {
    id: "darkMode",
    name: "Mode Sombre",
    description: "Pour les comptables nocturnes",
    unlocked: true,
    active: false,
    requirement: {
      type: "entries",
      value: 0
    }
  }
};

export const featureReducer = (state: GameState, action: { type: string; id?: FeatureId }): GameState => {
  switch (action.type) {
    case "TOGGLE_FEATURE": {
      if (!action.id) return state;
      const feature = state.features[action.id];
      if (!feature) return state;

      return {
        ...state,
        features: {
          ...state.features,
          [action.id]: {
            ...feature,
            active: !feature.active
          }
        }
      };
    }

    case "CHECK_FEATURE_UNLOCKS": {
      const updatedFeatures = { ...state.features };
      
      Object.values(state.features).forEach(feature => {
        if (!feature.unlocked && checkFeatureRequirement(state, feature)) {
          updatedFeatures[feature.id] = {
            ...feature,
            unlocked: true
          };
        }
      });

      return {
        ...state,
        features: updatedFeatures
      };
    }

    default:
      return state;
  }
};

export const checkFeatureRequirement = (state: GameState, feature: Feature): boolean => {
  if (!feature.requirement) return false;

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