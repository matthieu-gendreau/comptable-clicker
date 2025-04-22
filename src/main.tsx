import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { GameStateProvider } from './context'

// Définir le type de window avec notre fonction toggleDebug
declare global {
  interface Window {
    toggleDebug: () => void;
  }
}

// Fonction pour activer/désactiver le mode debug
window.toggleDebug = () => {
  const gameState = JSON.parse(localStorage.getItem("gameState") || "{}");
  gameState.debugMode = !gameState.debugMode;
  localStorage.setItem("gameState", JSON.stringify(gameState));
  location.reload();
};

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <GameStateProvider>
      <App />
    </GameStateProvider>
  </React.StrictMode>,
)
