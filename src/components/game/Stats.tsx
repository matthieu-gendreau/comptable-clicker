import React, { useEffect, useState, useCallback } from "react";
import { useGameState } from "@/context";
import { formatEntries, formatEntriesPerSecond } from "@/utils/formatters";
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
  Clock,
} from "lucide-react";
import type {
  ChartOptions,
  TooltipItem,
  Scale,
  CoreScaleOptions,
} from 'chart.js';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import type { ChartData } from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const StatItem = ({ icon: Icon, label, value, description }: {
  icon: React.ElementType;
  label: string;
  value: string;
  description?: string;
}) => (
  <div className="flex items-start gap-4 p-4 rounded-lg border bg-card hover:bg-accent/5 transition-colors">
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

interface HistoryDataPoint {
  timestamp: number;
  entries: number;
  entriesFromClicks: number;
  entriesFromCollaborators: number;
  entriesPerSecond: number;
}

const Stats = () => {
  const { state } = useGameState();
  const [historyData, setHistoryData] = useState<HistoryDataPoint[]>([]);

  const addDataPoint = useCallback(() => {
    setHistoryData(prevData => {
      const newData = [...prevData, {
        timestamp: Date.now(),
        entries: state.entries,
        entriesFromClicks: state.clickCount * state.entriesPerClick,
        entriesFromCollaborators: state.entriesPerSecond,
        entriesPerSecond: state.entriesPerSecond,
      }];

      // Keep only the last 300 points (10 minutes at 2s intervals)
      if (newData.length > 300) {
        return newData.slice(-300);
      }
      return newData;
    });
  }, [state.entries, state.entriesPerClick, state.entriesPerSecond, state.clickCount]);

  useEffect(() => {
    // Ajouter un point immédiatement
    addDataPoint();

    // Mettre à jour toutes les 2 secondes
    const interval = setInterval(addDataPoint, 2000);

    return () => clearInterval(interval);
  }, [state.entries, state.entriesPerSecond, addDataPoint]);

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
      value: formatEntriesPerSecond(state.entriesPerSecond),
      description: "Productivité automatique",
    },
    {
      icon: History,
      label: "Nombre de clics",
      value: formatEntries(state.clickCount),
      description: "Nombre total de clics effectués",
    },
    {
      icon: Clock,
      label: "Temps de jeu",
      value: formatGameTime(state.gameStartedAt),
      description: "Temps total depuis le début",
    },
  ];

  const chartOptions: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 0,
    },
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: false,
      },
      tooltip: {
        mode: 'index' as const,
        intersect: false,
        callbacks: {
          label: function(tooltipItem: TooltipItem<'line'>) {
            let label = tooltipItem.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (tooltipItem.parsed.y !== null) {
              label += formatEntries(tooltipItem.parsed.y);
            }
            return label;
          },
          title: function(items) {
            if (!items.length || !historyData.length) return '';
            const firstItem = items[0];
            if (!firstItem?.dataIndex) return '';
            const dataIndex = firstItem.dataIndex;
            if (dataIndex === undefined || dataIndex >= historyData.length) return '';
            const timestamp = historyData[dataIndex]?.timestamp;
            if (!timestamp) return '';
            const date = new Date(timestamp);
            const minutes = date.getMinutes().toString().padStart(2, '0');
            const seconds = date.getSeconds().toString().padStart(2, '0');
            return `${minutes}:${seconds}`;
          }
        }
      }
    },
    scales: {
      x: {
        display: false,
      },
      y: {
        beginAtZero: true,
        grid: {
          display: false,
        },
        ticks: {
          callback: function(this: Scale<CoreScaleOptions>, value: string | number) {
            return formatEntries(Number(value));
          }
        }
      },
    },
    interaction: {
      intersect: false,
      mode: 'nearest' as const,
    },
  };

  const data: ChartData<'line'> = {
    labels: historyData.map((_, index) => index),
    datasets: [
      {
        label: 'Total',
        data: historyData.map(point => point.entries),
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.1)',
        tension: 0.4,
        fill: true,
      }
    ],
  };

  const epsData: ChartData<'line'> = {
    labels: historyData.map((_, index) => index),
    datasets: [
      {
        label: 'Entrées par seconde',
        data: historyData.map(point => point.entriesPerSecond),
        borderColor: 'rgb(255, 159, 64)',
        backgroundColor: 'rgba(255, 159, 64, 0.1)',
        tension: 0.4,
        fill: true,
      },
    ],
  };

  return (
    <div className="space-y-8">
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

      <div className="grid gap-8 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Progression des entrées</CardTitle>
            <CardDescription>
              Évolution de votre solde total d'écritures sur les 10 dernières minutes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <Line options={chartOptions} data={data} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Productivité automatique</CardTitle>
            <CardDescription>
              Évolution de vos entrées par seconde sur les 10 dernières minutes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <Line options={chartOptions} data={epsData} />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

// Fonction utilitaire pour formater le temps de jeu
function formatGameTime(startTime: number): string {
  const now = Date.now();
  const diff = now - startTime;
  
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  
  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes}m`;
}

export default Stats;
