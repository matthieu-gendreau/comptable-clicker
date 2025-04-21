import type { GameCollaborator, Upgrade, Achievement, GameState, MiniGame, FamousAccountant, FiscalSeason, FiscalObjective, FiscalSpecialization } from "@/types/game";
import { initialFeaturesState } from "@/reducers/features/featureReducer";

// Configuration du joueur débutant
export const playerProgression = {
  // Configuration de base du joueur
  baseClickValue: 1,
  baseMultiplier: 1.2
};

export const initialCollaborators: GameCollaborator[] = [
  // PHASE 1 : STAGIAIRE
  {
    id: "intern_colleague",
    name: "Stagiaire",
    description: "Un stagiaire qui pense que le bilan c'est un exercice de yoga. Mais hey, il fait du bon café !",
    baseCost: 25,
    baseOutput: 0.5,
    count: 0,
    unlocked: true,
    effects: {
      training: 0.1
    }
  },
  {
    id: "basic_calculator",
    name: "Assistant Administratif",
    description: "Expert en pause café et en discussions machine à café. Accessoirement, fait aussi de la compta.",
    baseCost: 100,
    baseOutput: 2,
    count: 0,
    unlocked: false
  },
  // PHASE 2 : COMPTABLE JUNIOR
  {
    id: "excel_sheets",
    name: "Comptable Débutant",
    description: "Pense que VLOOKUP est une marque de voiture et que Pivot c'est une bière. Mais il apprend vite !",
    baseCost: 500,
    baseOutput: 8,
    count: 0,
    unlocked: false,
    effects: {
      boost: 1.05
    }
  },
  {
    id: "accounting_software",
    name: "Comptable Confirmé",
    description: "A nommé son chat 'Excel' et son chien 'Sage'. Légèrement inquiétant, mais efficace.",
    baseCost: 2000,
    baseOutput: 24,
    count: 0,
    unlocked: false,
    comptableClickerFeature: {
      title: "Interface Intuitive",
      description: "Aussi intuitive qu'un parcours du combattant dans le noir.",
      shown: false
    }
  },
  // PHASE 3 : COMPTABLE CONFIRMÉ
  {
    id: "junior_accountant",
    name: "Chef Comptable",
    description: "A des posters de Warren Buffett dans sa chambre. Ne nous jugeons pas.",
    baseCost: 10000,
    baseOutput: 80,
    count: 0,
    unlocked: false,
    effects: {
      training: 0.2
    }
  },
  {
    id: "ocr_system",
    name: "Expert-Comptable Junior",
    description: "Pense qu'OCR signifie 'Oh Ciel, Rien ne marche'. Mais il a un costard Sandro, donc ça passe.",
    baseCost: 25000,
    baseOutput: 200,
    count: 0,
    unlocked: false,
    comptableClickerFeature: {
      title: "OCR Intelligent",
      description: "L'OCR qui transforme magiquement vos tickets de kebab en notes de frais 5 étoiles.",
      shown: false
    }
  },
  // PHASE 4 : CHEF COMPTABLE
  {
    id: "senior_accountant",
    name: "Expert-Comptable Senior",
    description: "A tellement révisé le PCG qu'il récite les numéros de compte dans son sommeil. Sa femme s'inquiète.",
    baseCost: 100000,
    baseOutput: 600,
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
    description: "Jongle entre 15 dossiers, 3 cafés et 1 burn-out imminent. Mais ses PowerPoints sont magnifiques.",
    baseCost: 250000,
    baseOutput: 1600,
    count: 0,
    unlocked: false,
    comptableClickerFeature: {
      title: "Multi-Banques",
      description: "Synchronise vos comptes plus vite que vous ne synchronisez votre vie professionnelle et personnelle.",
      shown: false
    }
  },
  // PHASE 5 : EXPERT-COMPTABLE
  {
    id: "accounting_team",
    name: "Équipe Comptable",
    description: "Une équipe si soudée qu'ils ont créé un groupe WhatsApp 'Les Mercredis du PCG'. Ils ont besoin d'aide.",
    baseCost: 1000000,
    baseOutput: 4000,
    count: 0,
    unlocked: false,
    effects: {
      boost: 1.25
    }
  },
  {
    id: "ai_assistant",
    name: "Cabinet Comptable",
    description: "Un cabinet entier qui pense que 'travail/vie personnelle' est une notion de débutant. Efficacité maximale !",
    baseCost: 5000000,
    baseOutput: 10000,
    count: 0,
    unlocked: false,
    comptableClickerFeature: {
      title: "IA Comptable",
      description: "Une IA tellement avancée qu'elle fait même les pauses café à votre place.",
      shown: false
    }
  }
];

