import { Generator, Upgrade, Achievement, GameState } from "@/types/game";

export const initialGenerators: Generator[] = [
  {
    id: "junior_accountant",
    name: "Stagiaire DCG",
    description: "Sait à peine différencier un débit d'un crédit. Mais tellement enthousiaste !",
    baseCost: 10,
    baseOutput: 0.1,
    count: 0,
    unlocked: true,
  },
  {
    id: "senior_accountant",
    name: "Comptable Expérimenté",
    description: "Son café est aussi noir que ses tableaux Excel. Un vrai ninja des écritures.",
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
    name: "Cegid",
    description: "L'interface est restée bloquée en 2005. Les bugs sont des 'fonctionnalités spéciales'.",
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
    name: "Système ERP Capricieux",
    description: "Requiert 17 mots de passe différents et une offrande au dieu de l'informatique.",
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
    name: "IA Assistante Comptable",
    description: "Ne prend jamais de pause café mais a tendance à philosopher sur le sens des chiffres.",
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
    name: "Calculatrice Scientifique",
    description: "Double votre puissance de clic. La calculette de poche ne suffit plus !",
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
    name: "Formation Express",
    description: "Les stagiaires sont deux fois plus efficaces. Ils ont enfin compris la différence entre TVA et TTC !",
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
      title: "Formation Automatisée",
      description: "Pennylane offre une interface intuitive qui réduit le temps de formation des nouveaux utilisateurs.",
      shown: false,
    },
  },
  {
    id: "ergonomic_chairs",
    name: "Chaises Ergonomiques",
    description: "Tous les employés travaillent 50% plus vite. Le mal de dos était donc un vrai problème !",
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
      title: "Confort Utilisateur",
      description: "La conception ergonomique de Pennylane réduit le temps passé sur les tâches comptables.",
      shown: false,
    },
  },
  {
    id: "cloud_upgrade",
    name: "Migration Cloud",
    description: "Performance des logiciels augmentée de 100%. Adieu serveur dans le placard à balais !",
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
      title: "Plateforme Cloud",
      description: "Pennylane fonctionne entièrement dans le cloud, permettant un accès de partout avec des mises à jour automatiques.",
      shown: false,
    },
  },
];

export const initialAchievements: Achievement[] = [
  {
    id: "first_entry",
    name: "Premier Pas Comptable",
    description: "Votre première écriture comptable. Le début d'une grande aventure financière !",
    unlocked: false,
    hidden: false,
    condition: (state) => state.totalEntries >= 1,
  },
  {
    id: "click_100",
    name: "Doigts de Comptable",
    description: "100 écritures saisies manuellement. Vous êtes officiellement accro à la calculette !",
    unlocked: false,
    hidden: false,
    condition: (state) => state.clickCount >= 100,
  },
  {
    id: "hire_team",
    name: "Chef Comptable",
    description: "Embauchez 10 comptables au total. Votre équipe est plus grande que votre cuisine !",
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
    name: "Maître des Comptes",
    description: "Accumulez 1 000 000 d'écritures au total. Votre cerveau pense maintenant en partie double !",
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
