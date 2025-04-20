import { GameGenerator, Upgrade, Achievement, GameState, Prestige, TalentTree, MiniGame, FamousAccountant, FiscalSeason, FiscalObjective, FiscalSpecialization } from "@/types/game";

// Configuration du joueur débutant
export const playerProgression = {
  levels: [
    { name: "Stagiaire", requiredXP: 0 },
    { name: "Comptable Junior", requiredXP: 1000 },
    { name: "Comptable Confirmé", requiredXP: 5000 },
    { name: "Chef Comptable", requiredXP: 20000 },
    { name: "Expert-Comptable", requiredXP: 100000 }
  ]
};

export const initialGenerators: GameGenerator[] = [
  // PHASE 1 : STAGIAIRE
  {
    id: "intern_colleague",
    name: "Collègue Stagiaire",
    description: "Un autre stagiaire pour partager la charge de travail. Deux cerveaux valent mieux qu'un !",
    baseCost: 25,
    baseOutput: 0.2,
    count: 0,
    unlocked: true,
    effects: {
      training: 0.1 // Bonus d'apprentissage mutuel
    }
  },
  {
    id: "basic_calculator",
    name: "Calculatrice de Bureau",
    description: "Une calculatrice avec rouleau de papier. Un premier pas vers l'automatisation !",
    baseCost: 100,
    baseOutput: 0.5,
    count: 0,
    unlocked: false
  },
  // PHASE 2 : COMPTABLE JUNIOR
  {
    id: "excel_sheets",
    name: "Classeurs Excel",
    description: "Des formules Excel bien organisées. La puissance des tableaux croisés dynamiques !",
    baseCost: 500,
    baseOutput: 2,
    count: 0,
    unlocked: false,
    effects: {
      boost: 1.05 // Améliore légèrement tout le monde
    }
  },
  {
    id: "accounting_software",
    name: "Logiciel Comptable",
    description: "Un vrai logiciel de compta. Fini les erreurs d'arrondi !",
    baseCost: 2000,
    baseOutput: 6,
    count: 0,
    unlocked: false,
    pennylaneFeature: {
      title: "Interface Intuitive",
      description: "Pennylane propose une interface moderne et intuitive pour la saisie comptable.",
      shown: false
    }
  },
  // PHASE 3 : COMPTABLE CONFIRMÉ
  {
    id: "junior_accountant",
    name: "Comptable Junior",
    description: "Un jeune comptable motivé. Il apprend vite et travaille bien !",
    baseCost: 10000,
    baseOutput: 20,
    count: 0,
    unlocked: false,
    effects: {
      training: 0.2
    }
  },
  {
    id: "ocr_system",
    name: "Système OCR",
    description: "Reconnaissance automatique des documents. La technologie au service de la comptabilité !",
    baseCost: 25000,
    baseOutput: 50,
    count: 0,
    unlocked: false,
    pennylaneFeature: {
      title: "OCR Intelligent",
      description: "L'OCR de Pennylane extrait automatiquement les informations de vos documents.",
      shown: false
    }
  },
  // PHASE 4 : CHEF COMPTABLE
  {
    id: "senior_accountant",
    name: "Comptable Senior",
    description: "Un comptable expérimenté qui forme les juniors. Un vrai mentor !",
    baseCost: 100000,
    baseOutput: 150,
    count: 0,
    unlocked: false,
    effects: {
      boost: 1.15,
      training: 0.5
    }
  },
  {
    id: "bank_sync",
    name: "Synchronisation Bancaire",
    description: "Connexion en temps réel avec les banques. L'argent n'attend pas !",
    baseCost: 250000,
    baseOutput: 400,
    count: 0,
    unlocked: false,
    pennylaneFeature: {
      title: "Multi-Banques",
      description: "Pennylane se connecte à toutes vos banques pour une réconciliation automatique.",
      shown: false
    }
  },
  // PHASE 5 : EXPERT-COMPTABLE
  {
    id: "accounting_team",
    name: "Équipe Comptable",
    description: "Une équipe complète et bien rodée. La force du collectif !",
    baseCost: 1000000,
    baseOutput: 1000,
    count: 0,
    unlocked: false,
    effects: {
      boost: 1.25
    }
  },
  {
    id: "ai_assistant",
    name: "Assistant IA",
    description: "Un assistant virtuel intelligent qui ne dort jamais. Le futur est là !",
    baseCost: 5000000,
    baseOutput: 2500,
    count: 0,
    unlocked: false,
    pennylaneFeature: {
      title: "IA Comptable",
      description: "L'IA de Pennylane automatise les tâches répétitives et détecte les anomalies.",
      shown: false
    }
  }
];

