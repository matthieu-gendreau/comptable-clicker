import React, { createContext, useContext, useEffect, useReducer } from "react";
import { toast } from "sonner";

// Define types
type Generator = {
  id: string;
  name: string;
  description: string;
  baseCost: number;
  baseOutput: number;
  count: number;
  unlocked: boolean;
  pennylaneFeature?: {
    title: string;
    description: string;
    shown: boolean;
  };
};

type Upgrade = {
  id: string;
  name: string;
  description: string;
  cost: number;
  purchased: boolean;
  unlocked: boolean;
  effect: (state: GameState) => GameState;
  requirement?: {
    type: string;
    id: string;
    count: number;
  };
  pennylaneFeature?: {
    title: string;
    description: string;
    shown: boolean;
  };
};

type Achievement = {
  id: string;
  name: string;
  description: string;
  unlocked: boolean;
  hidden: boolean;
  condition: (state: GameState) => boolean;
};

// Update GameState type
type GameState = {
  entries: number; // Nombre d'écritures comptables
  totalEntries: number;
  entriesPerClick: number;
  entriesPerSecond: number;
  clickCount: number;
  generators: Generator[];
  upgrades: Upgrade[];
  achievements: Achievement[];
  gameStartedAt: number;
  lastSavedAt: number;
  lastTickAt: number;
};

type GameAction =
  | { type: "CLICK" }
  | { type: "BUY_GENERATOR"; id: string }
  | { type: "BUY_UPGRADE"; id: string }
  | { type: "TICK"; timestamp: number }
  | { type: "LOAD_GAME"; state: GameState }
  | { type: "RESET_GAME" }
  | { type: "SHOW_FEATURE"; id: string };

// Define initial generators
const initialGenerators: Generator[] = [
  {
    id: "junior_accountant",
    name: "Comptable Junior",
    description: "Saisit les écritures de base",
    baseCost: 10,
    baseOutput: 0.1,
    count: 0,
    unlocked: true,
  },
  {
    id: "senior_accountant",
    name: "Comptable Senior",
    description: "Gère les écritures complexes",
    baseCost: 100,
    baseOutput: 1,
    count: 0,
    unlocked: false,
    pennylaneFeature: {
      title: "Saisie Automatique",
      description: "Pennylane automatise la saisie des écritures comptables grâce à l'IA.",
      shown: false,
    },
  },
  {
    id: "accounting_software",
    name: "Logiciel Basique",
    description: "Logiciel de comptabilité simple",
    baseCost: 1000,
    baseOutput: 8,
    count: 0,
    unlocked: false,
    pennylaneFeature: {
      title: "Interface Intuitive",
      description: "Le tableau de bord Pennylane permet de visualiser en temps réel votre situation comptable.",
      shown: false,
    },
  },
  {
    id: "erp_system",
    name: "Système ERP",
    description: "Système de gestion intégré",
    baseCost: 10000,
    baseOutput: 47,
    count: 0,
    unlocked: false,
    pennylaneFeature: {
      title: "Intégration Complète",
      description: "Pennylane s'intègre avec tout votre écosystème pour une comptabilité sans silo.",
      shown: false,
    },
  },
  {
    id: "ai_assistant",
    name: "Assistant IA",
    description: "IA avancée pour la comptabilité",
    baseCost: 50000,
    baseOutput: 260,
    count: 0,
    unlocked: false,
    pennylaneFeature: {
      title: "Assistant Intelligent",
      description: "L'IA de Pennylane aide à la prise de décision avec des analyses prédictives.",
      shown: false,
    },
  },
];

