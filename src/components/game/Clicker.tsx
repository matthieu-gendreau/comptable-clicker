import React, { useEffect, useRef, useState } from "react";
import { useGameState } from "@/context";
import { Button } from "@/components/ui/button";
import { formatEntries } from "@/utils/formatters";
import { Badge } from "@/components/ui/badge";
import { calculateClickMultiplier } from "@/reducers/gameReducer";
import { Flame, Zap, Trophy } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { motion, AnimatePresence } from "framer-motion";

interface AccountingEntry {
  debit: string;
  credit: string;
}

// Définition des écritures comptables possibles
const ACCOUNTING_ENTRIES: readonly AccountingEntry[] = [
  // Ventes et encaissements
  { debit: "411 - Clients", credit: "706 - Prestations de services" },
  { debit: "512 - Banque", credit: "411 - Clients" },
  { debit: "411 - Clients", credit: "707 - Ventes de marchandises" },
  { debit: "531 - Caisse", credit: "411 - Clients" },
  
  // Achats et paiements
  { debit: "607 - Achats de marchandises", credit: "401 - Fournisseurs" },
  { debit: "401 - Fournisseurs", credit: "512 - Banque" },
  { debit: "602 - Achats stockés", credit: "401 - Fournisseurs" },
  { debit: "401 - Fournisseurs", credit: "531 - Caisse" },
  
  // Charges externes
  { debit: "6227 - Frais d'actes", credit: "512 - Banque" },
  { debit: "626 - Frais postaux", credit: "512 - Banque" },
  { debit: "613 - Locations", credit: "401 - Fournisseurs" },
  { debit: "615 - Entretien", credit: "512 - Banque" },
  { debit: "622 - Honoraires", credit: "401 - Fournisseurs" },
  { debit: "625 - Déplacements", credit: "512 - Banque" },
  
  // Charges de personnel
  { debit: "641 - Rémunérations", credit: "421 - Personnel" },
  { debit: "645 - Charges sociales", credit: "431 - Sécurité sociale" },
  { debit: "421 - Personnel", credit: "512 - Banque" },
  
  // Opérations diverses
  { debit: "512 - Banque", credit: "701 - Ventes de produits finis" },
  { debit: "681 - Amortissements", credit: "281 - Amortissements" },
  { debit: "661 - Charges d'intérêts", credit: "512 - Banque" },
  { debit: "601 - Achats stockés", credit: "401 - Fournisseurs" },
  
  // TVA
  { debit: "44566 - TVA déductible", credit: "401 - Fournisseurs" },
  { debit: "411 - Clients", credit: "44571 - TVA collectée" },
  { debit: "44551 - TVA à décaisser", credit: "512 - Banque" }
] as const;

interface EntryAnimation {
  id: number;
  entry: (typeof ACCOUNTING_ENTRIES)[number];
  position: {
    x: number;
    y: number;
  };
}

