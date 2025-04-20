import React from "react";
import { useGameState } from "@/context/GameStateContext";
import { Button } from "@/components/ui/button";
import { Bug } from "lucide-react";

const Header: React.FC = () => {
  const { state, dispatch } = useGameState();

  const toggleDebugMode = () => {
    dispatch({ type: "TOGGLE_DEBUG_MODE" });
  };

  return (
    <header className="flex justify-between items-center h-14 px-6">
      <h1 className="text-xl font-semibold tracking-tight text-[#003D3D]">
        Pennylane Clicker
      </h1>
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={toggleDebugMode}>
          <Bug className={state.debugMode ? "text-primary" : "text-muted-foreground"} />
        </Button>
      </div>
    </header>
  );
};

export default Header;
