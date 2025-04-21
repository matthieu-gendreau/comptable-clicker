import React from "react";
import { useGameState } from "@/context";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Achievement } from "@/types/game";

const Achievements: React.FC = () => {
  const { state } = useGameState();

  const unlockedCount = state.achievements.filter((a: Achievement) => a.unlocked).length;
  const totalCount = state.achievements.length;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Trophées</CardTitle>
            <CardDescription>
              Débloquez des succès !
            </CardDescription>
          </div>
          <Badge variant="outline" className="text-lg">
            {unlockedCount}/{totalCount}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {state.achievements.map((achievement: Achievement) => (
            <div
              key={achievement.id}
              className={`p-2 border rounded-lg ${
                achievement.unlocked
                  ? "bg-green-50 border-green-200"
                  : "opacity-50"
              }`}
            >
              <p className="font-medium">{achievement.name}</p>
              <p className="text-sm text-muted-foreground">
                {achievement.description}
              </p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default Achievements;
