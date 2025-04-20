import React from "react";
import { useGameState } from "@/context/GameStateContext";
import { calculatePrestigePoints } from "@/reducers/gameReducer";
import { formatEntries } from "@/utils/formatters";
import { fiscalSeasons } from "@/data/gameInitialState";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Trophy,
  Star,
  TrendingUp,
  Calendar,
  GraduationCap,
} from "lucide-react";

export const Prestige: React.FC = () => {
  const { state, dispatch } = useGameState();

  const potentialPoints = calculatePrestigePoints(
    state.totalEntries,
    state.prestige.objectives
  );
  const newPoints = Math.max(0, potentialPoints - state.prestige.points);

  const nextObjective = state.prestige.objectives.find(
    (obj) => !obj.completed
  );

  const progress = nextObjective
    ? (state.totalEntries / nextObjective.requirement) * 100
    : 100;

  return (
    <div className="space-y-6">
      {/* Points de prestige et action */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Points d'Expertise Fiscale</CardTitle>
              <CardDescription>
                Réinitialisez votre progression pour gagner des points d'expertise
              </CardDescription>
            </div>
            <Badge variant="secondary" className="text-xl">
              {state.prestige.points} PEF
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium">Points disponibles</p>
                <p className="text-2xl font-bold">+{newPoints} PEF</p>
              </div>
              <Button
                size="lg"
                onClick={() => dispatch({ type: "PRESTIGE" })}
                disabled={newPoints === 0}
              >
                Clôturer la saison
              </Button>
            </div>

            {nextObjective && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Prochain objectif : {nextObjective.name}</span>
                  <span>
                    {formatEntries(state.totalEntries)} /{" "}
                    {formatEntries(nextObjective.requirement)}
                  </span>
                </div>
                <Progress value={progress} />
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Objectifs */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5" />
            <CardTitle>Objectifs de la saison</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {state.prestige.objectives.map((objective) => (
              <div
                key={objective.id}
                className="flex items-center gap-4 p-4 border rounded-lg"
              >
                <div
                  className={`p-2 rounded-full ${
                    objective.completed
                      ? "bg-green-500/10 text-green-500"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  <Star className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">{objective.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {objective.description}
                  </p>
                </div>
                <Badge variant={objective.completed ? "default" : "outline"}>
                  +{objective.reward} PEF
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Spécialisations */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <GraduationCap className="w-5 h-5" />
            <CardTitle>Spécialisations</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {state.prestige.specializations.map((spec) => (
              <div
                key={spec.id}
                className="flex items-center gap-4 p-4 border rounded-lg"
              >
                <div
                  className={`p-2 rounded-full ${
                    spec.purchased
                      ? "bg-primary/10 text-primary"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  <TrendingUp className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">{spec.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {spec.description}
                  </p>
                </div>
                {spec.purchased ? (
                  <Badge>Acquis</Badge>
                ) : (
                  <Button
                    variant="outline"
                    onClick={() =>
                      dispatch({
                        type: "BUY_SPECIALIZATION",
                        id: spec.id,
                      })
                    }
                    disabled={state.prestige.points < spec.cost}
                  >
                    {spec.cost} PEF
                  </Button>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Saison fiscale */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            <CardTitle>Saison fiscale en cours</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 border rounded-lg bg-accent/5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">
                    {state.prestige.currentSeason.name}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {state.prestige.currentSeason.description}
                  </p>
                </div>
                <Badge variant="secondary">
                  ×{state.prestige.currentSeason.multiplier} PEF
                </Badge>
              </div>
            </div>
            <Separator />
            <div className="grid grid-cols-2 gap-2">
              {fiscalSeasons
                .filter((season) => !season.active)
                .map((season) => (
                  <Button
                    key={season.id}
                    variant="outline"
                    className="w-full"
                    onClick={() =>
                      dispatch({ type: "CHANGE_SEASON", id: season.id })
                    }
                  >
                    {season.name}
                  </Button>
                ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Prestige; 