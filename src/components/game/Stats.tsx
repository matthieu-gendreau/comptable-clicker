import React from "react";
import { useGameState } from "@/context/GameStateContext";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const Stats: React.FC = () => {
  const { state } = useGameState();

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat("fr-FR").format(num);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Statistiques</CardTitle>
        <CardDescription>
          Suivez votre progression !
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <p className="text-sm font-medium">Écritures actuelles</p>
            <p className="text-2xl font-bold">{formatNumber(state.entries)}</p>
          </div>
          <div>
            <p className="text-sm font-medium">Écritures totales</p>
            <p className="text-2xl font-bold">{formatNumber(state.totalEntries)}</p>
          </div>
          <div>
            <p className="text-sm font-medium">Écritures par clic</p>
            <p className="text-2xl font-bold">{formatNumber(state.entriesPerClick)}</p>
          </div>
          <div>
            <p className="text-sm font-medium">Écritures par seconde</p>
            <p className="text-2xl font-bold">{formatNumber(state.entriesPerSecond)}</p>
          </div>
          <div>
            <p className="text-sm font-medium">Nombre de clics</p>
            <p className="text-2xl font-bold">{formatNumber(state.clickCount)}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default Stats;
