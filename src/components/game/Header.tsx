
import React from "react";
import { Button } from "@/components/ui/button";
import { useGame } from "@/context/GameContext";

const Header: React.FC = () => {
  const { resetGame } = useGame();
  
  return (
    <header className="flex justify-between items-center py-4">
      <div className="flex items-center">
        <img 
          src="https://www.pennylane.com/wp-content/themes/pennylane/images/logo.svg" 
          alt="Pennylane Logo" 
          className="h-8 mr-3"
        />
        <h1 className="text-xl font-bold">Clicker Cash</h1>
      </div>
      <Button 
        variant="outline" 
        size="sm"
        onClick={resetGame}
      >
        Réinitialiser
      </Button>
    </header>
  );
};

export default Header;
