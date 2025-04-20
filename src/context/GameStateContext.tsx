import { createContext, useContext, useReducer, useEffect, ReactNode } from "react";
import { GameState, GameAction, Achievement, Upgrade } from "@/types/game";
import { gameReducer } from "@/reducers/gameReducer";
import { initialGameState, initialAchievements, initialUpgrades, initialCollaborators } from "@/data/gameInitialState";

type GameStateContextType = {
  state: GameState;
  dispatch: React.Dispatch<GameAction>;
};

const GameStateContext = createContext<GameStateContextType | undefined>(undefined);

export const GameStateProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(gameReducer, initialGameState);

  // Sauvegarde automatique toutes les 30 secondes
  useEffect(() => {
    const saveInterval = setInterval(() => {
      localStorage.setItem("gameState", JSON.stringify(state));
    }, 30000);

    return () => clearInterval(saveInterval);
  }, [state]);

  // Chargement de la sauvegarde au démarrage
  useEffect(() => {
    const savedState = localStorage.getItem("gameState");
    if (savedState) {
      try {
        const parsedState = JSON.parse(savedState);
        // Restore achievement conditions and upgrade effects from initial state
        const restoredState = {
          ...initialGameState, // Start with initial state to ensure all fields exist
          ...parsedState, // Override with saved values
          achievements: parsedState.achievements.map((achievement: Omit<Achievement, 'condition'>, index: number) => ({
            ...achievement,
            condition: initialAchievements[index].condition
          })),
          upgrades: parsedState.upgrades.map((upgrade: Omit<Upgrade, 'effect'>, index: number) => ({
            ...upgrade,
            effect: initialUpgrades[index].effect
          })),
          improvements: parsedState.improvements || [], // Ensure improvements array exists
        };
        dispatch({ type: "LOAD_GAME", state: restoredState });
      } catch (error) {
        console.error("Erreur lors du chargement de la sauvegarde:", error);
      }
    }
  }, []);

  // Mise à jour du jeu toutes les 100ms
  useEffect(() => {
    const gameLoop = setInterval(() => {
      dispatch({ type: "TICK", timestamp: Date.now() });
    }, 100);

    return () => clearInterval(gameLoop);
  }, []);

  return (
    <GameStateContext.Provider value={{ state, dispatch }}>
      {children}
    </GameStateContext.Provider>
  );
};

export const useGameState = () => {
  const context = useContext(GameStateContext);
  if (context === undefined) {
    throw new Error("useGameState must be used within a GameStateProvider");
  }
  return context;
}; 