export const initialPrestigeUpgrades: Upgrade[] = [
  {
    id: "prestige_multiplier_1",
    name: "Prestige Boost I",
    description: "Augmente votre multiplicateur de prestige de 25%",
    cost: 1,
    purchased: false,
    unlocked: true,
    multiplier: 1.25,
    effect: (state: GameState) => ({
      ...state,
      prestige: {
        ...state.prestige,
        multiplier: state.prestige.multiplier * 1.25
      }
    })
  },
  {
    id: "prestige_click_power",
    name: "Pouvoir du Clic Prestigieux",
    description: "Vos clics sont 50% plus puissants après un prestige",
    cost: 2,
    purchased: false,
    unlocked: true,
    multiplier: 1.5,
    effect: (state: GameState) => ({
      ...state,
      entriesPerClick: state.entriesPerClick * 1.5
    })
  },
  {
    id: "prestige_auto_click",
    name: "Auto-Clic de Prestige",
    description: "Gagne automatiquement 1 clic par seconde pour chaque prestige effectué",
    cost: 3,
    purchased: false,
    unlocked: true,
    multiplier: 1,
    effect: (state: GameState) => ({
      ...state,
      autoClickRate: (state.autoClickRate || 0) + 1
    })
  },
  {
    id: "prestige_combo_master",
    name: "Maître du Combo Prestigieux",
    description: "Les combos durent 50% plus longtemps et leur multiplicateur maximum est augmenté de 25%",
    cost: 5,
    purchased: false,
    unlocked: true,
    multiplier: 1.75,
    effect: (state: GameState) => ({
      ...state,
      combo: {
        ...state.combo,
        comboTimeWindow: state.combo.comboTimeWindow * 1.5,
        maxMultiplier: state.combo.maxMultiplier * 1.25
      }
    })
  }
];

export const miniGames: MiniGame[] = [
  {
    id: "balance_puzzle",
    name: "Puzzle de la Balance",
    description: "Équilibrez les comptes pour gagner un multiplicateur de production",
    unlocked: true,
    completed: false,
    active: false,
    timeLeft: 0,
    reward: {
      type: "multiplier",
      value: 2
    }
  },
  {
    id: "tax_return_rush",
    name: "Rush des Déclarations",
    description: "Remplissez un maximum de déclarations en temps limité",
    unlocked: false,
    completed: false,
    active: false,
    timeLeft: 0,
    reward: {
      type: "resource",
      value: 1000
    }
  },
  {
    id: "audit_investigation",
    name: "Investigation d'Audit",
    description: "Menez l'enquête pour trouver les erreurs comptables",
    unlocked: false,
    completed: false,
    active: false,
    timeLeft: 0,
    reward: {
      type: "resource",
      value: 1000
    }
  }
];

export const famousAccountants: FamousAccountant[] = [
  {
    id: "bilan_gates",
    name: "Bilan Gates",
    description: "Le gourou de la compta numérique. Sa calculette a plus de RAM que votre PC.",
    unlocked: true,
    purchased: false,
    active: false,
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
    description: "Ses splits divisent les comptes plus vite que l'éclair. 'Aware is not aware.'",
    unlocked: false,
    purchased: false,
    active: false,
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
    description: "Tellement discret qu'il fait disparaître les charges comme par magie. Ne posez pas de questions.",
    unlocked: false,
    purchased: false,
    active: false,
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
    description: "Le sage de la compta analytique. Médite 2h par jour sur les provisions pour risques.",
    unlocked: false,
    purchased: false,
    active: false,
    power: {
      type: "upgrade",
      multiplier: 1.5,
      duration: 35,
      bonusEffect: 2
    },
    cooldown: 320
  },
  {
    id: "debit_vador",
    name: "Débit Vador",
    description: "A basculé du côté obscur de la compta. Son grand livre est plus noir que son casque.",
    unlocked: false,
    purchased: false,
    active: false,
    power: {
      type: "generator",
      multiplier: 2.5,
      duration: 40
    },
    cooldown: 360
  }
];

