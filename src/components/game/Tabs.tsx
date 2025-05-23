import React from "react";
import { useGameState } from "@/context";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import Clicker from "./Clicker";
import Stats from "./Stats";
import Collaborators from "./Collaborators";
import Upgrades from "./Upgrades";
import Achievements from "./Achievements";
import FamousAccountants from "./FamousAccountants";
import AccountantShop from "./AccountantShop";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { FamousAccountant } from "@/types/game";

const GameTabs: React.FC = () => {
  const { state, dispatch } = useGameState();

  // Calcule le nombre d'améliorations disponibles à l'achat
  const availableUpgrades = state.upgrades.filter(
    u => u.unlocked && !u.purchased && state.entries >= u.cost
  ).length;

  // Vérifie si des Légendes de la Compta sont disponibles
  const availableAccountants = state.famousAccountants.filter((a: FamousAccountant) => a.unlocked && !a.purchased).length;
  const purchasedAccountants = state.famousAccountants.filter((a: FamousAccountant) => a.purchased).length;
  const hasPurchasedAccountants = purchasedAccountants > 0;

  // Check for new tab unlocks
  React.useEffect(() => {
    if (!state.upgradesTabUnlocked && state.entries >= 15) {
      dispatch({ type: "UNLOCK_TAB", id: "upgrades" });
    }
    if (!state.statsTabUnlocked && state.upgrades.some(u => u.id === "stats_unlock" && u.purchased)) {
      dispatch({ type: "UNLOCK_TAB", id: "stats" });
    }
    if (!state.achievementsTabUnlocked && state.totalEntries >= 500) {
      dispatch({ type: "UNLOCK_TAB", id: "achievements" });
    }
  }, [
    state.entries,
    state.upgrades,
    state.achievements,
    state.totalEntries,
    state.upgradesTabUnlocked,
    state.statsTabUnlocked,
    state.achievementsTabUnlocked,
    dispatch
  ]);

  const tabs = [
    {
      id: "main",
      label: "Bureau",
      content: (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-6">
            <Clicker />
            {hasPurchasedAccountants && <FamousAccountants />}
          </div>
          <div className="space-y-6 md:h-[calc(100vh-12rem)] md:overflow-y-auto md:sticky md:top-4">
            <Collaborators />
          </div>
        </div>
      ),
      unlocked: true,
    },
    {
      id: "upgrades",
      label: (
        <div className="flex items-center gap-2">
          Améliorations
          {availableUpgrades > 0 && (
            <Badge variant="secondary" className="h-5 px-1.5">
              {availableUpgrades}
            </Badge>
          )}
        </div>
      ),
      content: (
        <div className="max-w-4xl mx-auto">
          <Upgrades />
        </div>
      ),
      unlocked: state.upgradesTabUnlocked,
    },
    {
      id: "accountants",
      label: (
        <div className="flex items-center gap-2">
          Cabinet de Recrutement
          {availableAccountants > 0 && (
            <Badge variant="secondary" className="h-5 px-1.5">
              {availableAccountants}
            </Badge>
          )}
        </div>
      ),
      content: (
        <div className="max-w-4xl mx-auto">
          <AccountantShop />
        </div>
      ),
      unlocked: state.cabinetUnlocked,
    },
    {
      id: "stats",
      label: "Statistiques",
      content: (
        <div className="max-w-2xl mx-auto">
          <Stats />
        </div>
      ),
      unlocked: state.statsTabUnlocked,
    },
    {
      id: "achievements",
      label: "Trophées",
      content: (
        <div className="max-w-2xl mx-auto">
          <Achievements />
        </div>
      ),
      unlocked: state.achievementsTabUnlocked,
    },
  ];

  // Filter only unlocked tabs
  const unlockedTabs = tabs.filter(tab => tab.unlocked);

  const handleReset = () => {
    if (window.confirm("Êtes-vous sûr de vouloir réinitialiser votre progression ? Cette action est irréversible.")) {
      dispatch({ type: "RESET_GAME" });
    }
  };

  return (
    <Tabs defaultValue="main" className="w-full">
      <div className="flex items-center justify-between mb-6">
        <TabsList>
          {unlockedTabs.map((tab) => (
            <TabsTrigger
              key={tab.id}
              value={tab.id}
              className="relative"
            >
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

      {unlockedTabs.map((tab) => (
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