// Define initial upgrades
const initialUpgrades: Upgrade[] = [
  {
    id: "better_calculator",
    name: "Better Calculator",
    description: "Double your clicking power",
    cost: 50,
    purchased: false,
    unlocked: true,
    effect: (state) => ({
      ...state,
      entriesPerClick: state.entriesPerClick * 2,
    }),
  },
  {
    id: "training_program",
    name: "Training Program",
    description: "Junior Accountants are twice as efficient",
    cost: 200,
    purchased: false,
    unlocked: false,
    requirement: {
      type: "generator",
      id: "junior_accountant",
      count: 5,
    },
    effect: (state) => {
      return {
        ...state,
        generators: state.generators.map((g) =>
          g.id === "junior_accountant"
            ? { ...g, baseOutput: g.baseOutput * 2 }
            : g
        ),
      };
    },
    pennylaneFeature: {
      title: "Automated Training",
      description: "Pennylane offers an intuitive interface that reduces training time for new users.",
      shown: false,
    },
  },
  {
    id: "ergonomic_chairs",
    name: "Ergonomic Chairs",
    description: "All employees work 50% faster",
    cost: 1000,
    purchased: false,
    unlocked: false,
    requirement: {
      type: "generator",
      id: "senior_accountant",
      count: 3,
    },
    effect: (state) => {
      return {
        ...state,
        generators: state.generators.map((g) =>
          g.id.includes("accountant") ? { ...g, baseOutput: g.baseOutput * 1.5 } : g
        ),
      };
    },
    pennylaneFeature: {
      title: "User Comfort",
      description: "Pennylane's ergonomic design reduces the time spent on accounting tasks.",
      shown: false,
    },
  },
  {
    id: "cloud_upgrade",
    name: "Cloud Infrastructure",
    description: "Software performance increased by 100%",
    cost: 5000,
    purchased: false,
    unlocked: false,
    requirement: {
      type: "generator",
      id: "accounting_software",
      count: 2,
    },
    effect: (state) => {
      return {
        ...state,
        generators: state.generators.map((g) =>
          g.id === "accounting_software" ? { ...g, baseOutput: g.baseOutput * 2 } : g
        ),
      };
    },
    pennylaneFeature: {
      title: "Cloud-Based Platform",
      description: "Pennylane runs entirely in the cloud, allowing access from anywhere with automatic updates.",
      shown: false,
    },
  },
];

// Define initial achievements
const initialAchievements: Achievement[] = [
  {
    id: "first_entry",
    name: "Première Écriture",
    description: "Saisissez votre première écriture comptable",
    unlocked: false,
    hidden: false,
    condition: (state) => state.totalEntries >= 1,
  },
  {
    id: "click_100",
    name: "Expert en Saisie",
    description: "Saisissez 100 écritures manuellement",
    unlocked: false,
    hidden: false,
    condition: (state) => state.clickCount >= 100,
  },
  {
    id: "hire_team",
    name: "Constitution d'Équipe",
    description: "Embauchez 10 comptables au total",
    unlocked: false,
    hidden: false,
    condition: (state) => {
      const totalAccountants = state.generators
        .filter((g) => g.id.includes("accountant"))
        .reduce((total, g) => total + g.count, 0);
      return totalAccountants >= 10;
    },
  },
  {
    id: "entries_master",
    name: "Expert Comptable",
    description: "Accumulez 1,000,000 écritures au total",
    unlocked: false,
    hidden: false,
    condition: (state) => state.totalEntries >= 1000000,
  },
];

// Initial game state
const initialGameState: GameState = {
  entries: 0,
  totalEntries: 0,
  entriesPerClick: 1,
  entriesPerSecond: 0,
  clickCount: 0,
  generators: initialGenerators,
  upgrades: initialUpgrades,
  achievements: initialAchievements,
  gameStartedAt: Date.now(),
  lastSavedAt: Date.now(),
  lastTickAt: Date.now(),
};

// Helper functions
const calculateGeneratorCost = (baseCost: number, count: number): number => {
  return Math.floor(baseCost * Math.pow(1.15, count));
};

const calculateEurosPerSecond = (generators: Generator[]): number => {
  return generators.reduce(
    (total, generator) => total + generator.baseOutput * generator.count,
    0
  );
};