export const initialUpgrades: Upgrade[] = [
  {
    id: "linkedin_premium",
    name: "LinkedIn Premium",
    description: "Débloque le Cabinet de Recrutement et permet d'embaucher des Légendes de la Compta",
    cost: 1000,
    unlocked: false,
    purchased: false,
    requirement: {
      type: "totalEntries",
      id: "total_entries_1k",
      count: 1000
    },
    effect: (state: GameState): GameState => ({
      ...state,
      cabinetUnlocked: true,
      entriesPerSecond: state.entriesPerSecond * 1.5,
      entriesPerClick: state.entriesPerClick * 1.5
    }),
    multiplier: 1
  },
  // EARLY GAME - Améliorations de clic de base
  {
    id: "typing_101",
    name: "La Dactylographie pour les Nuls",
    description: "Félicitations ! Vous utilisez maintenant plus de doigts qu'un T-Rex !",
    cost: 50,
    unlocked: true,
    purchased: false,
    effect: (state: GameState): GameState => ({
      ...state,
      entriesPerClick: state.entriesPerClick * 1.5
    }),
    multiplier: 1
  },
  {
    id: "stats_unlock",
    name: "Tableau de Bord",
    description: "Débloque l'onglet des statistiques pour suivre votre progression",
    cost: 500,
    unlocked: true,
    purchased: false,
    effect: (state: GameState): GameState => state,
    multiplier: 1
  },
  {
    id: "coffee_basics",
    name: "Machine à Café Basique",
    description: "Le genre de café qui fait regretter l'eau du robinet. Mais hey, la caféine c'est la caféine !",
    cost: 100,
    unlocked: true,
    purchased: false,
    effect: (state: GameState): GameState => ({
      ...state,
      entriesPerClick: state.entriesPerClick * 1.25
    }),
    multiplier: 1
  },
  {
    id: "excel_basics",
    name: "Excel pour les Débutants",
    description: "CTRL+Z est votre nouveau meilleur ami. CTRL+ALT+SUPPR sera bientôt le second.",
    cost: 250,
    unlocked: false,
    purchased: false,
    requirement: {
      type: "clickCount",
      id: "click_count_100",
      count: 100
    },
    effect: (state: GameState): GameState => ({
      ...state,
      entriesPerClick: state.entriesPerClick * 1.75
    }),
    multiplier: 1
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
    effect: (state: GameState): GameState => ({
      ...state,
      collaborators: state.collaborators.map(g =>
        g.id === "intern_colleague" ? { ...g, baseOutput: g.baseOutput * 1.5 } : g
      )
    }),
    multiplier: 1
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
    effect: (state: GameState): GameState => ({
      ...state,
      collaborators: state.collaborators.map(g =>
        g.id === "basic_calculator" ? { ...g, baseOutput: g.baseOutput * 1.75 } : g
      )
    }),
    multiplier: 1
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
    effect: (state: GameState): GameState => ({
      ...state,
      collaborators: state.collaborators.map(g => ({
        ...g,
        baseOutput: g.baseOutput * 1.1
      }))
    }),
    multiplier: 1
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
    effect: (state: GameState): GameState => ({
      ...state,
      collaborators: state.collaborators.map(g => ({
        ...g,
        baseOutput: g.baseOutput * 1.15
      }))
    }),
    multiplier: 1
  },

  // MID-LATE GAME - Améliorations fun
  {
    id: "rubber_duck",
    name: "Canard en Plastique",
    description: "Il ne juge pas vos erreurs de calcul. C'est déjà ça.",
    cost: 10000,
    unlocked: false,
    purchased: false,
    requirement: {
      type: "totalEntries",
      id: "total_entries_20k",
      count: 20000
    },
    effect: (state: GameState): GameState => ({
      ...state,
      entriesPerClick: state.entriesPerClick * 2
    }),
    multiplier: 1
  },
  {
    id: "office_cat",
    name: "Chat Comptable",
    description: "S'assoit sur les documents importants et ronronne pendant les appels clients. Parfait !",
    cost: 25000,
    unlocked: false,
    purchased: false,
    requirement: {
      type: "totalEntries",
      id: "total_entries_50k",
      count: 50000
    },
    effect: (state: GameState): GameState => ({
      ...state,
      collaborators: state.collaborators.map(g => ({
        ...g,
        baseOutput: g.baseOutput * 1.25
      }))
    }),
    multiplier: 1
  },

  // LATE GAME - Améliorations avancées
  {
    id: "quantum_calculator",
    name: "Calculatrice Quantique",
    description: "Calcule dans plusieurs dimensions fiscales. Peut aussi ouvrir un portail vers les Enfers.",
    cost: 100000,
    unlocked: false,
    purchased: false,
    requirement: {
      type: "totalEntries",
      id: "total_entries_200k",
      count: 200000
    },
    effect: (state: GameState): GameState => ({
      ...state,
      collaborators: state.collaborators.map(g => ({
        ...g,
        baseOutput: g.baseOutput * 1.5
      }))
    }),
    multiplier: 1
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
    effect: (state: GameState): GameState => ({
      ...state,
      collaborators: state.collaborators.map(g => ({
        ...g,
        baseOutput: g.baseOutput * 2
      }))
    }),
    multiplier: 1
  },

  // COSMETIC - Améliorations visuelles
  {
    id: "rgb_keyboard",
    name: "Clavier RGB Gaming",
    description: "Parce que les vrais pros font leur compta avec des LEDs multicolores. SWAG !",
    cost: 15000,
    unlocked: false,
    purchased: false,
    requirement: {
      type: "clickCount",
      id: "click_count_5k",
      count: 5000
    },
    effect: (state: GameState): GameState => state,
    multiplier: 1
  },
  {
    id: "golden_calculator",
    name: "Calculatrice en Or",
    description: "Pour quand vous voulez flex sur les autres comptables. Totalement inutile, totalement indispensable.",
    cost: 50000,
    unlocked: false,
    purchased: false,
    requirement: {
      type: "totalEntries",
      id: "total_entries_100k",
      count: 100000
    },
    effect: (state: GameState): GameState => state,
    multiplier: 1
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
    effect: (state: GameState): GameState => ({
      ...state,
      combo: {
        ...state.combo,
        comboTimeWindow: state.combo.comboTimeWindow + 2000
      }
    }),
    multiplier: 1
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
      id: "click_count_2k",
      count: 2000
    },
    effect: (state: GameState): GameState => ({
      ...state,
      combo: {
        ...state.combo,
        maxMultiplier: state.combo.maxMultiplier + 1
      }
    }),
    multiplier: 1
  },

  // EASTER EGGS - Améliorations secrètes
  {
    id: "coffee_overflow",
    name: "Overdose de Café",
    description: "Vous vibrez tellement que vous traversez les dimensions. Les chiffres dansent devant vos yeux.",
    cost: 99999,
    unlocked: false,
    purchased: false,
    requirement: {
      type: "clickCount",
      id: "click_count_10k",
      count: 10000
    },
    effect: (state: GameState): GameState => ({
      ...state,
      entriesPerClick: state.entriesPerClick * 2
    }),
    multiplier: 1
  },
  {
    id: "comic_sans",
    name: "Police Comic Sans",
    description: "Le crime ultime contre l'humanité. Même les inspecteurs des impôts fuient en courant.",
    cost: 123456,
    unlocked: false,
    purchased: false,
    requirement: {
      type: "totalEntries",
      id: "total_entries_500k",
      count: 500000
    },
    effect: (state: GameState): GameState => ({
      ...state,
      collaborators: state.collaborators.map(g => ({
        ...g,
        baseOutput: g.baseOutput * 1.5
      }))
    }),
    multiplier: 1
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
    effect: (state: GameState): GameState => ({
      ...state,
      collaborators: state.collaborators.map(g => ({
        ...g,
        baseOutput: g.baseOutput * 2
      }))
    }),
    multiplier: 1
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
    effect: (state: GameState): GameState => ({
      ...state,
      collaborators: state.collaborators.map(g => ({
        ...g,
        baseOutput: g.baseOutput * 2.5
      })),
      prestige: {
        ...state.prestige,
        multiplier: state.prestige.multiplier * 1.05
      }
    }),
    multiplier: 1
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
    effect: (state: GameState): GameState => ({
      ...state,
      collaborators: state.collaborators.map(g => ({
        ...g,
        baseOutput: g.baseOutput * 2
      }))
    }),
    multiplier: 1
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
    effect: (state: GameState): GameState => ({
      ...state,
      collaborators: state.collaborators.map(g => ({
        ...g,
        baseOutput: g.baseOutput * 3
      }))
    }),
    multiplier: 1
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
    effect: (state: GameState): GameState => ({
      ...state,
      collaborators: state.collaborators.map(g => ({
        ...g,
        baseOutput: g.baseOutput * 2,
        effects: g.effects ? {
          ...g.effects,
          training: (g.effects.training || 0) + 0.1
        } : { training: 0.1 }
      }))
    }),
    multiplier: 1
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
    effect: (state: GameState): GameState => ({
      ...state,
      collaborators: state.collaborators.map(g => ({
        ...g,
        baseOutput: g.baseOutput * 2.5
      }))
    }),
    multiplier: 1
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
    effect: (state: GameState): GameState => ({
      ...state,
      collaborators: state.collaborators.map(g => ({
        ...g,
        baseOutput: g.baseOutput * 2.5
      }))
    }),
    multiplier: 1
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
    effect: (state: GameState): GameState => ({
      ...state,
      collaborators: state.collaborators.map(g => ({
        ...g,
        baseOutput: g.baseOutput * 1.1
      }))
    }),
    multiplier: 1
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
    effect: (state: GameState): GameState => ({
      ...state,
      collaborators: state.collaborators.map(g => ({
        ...g,
        baseOutput: g.baseOutput * 1.25
      }))
    }),
    multiplier: 1
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
    effect: (state: GameState): GameState => ({
      ...state,
      collaborators: state.collaborators.map(g => ({
        ...g,
        baseOutput: g.baseOutput * 1.5
      }))
    }),
    multiplier: 1
  },

  // COMBO IMPROVEMENTS
  {
    id: "combo_tier_1",
    name: "Combo Débutant",
    description: "Débloque le premier palier de combo (x2 à 10 clics)",
    cost: 1000,
    unlocked: true,
    purchased: false,
    effect: (state: GameState): GameState => ({
      ...state,
      combo: {
        ...state.combo,
        comboTimeWindow: 3000,
        tiers: [...state.combo.tiers, { clickThreshold: 10, multiplier: 2 }]
      }
    }),
    multiplier: 1
  },
  {
    id: "combo_tier_2",
    name: "Combo Intermédiaire",
    description: "Débloque le deuxième palier de combo (x3 à 25 clics)",
    cost: 5000,
    unlocked: false,
    purchased: false,
    requirement: {
      type: "clickCount",
      id: "click_count_500",
      count: 500
    },
    effect: (state: GameState): GameState => ({
      ...state,
      combo: {
        ...state.combo,
        tiers: [...state.combo.tiers, { clickThreshold: 25, multiplier: 3 }]
      }
    }),
    multiplier: 1
  },
  {
    id: "combo_tier_3",
    name: "Combo Expert",
    description: "Débloque le troisième palier de combo (x5 à 50 clics)",
    cost: 15000,
    unlocked: false,
    purchased: false,
    requirement: {
      type: "clickCount",
      id: "click_count_1000",
      count: 1000
    },
    effect: (state: GameState): GameState => ({
      ...state,
      combo: {
        ...state.combo,
        tiers: [...state.combo.tiers, { clickThreshold: 50, multiplier: 5 }]
      }
    }),
    multiplier: 1
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
    effect: (state: GameState): GameState => ({
      ...state,
      collaborators: state.collaborators.map(g => ({
        ...g,
        baseOutput: g.baseOutput * 1.3
      }))
    }),
    multiplier: 1
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
    effect: (state: GameState): GameState => ({
      ...state,
      collaborators: state.collaborators.map(g => ({
        ...g,
        baseOutput: g.baseOutput * 1.4
      }))
    }),
    multiplier: 1
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
    effect: (state: GameState): GameState => ({
      ...state,
      prestige: {
        ...state.prestige,
        multiplier: state.prestige.multiplier * 1.2
      }
    }),
    multiplier: 1
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
    effect: (state: GameState): GameState => ({
      ...state,
      prestige: {
        ...state.prestige,
        multiplier: state.prestige.multiplier * 1.5
      }
    }),
    multiplier: 1
  },
  {
    id: "ebp_crash",
    name: "Crash EBP Quotidien",
    description: "CTRL+S est devenu un tic nerveux. Vous sauvegardez même vos conversations WhatsApp.",
    cost: 25000,
    unlocked: false,
    purchased: false,
    requirement: {
      type: "totalEntries",
      id: "total_entries_50k",
      count: 50000
    },
    effect: (state: GameState): GameState => ({
      ...state,
      collaborators: state.collaborators.map(g => ({
        ...g,
        baseOutput: g.baseOutput * 1.5
      }))
    }),
    multiplier: 1,
    comptableClickerFeature: {
      title: "Crash EBP",
      description: "Votre F5 a des ampoules.",
      shown: false
    }
  },
  {
    id: "sage_update",
    name: "Mise à Jour Sage Surprise",
    description: "Comme un jeu de piste, mais avec vos boutons favoris. Où est passé le menu 'Validation' ?!",
    cost: 50000,
    unlocked: false,
    purchased: false,
    requirement: {
      type: "totalEntries",
      id: "total_entries_100k",
      count: 100000
    },
    effect: (state: GameState): GameState => ({
      ...state,
      collaborators: state.collaborators.map(g => ({
        ...g,
        baseOutput: g.baseOutput * 1.75
      }))
    }),
    multiplier: 1,
    comptableClickerFeature: {
      title: "Mise à Jour Surprise",
      description: "C'est comme un escape game, mais avec votre logiciel comptable !",
      shown: false
    }
  },
  {
    id: "ciel_compta_bug",
    name: "Bug Mystérieux Ciel",
    description: "Le fameux bug 'Impossible de se connecter au serveur' de Ciel vous a appris la patience. Production +100%",
    cost: 75000,
    unlocked: false,
    purchased: false,
    requirement: {
      type: "totalEntries",
      id: "total_entries_150k",
      count: 150000
    },
    effect: (state: GameState): GameState => ({
      ...state,
      collaborators: state.collaborators.map(g => ({
        ...g,
        baseOutput: g.baseOutput * 2
      }))
    }),
    multiplier: 1,
    comptableClickerFeature: {
      title: "Bug Mystérieux",
      description: "La connexion reviendra... un jour...",
      shown: false
    }
  }
];

