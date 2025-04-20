import { GameState, GameAction } from "@/types/game";
import { toast } from "sonner";
import { initialGameState } from "@/data/gameInitialState";

export const calculateGeneratorCost = (baseCost: number, count: number): number => {
  return Math.floor(baseCost * Math.pow(1.15, count));
};

export const calculateEntriesPerSecond = (generators: GameState["generators"]): number => {
  return generators.reduce(
    (total, generator) => total + generator.baseOutput * generator.count,
    0
  );
};

export const checkAchievements = (state: GameState, newState: Partial<GameState>) => {
  return state.achievements.map((achievement) => {
    if (achievement.unlocked) return achievement;
    const testState = { ...state, ...newState };
    if (achievement.condition(testState)) {
      toast.success(`🏆 Trophée débloqué : ${achievement.name}`, {
        description: achievement.description,
      });
      return { ...achievement, unlocked: true };
    }
    return achievement;
  });
};

// Nouvelles fonctions utilitaires
export const calculatePrestigePoints = (totalEntries: number): number => {
  return Math.floor(Math.sqrt(totalEntries / 1e6));
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
      case "count_dracula":
        return {
          ...accountant,
          unlocked: state.clickCount >= 5000
        };
      case "sherlock_holmes":
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

export const gameReducer = (state: GameState, action: GameAction): GameState => {
  switch (action.type) {
    case "CLICK": {
      const clickMultiplier = state.debugMode ? 10 : 1;
      const clickGain = state.entriesPerClick * clickMultiplier;
      const newEntries = state.entries + clickGain;
      const newTotalEntries = state.totalEntries + clickGain;
      const newClickCount = state.clickCount + 1;

      const updatedAchievements = checkAchievements(state, {
        entries: newEntries,
        totalEntries: newTotalEntries,
        clickCount: newClickCount,
      });

      return {
        ...state,
        entries: newEntries,
        totalEntries: newTotalEntries,
        clickCount: newClickCount,
        achievements: updatedAchievements,
      };
    }

    case "BUY_GENERATOR": {
      const generatorIndex = state.generators.findIndex((g) => g.id === action.id);
      if (generatorIndex === -1) return state;

      const generator = state.generators[generatorIndex];
      const cost = calculateGeneratorCost(generator.baseCost, generator.count);

      if (state.entries < cost) return state;

      const updatedGenerators = [...state.generators];
      updatedGenerators[generatorIndex] = {
        ...generator,
        count: generator.count + 1,
      };

      const entriesPerSecond = calculateEntriesPerSecond(updatedGenerators);

      if (generator.count === 0) {
        const nextIndex = generatorIndex + 1;
        if (nextIndex < updatedGenerators.length && !updatedGenerators[nextIndex].unlocked) {
          updatedGenerators[nextIndex] = {
            ...updatedGenerators[nextIndex],
            unlocked: true,
          };
        }
      }

      const updatedUpgrades = state.upgrades.map((upgrade) => {
        if (upgrade.unlocked || upgrade.purchased) return upgrade;
        
        if (upgrade.requirement?.type === "generator" && 
            upgrade.requirement.id === generator.id && 
            generator.count + 1 >= upgrade.requirement.count) {
          return { ...upgrade, unlocked: true };
        }
        return upgrade;
      });

      const updatedAchievements = checkAchievements(state, {
        entries: state.entries - cost,
        generators: updatedGenerators,
        entriesPerSecond,
      });

      return {
        ...state,
        entries: state.entries - cost,
        generators: updatedGenerators,
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
        entriesPerSecond: calculateEntriesPerSecond(updatedState.generators),
        achievements: updatedAchievements,
      };
    }

    case "PRESTIGE": {
      const prestigePoints = calculatePrestigePoints(state.totalEntries);
      if (prestigePoints <= state.prestige.points) return state;

      toast.success("🌟 Prestige !", {
        description: `Vous gagnez ${prestigePoints - state.prestige.points} points de prestige !`,
      });

      return {
        ...initialGameState,
        prestige: {
          ...state.prestige,
          points: prestigePoints,
          upgrades: state.prestige.upgrades.map(u => {
            if (!u.unlocked && prestigePoints >= u.cost) {
              return { ...u, unlocked: true };
            }
            return u;
          })
        },
        talents: state.talents,
        miniGames: state.miniGames,
        famousAccountants: state.famousAccountants,
        gameStartedAt: state.gameStartedAt,
        lastTickAt: Date.now(),
        lastSavedAt: Date.now(),
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
        entriesPerSecond: calculateEntriesPerSecond(updatedState.generators)
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
      if (!accountant.unlocked) return state;

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
          const boostedGenerators = state.generators.map(g => ({
            ...g,
            baseOutput: g.baseOutput * accountant.power.multiplier
          }));
          updatedState = {
            ...updatedState,
            generators: boostedGenerators,
            entriesPerSecond: calculateEntriesPerSecond(boostedGenerators)
          };
          // Réinitialiser après la durée
          setTimeout(() => {
            updatedState = {
              ...updatedState,
              generators: state.generators,
              entriesPerSecond: calculateEntriesPerSecond(state.generators)
            };
          }, accountant.power.duration * 1000);
          break;
        }
        case "global": {
          updatedState = {
            ...updatedState,
            entriesPerClick: state.entriesPerClick * accountant.power.multiplier,
            generators: state.generators.map(g => ({
              ...g,
              baseOutput: g.baseOutput * accountant.power.multiplier
            }))
          };
          // Réinitialiser après la durée
          setTimeout(() => {
            updatedState = {
              ...updatedState,
              entriesPerClick: state.entriesPerClick,
              generators: state.generators
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

    case "TICK": {
      const deltaTime = (action.timestamp - state.lastTickAt) / 1000;
      const speedMultiplier = state.debugMode ? 10 : 1;
      const prestigeMultiplier = state.prestige.multiplier;
      const earnedEntries = state.entriesPerSecond * deltaTime * speedMultiplier * prestigeMultiplier;
      
      const updatedMiniGames = checkMiniGameUnlock({
        ...state,
        entries: state.entries + earnedEntries,
        totalEntries: state.totalEntries + earnedEntries,
      });

      const updatedFamousAccountants = checkFamousAccountantUnlock({
        ...state,
        entries: state.entries + earnedEntries,
        totalEntries: state.totalEntries + earnedEntries,
      });

      const updatedAchievements = checkAchievements(state, {
        entries: state.entries + earnedEntries,
        totalEntries: state.totalEntries + earnedEntries,
        miniGames: updatedMiniGames,
        famousAccountants: updatedFamousAccountants
      });

      return {
        ...state,
        entries: state.entries + earnedEntries,
        totalEntries: state.totalEntries + earnedEntries,
        lastTickAt: action.timestamp,
        achievements: updatedAchievements,
        miniGames: updatedMiniGames,
        famousAccountants: updatedFamousAccountants
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
          generators: state.generators.map(g => 
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

    case 'TOGGLE_DEBUG_MODE':
      return {
        ...state,
        debugMode: !state.debugMode,
      };

    default:
      return state;
  }
};
