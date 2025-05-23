import type { GameState, GameAction, Achievement, FiscalObjective, MiniGame, Upgrade, GameCollaborator } from "@/types/game";
import { toast } from "sonner";
import { initialGameState, fiscalSeasons } from "@/data/gameInitialState";
import { featureReducer } from "@/reducers/features/featureReducer";
import { checkFeatureRequirements } from "@/types/features";
import { calculateCollaboratorBoost, calculateCollaboratorCost } from "@/reducers/calculations/collaboratorCalculations";

const DEBUG_MULTIPLIER = 1000;

export const calculateEntriesPerSecond = (state: GameState): number => {
  const baseEntriesPerSecond = state.collaborators?.reduce(
    (total, collaborator) => total + collaborator.baseOutput * collaborator.count,
    0
  ) || 0;
  
  return state.debugMode ? baseEntriesPerSecond * DEBUG_MULTIPLIER : baseEntriesPerSecond;
};

export const checkAchievements = (state: GameState, updates: Partial<GameState>): Achievement[] => {
  return state.achievements.map(achievement => {
    if (achievement.unlocked) return achievement;

    const testState = {
      ...state,
      ...updates,
      totalEntries: updates.totalEntries ?? state.totalEntries,
      entries: updates.entries ?? state.entries,
      clickCount: updates.clickCount ?? state.clickCount,
      prestige: {
        ...initialGameState.prestige,
        ...state.prestige,
        ...updates.prestige
      }
    };

    try {
      if (achievement.condition(testState)) {
        toast.success(`🏆 Trophée débloqué : ${achievement.name}`, {
          description: achievement.description,
        });
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
};

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

// Vérification des objectifs
export const checkObjectives = (state: GameState): FiscalObjective[] => {
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

const calculatePrestigeMultiplier = (prestigeUpgrades: Upgrade[]): number => {
  return prestigeUpgrades
    .filter(u => u.purchased)
    .reduce((total, upgrade) => {
      const effect = upgrade.effect({ ...initialGameState });
      return total * (effect.prestige?.multiplier || 1);
    }, 1);
};

export const checkMiniGameUnlock = (state: GameState): MiniGame[] => {
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
    if (accountant.unlocked) {
      return accountant;
    }
    
    // Conditions de déblocage des Légendes de la Compta
    switch (accountant.id) {
      case "jean_compta_van_damme": {
        return {
          ...accountant,
          unlocked: state.debugMode ? state.clickCount >= 10 : state.clickCount >= 500
        };
      }
      case "debit_vador": {
        return {
          ...accountant,
          unlocked: state.totalEntries >= 1000000
        };
      }
      case "credit_suisse": {
        return {
          ...accountant,
          unlocked: state.totalEntries >= 100000
        };
      }
      case "warren_buffeuille": {
        const totalCollabs = state.collaborators.reduce((total, collab) => total + collab.count, 0);
        return {
          ...accountant,
          unlocked: totalCollabs >= 50
        };
      }
      default:
        return accountant;
    }
  });
};

// Calcul du multiplicateur de clic
export const calculateClickMultiplier = (state: GameState): number => {
  const baseMultiplier = 1;
  
  // Si prestige ou specializations n'existe pas, retourner le multiplicateur de base
  if (!state.prestige?.specializations) {
    return baseMultiplier;
  }
  
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

export const calculateTrainingPoints = (state: GameState): number => {
  return state.collaborators
    .filter(g => g.effects?.training && g.count > 0)
    .reduce((total, g) => total + (g.effects?.training || 0) * g.count, 0);
};

export const calculateComboMultiplier = (state: GameState): number => {
  // Only activate combo system after 10 total entries
  if (state.totalEntries < 10) return 1;
  
  if (!state.combo.active) return 1;
  
  const now = Date.now();
  const timeSinceLastClick = now - state.combo.lastClickTime;
  
  // Si le temps depuis le dernier clic dépasse la fenêtre, pas de combo
  if (timeSinceLastClick > state.combo.comboTimeWindow) {
    return 1;
  }

  // Calculer la dégradation depuis la dernière mise à jour
  const timeSinceLastDegradation = now - state.combo.lastDegradationTime;
  const degradationSteps = Math.floor(timeSinceLastDegradation / state.combo.degradationInterval);
  let currentMultiplier = state.combo.multiplier;
  
  if (degradationSteps > 0) {
    // Appliquer la dégradation
    const degradationFactor = Math.pow(1 - state.combo.degradationRate, degradationSteps);
    currentMultiplier = Math.max(1, currentMultiplier * degradationFactor);
  }

  // Trouver le palier actuel
  const currentTier = state.combo.tiers.reduce((maxTier, tier, index) => {
    return state.combo.clicksInCombo >= tier.clickThreshold ? index : maxTier;
  }, -1);

  // Calculer le multiplicateur de base avec le palier
  const tierMultiplier = currentTier >= 0 && currentTier < state.combo.tiers.length && state.combo.tiers[currentTier]
    ? state.combo.tiers[currentTier].multiplier
    : 1;
  
  // Appliquer le bonus de vitesse si les clics sont rapprochés
  const speedBonus = timeSinceLastClick < 200 ? 1.5 : 1;

  // Calculer le multiplicateur final
  return Math.min(
    state.combo.maxMultiplier,
    currentMultiplier * state.combo.baseMultiplier * tierMultiplier * speedBonus
  );
};

const applyFeatureEffects = (state: GameState): GameState => {
  const activeFeatures = Object.values(state.features).filter(f => f.active && f.effect);
  return activeFeatures.reduce((acc, feature) => feature.effect ? feature.effect(acc) : acc, state);
};

const checkCollaboratorUnlock = (state: GameState): GameCollaborator[] => {
  return state.collaborators.map((collaborator, index) => {
    if (collaborator.unlocked) return collaborator;
    
    // If it's the first collaborator, it's always unlocked
    if (index === 0) return { ...collaborator, unlocked: true };
    
    // Get the previous collaborator
    const previousCollaborator = state.collaborators[index - 1];
    if (!previousCollaborator) return collaborator;
    
    // Unlock only based on previous collaborator count
    const shouldUnlockByCount = previousCollaborator.unlocked && previousCollaborator.count >= 5;
    
    return {
      ...collaborator,
      unlocked: shouldUnlockByCount
    };
  });
};

export function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case "TICK": {
      const now = action.timestamp;
      const deltaTime = now - state.lastTickAt;
      if (deltaTime < 50) return state;

      const entriesPerSecond = calculateEntriesPerSecond(state);
      const entriesGained = (entriesPerSecond * deltaTime) / 1000;
      
      const newEntries = state.entries + entriesGained;
      const newTotalEntries = state.totalEntries + entriesGained;

      // Create updated state for checks
      const updatedState = {
        ...state,
        entries: newEntries,
        totalEntries: newTotalEntries,
        entriesPerSecond,
        lastTickAt: now
      };

      // Check achievements with updated state
      const updatedAchievements = checkAchievements(updatedState, {});

      // Check collaborator unlocking with updated state
      const updatedCollaborators = checkCollaboratorUnlock(updatedState);

      // Vérification des Légendes de la Compta
      const updatedFamousAccountants = checkFamousAccountantUnlock({
        ...updatedState,
        collaborators: updatedCollaborators,
        achievements: updatedAchievements
      });

      // Mise à jour du combo
      const combo = state.combo.active ? {
        ...state.combo,
        multiplier: Math.min(
          state.combo.maxMultiplier,
          state.combo.multiplier + (deltaTime / state.combo.comboTimeWindow) * 0.1
        )
      } : state.combo;

      // Vérification des mini-jeux
      const updatedMiniGames = state.miniGames.map((game: MiniGame) => {
        return {
          ...game,
          timeLeft: game.reward.type === "multiplier" ? Math.max(0, (game.reward.value || 0) - deltaTime) : 0
        };
      });

      // Vérification des améliorations
      const updatedUpgrades = state.upgrades.map(upgrade => {
        if (upgrade.purchased || upgrade.unlocked) return upgrade;
        
        if (upgrade.requirement) {
          const requirement = upgrade.requirement;
          
          switch (requirement.type) {
            case "totalEntries":
              return {
                ...upgrade,
                unlocked: newTotalEntries >= requirement.count
              };
            default:
              return upgrade;
          }
        }
        
        return upgrade;
      });

      // Vérification des fonctionnalités
      const updatedFeatures = { ...state.features };
      
      Object.entries(state.features).forEach(([id, feature]) => {
        if (!feature.unlocked && checkFeatureRequirements(updatedState, feature)) {
          updatedFeatures[id] = {
            ...feature,
            unlocked: true
          };
        }
      });

      let finalState = {
        ...updatedState,
        combo,
        achievements: updatedAchievements,
        miniGames: updatedMiniGames,
        famousAccountants: updatedFamousAccountants,
        upgrades: updatedUpgrades,
        features: updatedFeatures,
        activePowerUps: state.activePowerUps.filter(p => p.expiresAt ? p.expiresAt > now : false),
        collaborators: updatedCollaborators
      };

      // Appliquer les effets des fonctionnalités actives
      finalState = applyFeatureEffects(finalState);

      return finalState;
    }

    case "CLICK": {
      const now = Date.now();
      const clickMultiplier = calculateClickMultiplier(state);
      const baseEntriesPerClick = state.entriesPerClick * clickMultiplier;
      const entriesPerClick = state.debugMode ? baseEntriesPerClick * DEBUG_MULTIPLIER : baseEntriesPerClick;

      // Update combo system
      let combo = { ...state.combo };
      const timeSinceLastClick = now - combo.lastClickTime;

      if (!combo.active || timeSinceLastClick <= combo.comboTimeWindow) {
        // Mise à jour du combo
        const newClicksInCombo = combo.active ? combo.clicksInCombo + 1 : 1;
        
        // Trouver le nouveau palier
        const newTier = combo.tiers.reduce((maxTier, tier, index) => {
          return newClicksInCombo >= tier.clickThreshold ? index : maxTier;
        }, -1);

        // Calculer le nouveau multiplicateur
        const tierMultiplier = newTier >= 0 && newTier < combo.tiers.length && combo.tiers[newTier]
          ? combo.tiers[newTier].multiplier
          : 1;
        const speedBonus = timeSinceLastClick < 200 ? 1.5 : 1;
        const newMultiplier = Math.min(
          combo.maxMultiplier,
          (combo.active ? combo.multiplier : 1) * combo.baseMultiplier * tierMultiplier * speedBonus
        );

        combo = {
          ...combo,
          active: true,
          multiplier: newMultiplier,
          clicksInCombo: newClicksInCombo,
          lastClickTime: now,
          currentTier: newTier,
          speedBonus: speedBonus,
          lastDegradationTime: now
        };
      } else {
        // Réinitialiser le combo
        combo = {
          ...combo,
          active: true,
          multiplier: 1,
          clicksInCombo: 1,
          lastClickTime: now,
          currentTier: 0,
          speedBonus: 1,
          lastDegradationTime: now
        };
      }

      // Only apply combo multiplier if combo is active and totalEntries >= 10
      const comboMultiplier = (state.totalEntries >= 10 && combo.active) ? combo.multiplier : 1;
      const entriesGained = entriesPerClick * comboMultiplier;

      const updatedState = {
        ...state,
        entries: state.entries + entriesGained,
        totalEntries: state.totalEntries + entriesGained,
        clickCount: state.clickCount + 1,
        combo
      };

      // Check achievements with updated state
      const updatedAchievements = checkAchievements(updatedState, {});

      return {
        ...updatedState,
        achievements: updatedAchievements
      };
    }

    case "BUY_COLLABORATOR": {
      const collaborator = state.collaborators.find(c => c.id === action.id);
      if (!collaborator) return state;

      const cost = calculateCollaboratorCost(collaborator.baseCost, collaborator.count);
      if (state.entries < cost) {
        toast.error("Not enough entries!", { duration: 2000 });
        return state;
      }

      // Unlock next collaborator if this is the first purchase
      const updatedCollaborators = state.collaborators.map((c, index, array) => {
        if (c.id === action.id) {
          // If this is the first purchase and there's a next collaborator
          if (c.count === 0 && index + 1 < array.length) {
            const nextCollaborator = array[index + 1];
            if (nextCollaborator) {
              nextCollaborator.unlocked = true;
            }
          }
          return { ...c, count: c.count + 1 };
        }
        return c;
      });

      return {
        ...state,
        entries: state.entries - cost,
        collaborators: updatedCollaborators,
      };
    }

    case "BUY_UPGRADE": {
      const upgradeIndex = state.upgrades.findIndex((u) => u.id === action.id);
      const upgrade = state.upgrades[upgradeIndex];
      if (!upgrade || upgrade.purchased || !upgrade.unlocked || state.entries < upgrade.cost) {
        return state;
      }

      // Update state with purchased upgrade
      const updatedState = {
        ...state,
        entries: state.entries - upgrade.cost,
        upgrades: state.upgrades.map((u, i) =>
          i === upgradeIndex ? { ...u, purchased: true } : u
        ),
        statsTabUnlocked: state.statsTabUnlocked || (upgrade.id === 'stats_unlock')
      };

      // Apply upgrade effect
      const stateAfterEffect = upgrade.effect(updatedState);

      // Check achievements
      const updatedAchievements = checkAchievements(state, stateAfterEffect);

      return {
        ...stateAfterEffect,
        upgrades: updatedState.upgrades,
        statsTabUnlocked: updatedState.statsTabUnlocked,
        entriesPerSecond: calculateEntriesPerSecond(stateAfterEffect),
        achievements: updatedAchievements
      };
    }

    case "PRESTIGE": {
      if (state.entries < state.prestige.cost) {
        return state;
      }

      const prestigePoints = Math.floor(Math.log10(state.entries / state.prestige.cost));
      const currentMultiplier = state.prestige.multiplier;
      const currentTotalResets = state.prestige.totalResets;
      const currentAchievements = state.achievements;

      // Reset the game state but keep certain progress
      const newState = {
        ...initialGameState,
        prestige: {
          ...initialGameState.prestige,
          points: state.prestige.points + prestigePoints,
          multiplier: currentMultiplier * 1.1, // Increase multiplier by 10%
          totalResets: currentTotalResets + 1,
          upgrades: state.prestige.upgrades // Keep prestige upgrades
        },
        achievements: currentAchievements, // Keep achievements
        debugMode: state.debugMode, // Keep debug mode setting
        gameStartedAt: state.gameStartedAt, // Keep original start time
        lastSavedAt: Date.now(),
        lastTickAt: Date.now()
      };

      // Check for new achievements after prestige
      const updatedAchievements = checkAchievements(newState, {});

      return {
        ...newState,
        achievements: updatedAchievements
      };
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
      const upgrade = state.prestige.upgrades[upgradeIndex];
      if (!upgrade || upgrade.purchased || !upgrade.unlocked || state.prestige.points < upgrade.cost) {
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

    case "START_MINIGAME": {
      const gameIndex = state.miniGames.findIndex(g => g.id === action.id);
      const game = state.miniGames[gameIndex];
      if (!game || !game.unlocked) return state;

      return state;
    }

    case "COMPLETE_MINIGAME": {
      const gameIndex = state.miniGames.findIndex(g => g.id === action.id);
      const game = state.miniGames[gameIndex];
      if (!game || game.completed) return state;

      let updatedState = {
        ...state,
        miniGames: state.miniGames.map((g, i) =>
          i === gameIndex ? { ...g, completed: true } : g
        )
      };

      // Apply reward if it exists
      if (game.reward) {
        switch (game.reward.type) {
          case "multiplier":
            updatedState = {
              ...updatedState,
              entriesPerClick: state.entriesPerClick * (game.reward.value || 1)
            };
            break;
          case "resource":
            updatedState = {
              ...updatedState,
              entries: state.entries + (game.reward.value || 0)
            };
            break;
        }
      }

      const updatedAchievements = checkAchievements(state, updatedState);
      return { ...updatedState, achievements: updatedAchievements };
    }

    case "ACTIVATE_ACCOUNTANT": {
      const accountantIndex = state.famousAccountants.findIndex(a => a.id === action.id);
      const accountant = state.famousAccountants[accountantIndex];
      if (!accountant || !accountant.unlocked || !accountant.purchased) return state;

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

      // Apply power if it exists
      if (accountant.power) {
        switch (accountant.power.type) {
          case "click": {
            updatedState = {
              ...updatedState,
              entriesPerClick: state.entriesPerClick * accountant.power.multiplier
            };
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
      }

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
      const accountant = state.famousAccountants[accountantIndex];
      if (!accountant || !accountant.unlocked || accountant.purchased) return state;

      return {
        ...state,
        famousAccountants: state.famousAccountants.map((a, i) =>
          i === accountantIndex ? { ...a, purchased: true } : a
        )
      };
    }

    case "LOAD_GAME": {
      // Create a map of achievement conditions from initialGameState
      const conditionMap = new Map(
        initialGameState.achievements.map(a => [a.id, a.condition])
      );

      // Create a map of upgrade effects from initialGameState
      const effectMap = new Map(
        initialGameState.upgrades.map(u => [u.id, u.effect])
      );

      // Reattach achievement conditions and upgrade effects from initialGameState
      const loadedState = {
        ...action.state,
        achievements: action.state.achievements.map((achievement: Achievement) => {
          const condition = conditionMap.get(achievement.id);
          if (!condition) {
            console.error(`No condition found for achievement: ${achievement.id}`);
            return {
              ...achievement,
              condition: () => false
            };
          }
          return {
            ...achievement,
            condition
          };
        }),
        upgrades: action.state.upgrades.map((upgrade: Upgrade) => {
          const effect = effectMap.get(upgrade.id);
          if (!effect) {
            console.error(`No effect found for upgrade: ${upgrade.id}`);
            return {
              ...upgrade,
              effect: (state: GameState) => state
            };
          }
          return {
            ...upgrade,
            effect,
            purchased: upgrade.purchased || false
          };
        }),
        // Preserve all unlocked states
        statsTabUnlocked: action.state.statsTabUnlocked || action.state.upgrades.some(u => u.id === 'stats_unlock' && u.purchased),
        upgradesTabUnlocked: action.state.upgradesTabUnlocked,
        achievementsTabUnlocked: action.state.achievementsTabUnlocked,
        prestigeTabUnlocked: action.state.prestigeTabUnlocked,
        specialFeaturesUnlocked: action.state.specialFeaturesUnlocked
      };

      // Ensure stats tab is unlocked if stats_unlock upgrade is purchased
      if (loadedState.upgrades.some(u => u.id === 'stats_unlock' && u.purchased)) {
        loadedState.statsTabUnlocked = true;
      }

      return loadedState;
    }

    case "RESET_GAME":
      return {
        ...initialGameState,
        achievements: state.achievements, // Keep achievements after reset
        gameStartedAt: Date.now(),
        lastSavedAt: Date.now(),
        lastTickAt: Date.now(),
        debugMode: false,
      };
      
    case "TOGGLE_DEBUG_MODE": {
      const newState = {
        ...state,
        debugMode: !state.debugMode
      };
      
      toast.success(
        newState.debugMode ? "🐞 Mode Debug Activé" : "🐞 Mode Debug Désactivé",
        {
          description: newState.debugMode 
            ? "Multiplicateur x1000 activé pour le développement"
            : "Retour au mode normal"
        }
      );
      
      return newState;
    }

    case "FEATURE_ACTION": {
      const updatedFeatures = featureReducer(state, action.featureAction);
      let updatedState = {
        ...state,
        features: updatedFeatures.features
      };

      // Apply feature effects if needed
      if (action.featureAction.type === "TOGGLE_FEATURE") {
        updatedState = applyFeatureEffects(updatedState);
      }

      return updatedState;
    }

    case "UNLOCK_TAB": {
      switch (action.id) {
        case "upgrades":
          return {
            ...state,
            upgradesTabUnlocked: true
          };
        case "stats":
          return {
            ...state,
            statsTabUnlocked: true
          };
        case "achievements":
          return {
            ...state,
            achievementsTabUnlocked: true
          };
        case "prestige":
          return {
            ...state,
            prestigeTabUnlocked: true
          };
        default:
          return state;
      }
    }

    case "CHECK_UNLOCKS": {
      return {
        ...state,
        // L'onglet des améliorations est déverrouillé à partir de 30 entrées
        upgradesTabUnlocked: state.upgradesTabUnlocked || state.entries >= 30,
        // L'onglet des statistiques est déverrouillé quand l'amélioration stats_unlock est achetée
        statsTabUnlocked: state.statsTabUnlocked || state.upgrades.some(u => u.id === 'stats_unlock' && u.purchased),
        // L'onglet des succès est déverrouillé quand au moins un succès est débloqué
        achievementsTabUnlocked: state.achievementsTabUnlocked || state.achievements.some(a => a.unlocked),
        // L'onglet de prestige est déverrouillé à 1M d'entrées ou quand des points de prestige existent
        prestigeTabUnlocked: state.prestigeTabUnlocked || state.totalEntries >= 1_000_000 || state.prestige.points > 0,
        // Special features are unlocked at 1M total entries
        specialFeaturesUnlocked: state.specialFeaturesUnlocked || state.totalEntries >= 1_000_000
      };
    }

    default:
      return state;
  }
}

export function calculateCollaboratorOutput(state: GameState, collaborator: GameCollaborator): number {
  const boost = calculateCollaboratorBoost(state);
  return collaborator.baseOutput * collaborator.count * boost;
}

