import { createContext, useContext } from 'react'
import type { GameState, GameAction } from '@/types/game'

export interface GameStateContextType {
  state: GameState
  dispatch: React.Dispatch<GameAction>
}

export const GameStateContext = createContext<GameStateContextType | undefined>(undefined)

export const useGameState = () => {
  const context = useContext(GameStateContext)
  if (!context) {
    throw new Error('useGameState must be used within a GameStateProvider')
  }
  return context
} 