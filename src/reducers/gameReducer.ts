import { GameState, GameAction, FiscalObjective, FiscalSeason, FiscalSpecialization, GameCollaborator, Achievement, Feature } from "@/types/game";
import { toast } from "sonner";
import { initialGameState, fiscalSeasons, playerProgression } from "@/data/gameInitialState";
import { featureReducer } from "./features/featureReducer";
import { checkFeatureRequirements } from "@/types/features";

const DEBUG_MULTIPLIER = 50;

export const calculateCollaboratorCost = (baseCost: number, count: number): number => {
  return Math.floor(baseCost * Math.pow(1.15, count));
};

export const calculateEntriesPerSecond = (state: GameState): number => {
  const baseEntriesPerSecond = state.collaborators?.reduce(
    (total, collaborator) => total + collaborator.baseOutput * collaborator.count,
    0
  ) || 0;
  
  return state.debugMode ? baseEntriesPerSecond * DEBUG_MULTIPLIER : baseEntriesPerSecond;
};

function checkAchievements(state: GameState, updates: Partial<GameState>): Achievement[] {
  return state.achievements.map(achievement => {
    if (achievement.unlocked) return achievement;

    const testState = {
      ...state,
      ...updates
    };

    try {
      if (achievement.condition(testState)) {
        return {
          ...achievement,
          unlocked: true
        };
      }
    } catch (error) {
      console.error("Error checking achievement:", achievement.id, error);
    }

    return achievement;
  });
}

// Nouvelle formule de calcul des points de prestige
export const calculatePrestigePoints = (totalEntries: number, objectives: GameState["prestige"]["objectives"]): number => {
  // Points de base : plus difficile à obtenir
  const basePoints = Math.floor(Math.sqrt(totalEntries / 1e6));
  
  // Points bonus des objectifs
  const objectivePoints = objectives
    .filter(obj => obj.completed)
    .reduce((total, obj) => total + obj.reward, 0);
  
  return Math.max(0, basePoints + objectivePoints);
};

