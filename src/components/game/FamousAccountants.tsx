import React from "react";
import { useGameState } from "@/context";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Crown, Zap, Target } from "lucide-react";
import type { FamousAccountant } from "@/types/game";

const FamousAccountants: React.FC = () => {
  const { state, dispatch } = useGameState();
  const now = Date.now();
  const [activePowers, setActivePowers] = React.useState<{[key: string]: number}>({});

  React.useEffect(() => {
    const interval = setInterval(() => {
      setActivePowers(prev => {
        const newPowers = { ...prev };
        Object.keys(newPowers).forEach(id => {
          const power = newPowers[id];
          if (power && now > power) {
            delete newPowers[id];
          }
        });
        return newPowers;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [now]);

  const activateAccountant = (id: string) => {
    const accountant = state.famousAccountants.find(a => a.id === id);
    if (accountant) {
      setActivePowers(prev => ({
        ...prev,
        [id]: Date.now() + accountant.power.duration * 1000
      }));
      dispatch({ type: "ACTIVATE_ACCOUNTANT", id });
    }
  };

  const purchasedAccountants = state.famousAccountants.filter((a: FamousAccountant) => a.purchased);

  // Fonction pour obtenir l'icône appropriée
  const getAccountantIcon = (id: string) => {
    switch (id) {
      case "bilan_gates":
        return <Crown className="w-6 h-6" />;
      case "jean_compta_van_damme":
        return <Zap className="w-6 h-6" />;
      case "debit_vador":
        return <Target className="w-6 h-6" />;
      default:
        return null;
    }
  };

  // Fonction pour obtenir les styles du pouvoir
  const getPowerStyles = (type: "click" | "generator" | "global" | "cost" | "upgrade") => {
    switch (type) {
      case "click":
        return {
          background: "from-yellow-500 to-amber-600",
          border: "border-yellow-400",
          hover: "hover:border-yellow-300",
          icon: "text-yellow-100",
          progress: "bg-yellow-300"
        };
      case "generator":
        return {
          background: "from-purple-500 to-fuchsia-600",
          border: "border-purple-400",
          hover: "hover:border-purple-300",
          icon: "text-purple-100",
          progress: "bg-purple-300"
        };
      case "global":
        return {
          background: "from-blue-500 to-cyan-600",
          border: "border-blue-400",
          hover: "hover:border-blue-300",
          icon: "text-blue-100",
          progress: "bg-blue-300"
        };
      case "cost":
        return {
          background: "from-green-500 to-emerald-600",
          border: "border-green-400",
          hover: "hover:border-green-300",
          icon: "text-green-100",
          progress: "bg-green-300"
        };
      case "upgrade":
        return {
          background: "from-red-500 to-rose-600",
          border: "border-red-400",
          hover: "hover:border-red-300",
          icon: "text-red-100",
          progress: "bg-red-300"
        };
    }
  };

  if (purchasedAccountants.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-3">
      {purchasedAccountants.map((accountant: FamousAccountant) => {
        const isOnCooldown = accountant.lastUsed ? (now - accountant.lastUsed) < accountant.cooldown * 1000 : false;
        const cooldownProgress = accountant.lastUsed 
          ? ((now - accountant.lastUsed) / (accountant.cooldown * 1000)) * 100 
          : 100;

        const powerActive = activePowers[accountant.id];
        const powerTimeRemaining = powerActive ? Math.ceil((powerActive - now) / 1000) : 0;

        const styles = getPowerStyles(accountant.power.type);

        return (
          <TooltipProvider key={accountant.id}>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={() => activateAccountant(accountant.id)}
                  disabled={isOnCooldown || false}
                  className={`
                    relative w-24 h-24 rounded-xl border-2 transition-all duration-200
                    bg-gradient-to-br ${styles.background} ${styles.border}
                    ${isOnCooldown ? 'opacity-75 cursor-not-allowed' : styles.hover}
                    disabled:transform-none hover:scale-105 hover:-translate-y-1
                    flex flex-col items-center justify-center gap-1 p-2
                  `}
                >
                  <div className={`${styles.icon}`}>
                    {getAccountantIcon(accountant.id)}
                  </div>
                  <div className="text-white font-bold">×{accountant.power.multiplier}</div>
                  {powerActive ? (
                    <div className="text-emerald-300 text-xs font-medium">
                      {powerTimeRemaining}s
                    </div>
                  ) : null}
                  {/* Barre de progression du cooldown */}
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/20">
                    <div 
                      className={`h-full transition-all duration-200 ${styles.progress}`}
                      style={{ width: `${cooldownProgress}%` }}
                    />
                  </div>
                </button>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="bg-slate-900/95 border-slate-700 backdrop-blur-sm p-3 max-w-[250px] shadow-xl">
                <div className="text-sm space-y-1.5">
                  <p className="font-bold text-white">{accountant.name}</p>
                  <p className="text-slate-200 leading-snug">
                    Multiplie {accountant.power.type === "click" ? "la valeur de vos clics" : 
                             accountant.power.type === "generator" ? "votre production par seconde" : 
                             accountant.power.type === "global" ? "tous vos gains" :
                             accountant.power.type === "cost" ? "réduit le coût des collaborateurs" :
                             "l'efficacité des améliorations"} par {accountant.power.multiplier}x pendant {accountant.power.duration} secondes
                  </p>
                  <p className="text-xs text-slate-400 italic mt-1">
                    Temps de recharge : {accountant.cooldown} secondes
                  </p>
                </div>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        );
      })}
    </div>
  );
};

export default FamousAccountants; 