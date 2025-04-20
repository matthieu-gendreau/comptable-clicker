import { Feature, FeatureAction, FeatureId } from "@/types/features";
import { toast } from "sonner";
import { playerProgression } from "@/data/gameInitialState";

export const initialFeaturesState: Record<FeatureId, Feature> = {
  linkedinPremium: {
    id: "linkedinPremium",
    name: "LinkedIn Premium",
    description: "Débloque le Cabinet de Recrutement et permet d'embaucher des comptables célèbres",
    unlocked: false,
    active: false,
    requirements: [
      { type: "totalEntries", value: 1000 }
    ],
    effects: [
      { type: "multiplier", value: 1.5 },
      { type: "bonus", value: 100 },
      { type: "automation", value: 1 }
    ]
  },
  taxOptimizer: {
    id: "taxOptimizer",
    name: "Optimisateur Fiscal",
    description: "Optimise automatiquement vos déclarations fiscales",
    unlocked: false,
    active: false,
    requirements: [
      { type: "prestigePoints", value: 10 },
      { type: "achievements", value: 5 }
    ],
    effects: [
      { type: "automation", value: 1 },
      { type: "bonus", value: 50 }
    ]
  },
  autoFiling: {
    id: "autoFiling",
    name: "Auto-Archivage",
    description: "Archive automatiquement vos documents",
    unlocked: false,
    active: false,
    requirements: [
      { type: "totalEntries", value: 500000 }
    ],
    effects: [
      { type: "automation", value: 1 }
    ]
  }
};

export const featureReducer = (
  state: Record<FeatureId, Feature>,
  action: FeatureAction
): Record<FeatureId, Feature> => {
  const feature = state[action.featureId];
  if (!feature) return state;

  switch (action.type) {
    case "UNLOCK_FEATURE": {
      if (feature.unlocked) return state;
      
      if (feature.id === "linkedinPremium") {
        toast.success(`🎉 LinkedIn Premium disponible !`, {
          description: "Vous pouvez maintenant activer LinkedIn Premium pour débloquer le Cabinet de Recrutement"
        });
      } else {
        toast.success(`🎉 Nouvelle fonctionnalité débloquée : ${feature.name}`, {
          description: feature.description
        });
      }
      
      return {
        ...state,
        [action.featureId]: {
          ...feature,
          unlocked: true
        }
      };
    }

    case "ACTIVATE_FEATURE": {
      if (!feature.unlocked || feature.active) return state;
      
      if (feature.id === "linkedinPremium") {
        toast.success("💼 LinkedIn Premium activé !", {
          description: "Le Cabinet de Recrutement est maintenant disponible. Vous pouvez recruter des comptables célèbres !"
        });
      } else {
        toast.success(`✨ Fonctionnalité activée : ${feature.name}`);
      }
      
      return {
        ...state,
        [action.featureId]: {
          ...feature,
          active: true
        }
      };
    }

    case "DEACTIVATE_FEATURE": {
      if (!feature.active) return state;
      
      return {
        ...state,
        [action.featureId]: {
          ...feature,
          active: false
        }
      };
    }

    default:
      return state;
  }
}; 