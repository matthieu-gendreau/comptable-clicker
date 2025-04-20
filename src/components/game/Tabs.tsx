import React from "react";
import { useGameState } from "@/context/GameStateContext";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Lock } from "lucide-react";
import Clicker from "./Clicker";
import Stats from "./Stats";
import Generators from "./Generators";
import Upgrades from "./Upgrades";
import Achievements from "./Achievements";
import { Prestige } from "./Prestige";
import { Button } from "@/components/ui/button";

const GameTabs: React.FC = () => {
  const { state, dispatch } = useGameState();

  const tabs = [
    {
      id: "main",
      label: "Bureau",
      content: (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-6">
            <Clicker />
          </div>
          <div className="space-y-6 md:h-[calc(100vh-12rem)] md:overflow-y-auto md:sticky md:top-4">
            <Generators />
          </div>
        </div>
      ),
      unlocked: true,
    },
    {
      id: "upgrades",
      label: "Améliorations",
      content: (
        <div className="max-w-4xl mx-auto">
          <Upgrades />
        </div>
      ),
      unlocked: state.entries >= 100,
    },
    {
      id: "stats",
      label: "Statistiques",
      content: (
        <div className="max-w-2xl mx-auto">
          <Stats />
        </div>
      ),
      unlocked: state.upgrades.some(u => u.id === "stats_unlock" && u.purchased),
    },
    {
      id: "prestige",
      label: "Cabinet",
      content: (
        <div className="max-w-4xl mx-auto">
          <Prestige />
        </div>
      ),
      unlocked: state.totalEntries >= 1_000_000 || state.prestige.points > 0,
    },
    {
      id: "achievements",
      label: "Trophées",
      content: (
        <div className="max-w-2xl mx-auto">
          <Achievements />
        </div>
      ),
      unlocked: state.achievements.some(a => a.unlocked),
    },
  ];

  const handleReset = () => {
    if (window.confirm("Êtes-vous sûr de vouloir réinitialiser votre progression ? Cette action est irréversible.")) {
      dispatch({ type: "RESET_GAME" });
    }
  };

  return (
    <Tabs defaultValue="main" className="w-full">
      <div className="flex items-center justify-between mb-6">
        <TabsList>
          {tabs.map((tab) => (
            <TabsTrigger
              key={tab.id}
              value={tab.id}
              disabled={!tab.unlocked}
              className="relative"
            >
              {!tab.unlocked && <Lock className="w-4 h-4 mr-2" />}
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>
        <Button
          variant="outline"
          size="sm"
          onClick={handleReset}
          className="text-red-600 hover:text-red-700 hover:bg-red-50"
        >
          Réinitialiser
        </Button>
      </div>

      {tabs.map((tab) => (
        <TabsContent
          key={tab.id}
          value={tab.id}
          className="animate-in fade-in-50"
        >
          {tab.content}
        </TabsContent>
      ))}
    </Tabs>
  );
};

export default GameTabs; 