import { Generator, Upgrade, Achievement, GameState } from "@/types/game";

export const initialGenerators: Generator[] = [
  {
    id: "junior_accountant",
    name: "Comptable Junior",
    description: "Saisit les écritures de base",
    baseCost: 10,
    baseOutput: 0.1,
    count: 0,
    unlocked: true,
  },
  {
    id: "senior_accountant",
    name: "Comptable Senior",
    description: "Gère les écritures complexes",
    baseCost: 100,
    baseOutput: 1,
    count: 0,
    unlocked: false,
    pennylaneFeature: {
      title: "Saisie Automatique",
      description: "Pennylane automatise la saisie des écritures comptables grâce à l'IA.",
      shown: false,
    },
  },
  {
    id: "accounting_software",
    name: "Logiciel Basique",
    description: "Logiciel de comptabilité simple",
    baseCost: 1000,
    baseOutput: 8,
    count: 0,
    unlocked: false,
    pennylaneFeature: {
      title: "Interface Intuitive",
      description: "Le tableau de bord Pennylane permet de visualiser en temps réel votre situation comptable.",
      shown: false,
    },
  },
  {
    id: "erp_system",
    name: "Système ERP",
    description: "Système de gestion intégré",
    baseCost: 10000,
    baseOutput: 47,
    count: 0,
    unlocked: false,
    pennylaneFeature: {
      title: "Intégration Complète",
      description: "Pennylane s'intègre avec tout votre écosystème pour une comptabilité sans silo.",
      shown: false,
    },
  },
  {
    id: "ai_assistant",
    name: "Assistant IA",
    description: "IA avancée pour la comptabilité",
    baseCost: 50000,
    baseOutput: 260,
    count: 0,
    unlocked: false,
    pennylaneFeature: {
      title: "Assistant Intelligent",
      description: "L'IA de Pennylane aide à la prise de décision avec des analyses prédictives.",
      shown: false,
    },
  },
];

export const initialUpgrades: Upgrade[] = [
  {
    id: "better_calculator",
    name: "Better Calculator",
    description: "Double your clicking power",
    cost: 50,
    purchased: false,
    unlocked: true,
    effect: (state) => ({
      ...state,
      entriesPerClick: state.entriesPerClick * 2,
    }),
  },
  {
    id: "training_program",
    name: "Training Program",
    description: "Junior Accountants are twice as efficient",
    cost: 200,
    purchased: false,
    unlocked: false,
    requirement: {
      type: "generator",
      id: "junior_accountant",
      count: 5,
    },
    effect: (state) => {
      return {
        ...state,
        generators: state.generators.map((g) =>
          g.id === "junior_accountant"
            ? { ...g, baseOutput: g.baseOutput * 2 }
            : g
        ),
      };
    },
    pennylaneFeature: {
      title: "Automated Training",
      description: "Pennylane offers an intuitive interface that reduces training time for new users.",
      shown: false,
    },
  },
  {
    id: "ergonomic_chairs",
    name: "Ergonomic Chairs",
    description: "All employees work 50% faster",
    cost: 1000,
    purchased: false,
    unlocked: false,
    requirement: {
      type: "generator",
      id: "senior_accountant",
      count: 3,
    },
    effect: (state) => {
      return {
        ...state,
        generators: state.generators.map((g) =>
          g.id.includes("accountant") ? { ...g, baseOutput: g.baseOutput * 1.5 } : g
        ),
      };
    },
    pennylaneFeature: {
      title: "User Comfort",
      description: "Pennylane's ergonomic design reduces the time spent on accounting tasks.",
      shown: false,
    },
  },
  {
    id: "cloud_upgrade",
    name: "Cloud Infrastructure",
    description: "Software performance increased by 100%",
    cost: 5000,
    purchased: false,
    unlocked: false,
    requirement: {
      type: "generator",
      id: "accounting_software",
      count: 2,
    },
    effect: (state) => {
      return {
        ...state,
        generators: state.generators.map((g) =>
          g.id === "accounting_software" ? { ...g, baseOutput: g.baseOutput * 2 } : g
        ),
      };
    },
    pennylaneFeature: {
      title: "Cloud-Based Platform",
      description: "Pennylane runs entirely in the cloud, allowing access from anywhere with automatic updates.",
      shown: false,
    },
  },
];

export const initialAchievements: Achievement[] = [
  {
    id: "first_entry",
    name: "Première Écriture",
    description: "Saisissez votre première écriture comptable",
    unlocked: false,
    hidden: false,
    condition: (state) => state.totalEntries >= 1,
  },
  {
    id: "click_100",
    name: "Expert en Saisie",
    description: "Saisissez 100 écritures manuellement",
    unlocked: false,
    hidden: false,
    condition: (state) => state.clickCount >= 100,
  },
  {
    id: "hire_team",
    name: "Constitution d'Équipe",
    description: "Embauchez 10 comptables au total",
    unlocked: false,
    hidden: false,
    condition: (state) => {
      const totalAccountants = state.generators
        .filter((g) => g.id.includes("accountant"))
        .reduce((total, g) => total + g.count, 0);
      return totalAccountants >= 10;
    },
  },
  {
    id: "entries_master",
    name: "Expert Comptable",
    description: "Accumulez 1,000,000 écritures au total",
    unlocked: false,
    hidden: false,
    condition: (state) => state.totalEntries >= 1000000,
  },
];

export const initialGameState: GameState = {
  entries: 0,
  totalEntries: 0,
  entriesPerClick: 1,
  entriesPerSecond: 0,
  clickCount: 0,
  generators: initialGenerators,
  upgrades: initialUpgrades,
  achievements: initialAchievements,
  gameStartedAt: Date.now(),
  lastSavedAt: Date.now(),
  lastTickAt: Date.now(),
};