// Calcul du multiplicateur total ajusté
const calculateTotalMultiplier = (state: GameState): number => {
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

// Vérification des objectifs
const checkObjectives = (state: GameState): FiscalObjective[] => {
  return state.prestige.objectives.map(objective => {
    if (objective.completed) return objective;
    if (state.totalEntries >= objective.requirement) {
      toast.success(`🎯 Objectif atteint : ${objective.name}`, {
        description: `+${objective.reward} Point d'Expertise Fiscale !`,
      });
      return { ...objective, completed: true };
    }
    return objective;
  });
};

const calculatePrestigeMultiplier = (prestigeUpgrades: GameState["prestige"]["upgrades"]): number => {
  return prestigeUpgrades
    .filter(u => u.purchased)
    .reduce((total, upgrade) => total * upgrade.multiplier, 1);
};

const calculateTalentCost = (talent: GameState["talents"]["tree"][0]): number => {
  return Math.floor(talent.cost * Math.pow(1.5, talent.level));
};

const checkMiniGameUnlock = (state: GameState): GameState["miniGames"] => {
  return state.miniGames.map(game => {
    if (game.unlocked) return game;
    
    // Conditions de déblocage des mini-jeux
    switch (game.id) {
      case "tax_return_rush":
        return {
          ...game,
          unlocked: state.totalEntries >= 100000
        };
      case "audit_investigation":
        return {
          ...game,
          unlocked: state.totalEntries >= 500000
        };
      default:
        return game;
    }
  });
};

const checkFamousAccountantUnlock = (state: GameState): GameState["famousAccountants"] => {
  return state.famousAccountants.map(accountant => {
    if (accountant.unlocked) return accountant;
    
    // Conditions de déblocage des comptables célèbres
    switch (accountant.id) {
      case "jean_compta_van_damme":
        return {
          ...accountant,
          unlocked: state.debugMode ? state.clickCount >= 10 : state.clickCount >= 5000
        };
      case "debit_vador":
        return {
          ...accountant,
          unlocked: state.totalEntries >= 1000000
        };
      default:
        return accountant;
    }
  });
};

const initialUpgrades = [
  {
    id: "stats_unlock",
    name: "Tableau de bord",
    description: "Débloque l'accès aux statistiques détaillées de votre cabinet",
    cost: 1000,
    unlocked: true,
    purchased: false,
    type: "click",
    multiplier: 1,
  },
];

// Calcul du multiplicateur de clic
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

export const calculateComboMultiplier = (state: GameState): number => {
  // Only activate combo system after 10 total entries
  if (state.totalEntries < 10) return 1;
  
  if (!state.combo.active) return 1;
  
  const timeSinceLastClick = Date.now() - state.combo.lastClickTime;
  if (timeSinceLastClick > state.combo.comboTimeWindow) {
    return 1;
  }
  
  return Math.min(
    state.combo.maxMultiplier,
    1 + (state.combo.clicksInCombo * 0.1)
  );
};

// Calcul de l'XP gagnée avec feedback
const calculateXPGain = (entriesGained: number): number => {
  const xpGain = Math.floor(Math.sqrt(entriesGained));
  if (xpGain > 0) {
    toast.info(`📚 +${xpGain} XP`, {
      description: "Continuez comme ça pour monter en grade !"
    });
  }
  return xpGain;
};

// Vérification du niveau avec feedback détaillé
const checkLevelUp = (state: GameState): GameState => {
  const currentLevel = playerProgression.levels[state.level.current];
  const nextLevel = playerProgression.levels[state.level.current + 1];
  
  if (nextLevel && state.level.xp >= nextLevel.requiredXP) {
    toast.success(`🎓 Niveau Supérieur : ${nextLevel.name}`, {
      description: `Félicitations ! Vous êtes maintenant ${nextLevel.name}. De nouvelles opportunités s'offrent à vous !`
    });

    // Vérifier si ce niveau débloque LinkedIn Premium
    if (state.level.current === 0 && !state.features.linkedinPremium.active) {
      toast.info("💼 LinkedIn Premium est maintenant disponible !", {
        description: "Vous pouvez maintenant activer LinkedIn Premium pour débloquer le Cabinet de Recrutement."
      });
    }

    return {
      ...state,
      level: {
        current: state.level.current + 1,
        xp: state.level.xp
      }
    };
  }
  return state;
};

export function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case "TICK": {
      const now = action.timestamp;
      const deltaTime = (now - state.lastTickAt) / 1000;

      // Calculate entries per second from collaborators
      const entriesPerSecond = calculateEntriesPerSecond(state);

      // Update combo system
      let combo = state.combo;
      if (combo.active && now - combo.lastClickTime > combo.comboTimeWindow) {
        combo = {
          ...combo,
          active: false,
          multiplier: 1,
          clicksInCombo: 0
        };
      }

      // Check for unlocks with the new values
      const newEntries = state.entries + (entriesPerSecond * deltaTime);
      const newTotalEntries = state.totalEntries + (entriesPerSecond * deltaTime);

      const updatedMiniGames = checkMiniGameUnlock({
        ...state,
        entries: newEntries,
        totalEntries: newTotalEntries,
      });

      const updatedFamousAccountants = checkFamousAccountantUnlock({
        ...state,
        entries: newEntries,
        totalEntries: newTotalEntries,
      });

      // Update upgrades based on new values
      const uniqueCollaboratorsCount = state.collaborators.filter(g => g.count > 0).length;
      const updatedUpgrades = state.upgrades.map((upgrade) => {
        if (upgrade.unlocked || upgrade.purchased) return upgrade;
        
        if (upgrade.requirement?.type === "totalEntries" && 
            newTotalEntries >= upgrade.requirement.count) {
          return { ...upgrade, unlocked: true };
        }

        if (upgrade.requirement?.type === "uniqueCollaborators" && 
            uniqueCollaboratorsCount >= upgrade.requirement.count) {
          return { ...upgrade, unlocked: true };
        }

        return upgrade;
      });

      // Check for feature unlocks
      const updatedFeatures = { ...state.features };
      Object.entries(state.features).forEach(([id, feature]) => {
        if (!feature.unlocked && checkFeatureRequirements(state, feature)) {
          updatedFeatures[id] = {
            ...feature,
            unlocked: true
          };
        }
      });

      // Check for trial expirations
      Object.entries(updatedFeatures).forEach(([id, feature]) => {
        if (feature.trialPeriod?.endedAt && now > feature.trialPeriod.endedAt && feature.active) {
          updatedFeatures[id] = {
            ...feature,
            active: false
          };
        }
      });

      // Check achievements with all updated values
      const updatedAchievements = checkAchievements(state, {
        entries: newEntries,
        totalEntries: newTotalEntries,
        miniGames: updatedMiniGames,
        famousAccountants: updatedFamousAccountants,
        upgrades: updatedUpgrades,
        features: updatedFeatures
      });

      return {
        ...state,
        entries: newEntries,
        totalEntries: newTotalEntries,
        entriesPerSecond,
        lastTickAt: now,
        combo,
        achievements: updatedAchievements,
        miniGames: updatedMiniGames,
        famousAccountants: updatedFamousAccountants,
        upgrades: updatedUpgrades,
        features: updatedFeatures,
        activePowerUps: state.activePowerUps.filter(p => p.expiresAt > now)
      };
    }

    case "CLICK": {
      const now = Date.now();
      const clickMultiplier = calculateTotalMultiplier(state);
      // Apply debug multiplier to clicks
      const baseEntriesPerClick = state.entriesPerClick * clickMultiplier;
      const entriesPerClick = state.debugMode ? baseEntriesPerClick * DEBUG_MULTIPLIER : baseEntriesPerClick;

      // Update combo system
      let combo = { ...state.combo };
      if (!combo.active || now - combo.lastClickTime <= combo.comboTimeWindow) {
        combo = {
          ...combo,
          active: true,
          multiplier: Math.min(combo.multiplier + 0.1, combo.maxMultiplier),
          clicksInCombo: combo.clicksInCombo + 1,
          lastClickTime: now
        };
      } else {
        combo = {
          ...combo,
          active: true,
          multiplier: 1,
          clicksInCombo: 1,
          lastClickTime: now
        };
      }

      const entriesGained = entriesPerClick * combo.multiplier;

      return {
        ...state,
        entries: state.entries + entriesGained,
        totalEntries: state.totalEntries + entriesGained,
        clickCount: state.clickCount + 1,
        combo
      };
    }

    case "BUY_COLLABORATOR": {
      const collaboratorIndex = state.collaborators.findIndex((g) => g.id === action.id);
      if (collaboratorIndex === -1) return state;

      const collaborator = state.collaborators[collaboratorIndex];
      const cost = calculateCollaboratorCost(collaborator.baseCost, collaborator.count);

      if (state.entries < cost) return state;

      const updatedCollaborators = [...state.collaborators];
      updatedCollaborators[collaboratorIndex] = {
        ...collaborator,
        count: collaborator.count + 1,
      };

      const entriesPerSecond = calculateEntriesPerSecond({
        ...state,
        collaborators: updatedCollaborators
      });

      // Unlock next collaborator if this is the first purchase
      if (collaborator.count === 0) {
        const nextIndex = collaboratorIndex + 1;
        if (nextIndex < updatedCollaborators.length && !updatedCollaborators[nextIndex].unlocked) {
          updatedCollaborators[nextIndex] = {
            ...updatedCollaborators[nextIndex],
            unlocked: true,
          };
        }
      }

      // Count unique collaborators after this purchase
      const uniqueCollaboratorsCount = updatedCollaborators.filter(g => g.count > 0).length;

      const updatedUpgrades = state.upgrades.map((upgrade) => {
        if (upgrade.unlocked || upgrade.purchased) return upgrade;
        
        if (upgrade.requirement?.type === "collaborator" && 
            upgrade.requirement.id === collaborator.id && 
            collaborator.count + 1 >= upgrade.requirement.count) {
          return { ...upgrade, unlocked: true };
        }

        // Check for uniqueCollaborators requirement
        if (upgrade.requirement?.type === "uniqueCollaborators" && 
            uniqueCollaboratorsCount >= upgrade.requirement.count) {
          return { ...upgrade, unlocked: true };
        }

        return upgrade;
      });

      const updatedAchievements = checkAchievements(state, {
        entries: state.entries - cost,
        collaborators: updatedCollaborators,
        entriesPerSecond,
        upgrades: updatedUpgrades,
      });

      return {
        ...state,
        entries: state.entries - cost,
        collaborators: updatedCollaborators,
        entriesPerSecond,
        upgrades: updatedUpgrades,
        achievements: updatedAchievements,
      };
    }

    case "BUY_UPGRADE": {
      const upgradeIndex = state.upgrades.findIndex((u) => u.id === action.id);
      if (upgradeIndex === -1) return state;

      const upgrade = state.upgrades[upgradeIndex];
      if (upgrade.purchased || !upgrade.unlocked || state.entries < upgrade.cost) {
        return state;
      }

      const updatedState = upgrade.effect({
        ...state,
        entries: state.entries - upgrade.cost,
        upgrades: state.upgrades.map((u, i) =>
          i === upgradeIndex ? { ...u, purchased: true } : u
        ),
      });

      const updatedAchievements = checkAchievements(state, updatedState);

      return {
        ...updatedState,
        entriesPerSecond: calculateEntriesPerSecond(updatedState),
        achievements: updatedAchievements,
      };
    }

    case "PRESTIGE": {
      const potentialPoints = calculatePrestigePoints(state.totalEntries, state.prestige.objectives);
      if (potentialPoints <= state.prestige.points) return state;

      const baseState = {
        ...initialGameState,
        prestige: {
          ...state.prestige,
          points: potentialPoints,
          totalResets: state.prestige.totalResets + 1,
          specializations: state.prestige.specializations,
          objectives: state.prestige.objectives.map(obj => ({ ...obj, completed: false })),
        },
        achievements: state.achievements,
      };

      toast.success("🌟 Prestige effectué !", {
        description: `Vous avez gagné ${potentialPoints - state.prestige.points} Points d'Expertise Fiscale !`,
      });

      return baseState;
    }

    case "BUY_SPECIALIZATION": {
      const specialization = state.prestige.specializations.find(
        spec => spec.id === action.id
      );
      if (!specialization || specialization.purchased || state.prestige.points < specialization.cost) {
        return state;
      }

      const updatedSpecializations = state.prestige.specializations.map(spec =>
        spec.id === action.id ? { ...spec, purchased: true } : spec
      );

      toast.success(`🎓 Spécialisation débloquée : ${specialization.name}`, {
        description: specialization.description,
      });

      return {
        ...state,
        prestige: {
          ...state.prestige,
          points: state.prestige.points - specialization.cost,
          specializations: updatedSpecializations,
        },
      };
    }

    case "COMPLETE_OBJECTIVE": {
      const objective = state.prestige.objectives.find(
        obj => obj.id === action.id
      );
      if (!objective || objective.completed || state.totalEntries < objective.requirement) {
        return state;
      }

      const updatedObjectives = state.prestige.objectives.map(obj =>
        obj.id === action.id ? { ...obj, completed: true } : obj
      );

      return {
        ...state,
        prestige: {
          ...state.prestige,
          objectives: updatedObjectives,
        },
      };
    }

    case "CHANGE_SEASON": {
      const newSeason = fiscalSeasons.find(season => season.id === action.id);
      if (!newSeason) return state;

      return {
        ...state,
        prestige: {
          ...state.prestige,
          currentSeason: newSeason,
        },
      };
    }

    case "BUY_PRESTIGE_UPGRADE": {
      const upgradeIndex = state.prestige.upgrades.findIndex(u => u.id === action.id);
      if (upgradeIndex === -1) return state;

      const upgrade = state.prestige.upgrades[upgradeIndex];
      if (upgrade.purchased || !upgrade.unlocked || state.prestige.points < upgrade.cost) {
        return state;
      }

      const updatedUpgrades = state.prestige.upgrades.map((u, i) =>
        i === upgradeIndex ? { ...u, purchased: true } : u
      );

      const updatedAchievements = checkAchievements(state, {
        prestige: {
          ...state.prestige,
          points: state.prestige.points - upgrade.cost,
          upgrades: updatedUpgrades,
          multiplier: calculatePrestigeMultiplier(updatedUpgrades)
        }
      });

      return {
        ...state,
        prestige: {
          ...state.prestige,
          points: state.prestige.points - upgrade.cost,
          upgrades: updatedUpgrades,
          multiplier: calculatePrestigeMultiplier(updatedUpgrades)
        },
        achievements: updatedAchievements
      };
    }

    case "UPGRADE_TALENT": {
      const talentIndex = state.talents.tree.findIndex(t => t.id === action.id);
      if (talentIndex === -1) return state;

      const talent = state.talents.tree[talentIndex];
      if (talent.level >= talent.maxLevel) return state;

      const cost = calculateTalentCost(talent);
      if (state.talents.points < cost) return state;

      if (talent.requirements) {
        const { talents: reqTalents, prestige: reqPrestige } = talent.requirements;
        
        if (reqPrestige && state.prestige.points < reqPrestige) return state;
        
        if (reqTalents && !reqTalents.every(req => {
          const parentTalent = state.talents.tree.find(t => t.id === req.id);
          return parentTalent && parentTalent.level >= req.level;
        })) return state;
      }

      const updatedState = talent.effect({
        ...state,
        talents: {
          ...state.talents,
          points: state.talents.points - cost,
          tree: state.talents.tree.map((t, i) =>
            i === talentIndex ? { ...t, level: t.level + 1 } : t
          )
        }
      });

      const updatedAchievements = checkAchievements(state, updatedState);

      return {
        ...updatedState,
        achievements: updatedAchievements,
        entriesPerSecond: calculateEntriesPerSecond(updatedState)
      };
    }

    case "START_MINIGAME": {
      const gameIndex = state.miniGames.findIndex(g => g.id === action.id);
      if (gameIndex === -1 || !state.miniGames[gameIndex].unlocked) return state;

      // La logique du mini-jeu elle-même sera gérée par un composant séparé
      return state;
    }

    case "COMPLETE_MINIGAME": {
      const gameIndex = state.miniGames.findIndex(g => g.id === action.id);
      if (gameIndex === -1) return state;

      const game = state.miniGames[gameIndex];
      if (game.completed) return state;

      let updatedState = {
        ...state,
        miniGames: state.miniGames.map((g, i) =>
          i === gameIndex ? { ...g, completed: true } : g
        )
      };

      // Appliquer la récompense
      switch (game.reward.type) {
        case "multiplier":
          updatedState = {
            ...updatedState,
            entriesPerClick: state.entriesPerClick * game.reward.value
          };
          break;
        case "resource":
          updatedState = {
            ...updatedState,
            entries: state.entries + game.reward.value
          };
          break;
        case "talent_points":
          updatedState = {
            ...updatedState,
            talents: {
              ...state.talents,
              points: state.talents.points + game.reward.value
            }
          };
          break;
      }

      const updatedAchievements = checkAchievements(state, updatedState);
      return { ...updatedState, achievements: updatedAchievements };
    }

    case "ACTIVATE_ACCOUNTANT": {
      const accountantIndex = state.famousAccountants.findIndex(a => a.id === action.id);
      if (accountantIndex === -1) return state;

      const accountant = state.famousAccountants[accountantIndex];
      if (!accountant.unlocked || !accountant.purchased) return state;

      const now = Date.now();
      if (accountant.lastUsed && now - accountant.lastUsed < accountant.cooldown * 1000) {
        return state;
      }

      let updatedState = {
        ...state,
        famousAccountants: state.famousAccountants.map((a, i) =>
          i === accountantIndex ? { ...a, lastUsed: now } : a
        )
      };

      // Appliquer le pouvoir
      switch (accountant.power.type) {
        case "click": {
          updatedState = {
            ...updatedState,
            entriesPerClick: state.entriesPerClick * accountant.power.multiplier
          };
          // Réinitialiser après la durée
          setTimeout(() => {
            updatedState = {
              ...updatedState,
              entriesPerClick: state.entriesPerClick
            };
          }, accountant.power.duration * 1000);
          break;
        }
        case "generator": {
          const boostedGenerators = state.collaborators.map(g => ({
            ...g,
            baseOutput: g.baseOutput * accountant.power.multiplier
          }));
          updatedState = {
            ...updatedState,
            collaborators: boostedGenerators,
            entriesPerSecond: calculateEntriesPerSecond({
              ...state,
              collaborators: boostedGenerators
            })
          };
          // Réinitialiser après la durée
          setTimeout(() => {
            updatedState = {
              ...updatedState,
              collaborators: state.collaborators,
              entriesPerSecond: calculateEntriesPerSecond(state)
            };
          }, accountant.power.duration * 1000);
          break;
        }
        case "global": {
          updatedState = {
            ...updatedState,
            entriesPerClick: state.entriesPerClick * accountant.power.multiplier,
            collaborators: state.collaborators.map(g => ({
              ...g,
              baseOutput: g.baseOutput * accountant.power.multiplier
            }))
          };
          // Réinitialiser après la durée
          setTimeout(() => {
            updatedState = {
              ...updatedState,
              entriesPerClick: state.entriesPerClick,
              collaborators: state.collaborators
            };
          }, accountant.power.duration * 1000);
          break;
        }
      }

      toast.success(`🎭 ${accountant.name} activé !`, {
        description: accountant.description,
      });

      return updatedState;
    }

    case "PURCHASE_ACCOUNTANT": {
      const accountantIndex = state.famousAccountants.findIndex(a => a.id === action.id);
      if (accountantIndex === -1) return state;

      const accountant = state.famousAccountants[accountantIndex];
      if (!accountant.unlocked || accountant.purchased) return state;

      return {
        ...state,
        famousAccountants: state.famousAccountants.map((a, i) =>
          i === accountantIndex ? { ...a, purchased: true } : a
        )
      };
    }

    case "LOAD_GAME":
      return action.state;

    case "RESET_GAME":
      return {
        ...initialGameState,
        gameStartedAt: Date.now(),
        lastSavedAt: Date.now(),
        lastTickAt: Date.now(),
      };
      
    case "SHOW_FEATURE": {
      const [type, id] = action.id.split(":");
      
      if (type === "generator") {
        return {
          ...state,
          collaborators: state.collaborators.map(g => 
            g.id === id && g.pennylaneFeature 
              ? { ...g, pennylaneFeature: { ...g.pennylaneFeature, shown: true }} 
              : g
          )
        };
      }
      
      if (type === "upgrade") {
        return {
          ...state,
          upgrades: state.upgrades.map(u => 
            u.id === id && u.pennylaneFeature 
              ? { ...u, pennylaneFeature: { ...u.pennylaneFeature, shown: true }} 
              : u
          )
        };
      }
      
      return state;
    }

    case "TOGGLE_DEBUG_MODE": {
      const newState = {
        ...state,
        debugMode: !state.debugMode
      };
      
      toast.success(
        newState.debugMode ? "🐞 Mode Debug Activé" : "🐞 Mode Debug Désactivé",
        {
          description: newState.debugMode 
            ? "Multiplicateur x50 activé pour le développement"
            : "Retour au mode normal"
        }
      );
      
      return newState;
    }

    case "ACTIVATE_FEATURE": {
      const updatedFeatures = featureReducer(state.features, action);
      const feature = updatedFeatures[action.featureId];
      
      // Si c'est LinkedIn Premium qui est activé, on débloque le cabinet
      if (action.featureId === "linkedinPremium" && feature.active) {
        return {
          ...state,
          features: updatedFeatures,
          cabinetUnlocked: true
        };
      }
      
      return {
        ...state,
        features: updatedFeatures
      };
    }

    case "DEACTIVATE_FEATURE":
    case "UNLOCK_FEATURE":
    case "START_TRIAL":
    case "END_TRIAL": {
      return {
        ...state,
        features: featureReducer(state.features, action)
      };
    }

    default:
      return state;
  }
}

