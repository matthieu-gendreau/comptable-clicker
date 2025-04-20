
export type Generator = {
  id: string;
  name: string;
  description: string;
  baseCost: number;
  baseOutput: number;
  count: number;
  unlocked: boolean;
  pennylaneFeature?: {
    title: string;
    description: string;
    shown: boolean;
  };
};

export type Upgrade = {
  id: string;
  name: string;
  description: string;
  cost: number;
  purchased: boolean;
  unlocked: boolean;
  effect: (state: GameState) => GameState;
  requirement?: {
    type: string;
    id: string;
    count: number;
  };
  pennylaneFeature?: {
    title: string;
    description: string;
    shown: boolean;
  };
};

export type Achievement = {
  id: string;
  name: string;
  description: string;
  unlocked: boolean;
  hidden: boolean;
  condition: (state: GameState) => boolean;
};

export type GameState = {
  entries: number;
  totalEntries: number;
  entriesPerClick: number;
  entriesPerSecond: number;
  clickCount: number;
  generators: Generator[];
  upgrades: Upgrade[];
  achievements: Achievement[];
  gameStartedAt: number;
  lastSavedAt: number;
  lastTickAt: number;
};

export type GameAction =
  | { type: "CLICK" }
  | { type: "BUY_GENERATOR"; id: string }
  | { type: "BUY_UPGRADE"; id: string }
  | { type: "TICK"; timestamp: number }
  | { type: "LOAD_GAME"; state: GameState }
  | { type: "RESET_GAME" }
  | { type: "SHOW_FEATURE"; id: string };
