import React from "react";
import { Button } from "@/components/ui/button";
import { useGame } from "@/context/GameContext";
import { Bug } from "lucide-react";

const Header: React.FC = () => {
  const { state, resetGame, toggleDebugMode } = useGame();
  
  return (
    <header className="flex justify-between items-center h-14 px-6">
      <h1 className="text-xl font-semibold tracking-tight text-[#003D3D]">
        <span className="font-bold">Pennylane</span>
        {" "}
        <span className="font-medium">clicker</span>
      </h1>
      <div className="flex gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleDebugMode}
          className={`text-[#003D3D] hover:bg-[#003D3D] hover:text-white ${state.debugMode ? 'bg-[#003D3D] text-white' : ''}`}
        >
          <Bug className="w-4 h-4" />
        </Button>
        <Button 
          variant="outline" 
          size="sm"
          onClick={resetGame}
          className="border-[#003D3D] text-[#003D3D] hover:bg-[#003D3D] hover:text-white"
        >
          Réinitialiser
        </Button>
      </div>
    </header>
  );
};

export default Header;
