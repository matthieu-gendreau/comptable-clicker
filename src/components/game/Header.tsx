import React from "react";
import { Button } from "@/components/ui/button";
import { useGame } from "@/context/GameContext";

const Header: React.FC = () => {
  const { resetGame } = useGame();
  
  return (
    <header className="flex justify-between items-center h-14 px-6">
      <h1 className="text-xl font-semibold tracking-tight text-[#003D3D]">
        <span className="font-bold">Pennylane</span>
        {" "}
        <span className="font-medium">clicker</span>
      </h1>
      <Button 
        variant="outline" 
        size="sm"
        onClick={resetGame}
        className="border-[#003D3D] text-[#003D3D] hover:bg-[#003D3D] hover:text-white"
      >
        Réinitialiser
      </Button>
    </header>
  );
};

export default Header;
