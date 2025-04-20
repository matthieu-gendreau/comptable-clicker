import { Feature, FeatureId } from "./features";

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
  pennylaneFeature?: {
    title: string;
    description: string;
    shown: boolean;
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
  purchased: boolean;
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

export interface GameState {
  entries: number;
  totalEntries: number;
  entriesPerClick: number;
  entriesPerSecond: number;
  clickCount: number;
  lastTickAt: number;
  collaborators: GameCollaborator[];
  upgrades: Upgrade[];
  achievements: Achievement[];
  prestige: {
    points: number;
    upgrades: Upgrade[];
    objectives: FiscalObjective[];
    specializations: FiscalSpecialization[];
    currentSeason: FiscalSeason;
    multiplier: number;
    totalResets: number;
  };
  talents: {
    points: number;
    tree: TalentTree[];
  };
  miniGames: MiniGame[];
  famousAccountants: FamousAccountant[];
  fiscalSeasons: FiscalSeason[];
  combo: ComboSystem;
  powerUps: PowerUp[];
  activePowerUps: PowerUp[];
  features: Record<string, Feature>;
  debugMode: boolean;
  cabinetUnlocked: boolean;
  gameStartedAt: number;
  lastSavedAt: number;
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
  | { type: "UPGRADE_TALENT"; id: string }
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
  | { type: "START_TRIAL"; featureId: FeatureId }
  | { type: "END_TRIAL"; featureId: FeatureId };
