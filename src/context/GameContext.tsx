import React, { createContext, useContext, useEffect, useReducer } from "react";
import { GameState, GameAction } from "@/types/game";
import { gameReducer } from "@/reducers/gameReducer";
import { initialGameState } from "@/data/gameInitialState";
import { toast } from "sonner";

type GameContextType = {
  state: GameState;
  clickEuro: () => void;
  buyGenerator: (id: string) => void;
  buyUpgrade: (id: string) => void;
  resetGame: () => void;
  showFeature: (id: string) => void;
  toggleDebugMode: () => void;
};

const GameContext = createContext<GameContextType | undefined>(undefined);

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
    }, 30000);

    return () => clearInterval(saveInterval);
  }, [state]);

  // Load saved game
  useEffect(() => {
    const savedGame = localStorage.getItem("pennylane_clicker_save");
    if (savedGame) {
      try {
        const parsedState = JSON.parse(savedGame) as GameState;
        
        const awayTime = (Date.now() - parsedState.lastTickAt) / 1000;
        const awayEarnings = parsedState.entriesPerSecond * awayTime;
        
        if (awayEarnings > 0 && parsedState.entriesPerSecond > 0) {
          const formattedEarnings = new Intl.NumberFormat('fr-FR').format(awayEarnings);
          
          setTimeout(() => {
            toast.success(`Vos comptables ont généré ${formattedEarnings} écritures pendant votre absence!`);
          }, 1500);
        }
        
        parsedState.lastTickAt = Date.now();
        parsedState.lastSavedAt = Date.now();
        parsedState.entries += awayEarnings;
        parsedState.totalEntries += awayEarnings;
        
        dispatch({ type: "LOAD_GAME", state: parsedState });
      } catch (error) {
        console.error("Failed to load saved game:", error);
      }
    }
  }, []);

  // Feature auto-hide
  useEffect(() => {
    const timeouts: NodeJS.Timeout[] = [];

    // Check generators
    state.generators.forEach(generator => {
      if (generator.pennylaneFeature?.shown) {
        const timeout = setTimeout(() => {
          dispatch({ type: "SHOW_FEATURE", id: `generator:${generator.id}` });
        }, 10000);
        timeouts.push(timeout);
      }
    });

    // Check upgrades
    state.upgrades.forEach(upgrade => {
      if (upgrade.pennylaneFeature?.shown) {
        const timeout = setTimeout(() => {
          dispatch({ type: "SHOW_FEATURE", id: `upgrade:${upgrade.id}` });
        }, 10000);
        timeouts.push(timeout);
      }
    });

    return () => {
      timeouts.forEach(timeout => clearTimeout(timeout));
    };
  }, [state.generators, state.upgrades]);

  // Achievement notifications
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
    toggleDebugMode: () => dispatch({ type: "TOGGLE_DEBUG_MODE" }),
  };

  return (
    <GameContext.Provider value={contextValue}>
      {children}
    </GameContext.Provider>
  );
};

export const useGame = (): GameContextType => {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error("useGame must be used within a GameProvider");
  }
  return context;
};