const Clicker: React.FC = () => {
  const { state, dispatch } = useGameState();
  const comboSoundRef = useRef<HTMLAudioElement | null>(null);
  const tierUpSoundRef = useRef<HTMLAudioElement | null>(null);
  const [entries, setEntries] = useState<EntryAnimation[]>([]);
  const [nextId, setNextId] = useState(0);

  useEffect(() => {
    comboSoundRef.current = new Audio("/sounds/combo.mp3");
    tierUpSoundRef.current = new Audio("/sounds/tier-up.mp3");
  }, []);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    dispatch({ type: "CLICK" });
    
    // Jouer le son du combo si actif
    if (state.combo.active && state.totalEntries >= 10) {
      if (comboSoundRef.current) {
        comboSoundRef.current.currentTime = 0;
        comboSoundRef.current.play().catch(() => {});
      }
    }

    // Créer une nouvelle entrée avec une position relative au clic
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Sélectionner une écriture comptable aléatoire
    const randomIndex = Math.floor(Math.random() * ACCOUNTING_ENTRIES.length);
    // L'index sera toujours valide car ACCOUNTING_ENTRIES est une constante non vide
    const randomEntry = ACCOUNTING_ENTRIES[randomIndex]!;
    
    const newEntry: EntryAnimation = {
      id: nextId,
      entry: randomEntry,
      position: { x, y }
    };
    
    setEntries(prev => [...prev, newEntry]);
    setNextId(prev => prev + 1);

    // Nettoyer les anciennes entrées après 2 secondes
    setTimeout(() => {
      setEntries(prev => prev.filter(entry => entry.id !== nextId));
    }, 2000);
  };

  const clickMultiplier = calculateClickMultiplier(state);
  const totalPerClick = state.entriesPerClick * clickMultiplier;

  // Combo info
  const comboActive = state.combo.active && state.totalEntries >= 10;
  const comboMultiplier = state.combo.multiplier;
  const clicksInCombo = state.combo.clicksInCombo;
  const timeLeft = Math.max(0, (state.combo.lastClickTime + state.combo.comboTimeWindow - Date.now()) / 1000);

  // Trouver le palier actuel et le prochain
  const currentTier = state.combo.currentTier;
  const nextTier = state.combo.tiers[currentTier + 1];
  
  // Calculer la progression vers le prochain palier
  const progressToNextTier = nextTier
    ? (clicksInCombo / nextTier.clickThreshold) * 100
    : 100;

  // Déterminer si on a un bonus de vitesse
  const hasSpeedBonus = state.combo.speedBonus > 1;

  // Effet pour jouer le son quand on atteint un nouveau palier
  useEffect(() => {
    if (currentTier >= 0 && tierUpSoundRef.current) {
      tierUpSoundRef.current.currentTime = 0;
      tierUpSoundRef.current.play().catch(() => {});
    }
  }, [currentTier]);

  return (
    <div className="flex flex-col gap-4 p-6 border rounded-lg">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Écritures</h2>
          <p className="text-sm text-muted-foreground">
            Cliquez pour créer des écritures !
          </p>
        </div>
        <Badge variant="outline" className="text-lg">
          {formatEntries(totalPerClick)}/clic
        </Badge>
      </div>

      <div className="flex flex-col items-center gap-4">
        <div className="text-4xl font-bold">
          {formatEntries(state.entries)}
        </div>
        <div className="relative w-full">
          <Button
            size="lg"
            className="w-full h-24 text-xl relative overflow-visible"
            onClick={handleClick}
          >
            Créer une écriture
            {hasSpeedBonus && (
              <Zap className="absolute top-2 right-2 w-4 h-4 text-yellow-400 animate-pulse" />
            )}
          </Button>
          
          <AnimatePresence>
            {entries.map(({ id, entry, position }) => (
              <motion.div
                key={id}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: -20 }}
                exit={{ opacity: 0, y: -40 }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                className="absolute pointer-events-none text-sm font-medium whitespace-nowrap bg-transparent z-50"
                style={{ 
                  left: position.x, 
                  bottom: 0,
                  color: "#00916e",
                  transform: "translateX(-50%)" // Centre l'écriture par rapport au clic
                }}
              >
                <div className="flex items-center gap-2 bg-transparent">
                  <span className="bg-transparent">{entry.debit}</span>
                  <span className="opacity-75 text-xs bg-transparent">à</span>
                  <span className="bg-transparent">{entry.credit}</span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* Combo indicator with fixed height */}
      <div className="h-[80px] flex flex-col justify-center">
        {state.totalEntries >= 10 && state.combo.comboTimeWindow > 0 && (
          <div className={`flex flex-col gap-2 p-3 rounded-lg transition-colors w-full ${
            comboActive && comboMultiplier > 1 && timeLeft > 0 ? "bg-orange-100 text-orange-700" : "bg-gray-100 text-gray-500"
          }`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Flame className={`w-5 h-5 ${comboActive && comboMultiplier > 1 && timeLeft > 0 ? "animate-pulse" : ""}`} />
                <div className="text-sm font-medium">
                  {comboActive && comboMultiplier > 1 && timeLeft > 0 ? (
                    <>
                      <span className="font-bold">Combo x{comboMultiplier.toFixed(1)}</span>
                      <span className="mx-2">•</span>
                      <span>{clicksInCombo} clics</span>
                      <span className="mx-2">•</span>
                      <span>{timeLeft.toFixed(1)}s</span>
                    </>
                  ) : (
                    "Cliquez rapidement pour activer le combo !"
                  )}
                </div>
              </div>
              {currentTier >= 0 && comboMultiplier > 1 && timeLeft > 0 && (
                <Trophy className="w-5 h-5 text-yellow-600" />
              )}
            </div>
            
            {comboActive && comboMultiplier > 1 && timeLeft > 0 && nextTier && (
              <div className="flex flex-col gap-1">
                <div className="flex justify-between text-xs">
                  <span>Prochain palier : x{nextTier.multiplier}</span>
                  <span>{clicksInCombo}/{nextTier.clickThreshold} clics</span>
                </div>
                <Progress value={progressToNextTier} className="h-1" />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Clicker;
