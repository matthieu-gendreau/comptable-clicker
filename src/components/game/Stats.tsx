import React from "react";
import { useGameState } from "@/context";
import { formatEntries } from "@/utils/formatters";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  CircleDollarSign,
  History,
  MousePointerClick,
  Timer,
  TrendingUp,
} from "lucide-react";

const StatItem = ({ icon: Icon, label, value, description }: {
  icon: React.ElementType;
  label: string;
  value: string;
  description?: string;
}) => (
  <div className="flex items-start gap-4 p-4 rounded-lg border bg-card">
    <div className="p-2 rounded-full bg-primary/10">
      <Icon className="w-6 h-6 text-primary" />
    </div>
    <div>
      <p className="text-sm font-medium text-muted-foreground">{label}</p>
      <p className="text-2xl font-bold">{value}</p>
      {description && (
        <p className="text-sm text-muted-foreground">{description}</p>
      )}
    </div>
  </div>
);

const Stats = () => {
  const { state } = useGameState();

  const stats = [
    {
      icon: CircleDollarSign,
      label: "Entrées actuelles",
      value: formatEntries(state.entries),
      description: "Votre solde actuel d'écritures",
    },
    {
      icon: TrendingUp,
      label: "Total des entrées",
      value: formatEntries(state.totalEntries),
      description: "Nombre total d'écritures générées",
    },
    {
      icon: MousePointerClick,
      label: "Entrées par clic",
      value: formatEntries(state.entriesPerClick),
      description: "Productivité par clic",
    },
    {
      icon: Timer,
      label: "Entrées par seconde",
      value: formatEntries(state.entriesPerSecond),
      description: "Productivité automatique",
    },
    {
      icon: History,
      label: "Nombre de clics",
      value: formatEntries(state.clickCount),
      description: "Nombre total de clics effectués",
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Statistiques</CardTitle>
        <CardDescription>
          Suivez votre progression et votre productivité
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {stats.map((stat) => (
            <StatItem key={stat.label} {...stat} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default Stats;
