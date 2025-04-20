import { Upgrade, GameState } from "@/types/game";

type GeneratorUpgrades = {
  [key: string]: Upgrade[];
};

export const generatorUpgrades: GeneratorUpgrades = {
  // STAGIAIRE
  "intern_colleague": [
    {
      id: "intern_desk",
      name: "Bureau Dédié",
      description: "Un vrai bureau pour le stagiaire. Production +50%",
      cost: 100,
      unlocked: false,
      purchased: false,
      requirement: {
        type: "generator",
        id: "intern_colleague",
        count: 2
      },
      effect: (state: GameState) => ({
        ...state,
        generators: state.generators.map(g =>
          g.id === "intern_colleague" ? { ...g, baseOutput: g.baseOutput * 1.5 } : g
        )
      })
    },
    {
      id: "intern_training",
      name: "Formation Initiale",
      description: "Une formation complète pour le stagiaire. Production +75%",
      cost: 250,
      unlocked: false,
      purchased: false,
      requirement: {
        type: "generator",
        id: "intern_colleague",
        count: 5
      },
      effect: (state: GameState) => ({
        ...state,
        generators: state.generators.map(g =>
          g.id === "intern_colleague" ? { ...g, baseOutput: g.baseOutput * 1.75 } : g
        )
      })
    },
    {
      id: "intern_motivation",
      name: "Stage Gratifié",
      description: "Un stagiaire motivé est un stagiaire productif ! Production +100%",
      cost: 500,
      unlocked: false,
      purchased: false,
      requirement: {
        type: "generator",
        id: "intern_colleague",
        count: 10
      },
      effect: (state: GameState) => ({
        ...state,
        generators: state.generators.map(g =>
          g.id === "intern_colleague" ? { ...g, baseOutput: g.baseOutput * 2 } : g
        )
      })
    },
    {
      id: "intern_computer",
      name: "Ordinateur Performant",
      description: "Fini le PC qui rame ! Production +125%",
      cost: 1000,
      unlocked: false,
      purchased: false,
      requirement: {
        type: "generator",
        id: "intern_colleague",
        count: 15
      },
      effect: (state: GameState) => ({
        ...state,
        generators: state.generators.map(g =>
          g.id === "intern_colleague" ? { ...g, baseOutput: g.baseOutput * 2.25 } : g
        )
      })
    },
    {
      id: "intern_mentor",
      name: "Programme de Mentorat",
      description: "Un suivi personnalisé. Production +150% et bonus de formation +5%",
      cost: 2000,
      unlocked: false,
      purchased: false,
      requirement: {
        type: "generator",
        id: "intern_colleague",
        count: 25
      },
      effect: (state: GameState) => ({
        ...state,
        generators: state.generators.map(g =>
          g.id === "intern_colleague" ? {
            ...g,
            baseOutput: g.baseOutput * 2.5,
            effects: { ...g.effects, training: (g.effects?.training || 0) + 0.05 }
          } : g
        )
      })
    }
  ],

  // ASSISTANT ADMINISTRATIF
  "basic_calculator": [
    {
      id: "admin_software",
      name: "Logiciel de Gestion",
      description: "Un vrai logiciel professionnel. Production +50%",
      cost: 300,
      unlocked: false,
      purchased: false,
      requirement: {
        type: "generator",
        id: "basic_calculator",
        count: 2
      },
      effect: (state: GameState) => ({
        ...state,
        generators: state.generators.map(g =>
          g.id === "basic_calculator" ? { ...g, baseOutput: g.baseOutput * 1.5 } : g
        )
      })
    },
    {
      id: "admin_organization",
      name: "Formation Organisation",
      description: "Méthodes d'organisation efficaces. Production +75%",
      cost: 750,
      unlocked: false,
      purchased: false,
      requirement: {
        type: "generator",
        id: "basic_calculator",
        count: 5
      },
      effect: (state: GameState) => ({
        ...state,
        generators: state.generators.map(g =>
          g.id === "basic_calculator" ? { ...g, baseOutput: g.baseOutput * 1.75 } : g
        )
      })
    },
    {
      id: "admin_scanner",
      name: "Scanner Haute Vitesse",
      description: "Numérisez plus vite que votre ombre ! Production +100%",
      cost: 1500,
      unlocked: false,
      purchased: false,
      requirement: {
        type: "generator",
        id: "basic_calculator",
        count: 10
      },
      effect: (state: GameState) => ({
        ...state,
        generators: state.generators.map(g =>
          g.id === "basic_calculator" ? { ...g, baseOutput: g.baseOutput * 2 } : g
        )
      })
    },
    {
      id: "admin_dual_screen",
      name: "Double Écran",
      description: "Le luxe du multitâche. Production +125%",
      cost: 3000,
      unlocked: false,
      purchased: false,
      requirement: {
        type: "generator",
        id: "basic_calculator",
        count: 15
      },
      effect: (state: GameState) => ({
        ...state,
        generators: state.generators.map(g =>
          g.id === "basic_calculator" ? { ...g, baseOutput: g.baseOutput * 2.25 } : g
        )
      })
    },
    {
      id: "admin_certification",
      name: "Certification Administrative",
      description: "Une expertise reconnue. Production +150%",
      cost: 6000,
      unlocked: false,
      purchased: false,
      requirement: {
        type: "generator",
        id: "basic_calculator",
        count: 25
      },
      effect: (state: GameState) => ({
        ...state,
        generators: state.generators.map(g =>
          g.id === "basic_calculator" ? { ...g, baseOutput: g.baseOutput * 2.5 } : g
        )
      })
    }
  ],

  // COMPTABLE DÉBUTANT
  "excel_sheets": [
    {
      id: "excel_shortcuts",
      name: "Raccourcis Excel",
      description: "La vitesse des pros. Production +50%",
      cost: 2000,
      unlocked: false,
      purchased: false,
      requirement: {
        type: "generator",
        id: "excel_sheets",
        count: 2
      },
      effect: (state: GameState) => ({
        ...state,
        generators: state.generators.map(g =>
          g.id === "excel_sheets" ? { ...g, baseOutput: g.baseOutput * 1.5 } : g
        )
      })
    },
    {
      id: "excel_macros",
      name: "Macros Basiques",
      description: "L'automatisation pour débutants. Production +75%",
      cost: 5000,
      unlocked: false,
      purchased: false,
      requirement: {
        type: "generator",
        id: "excel_sheets",
        count: 5
      },
      effect: (state: GameState) => ({
        ...state,
        generators: state.generators.map(g =>
          g.id === "excel_sheets" ? { ...g, baseOutput: g.baseOutput * 1.75 } : g
        )
      })
    },
    {
      id: "excel_pivot",
      name: "Tableaux Croisés Dynamiques",
      description: "La puissance de l'analyse. Production +100%",
      cost: 10000,
      unlocked: false,
      purchased: false,
      requirement: {
        type: "generator",
        id: "excel_sheets",
        count: 10
      },
      effect: (state: GameState) => ({
        ...state,
        generators: state.generators.map(g =>
          g.id === "excel_sheets" ? { ...g, baseOutput: g.baseOutput * 2 } : g
        )
      })
    },
    {
      id: "excel_templates",
      name: "Templates Personnalisés",
      description: "Des modèles sur mesure. Production +125%",
      cost: 20000,
      unlocked: false,
      purchased: false,
      requirement: {
        type: "generator",
        id: "excel_sheets",
        count: 15
      },
      effect: (state: GameState) => ({
        ...state,
        generators: state.generators.map(g =>
          g.id === "excel_sheets" ? { ...g, baseOutput: g.baseOutput * 2.25 } : g
        )
      })
    },
    {
      id: "excel_master",
      name: "Maîtrise Excel",
      description: "Un vrai ninja Excel. Production +150% et bonus global +2%",
      cost: 40000,
      unlocked: false,
      purchased: false,
      requirement: {
        type: "generator",
        id: "excel_sheets",
        count: 25
      },
      effect: (state: GameState) => ({
        ...state,
        generators: state.generators.map(g =>
          g.id === "excel_sheets" ? { ...g, baseOutput: g.baseOutput * 2.5 } : g
        ),
        prestige: {
          ...state.prestige,
          multiplier: state.prestige.multiplier * 1.02
        }
      })
    }
  ],

  // COMPTABLE CONFIRMÉ
  "accounting_software": [
    {
      id: "software_training",
      name: "Formation Logiciel",
      description: "Maîtrise des fonctionnalités avancées. Production +50%",
      cost: 8000,
      unlocked: false,
      purchased: false,
      requirement: {
        type: "generator",
        id: "accounting_software",
        count: 2
      },
      effect: (state: GameState) => ({
        ...state,
        generators: state.generators.map(g =>
          g.id === "accounting_software" ? { ...g, baseOutput: g.baseOutput * 1.5 } : g
        )
      })
    },
    {
      id: "software_plugins",
      name: "Plugins Spécialisés",
      description: "Des extensions sur mesure. Production +75%",
      cost: 15000,
      unlocked: false,
      purchased: false,
      requirement: {
        type: "generator",
        id: "accounting_software",
        count: 5
      },
      effect: (state: GameState) => ({
        ...state,
        generators: state.generators.map(g =>
          g.id === "accounting_software" ? { ...g, baseOutput: g.baseOutput * 1.75 } : g
        )
      })
    },
    {
      id: "software_automation",
      name: "Automatisation Avancée",
      description: "Des workflows optimisés. Production +100%",
      cost: 30000,
      unlocked: false,
      purchased: false,
      requirement: {
        type: "generator",
        id: "accounting_software",
        count: 10
      },
      effect: (state: GameState) => ({
        ...state,
        generators: state.generators.map(g =>
          g.id === "accounting_software" ? { ...g, baseOutput: g.baseOutput * 2 } : g
        )
      })
    },
    {
      id: "software_api",
      name: "Intégration API",
      description: "Connexion avec tous vos outils. Production +125%",
      cost: 60000,
      unlocked: false,
      purchased: false,
      requirement: {
        type: "generator",
        id: "accounting_software",
        count: 15
      },
      effect: (state: GameState) => ({
        ...state,
        generators: state.generators.map(g =>
          g.id === "accounting_software" ? { ...g, baseOutput: g.baseOutput * 2.25 } : g
        )
      })
    },
    {
      id: "software_expert",
      name: "Expert Logiciel",
      description: "Une maîtrise totale. Production +150% et bonus global +3%",
      cost: 120000,
      unlocked: false,
      purchased: false,
      requirement: {
        type: "generator",
        id: "accounting_software",
        count: 25
      },
      effect: (state: GameState) => ({
        ...state,
        generators: state.generators.map(g =>
          g.id === "accounting_software" ? { ...g, baseOutput: g.baseOutput * 2.5 } : g
        ),
        prestige: {
          ...state.prestige,
          multiplier: state.prestige.multiplier * 1.03
        }
      })
    }
  ],

  // CHEF COMPTABLE
  "junior_accountant": [
    {
      id: "team_management",
      name: "Gestion d'Équipe",
      description: "Des compétences de leader. Production +50%",
      cost: 25000,
      unlocked: false,
      purchased: false,
      requirement: {
        type: "generator",
        id: "junior_accountant",
        count: 2
      },
      effect: (state: GameState) => ({
        ...state,
        generators: state.generators.map(g =>
          g.id === "junior_accountant" ? { ...g, baseOutput: g.baseOutput * 1.5 } : g
        )
      })
    },
    {
      id: "process_optimization",
      name: "Optimisation des Process",
      description: "Des méthodes de travail efficaces. Production +75%",
      cost: 50000,
      unlocked: false,
      purchased: false,
      requirement: {
        type: "generator",
        id: "junior_accountant",
        count: 5
      },
      effect: (state: GameState) => ({
        ...state,
        generators: state.generators.map(g =>
          g.id === "junior_accountant" ? { ...g, baseOutput: g.baseOutput * 1.75 } : g
        )
      })
    },
    {
      id: "team_training",
      name: "Formation d'Équipe",
      description: "Des formations régulières. Production +100% et bonus de formation +5%",
      cost: 100000,
      unlocked: false,
      purchased: false,
      requirement: {
        type: "generator",
        id: "junior_accountant",
        count: 10
      },
      effect: (state: GameState) => ({
        ...state,
        generators: state.generators.map(g =>
          g.id === "junior_accountant" ? {
            ...g,
            baseOutput: g.baseOutput * 2,
            effects: { ...g.effects, training: (g.effects?.training || 0) + 0.05 }
          } : g
        )
      })
    },
    {
      id: "quality_control",
      name: "Contrôle Qualité",
      description: "Des processus de vérification efficaces. Production +125%",
      cost: 200000,
      unlocked: false,
      purchased: false,
      requirement: {
        type: "generator",
        id: "junior_accountant",
        count: 15
      },
      effect: (state: GameState) => ({
        ...state,
        generators: state.generators.map(g =>
          g.id === "junior_accountant" ? { ...g, baseOutput: g.baseOutput * 2.25 } : g
        )
      })
    },
    {
      id: "leadership_master",
      name: "Leadership Avancé",
      description: "Un vrai leader inspirant. Production +150% et bonus global +5%",
      cost: 400000,
      unlocked: false,
      purchased: false,
      requirement: {
        type: "generator",
        id: "junior_accountant",
        count: 25
      },
      effect: (state: GameState) => ({
        ...state,
        generators: state.generators.map(g =>
          g.id === "junior_accountant" ? { ...g, baseOutput: g.baseOutput * 2.5 } : g
        ),
        prestige: {
          ...state.prestige,
          multiplier: state.prestige.multiplier * 1.05
        }
      })
    }
  ]
}; 