// Game reducer
const gameReducer = (state: GameState, action: GameAction): GameState => {
  switch (action.type) {
    case "CLICK": {
      const newEntries = state.entries + state.entriesPerClick;
      const newTotalEntries = state.totalEntries + state.entriesPerClick;
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

      // Calculate new EPS
      const entriesPerSecond = calculateEurosPerSecond(updatedGenerators);

      // Check if we need to unlock the next generator
      if (generator.count === 0) {
        const nextIndex = generatorIndex + 1;
        if (nextIndex < updatedGenerators.length && !updatedGenerators[nextIndex].unlocked) {
          updatedGenerators[nextIndex] = {
            ...updatedGenerators[nextIndex],
            unlocked: true,
          };
        }
      }

      // Check if any upgrades should be unlocked
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

      // Apply the upgrade effect
      const updatedState = upgrade.effect({
        ...state,
        entries: state.entries - upgrade.cost,
        upgrades: state.upgrades.map((u, i) =>
          i === upgradeIndex ? { ...u, purchased: true } : u
        ),
      });

      // Recalculate EPS
      return {
        ...updatedState,
        entriesPerSecond: calculateEurosPerSecond(updatedState.generators),
      };
    }

    case "TICK": {
      const deltaTime = (action.timestamp - state.lastTickAt) / 1000; // Convert to seconds
      const earnedEntries = state.entriesPerSecond * deltaTime;
      
      // Check for newly unlocked achievements
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

    default:
      return state;
  }
};

// Create Context
type GameContextType = {
  state: GameState;
  clickEuro: () => void;
  buyGenerator: (id: string) => void;
  buyUpgrade: (id: string) => void;
  resetGame: () => void;
  showFeature: (id: string) => void;
};

const GameContext = createContext<GameContextType | undefined>(undefined);

// Game Provider
export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(gameReducer, initialGameState);

  // Handle tick
  useEffect(() => {
    const tickInterval = setInterval(() => {
      dispatch({ type: "TICK", timestamp: Date.now() });
    }, 100);

    return () => clearInterval(tickInterval);
  }, []);

  // Handle save game
  useEffect(() => {
    const saveInterval = setInterval(() => {
      localStorage.setItem("pennylane_clicker_save", JSON.stringify({
        ...state,
        lastSavedAt: Date.now()
      }));
    }, 30000); // Save every 30 seconds

    return () => clearInterval(saveInterval);
  }, [state]);

  // Load saved game
  useEffect(() => {
    const savedGame = localStorage.getItem("pennylane_clicker_save");
    if (savedGame) {
      try {
        const parsedState = JSON.parse(savedGame) as GameState;
        
        // Calculate earnings while away
        const awayTime = (Date.now() - parsedState.lastTickAt) / 1000; // in seconds
        const awayEarnings = parsedState.entriesPerSecond * awayTime;
        
        if (awayEarnings > 0 && parsedState.entriesPerSecond > 0) {
          const formattedEarnings = new Intl.NumberFormat('fr-FR', { 
            style: 'currency', 
            currency: 'EUR',
            maximumFractionDigits: 2
          }).format(awayEarnings);
          
          setTimeout(() => {
            toast.success(`Vos comptables ont gagné ${formattedEarnings} pendant votre absence!`);
          }, 1500);
        }
        
        // Update timestamps
        parsedState.lastTickAt = Date.now();
        parsedState.lastSavedAt = Date.now();
        
        // Calculate earnings while away
        parsedState.entries += awayEarnings;
        parsedState.totalEntries += awayEarnings;
        
        dispatch({ type: "LOAD_GAME", state: parsedState });
      } catch (error) {
        console.error("Failed to load saved game:", error);
      }
    }
  }, []);

  // Update achievement notification logic
  useEffect(() => {
    const newlyUnlockedAchievements = state.achievements.filter(
      achievement => achievement.unlocked && 
      !localStorage.getItem(`achievement_${achievement.id}_shown`)
    );

    newlyUnlockedAchievements.forEach(achievement => {
      toast.success(`Trophée débloqué : ${achievement.name}`, {
        description: achievement.description,
      });
      localStorage.setItem(`achievement_${achievement.id}_shown`, 'true');
    });
  }, [state.achievements]);

  // Create context value
  const contextValue: GameContextType = {
    state,
    clickEuro: () => dispatch({ type: "CLICK" }),
    buyGenerator: (id) => dispatch({ type: "BUY_GENERATOR", id }),
    buyUpgrade: (id) => dispatch({ type: "BUY_UPGRADE", id }),
    resetGame: () => {
      if (confirm("Êtes-vous sûr de vouloir réinitialiser le jeu? Tout votre progrès sera perdu.")) {
        dispatch({ type: "RESET_GAME" });
        localStorage.removeItem("pennylane_clicker_save");
      }
    },
    showFeature: (id) => dispatch({ type: "SHOW_FEATURE", id }),
  };

  return (
    <GameContext.Provider value={contextValue}>
      {children}
    </GameContext.Provider>
  );
};

// Custom hook to use the game context
export const useGame = (): GameContextType => {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error("useGame must be used within a GameProvider");
  }
  return context;
};
