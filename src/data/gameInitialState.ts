import { GameCollaborator, Upgrade, Achievement, GameState, Prestige, TalentTree, MiniGame, FamousAccountant, FiscalSeason, FiscalObjective, FiscalSpecialization } from "@/types/game";
import { initialFeaturesState } from "@/reducers/features/featureReducer";

// Configuration du joueur débutant
export const playerProgression = {
  // Configuration de base du joueur
  baseClickValue: 1,
  baseMultiplier: 1
};

export const initialCollaborators: GameCollaborator[] = [
  // PHASE 1 : STAGIAIRE
  {
    id: "intern_colleague",
    name: "Stagiaire",
    description: "Un stagiaire motivé pour vous aider. Deux cerveaux valent mieux qu'un !",
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
    name: "Assistant Administratif",
    description: "Un assistant pour gérer les tâches administratives. La paperasse n'attend pas !",
    baseCost: 100,
    baseOutput: 0.5,
    count: 0,
    unlocked: false
  },
  // PHASE 2 : COMPTABLE JUNIOR
  {
    id: "excel_sheets",
    name: "Comptable Débutant",
    description: "Un jeune comptable qui maîtrise Excel. La puissance des tableaux croisés dynamiques !",
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
    name: "Comptable Confirmé",
    description: "Un comptable expérimenté qui maîtrise les logiciels. Fini les erreurs d'arrondi !",
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
    name: "Chef Comptable",
    description: "Un chef comptable qui supervise l'équipe. Son expertise fait la différence !",
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
    name: "Expert-Comptable Junior",
    description: "Un jeune expert-comptable dynamique. La technique au service de la comptabilité !",
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
    name: "Expert-Comptable Senior",
    description: "Un expert-comptable expérimenté qui forme les juniors. Un vrai mentor !",
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
    name: "Directeur de Mission",
    description: "Un directeur qui gère les missions complexes. L'expertise à son plus haut niveau !",
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
    name: "Cabinet Comptable",
    description: "Un cabinet entier à votre service. L'excellence comptable incarnée !",
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
      collaborators: state.collaborators.map(g => ({
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
      collaborators: state.collaborators.map(g => ({
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
    id: "bilan_gates",
    name: "Bilan Gates",
    description: "Le génie du bilan comptable. Son pouvoir équilibre parfaitement vos comptes et double tous les gains pendant 30 secondes !",
    unlocked: true,
    purchased: false,
    power: {
      type: "global",
      multiplier: 2,
      duration: 30
    },
    cooldown: 300
  },
  {
    id: "jean_compta_van_damme",
    name: "Jean-Compta Van Damme",
    description: "\"Je suis fasciné par l'air. Si on enlève l'air du ciel, tous les oiseaux tomberaient par terre... Et les chiffres aussi.\" Triple la puissance de clic pendant 20 secondes !",
    unlocked: false,
    purchased: false,
    power: {
      type: "click",
      multiplier: 3,
      duration: 20
    },
    cooldown: 240
  },
  {
    id: "credit_suisse",
    name: "Crédit Suisse",
    description: "\"L'optimisation fiscale, c'est comme le fromage suisse : il faut savoir où sont les trous !\" Réduit le coût de tous les générateurs de 50% pendant 25 secondes !",
    unlocked: false,
    purchased: false,
    power: {
      type: "cost",
      multiplier: 0.5,
      duration: 25
    },
    cooldown: 280
  },
  {
    id: "warren_buffeuille",
    name: "Warren Buffeuille",
    description: "\"Dans la comptabilité comme dans la cuisine, c'est dans les petits détails que se cache la réussite.\" Double la vitesse d'apparition des améliorations et augmente leur efficacité de 50% pendant 20 secondes !",
    unlocked: false,
    purchased: false,
    power: {
      type: "upgrade",
      multiplier: 2,
      duration: 20,
      bonusEffect: 1.5
    },
    cooldown: 320
  },
  {
    id: "debit_vador",
    name: "Débit Vador",
    description: "\"Luke, je suis ton débiteur.\" La force est avec lui pour quadrupler la production des collaborateurs pendant 15 secondes !",
    unlocked: false,
    purchased: false,
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
    id: "linkedin_premium",
    name: "LinkedIn Premium",
    description: "Débloque le Cabinet de Recrutement et permet d'embaucher des comptables célèbres",
    cost: 1000,
    unlocked: false,
    purchased: false,
    requirement: {
      type: "totalEntries",
      count: 1000
    },
    effect: (state: GameState) => ({
      ...state,
      cabinetUnlocked: true,
      entriesPerSecond: state.entriesPerSecond * 1.5,
      entriesPerClick: state.entriesPerClick * 1.5,
      talents: {
        ...state.talents,
        points: state.talents.points + 100
      }
    })
  },
  // EARLY GAME - Améliorations de clic de base
  {
    id: "typing_101",
    name: "La Dactylographie pour les Nuls",
    description: "Enfin vous utilisez plus de deux doigts ! Gains de clic +50%",
    cost: 50,
    unlocked: true,
    purchased: false,
    effect: (state) => ({
      ...state,
      entriesPerClick: state.entriesPerClick * 1.5
    })
  },
  {
    id: "coffee_basics",
    name: "Machine à Café Basique",
    description: "Le carburant de base du comptable. Gains de clic +25%",
    cost: 100,
    unlocked: true,
    purchased: false,
    effect: (state) => ({
      ...state,
      entriesPerClick: state.entriesPerClick * 1.25
    })
  },
  {
    id: "excel_basics",
    name: "Excel pour les Débutants",
    description: "Vous découvrez CTRL+C CTRL+V. Révolutionnaire ! Gains de clic +75%",
    cost: 250,
    unlocked: false,
    purchased: false,
    requirement: {
      type: "clickCount",
      id: "click_count_100",
      count: 100
    },
    effect: (state) => ({
      ...state,
      entriesPerClick: state.entriesPerClick * 1.75
    })
  },

  // EARLY-MID GAME - Améliorations des premiers collaborateurs
  {
    id: "intern_coffee",
    name: "Café des Stagiaires",
    description: "Du café premium pour les stagiaires. Leur productivité augmente de 50% !",
    cost: 500,
    unlocked: false,
    purchased: false,
    requirement: {
      type: "generator",
      id: "intern_colleague",
      count: 3
    },
    effect: (state) => ({
      ...state,
      collaborators: state.collaborators.map(g =>
        g.id === "intern_colleague" ? { ...g, baseOutput: g.baseOutput * 1.5 } : g
      )
    })
  },
  {
    id: "admin_desk",
    name: "Bureau Ergonomique",
    description: "Un vrai bureau pour l'assistant administratif. Production +75%",
    cost: 1000,
    unlocked: false,
    purchased: false,
    requirement: {
      type: "generator",
      id: "basic_calculator",
      count: 2
    },
    effect: (state) => ({
      ...state,
      collaborators: state.collaborators.map(g =>
        g.id === "basic_calculator" ? { ...g, baseOutput: g.baseOutput * 1.75 } : g
      )
    })
  },

  // MID GAME - Améliorations globales
  {
    id: "office_plants",
    name: "Plantes Vertes",
    description: "Des plantes pour égayer le bureau. Production globale +10%",
    cost: 2500,
    unlocked: false,
    purchased: false,
    requirement: {
      type: "totalEntries",
      id: "total_entries_5k",
      count: 5000
    },
    effect: (state) => ({
      ...state,
      collaborators: state.collaborators.map(g => ({
        ...g,
        baseOutput: g.baseOutput * 1.1
      }))
    })
  },
  {
    id: "casual_friday",
    name: "Vendredi Décontracté",
    description: "Le bonheur d'enlever sa cravate. Production globale +15%",
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
      collaborators: state.collaborators.map(g => ({
        ...g,
        baseOutput: g.baseOutput * 1.15
      }))
    })
  },

  // MID-LATE GAME - Améliorations fun
  {
    id: "rubber_duck",
    name: "Canard en Plastique",
    description: "Pour débugger vos écritures. Gains de clic +100% (mais pourquoi ?)",
    cost: 10000,
    unlocked: false,
    purchased: false,
    requirement: {
      type: "totalEntries",
      id: "total_entries_20k",
      count: 20000
    },
    effect: (state) => ({
      ...state,
      entriesPerClick: state.entriesPerClick * 2
    })
  },
  {
    id: "office_cat",
    name: "Chat Comptable",
    description: "Il dort sur les dossiers importants. Production globale +25% par mignonnerie",
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
      collaborators: state.collaborators.map(g => ({
        ...g,
        baseOutput: g.baseOutput * 1.25
      }))
    })
  },

  // LATE GAME - Améliorations avancées
  {
    id: "quantum_calculator",
    name: "Calculatrice Quantique",
    description: "Calcule dans plusieurs dimensions fiscales. Production globale +50%",
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
      collaborators: state.collaborators.map(g => ({
        ...g,
        baseOutput: g.baseOutput * 1.5
      }))
    })
  },
  {
    id: "time_machine",
    name: "Machine à Remonter le Temps",
    description: "Pour corriger les erreurs d'écriture du passé. Production globale +100%",
    cost: 500000,
    unlocked: false,
    purchased: false,
    requirement: {
      type: "totalEntries",
      id: "total_entries_1m",
      count: 1000000
    },
    effect: (state) => ({
      ...state,
      collaborators: state.collaborators.map(g => ({
        ...g,
        baseOutput: g.baseOutput * 2
      }))
    })
  },

  // COSMETIC - Améliorations visuelles
  {
    id: "rgb_keyboard",
    name: "Clavier RGB Gaming",
    description: "Parce que même les comptables peuvent être gamers. Style +100%",
    cost: 15000,
    unlocked: false,
    purchased: false,
    requirement: {
      type: "clickCount",
      id: "click_count_5k",
      count: 5000
    },
    effect: (state) => state // Effet purement cosmétique
  },
  {
    id: "golden_calculator",
    name: "Calculatrice en Or",
    description: "Totalement inutile mais tellement classe. Prestige +100%",
    cost: 50000,
    unlocked: false,
    purchased: false,
    requirement: {
      type: "totalEntries",
      id: "total_entries_100k",
      count: 100000
    },
    effect: (state) => state // Effet purement cosmétique
  },

  // COMBO - Améliorations de combo
  {
    id: "combo_training",
    name: "Formation Combo",
    description: "Gardez votre concentration plus longtemps. Durée du combo +2 secondes",
    cost: 5000,
    unlocked: false,
    purchased: false,
    requirement: {
      type: "clickCount",
      id: "click_count_1k",
      count: 1000
    },
    effect: (state) => ({
      ...state,
      combo: {
        ...state.combo,
        comboTimeWindow: state.combo.comboTimeWindow + 2000
      }
    })
  },
  {
    id: "combo_master",
    name: "Maître du Combo",
    description: "Vos combos sont plus puissants. Multiplicateur maximum +1",
    cost: 20000,
    unlocked: false,
    purchased: false,
    requirement: {
      type: "clickCount",
      id: "click_count_5k",
      count: 5000
    },
    effect: (state) => ({
      ...state,
      combo: {
        ...state.combo,
        maxMultiplier: state.combo.maxMultiplier + 1
      }
    })
  },

  // EASTER EGGS - Améliorations secrètes
  {
    id: "coffee_overflow",
    name: "Overdose de Café",
    description: "Vous vibrez tellement que vous écrivez deux fois plus vite. Gains de clic +100%",
    cost: 99999,
    unlocked: false,
    purchased: false,
    requirement: {
      type: "clickCount",
      id: "click_count_10k",
      count: 10000
    },
    effect: (state) => ({
      ...state,
      entriesPerClick: state.entriesPerClick * 2
    })
  },
  {
    id: "comic_sans",
    name: "Police Comic Sans",
    description: "L'ultime péché du design. Tout le monde est horrifié mais travaille 50% plus vite",
    cost: 123456,
    unlocked: false,
    purchased: false,
    requirement: {
      type: "totalEntries",
      id: "total_entries_500k",
      count: 500000
    },
    effect: (state) => ({
      ...state,
      collaborators: state.collaborators.map(g => ({
        ...g,
        baseOutput: g.baseOutput * 1.5
      }))
    })
  },

  // EXCEL IMPROVEMENTS
  {
    id: "excel_formulas",
    name: "Formules Avancées",
    description: "Maîtrisez les formules les plus complexes d'Excel. Production +100%",
    cost: 75000,
    unlocked: false,
    purchased: false,
    requirement: {
      type: "totalEntries",
      id: "total_entries_150k",
      count: 150000
    },
    effect: (state) => ({
      ...state,
      collaborators: state.collaborators.map(g => ({
        ...g,
        baseOutput: g.baseOutput * 2
      }))
    })
  },
  {
    id: "vba_macros",
    name: "Macros VBA",
    description: "Automatisez vos tâches Excel. Production +150% et bonus global +5%",
    cost: 150000,
    unlocked: false,
    purchased: false,
    requirement: {
      type: "totalEntries",
      id: "total_entries_300k",
      count: 300000
    },
    effect: (state) => ({
      ...state,
      collaborators: state.collaborators.map(g => ({
        ...g,
        baseOutput: g.baseOutput * 2.5
      })),
      prestige: {
        ...state.prestige,
        multiplier: state.prestige.multiplier * 1.05
      }
    })
  },

  // ACCOUNTING SOFTWARE IMPROVEMENTS
  {
    id: "smart_templates",
    name: "Modèles d'Écriture Intelligents",
    description: "Des modèles qui s'adaptent à vos besoins. Production +100%",
    cost: 200000,
    unlocked: false,
    purchased: false,
    requirement: {
      type: "totalEntries",
      id: "total_entries_400k",
      count: 400000
    },
    effect: (state) => ({
      ...state,
      collaborators: state.collaborators.map(g => ({
        ...g,
        baseOutput: g.baseOutput * 2
      }))
    })
  },
  {
    id: "connected_api",
    name: "API Connectée",
    description: "Connectez tous vos outils ensemble. Production +200%",
    cost: 300000,
    unlocked: false,
    purchased: false,
    requirement: {
      type: "totalEntries",
      id: "total_entries_600k",
      count: 600000
    },
    effect: (state) => ({
      ...state,
      collaborators: state.collaborators.map(g => ({
        ...g,
        baseOutput: g.baseOutput * 3
      }))
    })
  },

  // JUNIOR ACCOUNTING IMPROVEMENTS
  {
    id: "continuous_training",
    name: "Formation Continue",
    description: "Formez-vous en continu. Production +100% et bonus de formation +10%",
    cost: 400000,
    unlocked: false,
    purchased: false,
    requirement: {
      type: "totalEntries",
      id: "total_entries_800k",
      count: 800000
    },
    effect: (state) => ({
      ...state,
      collaborators: state.collaborators.map(g => ({
        ...g,
        baseOutput: g.baseOutput * 2,
        effects: g.effects ? {
          ...g.effects,
          training: (g.effects.training || 0) + 0.1
        } : { training: 0.1 }
      }))
    })
  },
  {
    id: "sector_specialization",
    name: "Spécialisation Sectorielle",
    description: "Devenez expert dans votre secteur. Production +150%",
    cost: 500000,
    unlocked: false,
    purchased: false,
    requirement: {
      type: "totalEntries",
      id: "total_entries_1m",
      count: 1000000
    },
    effect: (state) => ({
      ...state,
      collaborators: state.collaborators.map(g => ({
        ...g,
        baseOutput: g.baseOutput * 2.5
      }))
    })
  },

  // OCR IMPROVEMENTS
  {
    id: "advanced_ai",
    name: "IA Avancée",
    description: "Une IA qui comprend même les tickets de caisse froissés. Production +150%",
    cost: 750000,
    unlocked: false,
    purchased: false,
    requirement: {
      type: "totalEntries",
      id: "total_entries_1.5m",
      count: 1500000
    },
    effect: (state) => ({
      ...state,
      collaborators: state.collaborators.map(g => ({
        ...g,
        baseOutput: g.baseOutput * 2.5
      }))
    })
  },

  // GLOBAL IMPROVEMENTS
  {
    id: "quality_coffee",
    name: "Café de Qualité",
    description: "Du vrai café italien. Production globale +10%",
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
      collaborators: state.collaborators.map(g => ({
        ...g,
        baseOutput: g.baseOutput * 1.1
      }))
    })
  },
  {
    id: "team_building",
    name: "Team Building",
    description: "Escape game spécial comptabilité. Production globale +25%",
    cost: 200000,
    unlocked: false,
    purchased: false,
    requirement: {
      type: "totalEntries",
      id: "total_entries_400k",
      count: 400000
    },
    effect: (state) => ({
      ...state,
      collaborators: state.collaborators.map(g => ({
        ...g,
        baseOutput: g.baseOutput * 1.25
      }))
    })
  },
  {
    id: "office_renovation",
    name: "Rénovation des Bureaux",
    description: "Un environnement moderne et agréable. Production globale +50%",
    cost: 400000,
    unlocked: false,
    purchased: false,
    requirement: {
      type: "totalEntries",
      id: "total_entries_800k",
      count: 800000
    },
    effect: (state) => ({
      ...state,
      collaborators: state.collaborators.map(g => ({
        ...g,
        baseOutput: g.baseOutput * 1.5
      }))
    })
  },

  // COMBO IMPROVEMENTS
  {
    id: "combo_duration",
    name: "Durée du Combo",
    description: "Gardez votre combo plus longtemps. +5 secondes de combo",
    cost: 150000,
    unlocked: false,
    purchased: false,
    requirement: {
      type: "clickCount",
      id: "click_count_15k",
      count: 15000
    },
    effect: (state) => ({
      ...state,
      combo: {
        ...state.combo,
        comboTimeWindow: state.combo.comboTimeWindow + 5000
      }
    })
  },
  {
    id: "combo_power",
    name: "Puissance du Combo",
    description: "Des combos plus puissants. Multiplicateur maximum +2",
    cost: 300000,
    unlocked: false,
    purchased: false,
    requirement: {
      type: "clickCount",
      id: "click_count_20k",
      count: 20000
    },
    effect: (state) => ({
      ...state,
      combo: {
        ...state.combo,
        maxMultiplier: state.combo.maxMultiplier + 2
      }
    })
  },

  // FUN IMPROVEMENTS
  {
    id: "office_dog",
    name: "Chien de Bureau",
    description: "Il rapporte les documents. Production globale +30%",
    cost: 250000,
    unlocked: false,
    purchased: false,
    requirement: {
      type: "totalEntries",
      id: "total_entries_500k",
      count: 500000
    },
    effect: (state) => ({
      ...state,
      collaborators: state.collaborators.map(g => ({
        ...g,
        baseOutput: g.baseOutput * 1.3
      }))
    })
  },
  {
    id: "nap_room",
    name: "Salle de Sieste",
    description: "Pour des power naps efficaces. Production globale +40%",
    cost: 500000,
    unlocked: false,
    purchased: false,
    requirement: {
      type: "totalEntries",
      id: "total_entries_1m",
      count: 1000000
    },
    effect: (state) => ({
      ...state,
      collaborators: state.collaborators.map(g => ({
        ...g,
        baseOutput: g.baseOutput * 1.4
      }))
    })
  },

  // PRESTIGE RELATED
  {
    id: "prestige_boost",
    name: "Boost de Prestige",
    description: "Augmente l'efficacité du prestige. Multiplicateur de prestige +20%",
    cost: 1000000,
    unlocked: false,
    purchased: false,
    requirement: {
      type: "totalEntries",
      id: "total_entries_2m",
      count: 2000000
    },
    effect: (state) => ({
      ...state,
      prestige: {
        ...state.prestige,
        multiplier: state.prestige.multiplier * 1.2
      }
    })
  },
  {
    id: "prestige_master",
    name: "Maître du Prestige",
    description: "Le summum du prestige. Multiplicateur de prestige +50%",
    cost: 2000000,
    unlocked: false,
    purchased: false,
    requirement: {
      type: "totalEntries",
      id: "total_entries_5m",
      count: 5000000
    },
    effect: (state) => ({
      ...state,
      prestige: {
        ...state.prestige,
        multiplier: state.prestige.multiplier * 1.5
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
    condition: (state) => state.collaborators?.every(g => g.count > 0) || false,
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
    condition: (state) => state.talents?.tree?.every(t => t.level === t.maxLevel) || false,
  },
  {
    id: "famous_friend",
    name: "Célébrité Comptable",
    description: "Débloquez tous les comptables célèbres. Votre réseau LinkedIn fait pâlir d'envie !",
    unlocked: false,
    hidden: true,
    condition: (state) => state.famousAccountants?.every(a => a.unlocked) || false,
  },
  {
    id: "minigame_champion",
    name: "Maître du Jeu",
    description: "Complétez tous les mini-jeux. La comptabilité n'a plus aucun secret pour vous !",
    unlocked: false,
    hidden: true,
    condition: (state) => state.miniGames?.every(m => m.completed) || false,
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
  collaborators: initialCollaborators,
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
  fiscalSeasons: fiscalSeasons,
  combo: {
    active: false,
    multiplier: 1,
    clicksInCombo: 0,
    lastClickTime: 0,
    maxMultiplier: 2,
    comboTimeWindow: 3000
  },
  powerUps: [],
  activePowerUps: [],
  features: initialFeaturesState,
  cabinetUnlocked: false
};