export const initialPrestigeUpgrades: Prestige[] = [
  {
    id: "efficiency_expert",
    name: "Expert en Efficacité",
    description: "Vos méthodes de travail optimisées augmentent la productivité de 25%",
    multiplier: 1.25,
    cost: 1,
    unlocked: true,
    purchased: false
  },
  {
    id: "team_management",
    name: "Management d'Équipe",
    description: "Vos compétences en gestion d'équipe augmentent la production de 50%",
    multiplier: 1.5,
    cost: 3,
    unlocked: false,
    purchased: false
  },
  {
    id: "digital_transformation",
    name: "Transformation Digitale",
    description: "Votre expertise en digitalisation double la production",
    multiplier: 2,
    cost: 10,
    unlocked: false,
    purchased: false
  }
];

export const initialTalentTree: TalentTree[] = [
  {
    id: "typing_speed",
    name: "Vitesse de Frappe",
    description: "Chaque niveau augmente les gains par clic de 10%",
    level: 0,
    maxLevel: 10,
    cost: 5,
    effect: (state) => ({
      ...state,
      entriesPerClick: state.entriesPerClick * 1.1
    })
  },
  {
    id: "team_training",
    name: "Formation d'Équipe",
    description: "Chaque niveau augmente la production de l'équipe de 10%",
    level: 0,
    maxLevel: 10,
    cost: 8,
    effect: (state) => ({
      ...state,
      generators: state.generators.map(g => ({
        ...g,
        baseOutput: g.baseOutput * 1.1
      }))
    })
  },
  {
    id: "resource_management",
    name: "Gestion des Ressources",
    description: "Chaque niveau réduit les coûts de 5%",
    level: 0,
    maxLevel: 5,
    cost: 12,
    effect: (state) => ({
      ...state,
      generators: state.generators.map(g => ({
        ...g,
        baseCost: g.baseCost * 0.95
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
  // Améliorations de base (clics)
  {
    id: "faster_typing",
    name: "Cours de Frappe",
    description: "Double votre vitesse de saisie. Adieu la méthode deux doigts !",
    cost: 50,
    unlocked: true,
    purchased: false,
    effect: (state) => ({
      ...state,
      entriesPerClick: state.entriesPerClick * 2
    })
  },
  {
    id: "ergonomic_keyboard",
    name: "Clavier Ergonomique",
    description: "Un clavier adapté à la saisie intensive. Vos poignets vous remercient !",
    cost: 200,
    unlocked: false,
    purchased: false,
    effect: (state) => ({
      ...state,
      entriesPerClick: state.entriesPerClick * 1.5
    })
  },
  {
    id: "shortcut_mastery",
    name: "Maîtrise des Raccourcis",
    description: "CTRL+C, CTRL+V comme un pro ! Augmente les gains de clic de 75%",
    cost: 1000,
    unlocked: false,
    purchased: false,
    effect: (state) => ({
      ...state,
      entriesPerClick: state.entriesPerClick * 1.75
    })
  },

  // Améliorations Stagiaire
  {
    id: "intern_coffee",
    name: "Machine à Café",
    description: "Les stagiaires sont plus efficaces avec de la caféine. Production +50%",
    cost: 150,
    unlocked: false,
    purchased: false,
    requirement: {
      type: "generator",
      id: "intern_colleague",
      count: 3
    },
    effect: (state) => ({
      ...state,
      generators: state.generators.map(g =>
        g.id === "intern_colleague" ? { ...g, baseOutput: g.baseOutput * 1.5 } : g
      )
    })
  },
  {
    id: "intern_mentoring",
    name: "Programme de Mentorat",
    description: "Un stagiaire bien formé en vaut deux ! Production +100%",
    cost: 500,
    unlocked: false,
    purchased: false,
    requirement: {
      type: "generator",
      id: "intern_colleague",
      count: 5
    },
    effect: (state) => ({
      ...state,
      generators: state.generators.map(g =>
        g.id === "intern_colleague" ? { ...g, baseOutput: g.baseOutput * 2 } : g
      )
    })
  },

  // Améliorations Calculatrice
  {
    id: "calculator_memory",
    name: "Touches Mémoire",
    description: "Utilisation des touches M+, M-, MRC. Production +75%",
    cost: 300,
    unlocked: false,
    purchased: false,
    requirement: {
      type: "generator",
      id: "basic_calculator",
      count: 2
    },
    effect: (state) => ({
      ...state,
      generators: state.generators.map(g =>
        g.id === "basic_calculator" ? { ...g, baseOutput: g.baseOutput * 1.75 } : g
      )
    })
  },
  {
    id: "calculator_ribbon",
    name: "Ruban Sans Fin",
    description: "Plus besoin de changer le rouleau ! Production +100%",
    cost: 1000,
    unlocked: false,
    purchased: false,
    requirement: {
      type: "generator",
      id: "basic_calculator",
      count: 5
    },
    effect: (state) => ({
      ...state,
      generators: state.generators.map(g =>
        g.id === "basic_calculator" ? { ...g, baseOutput: g.baseOutput * 2 } : g
      )
    })
  },

  // Améliorations Excel
  {
    id: "excel_formulas",
    name: "Formules Avancées",
    description: "RECHERCHEV comme un champion ! Production +100%",
    cost: 2000,
    unlocked: false,
    purchased: false,
    requirement: {
      type: "generator",
      id: "excel_sheets",
      count: 3
    },
    effect: (state) => ({
      ...state,
      generators: state.generators.map(g =>
        g.id === "excel_sheets" ? { ...g, baseOutput: g.baseOutput * 2 } : g
      )
    })
  },
  {
    id: "excel_macros",
    name: "Macros VBA",
    description: "Automatisation poussée avec VBA. Production +150% et bonus global +5%",
    cost: 5000,
    unlocked: false,
    purchased: false,
    requirement: {
      type: "generator",
      id: "excel_sheets",
      count: 5
    },
    effect: (state) => ({
      ...state,
      generators: state.generators.map(g =>
        g.id === "excel_sheets" 
          ? { ...g, baseOutput: g.baseOutput * 2.5, effects: { ...g.effects, boost: (g.effects?.boost || 1) + 0.05 } }
          : g
      )
    })
  },

  // Améliorations Logiciel Comptable
  {
    id: "software_templates",
    name: "Modèles d'Écritures",
    description: "Écritures récurrentes pré-enregistrées. Production +100%",
    cost: 10000,
    unlocked: false,
    purchased: false,
    requirement: {
      type: "generator",
      id: "accounting_software",
      count: 2
    },
    effect: (state) => ({
      ...state,
      generators: state.generators.map(g =>
        g.id === "accounting_software" ? { ...g, baseOutput: g.baseOutput * 2 } : g
      )
    }),
    pennylaneFeature: {
      title: "Modèles Intelligents",
      description: "Pennylane apprend de vos habitudes pour suggérer les bonnes écritures",
      shown: false
    }
  },
  {
    id: "software_api",
    name: "API Connectée",
    description: "Connexion avec vos autres outils. Production +200%",
    cost: 25000,
    unlocked: false,
    purchased: false,
    requirement: {
      type: "generator",
      id: "accounting_software",
      count: 5
    },
    effect: (state) => ({
      ...state,
      generators: state.generators.map(g =>
        g.id === "accounting_software" ? { ...g, baseOutput: g.baseOutput * 3 } : g
      )
    }),
    pennylaneFeature: {
      title: "API Ouverte",
      description: "Pennylane s'intègre avec tout votre écosystème logiciel",
      shown: false
    }
  },

  // Améliorations Comptable Junior
  {
    id: "junior_training",
    name: "Formation Continue",
    description: "Formations régulières pour vos juniors. Production +100% et bonus formation +10%",
    cost: 50000,
    unlocked: false,
    purchased: false,
    requirement: {
      type: "generator",
      id: "junior_accountant",
      count: 3
    },
    effect: (state) => ({
      ...state,
      generators: state.generators.map(g =>
        g.id === "junior_accountant" 
          ? { ...g, baseOutput: g.baseOutput * 2, effects: { ...g.effects, training: (g.effects?.training || 0) + 0.1 } }
          : g
      )
    })
  },
  {
    id: "junior_specialization",
    name: "Spécialisation Sectorielle",
    description: "Chaque junior se spécialise dans un secteur. Production +150%",
    cost: 100000,
    unlocked: false,
    purchased: false,
    requirement: {
      type: "generator",
      id: "junior_accountant",
      count: 5
    },
    effect: (state) => ({
      ...state,
      generators: state.generators.map(g =>
        g.id === "junior_accountant" ? { ...g, baseOutput: g.baseOutput * 2.5 } : g
      )
    })
  },

  // Améliorations OCR
  {
    id: "ocr_ai",
    name: "IA Avancée",
    description: "Reconnaissance plus précise avec l'IA. Production +150%",
    cost: 150000,
    unlocked: false,
    purchased: false,
    requirement: {
      type: "generator",
      id: "ocr_system",
      count: 2
    },
    effect: (state) => ({
      ...state,
      generators: state.generators.map(g =>
        g.id === "ocr_system" ? { ...g, baseOutput: g.baseOutput * 2.5 } : g
      )
    }),
    pennylaneFeature: {
      title: "IA de Pointe",
      description: "L'IA de Pennylane comprend même les documents manuscrits",
      shown: false
    }
  },

  // Améliorations globales
  {
    id: "office_coffee",
    name: "Café de Qualité",
    description: "Du vrai café en grains. Tout le monde est plus efficace ! Production globale +10%",
    cost: 5000,
    unlocked: false,
    purchased: false,
    requirement: {
      type: "totalEntries",
      id: "total_entries_10k",
      count: 10000
    },
    effect: (state) => ({
      ...state,
      generators: state.generators.map(g => ({
        ...g,
        baseOutput: g.baseOutput * 1.1
      }))
    })
  },
  {
    id: "team_building",
    name: "Team Building",
    description: "Une équipe soudée est plus efficace. Production globale +25%",
    cost: 25000,
    unlocked: false,
    purchased: false,
    requirement: {
      type: "totalEntries",
      id: "total_entries_50k",
      count: 50000
    },
    effect: (state) => ({
      ...state,
      generators: state.generators.map(g => ({
        ...g,
        baseOutput: g.baseOutput * 1.25
      }))
    })
  },
  {
    id: "office_renovation",
    name: "Rénovation des Bureaux",
    description: "Un environnement agréable booste la productivité. Production globale +50%",
    cost: 100000,
    unlocked: false,
    purchased: false,
    requirement: {
      type: "totalEntries",
      id: "total_entries_200k",
      count: 200000
    },
    effect: (state) => ({
      ...state,
      generators: state.generators.map(g => ({
        ...g,
        baseOutput: g.baseOutput * 1.5
      }))
    })
  },

  // Améliorations combo
  {
    id: "combo_training",
    name: "Formation Concentration",
    description: "Gardez votre concentration plus longtemps. Durée du combo +1 seconde",
    cost: 1000,
    unlocked: false,
    purchased: false,
    requirement: {
      type: "clickCount",
      id: "click_count_100",
      count: 100
    },
    effect: (state) => ({
      ...state,
      combo: {
        ...state.combo,
        comboTimeWindow: state.combo.comboTimeWindow + 1000
      }
    })
  },
  {
    id: "combo_mastery",
    name: "Maîtrise du Rythme",
    description: "Vos combos sont plus puissants. Multiplicateur maximum +0.5",
    cost: 5000,
    unlocked: false,
    purchased: false,
    requirement: {
      type: "clickCount",
      id: "click_count_500",
      count: 500
    },
    effect: (state) => ({
      ...state,
      combo: {
        ...state.combo,
        maxMultiplier: state.combo.maxMultiplier + 0.5
      }
    })
  }
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
  famousAccountants: initialFamousAccountants,
  combo: {
    active: false,
    multiplier: 1,
    clicksInCombo: 0,
    lastClickTime: 0,
    maxMultiplier: 2,
    comboTimeWindow: 3000 // 3 secondes pour plus de confort
  },
  activePowerUps: [],
  level: {
    current: 0,
    xp: 0
  }
};
