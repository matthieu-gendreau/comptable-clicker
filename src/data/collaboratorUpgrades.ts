import { Upgrade, GameState } from "@/types/game";

type CollaboratorUpgrades = {
  [key: string]: Upgrade[];
};

export const collaboratorUpgrades: CollaboratorUpgrades = {
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
        type: "collaborator",
        id: "intern_colleague",
        count: 2
      },
      effect: (state: GameState) => ({
        ...state,
        collaborators: state.collaborators.map(g =>
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
        type: "collaborator",
        id: "intern_colleague",
        count: 5
      },
      effect: (state: GameState) => ({
        ...state,
        collaborators: state.collaborators.map(g =>
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
        type: "collaborator",
        id: "intern_colleague",
        count: 10
      },
      effect: (state: GameState) => ({
        ...state,
        collaborators: state.collaborators.map(g =>
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
        type: "collaborator",
        id: "intern_colleague",
        count: 15
      },
      effect: (state: GameState) => ({
        ...state,
        collaborators: state.collaborators.map(g =>
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
        type: "collaborator",
        id: "intern_colleague",
        count: 25
      },
      effect: (state: GameState) => ({
        ...state,
        collaborators: state.collaborators.map(g =>
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
        type: "collaborator",
        id: "basic_calculator",
        count: 2
      },
      effect: (state: GameState) => ({
        ...state,
        collaborators: state.collaborators.map(g =>
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
        type: "collaborator",
        id: "basic_calculator",
        count: 5
      },
      effect: (state: GameState) => ({
        ...state,
        collaborators: state.collaborators.map(g =>
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
        type: "collaborator",
        id: "basic_calculator",
        count: 10
      },
      effect: (state: GameState) => ({
        ...state,
        collaborators: state.collaborators.map(g =>
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
        type: "collaborator",
        id: "basic_calculator",
        count: 15
      },
      effect: (state: GameState) => ({
        ...state,
        collaborators: state.collaborators.map(g =>
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
        type: "collaborator",
        id: "basic_calculator",
        count: 25
      },
      effect: (state: GameState) => ({
        ...state,
        collaborators: state.collaborators.map(g =>
          g.id === "basic_calculator" ? { ...g, baseOutput: g.baseOutput * 2.5 } : g
        )
      })
    }
  ]
}; 