
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

type GameState = {
  euros: number;
  totalEuros: number;
  eurosPerClick: number;
  eurosPerSecond: number;
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
    name: "Junior Accountant",
    description: "Handles basic bookkeeping tasks",
    baseCost: 10,
    baseOutput: 0.1,
    count: 0,
    unlocked: true,
  },
  {
    id: "senior_accountant",
    name: "Senior Accountant",
    description: "Efficient accounting professional",
    baseCost: 100,
    baseOutput: 1,
    count: 0,
    unlocked: false,
    pennylaneFeature: {
      title: "Automated Invoice Processing",
      description: "Pennylane's AI automatically processes and categorizes invoices, just like a senior accountant would.",
      shown: false,
    },
  },
  {
    id: "accounting_software",
    name: "Basic Software",
    description: "Entry-level accounting software",
    baseCost: 1000,
    baseOutput: 8,
    count: 0,
    unlocked: false,
    pennylaneFeature: {
      title: "Intuitive Dashboard",
      description: "Pennylane's dashboard gives you a real-time overview of your financial situation.",
      shown: false,
    },
  },
  {
    id: "erp_system",
    name: "ERP System",
    description: "Enterprise resource planning system",
    baseCost: 10000,
    baseOutput: 47,
    count: 0,
    unlocked: false,
    pennylaneFeature: {
      title: "Complete Business Integration",
      description: "Pennylane integrates with your entire business ecosystem, removing data silos.",
      shown: false,
    },
  },
  {
    id: "ai_assistant",
    name: "AI Assistant",
    description: "Advanced AI for financial tasks",
    baseCost: 50000,
    baseOutput: 260,
    count: 0,
    unlocked: false,
    pennylaneFeature: {
      title: "Smart Financial Assistant",
      description: "Pennylane's AI helps you make smarter financial decisions with predictive analytics.",
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
      eurosPerClick: state.eurosPerClick * 2,
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
    id: "first_euro",
    name: "Premier Pas",
    description: "Earn your first euro",
    unlocked: false,
    hidden: false,
    condition: (state) => state.totalEuros >= 1,
  },
  {
    id: "click_100",
    name: "Click Master",
    description: "Click 100 times",
    unlocked: false,
    hidden: false,
    condition: (state) => state.clickCount >= 100,
  },
  {
    id: "hire_team",
    name: "Building a Team",
    description: "Hire 10 accountants total",
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
    id: "euro_millionaire",
    name: "Euro Millionaire",
    description: "Accumulate 1,000,000 euros in total",
    unlocked: false,
    hidden: false,
    condition: (state) => state.totalEuros >= 1000000,
  },
];

// Initial game state
const initialGameState: GameState = {
  euros: 0,
  totalEuros: 0,
  eurosPerClick: 1,
  eurosPerSecond: 0,
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
      const newEuros = state.euros + state.eurosPerClick;
      const newTotalEuros = state.totalEuros + state.eurosPerClick;
      return {
        ...state,
        euros: newEuros,
        totalEuros: newTotalEuros,
        clickCount: state.clickCount + 1,
      };
    }

    case "BUY_GENERATOR": {
      const generatorIndex = state.generators.findIndex((g) => g.id === action.id);
      if (generatorIndex === -1) return state;

      const generator = state.generators[generatorIndex];
      const cost = calculateGeneratorCost(generator.baseCost, generator.count);

      if (state.euros < cost) return state;

      const updatedGenerators = [...state.generators];
      updatedGenerators[generatorIndex] = {
        ...generator,
        count: generator.count + 1,
      };

      // Calculate new EPS
      const eurosPerSecond = calculateEurosPerSecond(updatedGenerators);

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
        euros: state.euros - cost,
        generators: updatedGenerators,
        eurosPerSecond,
        upgrades: updatedUpgrades,
      };
    }

    case "BUY_UPGRADE": {
      const upgradeIndex = state.upgrades.findIndex((u) => u.id === action.id);
      if (upgradeIndex === -1) return state;

      const upgrade = state.upgrades[upgradeIndex];
      if (upgrade.purchased || !upgrade.unlocked || state.euros < upgrade.cost) {
        return state;
      }

      // Apply the upgrade effect
      const updatedState = upgrade.effect({
        ...state,
        euros: state.euros - upgrade.cost,
        upgrades: state.upgrades.map((u, i) =>
          i === upgradeIndex ? { ...u, purchased: true } : u
        ),
      });

      // Recalculate EPS
      return {
        ...updatedState,
        eurosPerSecond: calculateEurosPerSecond(updatedState.generators),
      };
    }

    case "TICK": {
      const deltaTime = (action.timestamp - state.lastTickAt) / 1000; // Convert to seconds
      const earnedEuros = state.eurosPerSecond * deltaTime;
      
      // Check for newly unlocked achievements
      const updatedAchievements = state.achievements.map((achievement) => {
        if (achievement.unlocked) return achievement;
        if (achievement.condition({ ...state, euros: state.euros + earnedEuros, totalEuros: state.totalEuros + earnedEuros })) {
          return { ...achievement, unlocked: true };
        }
        return achievement;
      });

      return {
        ...state,
        euros: state.euros + earnedEuros,
        totalEuros: state.totalEuros + earnedEuros,
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
        const awayEarnings = parsedState.eurosPerSecond * awayTime;
        
        if (awayEarnings > 0 && parsedState.eurosPerSecond > 0) {
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
        parsedState.euros += awayEarnings;
        parsedState.totalEuros += awayEarnings;
        
        dispatch({ type: "LOAD_GAME", state: parsedState });
      } catch (error) {
        console.error("Failed to load saved game:", error);
      }
    }
  }, []);

  // Achievement notification
  useEffect(() => {
    const newlyUnlockedAchievements = state.achievements.filter(
      achievement => achievement.unlocked && 
      !initialGameState.achievements.find(a => a.id === achievement.id)?.unlocked
    );

    newlyUnlockedAchievements.forEach(achievement => {
      toast.success(`Trophée débloqué : ${achievement.name}`, {
        description: achievement.description,
      });
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