export const initialAchievements: Achievement[] = [
  {
    id: "first_entry",
    name: "Plan Comptable Général",
    description: "Première écriture réussie ! La prochaine fois, essayez de ne pas confondre débit et crédit.",
    unlocked: false,
    hidden: false,
    condition: (state) => state.totalEntries >= 1,
  },
  {
    id: "digital_pioneer",
    name: "Balance de Génie",
    description: "100 écritures ! Votre grand-livre est plus équilibré que votre vie personnelle.",
    unlocked: false,
    hidden: false,
    condition: (state) => state.totalEntries >= 100,
  },
  {
    id: "automation_master",
    name: "Expert-Comptable en Herbe",
    description: "Tous les générateurs débloqués ! Même l'Ordre des Experts-Comptables est impressionné.",
    unlocked: false,
    hidden: false,
    condition: (state) => state.collaborators?.every(g => g.count > 0) || false,
  },
  {
    id: "efficiency_expert",
    name: "Roi de la TVA",
    description: "1000 écritures par seconde ! Bercy vous surveille avec inquiétude.",
    unlocked: false,
    hidden: false,
    condition: (state) => state.entriesPerSecond >= 1000,
  },
  {
    id: "digital_revolution",
    name: "Maître du Bilan",
    description: "1 million d'écritures ! Votre FEC est plus long que le code des impôts.",
    unlocked: false,
    hidden: false,
    condition: (state) => state.totalEntries >= 1000000,
  },
  {
    id: "tax_season_survivor",
    name: "Survivant de la Liasse Fiscale",
    description: "Vous avez survécu à la période fiscale ! Votre CERFA préféré est le 2058-A, avouez-le.",
    unlocked: false,
    hidden: true,
    condition: (state) => state.clickCount >= 10000,
  },
  {
    id: "calculator_master",
    name: "Virtuose du Pavé Numérique",
    description: "Vos doigts sont si rapides que même la DGFiP n'arrive pas à suivre.",
    unlocked: false,
    hidden: true,
    condition: (state) => state.clickCount >= 100,
  },
  {
    id: "audit_ready",
    name: "Contrôle URSSAF Ready",
    description: "10 millions d'écritures sans erreur. Même les inspecteurs demandent des autographes !",
    unlocked: false,
    hidden: true,
    condition: (state) => state.totalEntries >= 10000000,
  },
  {
    id: "prestige_master",
    name: "Associé du Cabinet",
    description: "Premier prestige accompli ! Vous pouvez maintenant porter des boutons de manchette.",
    unlocked: false,
    hidden: true,
    condition: (state) => state.prestige.points > 0,
  },
  {
    id: "famous_friend",
    name: "Maître des Légendes",
    description: "Toutes les Légendes de la Compta débloquées. Même Chuck Norris fait appel à vous pour sa déclaration d'impôts !",
    unlocked: false,
    hidden: true,
    condition: (state) => state.famousAccountants?.every(a => a.unlocked) || false,
  },
  {
    id: "minigame_champion",
    name: "As du Grand Livre",
    description: "Tous les mini-jeux complétés. Le Plan Comptable n'a plus de secrets pour vous !",
    unlocked: false,
    hidden: true,
    condition: (state) => state.miniGames?.every(m => m.completed) || false,
  },
  {
    id: "software_survivor",
    name: "Dompteur de Logiciels",
    description: "Tous les bugs logiciels maîtrisés. Même le support technique vous demande conseil !",
    unlocked: false,
    hidden: true,
    condition: (state) => state.upgrades.filter(u => 
      ["ebp_crash", "sage_update", "ciel_compta_bug"].includes(u.id)
    ).every(u => u.purchased),
  },
  {
    id: "zen_master",
    name: "Maître du Calme",
    description: "Votre sérénité face aux bugs fait de vous le Bouddha de la compta.",
    unlocked: false,
    hidden: true,
    condition: (state) => state.upgrades.find(u => u.id === "ebp_crash")?.purchased === true && state.clickCount >= 10000,
  },
];

