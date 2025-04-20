import React from "react";
import { GameStateProvider } from "@/context/GameStateContext";
import Header from "@/components/game/Header";
import Footer from "@/components/game/Footer";
import GameTabs from "@/components/game/Tabs";

const Index: React.FC = () => {
  return (
    <GameStateProvider>
      <div className="min-h-screen bg-white">
        <Header />
        <main className="container mx-auto px-4 py-6">
          <GameTabs />
        </main>
        <Footer />
      </div>
    </GameStateProvider>
  );
};

export default Index;
