import type { Feature, FeatureId } from "./features";

export type { Feature, FeatureId };

export type GameCollaborator = {
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
  requiresPrestige?: boolean;
};

export type Upgrade = {
  id: string;
  name: string;
  description: string;
  cost: number;
  purchased: boolean;
  unlocked: boolean;
  multiplier: number;
  effect: (state: GameState) => GameState;
  requirement?: {
    type: string;
    id: string;
    count: number;
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

export type MiniGame = {
  id: string;
  name: string;
  description: string;
  unlocked: boolean;
  completed: boolean;
  active: boolean;
  timeLeft: number;
  reward: {
    type: "multiplier" | "resource";
    value: number;
  };
};

export type FamousAccountant = {
  id: string;
  name: string;
  description: string;
  unlocked: boolean;
  purchased: boolean;
  active: boolean;
  power: {
    type: "click" | "generator" | "global" | "cost" | "upgrade";
    multiplier: number;
    duration: number;
    bonusEffect?: number;
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
  active: boolean;
  specializations: FiscalSpecialization[];
  duration: number;
  timeLeft: number;
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
  baseMultiplier: number;
  speedBonus: number;
  currentTier: number;
  degradationRate: number;
  degradationInterval: number;
  lastDegradationTime: number;
  tiers: Array<{
    clickThreshold: number;
    multiplier: number;
  }>;
}

export type PowerUp = {
  id: string;
  type: "click" | "production" | "combo";
  multiplier: number;
  duration: number;
  active: boolean;
  expiresAt?: number;
};

export type Requirement = {
  type: "collaborator" | "totalEntries" | "clickCount" | "uniqueCollaborators";
  id: string;
  count: number;
};

export type Improvement = {
  id: string;
  name: string;
  description: string;
  cost: number;
  purchased: boolean;
  unlocked: boolean;
  requirements?: Requirement[];
};

export type TalentTree = {
  id: string;
  name: string;
  description: string;
  cost: number;
  unlocked: boolean;
  purchased: boolean;
  effects: {
    type: string;
    value: number;
  }[];
};

export interface GameState {
  entries: number;
  totalEntries: number;
  entriesPerClick: number;
  entriesPerSecond: number;
  autoClickRate: number;
  clickCount: number;
  debugMode: boolean;
  cabinetUnlocked: boolean;
  gameStartedAt: number;
  lastSavedAt: number;
  lastTickAt: number;
  collaborators: GameCollaborator[];
  upgrades: Upgrade[];
  achievements: Achievement[];
  miniGames: MiniGame[];
  famousAccountants: FamousAccountant[];
  combo: ComboSystem;
  prestige: {
    points: number;
    multiplier: number;
    cost: number;
    totalResets: number;
    upgrades: Upgrade[];
    specializations: FiscalSpecialization[];
    objectives: FiscalObjective[];
    currentSeason: FiscalSeason;
  };
  features: Record<string, Feature>;
  activePowerUps: PowerUp[];
  upgradesTabUnlocked: boolean;
  statsTabUnlocked: boolean;
  achievementsTabUnlocked: boolean;
  prestigeTabUnlocked: boolean;
}

export type GameAction =
  | { type: "CLICK" }
  | { type: "BUY_COLLABORATOR"; id: string }
  | { type: "BUY_UPGRADE"; id: string }
  | { type: "PRESTIGE" }
  | { type: "BUY_SPECIALIZATION"; id: string }
  | { type: "COMPLETE_OBJECTIVE"; id: string }
  | { type: "CHANGE_SEASON"; id: string }
  | { type: "BUY_PRESTIGE_UPGRADE"; id: string }
  | { type: "START_MINIGAME"; id: string }
  | { type: "COMPLETE_MINIGAME"; id: string }
  | { type: "ACTIVATE_ACCOUNTANT"; id: string }
  | { type: "PURCHASE_ACCOUNTANT"; id: string }
  | { type: "TICK"; timestamp: number }
  | { type: "LOAD_GAME"; state: GameState }
  | { type: "RESET_GAME" }
  | { type: "SHOW_FEATURE"; id: string }
  | { type: "TOGGLE_DEBUG_MODE" }
  | { type: "UNLOCK_FEATURE"; featureId: FeatureId }
  | { type: "ACTIVATE_FEATURE"; featureId: FeatureId }
  | { type: "DEACTIVATE_FEATURE"; featureId: FeatureId }
  | { type: "UNLOCK_TAB"; id: "upgrades" | "stats" | "achievements" | "prestige" }
  | { type: "CHECK_UNLOCKS" };