export const fiscalSeasons: FiscalSeason[] = [
  {
    id: "declarations",
    name: "Saison des Déclarations",
    description: "La période la plus chargée de l'année : TVA, charges sociales, tout s'enchaîne !",
    active: true,
    objectives: [],
    specializations: [],
    multiplier: 1.2,
    duration: 604800,
    timeLeft: 0
  },
  {
    id: "bilans",
    name: "Saison des Bilans",
    description: "L'heure des clôtures annuelles a sonné. Les dossiers s'empilent sur les bureaux !",
    active: false,
    objectives: [],
    specializations: [],
    multiplier: 1.5,
    duration: 604800,
    timeLeft: 0
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

export const comboTiers = [
  { clickThreshold: 10, multiplier: 1.5 },
  { clickThreshold: 25, multiplier: 2.5 },
  { clickThreshold: 50, multiplier: 4 },
  { clickThreshold: 100, multiplier: 7 }
];

export const initialGameState: GameState = {
  entries: 0,
  totalEntries: 0,
  entriesPerSecond: 0,
  entriesPerClick: playerProgression.baseClickValue,
  autoClickRate: 0,
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
    cost: 1e6,
    totalResets: 0,
    upgrades: [],
    specializations: [],
    objectives: [],
    currentSeason: fiscalSeasons[0]!
  },
  famousAccountants: famousAccountants,
  combo: {
    active: false,
    clicksInCombo: 0,
    multiplier: 1,
    lastClickTime: 0,
    maxMultiplier: 10,
    comboTimeWindow: 0,
    baseMultiplier: 1.2,
    speedBonus: 1,
    currentTier: -1,
    degradationRate: 0.2,
    degradationInterval: 500,
    lastDegradationTime: 0,
    tiers: []
  },
  activePowerUps: [],
  features: Object.fromEntries(
    Object.values(initialFeaturesState).map(feature => [feature.id, feature])
  ),
  cabinetUnlocked: false,
  miniGames: miniGames,
  upgradesTabUnlocked: false,
  statsTabUnlocked: false,
  achievementsTabUnlocked: false,
  prestigeTabUnlocked: false
};
