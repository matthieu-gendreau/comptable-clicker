import { Generator, Upgrade, Achievement, GameState, Prestige, TalentTree, MiniGame, FamousAccountant, FiscalSeason, FiscalObjective, FiscalSpecialization } from "@/types/game";

export const initialGenerators: Generator[] = [
  {
    id: "junior_accountant",
    name: "Stagiaire DCG",
    description: "Sait à peine différencier un débit d'un crédit. Mais tellement enthousiaste ! Compte sur ses doigts et utilise encore une calculette Casio.",
    baseCost: 10,
    baseOutput: 1,
    count: 0,
    unlocked: true,
  },
  {
    id: "ocr_scanner",
    name: "Scanner OCR",
    description: "Reconnaissance automatique des factures. Plus besoin de déchiffrer les tickets de caisse froissés ! Même les notes de kebab sont lisibles.",
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
    description: "Connexion directe avec les banques. L'argent va plus vite que son ombre ! Mind the GAAP entre vos comptes.",
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
    description: "Catégorise automatiquement les transactions. Ne fait jamais d'erreur de TVA ! Comprend même les blagues comptables.",
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
    description: "Tableaux de bord en temps réel. Les graphiques sont tellement beaux qu'on en pleurerait ! Même les actuaires trouvent ça excitant.",
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
    description: "Un seul outil pour les gouverner tous ! Tellement puissant qu'il pourrait même réconcilier les différences entre deux CPAs.",
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

export const initialPrestigeUpgrades: Prestige[] = [
  {
    id: "audit_mastery",
    name: "Maîtrise de l'Audit",
    description: "Votre expertise d'audit augmente tous les revenus de 50%. Même Sherlock Holmes est impressionné !",
    multiplier: 1.5,
    cost: 100,
    unlocked: true,
    purchased: false
  },
  {
    id: "tax_optimization",
    name: "Optimisation Fiscale",
    description: "Vos connaissances en optimisation fiscale doublent la production. 100% légal, promis !",
    multiplier: 2,
    cost: 250,
    unlocked: false,
    purchased: false
  },
  {
    id: "ifrs_master",
    name: "Maître des IFRS",
    description: "Votre maîtrise des normes internationales triple la production. Le monde entier vous envie !",
    multiplier: 3,
    cost: 1000,
    unlocked: false,
    purchased: false
  }
];

export const initialTalentTree: TalentTree[] = [
  {
    id: "tax_expert",
    name: "Expert Fiscal",
    description: "Chaque niveau augmente les gains de clic de 25%",
    level: 0,
    maxLevel: 5,
    cost: 10,
    effect: (state) => ({
      ...state,
      entriesPerClick: state.entriesPerClick * 1.25
    })
  },
  {
    id: "automation_specialist",
    name: "Spécialiste Automation",
    description: "Chaque niveau augmente la production des générateurs de 20%",
    level: 0,
    maxLevel: 5,
    cost: 15,
    effect: (state) => ({
      ...state,
      generators: state.generators.map(g => ({
        ...g,
        baseOutput: g.baseOutput * 1.2
      }))
    })
  },
  {
    id: "financial_analyst",
    name: "Analyste Financier",
    description: "Chaque niveau réduit le coût des générateurs de 10%",
    level: 0,
    maxLevel: 3,
    cost: 20,
    effect: (state) => ({
      ...state,
      generators: state.generators.map(g => ({
        ...g,
        baseCost: g.baseCost * 0.9
      }))
    })
  }
];

export const initialMiniGames: MiniGame[] = [
  {
    id: "balance_puzzle",
    name: "Puzzle du Bilan",
    description: "Équilibrez le bilan en plaçant les bonnes écritures. Un vrai casse-tête comptable !",
    unlocked: true,
    completed: false,
    reward: {
      type: "multiplier",
      value: 1.5
    }
  },
  {
    id: "tax_return_rush",
    name: "Rush des Déclarations",
    description: "C'est la deadline des impôts ! Complétez le maximum de déclarations avant minuit.",
    unlocked: false,
    completed: false,
    reward: {
      type: "resource",
      value: 1000
    }
  },
  {
    id: "audit_investigation",
    name: "Enquête d'Audit",
    description: "Trouvez les anomalies dans les comptes. Votre sens du détail est mis à l'épreuve !",
    unlocked: false,
    completed: false,
    reward: {
      type: "talent_points",
      value: 5
    }
  }
];

export const initialFamousAccountants: FamousAccountant[] = [
  {
    id: "luca_pacioli",
    name: "Luca Pacioli",
    description: "Le père de la comptabilité en partie double. Son pouvoir double tous les gains pendant 30 secondes !",
    unlocked: true,
    power: {
      type: "global",
      multiplier: 2,
      duration: 30
    },
    cooldown: 300
  },
  {
    id: "count_dracula",
    name: "Count Dracula",
    description: "Expert en comptage nocturne. Triple la puissance de clic pendant 20 secondes !",
    unlocked: false,
    power: {
      type: "click",
      multiplier: 3,
      duration: 20
    },
    cooldown: 240
  },
  {
    id: "sherlock_holmes",
    name: "Sherlock Holmes",
    description: "Le détective des comptes. Quadruple la production des générateurs pendant 15 secondes !",
    unlocked: false,
    power: {
      type: "generator",
      multiplier: 4,
      duration: 15
    },
    cooldown: 360
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
    id: "stats_unlock",
    name: "Tableau de bord",
    description: "Débloque l'accès aux statistiques détaillées de votre cabinet",
    cost: 5000,
    unlocked: false,
    purchased: false,
    requirement: {
      type: "generator",
      id: "ocr_scanner",
      count: 5,
    },
    effect: (state) => state,
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
    name: "Mind the GAAP",
    description: "Votre première écriture automatisée. Le début d'une grande aventure comptable !",
    unlocked: false,
    hidden: false,
    condition: (state) => state.totalEntries >= 1,
  },
  {
    id: "digital_pioneer",
    name: "It's an accrual world",
    description: "100 écritures automatisées. Vous commencez à comprendre que la comptabilité, c'est pas si barbant !",
    unlocked: false,
    hidden: false,
    condition: (state) => state.totalEntries >= 100,
  },
  {
    id: "automation_master",
    name: "Full Stack Accountant",
    description: "Possédez au moins un exemplaire de chaque générateur. Même les développeurs sont jaloux de votre stack !",
    unlocked: false,
    hidden: false,
    condition: (state) => state.generators.every(g => g.count > 0),
  },
  {
    id: "efficiency_expert",
    name: "Over Depreciated",
    description: "Atteignez 1000 écritures par seconde. Votre productivité est tellement élevée qu'elle devrait être amortie !",
    unlocked: false,
    hidden: false,
    condition: (state) => state.entriesPerSecond >= 1000,
  },
  {
    id: "digital_revolution",
    name: "Balance Sheet Master",
    description: "Accumulez 1 million d'écritures automatisées. Vos actifs numériques sont parfaitement équilibrés !",
    unlocked: false,
    hidden: false,
    condition: (state) => state.totalEntries >= 1000000,
  },
  {
    id: "tax_season_survivor",
    name: "Tax Season Hero",
    description: "Survivez à votre première période fiscale. Vous méritez une médaille (et des vacances) !",
    unlocked: false,
    hidden: true,
    condition: (state) => state.clickCount >= 10000,
  },
  {
    id: "calculator_master",
    name: "Calculator Whisperer",
    description: "Cliquez 100 fois en 10 secondes. Vos doigts sont plus rapides que votre calculette !",
    unlocked: false,
    hidden: true,
    condition: (state) => state.clickCount >= 100,
  },
  {
    id: "audit_ready",
    name: "Audit-Proof",
    description: "Accumulez 10 millions d'écritures sans erreur. Même l'URSSAF n'y trouverait rien à redire !",
    unlocked: false,
    hidden: true,
    condition: (state) => state.totalEntries >= 10000000,
  },
  {
    id: "prestige_master",
    name: "Big Four Material",
    description: "Effectuez votre premier prestige. Vous êtes maintenant dans la cour des grands !",
    unlocked: false,
    hidden: true,
    condition: (state) => state.prestige.points > 0,
  },
  {
    id: "talent_collector",
    name: "Comptable Renaissance",
    description: "Débloquez tous les talents. Vous êtes le Léonard de Vinci de la comptabilité moderne !",
    unlocked: false,
    hidden: true,
    condition: (state) => state.talents.tree.every(t => t.level === t.maxLevel),
  },
  {
    id: "famous_friend",
    name: "Célébrité Comptable",
    description: "Débloquez tous les comptables célèbres. Votre réseau LinkedIn fait pâlir d'envie !",
    unlocked: false,
    hidden: true,
    condition: (state) => state.famousAccountants.every(a => a.unlocked),
  },
  {
    id: "minigame_champion",
    name: "Maître du Jeu",
    description: "Complétez tous les mini-jeux. La comptabilité n'a plus aucun secret pour vous !",
    unlocked: false,
    hidden: true,
    condition: (state) => state.miniGames.every(m => m.completed),
  }
];

export const fiscalSeasons: FiscalSeason[] = [
  {
    id: "season_1",
    name: "Saison des Déclarations",
    description: "La période la plus chargée de l'année ! Les deadlines s'enchaînent, mais votre expertise fait la différence.",
    multiplier: 1.2,
    objectives: [
      {
        id: "obj_1",
        name: "Premier Pas",
        description: "Atteignez 1,000 entrées totales",
        requirement: 1000,
        reward: 1,
        completed: false
      },
      {
        id: "obj_2",
        name: "En Bonne Voie",
        description: "Atteignez 10,000 entrées totales",
        requirement: 10000,
        reward: 2,
        completed: false
      },
      {
        id: "obj_3",
        name: "Expert Comptable",
        description: "Atteignez 100,000 entrées totales",
        requirement: 100000,
        reward: 5,
        completed: false
      }
    ]
  },
  {
    id: "season_2",
    name: "Saison des Bilans",
    description: "L'heure des clôtures annuelles a sonné ! Votre cabinet croît à vue d'œil.",
    multiplier: 1.5,
    objectives: [
      {
        id: "obj_4",
        name: "Cabinet Reconnu",
        description: "Atteignez 500,000 entrées totales",
        requirement: 500000,
        reward: 10,
        completed: false
      },
      {
        id: "obj_5",
        name: "Cabinet Prestigieux",
        description: "Atteignez 1,000,000 entrées totales",
        requirement: 1000000,
        reward: 20,
        completed: false
      }
    ]
  }
];

export const fiscalObjectives: FiscalObjective[] = [
  {
    id: "apprenti",
    name: "Premier pas en comptabilité",
    description: "Atteignez 1,000 écritures totales",
    requirement: 1000,
    completed: false,
    reward: 1,
  },
  {
    id: "junior",
    name: "Maîtrise des écritures de base",
    description: "Atteignez 5,000 écritures totales",
    requirement: 5000,
    completed: false,
    reward: 1,
  },
  {
    id: "confirme",
    name: "Expert en saisie comptable",
    description: "Atteignez 20,000 écritures totales",
    requirement: 20000,
    completed: false,
    reward: 1,
  },
  {
    id: "senior",
    name: "Maître des écritures complexes",
    description: "Atteignez 50,000 écritures totales",
    requirement: 50000,
    completed: false,
    reward: 1,
  },
  {
    id: "expert",
    name: "Gourou de la comptabilité",
    description: "Atteignez 100,000 écritures totales",
    requirement: 100000,
    completed: false,
    reward: 1,
  },
];

export const fiscalSpecializations: FiscalSpecialization[] = [
  {
    id: "tva",
    name: "Expert TVA",
    description: "Votre maîtrise de la TVA augmente la production automatique de 50%",
    cost: 3,
    purchased: false,
    multiplier: 1.5,
    type: "production",
  },
  {
    id: "bilan",
    name: "Expert Bilan",
    description: "Votre expertise en bilan double les gains par clic",
    cost: 5,
    purchased: false,
    multiplier: 2,
    type: "click",
  },
  {
    id: "liasse",
    name: "Expert Liasse Fiscale",
    description: "Votre maîtrise des liasses fiscales triple tous les gains",
    cost: 10,
    purchased: false,
    multiplier: 3,
    type: "global",
  },
  {
    id: "audit",
    name: "Expert Audit",
    description: "Vos compétences en audit augmentent tous les bonus de 20%",
    cost: 7,
    purchased: false,
    multiplier: 1.2,
    type: "bonus",
  },
  {
    id: "conseil",
    name: "Expert Conseil",
    description: "Votre expertise en conseil débloque des bonus spéciaux",
    cost: 15,
    purchased: false,
    multiplier: 1.1,
    type: "bonus",
  },
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
  prestige: {
    points: 0,
    multiplier: 1,
    totalResets: 0,
    currentSeason: fiscalSeasons[0],
    objectives: fiscalObjectives,
    specializations: fiscalSpecializations,
    upgrades: initialPrestigeUpgrades
  },
  talents: {
    points: 0,
    tree: initialTalentTree
  },
  miniGames: initialMiniGames,
  famousAccountants: initialFamousAccountants
};
