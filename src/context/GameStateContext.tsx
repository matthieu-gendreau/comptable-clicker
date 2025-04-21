import React, { useReducer, useEffect } from 'react'
import { gameReducer } from '@/reducers/gameReducer'
import { initialGameState } from '@/data/gameInitialState'
import { GameStateContext } from './game-state-utils'

export const GameStateProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(gameReducer, initialGameState)

  // Sauvegarde automatique toutes les 5 secondes
  useEffect(() => {
    const saveInterval = setInterval(() => {
      localStorage.setItem("gameState", JSON.stringify(state))
    }, 5000)

    return () => clearInterval(saveInterval)
  }, [state])

  // Chargement de la sauvegarde au démarrage
  useEffect(() => {
    const savedState = localStorage.getItem("gameState")
    if (savedState) {
      try {
        const parsedState = JSON.parse(savedState)
        dispatch({ type: "LOAD_GAME", state: parsedState })
      } catch (error) {
        console.error("Erreur lors du chargement de la sauvegarde:", error)
        dispatch({ type: "LOAD_GAME", state: initialGameState })
      }
    }
  }, [])

  // Mise à jour du jeu toutes les 100ms
  useEffect(() => {
    const gameLoop = setInterval(() => {
      dispatch({ type: "TICK", timestamp: Date.now() })
    }, 100)

    return () => clearInterval(gameLoop)
  }, [])

  return (
    <GameStateContext.Provider value={{ state, dispatch }}>
      {children}
    </GameStateContext.Provider>
  )
} 