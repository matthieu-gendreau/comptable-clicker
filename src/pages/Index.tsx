import React from "react";
import { GameProvider } from "@/context/GameContext";
import Clicker from "@/components/game/Clicker";
import Generators from "@/components/game/Generators";
import Upgrades from "@/components/game/Upgrades";
import Achievements from "@/components/game/Achievements";
import Stats from "@/components/game/Stats";
import Header from "@/components/game/Header";
import Footer from "@/components/game/Footer";
import { motion } from "framer-motion";

const Index: React.FC = () => {
  return (
    <GameProvider>
      <div className="min-h-screen flex flex-col bg-white">
        <div className="container px-4 flex-grow pb-16">
          <Header />
          
          <main className="mt-4">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              {/* Left sidebar - Stats and achievements */}
              <motion.div 
                className="md:col-span-3 space-y-4 md:sticky md:top-4 md:max-h-[calc(100vh-8rem)] md:overflow-y-auto"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Stats />
                <Achievements />
              </motion.div>
              
              {/* Main content - Clicker */}
              <motion.div 
                className="md:col-span-6 flex flex-col items-center justify-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <Clicker />
              </motion.div>
              
              {/* Right sidebar - Generators and upgrades */}
              <motion.div 
                className="md:col-span-3 space-y-6 md:sticky md:top-4 md:max-h-[calc(100vh-8rem)] md:overflow-y-auto"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <Upgrades />
                <Generators />
              </motion.div>
            </div>
          </main>
        </div>
        <Footer />
      </div>
    </GameProvider>
  );
};

export default Index;
