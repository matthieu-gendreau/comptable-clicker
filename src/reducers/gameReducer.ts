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

export const gameReducer = (state: GameState, action: GameAction): GameState => {
  switch (action.type) {
    case "CLICK": {
      const clickMultiplier = state.debugMode ? 10 : 1;
      const clickGain = state.entriesPerClick * clickMultiplier;
      const newEntries = state.entries + clickGain;
      const newTotalEntries = state.totalEntries + clickGain;
      return {
        ...state,
        entries: newEntries,
        totalEntries: newTotalEntries,
        clickCount: state.clickCount + 1,
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

      return {
        ...state,
        entries: state.entries - cost,
        generators: updatedGenerators,
        entriesPerSecond,
        upgrades: updatedUpgrades,
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

      return {
        ...updatedState,
        entriesPerSecond: calculateEntriesPerSecond(updatedState.generators),
      };
    }

    case "TICK": {
      const deltaTime = (action.timestamp - state.lastTickAt) / 1000;
      const speedMultiplier = state.debugMode ? 10 : 1;
      const earnedEntries = state.entriesPerSecond * deltaTime * speedMultiplier;
      
      const updatedAchievements = state.achievements.map((achievement) => {
        if (achievement.unlocked) return achievement;
        if (achievement.condition({ ...state, entries: state.entries + earnedEntries, totalEntries: state.totalEntries + earnedEntries })) {
          return { ...achievement, unlocked: true };
        }
        return achievement;
      });

      return {
        ...state,
        entries: state.entries + earnedEntries,
        totalEntries: state.totalEntries + earnedEntries,
        lastTickAt: action.timestamp,
        achievements: updatedAchievements,
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
