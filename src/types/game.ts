export interface GameGenerator {
  id: string;
  name: string;
  description: string;
  baseCost: number;
  baseOutput: number;
  count: number;
  unlocked: boolean;
  effects?: {
    boost?: number;
    training?: number;
  };
  pennylaneFeature?: {
    title: string;
    description: string;
    shown: boolean;
  };
  requiresPrestige?: boolean;
}

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

export type Prestige = {
  id: string;
  name: string;
  description: string;
  multiplier: number;
  cost: number;
  unlocked: boolean;
  purchased: boolean;
};

export type TalentTree = {
  id: string;
  name: string;
  description: string;
  level: number;
  maxLevel: number;
  cost: number;
  effect: (state: GameState) => GameState;
  requirements?: {
    talents?: { id: string; level: number }[];
    prestige?: number;
  };
};

export type MiniGame = {
  id: string;
  name: string;
  description: string;
  unlocked: boolean;
  completed: boolean;
  reward: {
    type: "multiplier" | "resource" | "talent_points";
    value: number;
  };
};

export type FamousAccountant = {
  id: string;
  name: string;
  description: string;
  unlocked: boolean;
  power: {
    type: "click" | "generator" | "global";
    multiplier: number;
    duration: number;
  };
  cooldown: number;
  lastUsed?: number;
};

export type FiscalSeason = {
  id: string;
  name: string;
  description: string;
  multiplier: number;
  objectives: FiscalObjective[];
};

export type FiscalObjective = {
  id: string;
  name: string;
  description: string;
  requirement: number;
  completed: boolean;
  reward: number;
};

export type FiscalSpecialization = {
  id: string;
  name: string;
  description: string;
  cost: number;
  purchased: boolean;
  multiplier: number;
  type: "production" | "click" | "global" | "bonus";
};

export interface ComboSystem {
  active: boolean;
  clicksInCombo: number;
  multiplier: number;
  lastClickTime: number;
  maxMultiplier: number;
  comboTimeWindow: number;
}

export type PowerUp = {
  id: string;
  type: "click" | "production" | "combo";
  multiplier: number;
  duration: number;
  active: boolean;
  expiresAt?: number;
};

export type Level = {
  current: number;
  xp: number;
};

export type GameState = {
  entries: number;
  totalEntries: number;
  entriesPerClick: number;
  entriesPerSecond: number;
  clickCount: number;
  generators: GameGenerator[];
  upgrades: Upgrade[];
  achievements: Achievement[];
  debugMode: boolean;
  gameStartedAt: number;
  lastTickAt: number;
  lastSavedAt: number;
  combo: ComboSystem;
  activePowerUps: PowerUp[];
  prestige: {
    points: number;
    multiplier: number;
    totalResets: number;
    currentSeason: FiscalSeason;
    objectives: FiscalObjective[];
    specializations: FiscalSpecialization[];
    upgrades: Prestige[];
  };
  talents: {
    points: number;
    tree: TalentTree[];
  };
  miniGames: MiniGame[];
  famousAccountants: FamousAccountant[];
  level: Level;
};

export type GameAction =
  | { type: "CLICK" }
  | { type: "BUY_GENERATOR"; id: string }
  | { type: "BUY_UPGRADE"; id: string }
  | { type: "PRESTIGE" }
  | { type: "BUY_SPECIALIZATION"; id: string }
  | { type: "COMPLETE_OBJECTIVE"; id: string }
  | { type: "CHANGE_SEASON"; id: string }
  | { type: "BUY_PRESTIGE_UPGRADE"; id: string }
  | { type: "UPGRADE_TALENT"; id: string }
  | { type: "START_MINIGAME"; id: string }
  | { type: "COMPLETE_MINIGAME"; id: string; score: number }
  | { type: "ACTIVATE_ACCOUNTANT"; id: string }
  | { type: "TICK"; timestamp: number }
  | { type: "LOAD_GAME"; state: GameState }
  | { type: "RESET_GAME" }
  | { type: "SHOW_FEATURE"; id: string }
  | { type: "TOGGLE_DEBUG_MODE" };
