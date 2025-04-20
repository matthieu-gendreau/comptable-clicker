import { Generator, Upgrade, Achievement, GameState } from "@/types/game";

export const initialGenerators: Generator[] = [
  {
    id: "junior_accountant",
    name: "Stagiaire DCG",
    description: "Sait à peine différencier un débit d'un crédit. Mais tellement enthousiaste !",
    baseCost: 10,
    baseOutput: 1,
    count: 0,
    unlocked: true,
  },
  {
    id: "ocr_scanner",
    name: "Scanner OCR",
    description: "Reconnaissance automatique des factures. Plus besoin de déchiffrer les tickets de caisse froissés !",
    baseCost: 50,
    baseOutput: 5,
    count: 0,
    unlocked: false,
    pennylaneFeature: {
      title: "Reconnaissance Automatique",
      description: "Pennylane extrait automatiquement les informations de vos factures grâce à son OCR intelligent.",
      shown: false,
    },
  },
  {
    id: "bank_sync",
    name: "Synchronisation Bancaire",
    description: "Connexion directe avec les banques. Fini les relevés bancaires en PDF !",
    baseCost: 200,
    baseOutput: 15,
    count: 0,
    unlocked: false,
    pennylaneFeature: {
      title: "Multi-Banques",
      description: "Pennylane se connecte à toutes vos banques pour une réconciliation automatique.",
      shown: false,
    },
  },
  {
    id: "ai_accountant",
    name: "Robot Comptable IA",
    description: "Catégorise automatiquement les transactions. Ne fait jamais d'erreur de TVA !",
    baseCost: 1000,
    baseOutput: 50,
    count: 0,
    unlocked: false,
    pennylaneFeature: {
      title: "IA Comptable",
      description: "L'IA de Pennylane catégorise automatiquement vos transactions avec une précision inégalée.",
      shown: false,
    },
  },
  {
    id: "analytics_dashboard",
    name: "Dashboard Analytics",
    description: "Tableaux de bord en temps réel. Les graphiques sont tellement beaux qu'on en pleurerait !",
    baseCost: 5000,
    baseOutput: 200,
    count: 0,
    unlocked: false,
    pennylaneFeature: {
      title: "Reporting Intelligent",
      description: "Pennylane génère automatiquement des rapports personnalisés pour piloter votre entreprise.",
      shown: false,
    },
  },
  {
    id: "erp_connector",
    name: "Connecteur ERP",
    description: "Intégration avec tous vos outils. Un seul outil pour les gouverner tous !",
    baseCost: 20000,
    baseOutput: 750,
    count: 0,
    unlocked: false,
    pennylaneFeature: {
      title: "Écosystème Complet",
      description: "Pennylane s'intègre avec tous vos outils métier pour une gestion unifiée.",
      shown: false,
    },
  }
];

export const initialUpgrades: Upgrade[] = [
  {
    id: "better_calculator",
    name: "Calculatrice Connectée",
    description: "Double votre puissance de clic. La calculette rejoint enfin le 21ème siècle !",
    cost: 50,
    purchased: false,
    unlocked: true,
    effect: (state) => ({
      ...state,
      entriesPerClick: state.entriesPerClick * 2,
    }),
  },
  {
    id: "ocr_boost",
    name: "IA Vision Avancée",
    description: "L'OCR est deux fois plus efficace. Même les tickets de kebab sont reconnus !",
    cost: 200,
    purchased: false,
    unlocked: false,
    requirement: {
      type: "generator",
      id: "ocr_scanner",
      count: 3,
    },
    effect: (state) => {
      return {
        ...state,
        generators: state.generators.map((g) =>
          g.id === "ocr_scanner"
            ? { ...g, baseOutput: g.baseOutput * 2 }
            : g
        ),
      };
    },
    pennylaneFeature: {
      title: "OCR Multi-Documents",
      description: "Pennylane reconnaît tous types de documents : factures, tickets, notes de frais...",
      shown: false,
    },
  },
  {
    id: "instant_sync",
    name: "Sync Temps Réel",
    description: "Synchronisation bancaire 50% plus rapide. L'argent va plus vite que son ombre !",
    cost: 1000,
    purchased: false,
    unlocked: false,
    requirement: {
      type: "generator",
      id: "bank_sync",
      count: 3,
    },
    effect: (state) => {
      return {
        ...state,
        generators: state.generators.map((g) =>
          g.id === "bank_sync" ? { ...g, baseOutput: g.baseOutput * 1.5 } : g
        ),
      };
    },
    pennylaneFeature: {
      title: "Sync Instantanée",
      description: "Les transactions bancaires sont synchronisées en temps réel dans Pennylane.",
      shown: false,
    },
  },
  {
    id: "ai_upgrade",
    name: "IA GPT-4",
    description: "L'IA est deux fois plus intelligente. Elle comprend même les blagues comptables !",
    cost: 5000,
    purchased: false,
    unlocked: false,
    requirement: {
      type: "generator",
      id: "ai_accountant",
      count: 2,
    },
    effect: (state) => {
      return {
        ...state,
        generators: state.generators.map((g) =>
          g.id === "ai_accountant" ? { ...g, baseOutput: g.baseOutput * 2 } : g
        ),
      };
    },
    pennylaneFeature: {
      title: "IA Prédictive",
      description: "L'IA de Pennylane anticipe et suggère les écritures comptables avant même leur saisie.",
      shown: false,
    },
  },
];

export const initialAchievements: Achievement[] = [
  {
    id: "first_entry",
    name: "Premier Pas Digital",
    description: "Votre première écriture automatisée. Bienvenue dans le futur de la comptabilité !",
    unlocked: false,
    hidden: false,
    condition: (state) => state.totalEntries >= 1,
  },
  {
    id: "digital_pioneer",
    name: "Pionnier Digital",
    description: "100 écritures automatisées. La transformation digitale est en marche !",
    unlocked: false,
    hidden: false,
    condition: (state) => state.totalEntries >= 100,
  },
  {
    id: "automation_master",
    name: "Maître de l'Automatisation",
    description: "Possédez au moins un exemplaire de chaque générateur. Votre comptabilité est full-stack !",
    unlocked: false,
    hidden: false,
    condition: (state) => state.generators.every(g => g.count > 0),
  },
  {
    id: "efficiency_expert",
    name: "Expert en Efficacité",
    description: "Atteignez 1000 écritures par seconde. Votre productivité est over 9000 !",
    unlocked: false,
    hidden: false,
    condition: (state) => state.entriesPerSecond >= 1000,
  },
  {
    id: "digital_revolution",
    name: "Révolution Digitale",
    description: "Accumulez 1 million d'écritures automatisées. La comptabilité manuelle appartient au passé !",
    unlocked: false,
    hidden: false,
    condition: (state) => state.totalEntries >= 1000000,
  }
];

export const initialGameState: GameState = {
  entries: 0,
  totalEntries: 0,
  entriesPerSecond: 0,
  entriesPerClick: 1,
  clickCount: 0,
  lastTickAt: Date.now(),
  lastSavedAt: Date.now(),
  gameStartedAt: Date.now(),
  debugMode: false,
  generators: initialGenerators,
  upgrades: initialUpgrades,
  achievements: initialAchievements,
};
