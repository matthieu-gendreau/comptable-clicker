import { describe, it, expect, beforeEach, vi } from 'vitest';
import { gameReducer, calculateEntriesPerSecond } from '../reducers/gameReducer';
import { calculateCollaboratorCost } from '../reducers/calculations/collaboratorCalculations';
import { initialGameState } from '../data/gameInitialState';
import type { GameState, FiscalSpecialization, Upgrade, GameCollaborator, Achievement, MiniGame } from '../types/game';

describe('Gameplay Mechanics', () => {
  let state: GameState;
  const now = Date.now();

  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(now);
    
    // Reset state before each test
    state = {
      entries: 0,
      totalEntries: 0,
      entriesPerClick: 1,
      entriesPerSecond: 0,
      clickCount: 0,
      debugMode: false,
      cabinetUnlocked: false,
      gameStartedAt: Date.now(),
      lastSavedAt: Date.now(),
      lastTickAt: Date.now(),
      collaborators: [],
      upgrades: [
        {
          id: "stats_unlock",
          name: "Tableau de Bord",
          description: "Débloque l'onglet des statistiques pour suivre votre progression",
          cost: 100,
          unlocked: true,
          purchased: false,
          effect: (state: GameState): GameState => state,
          multiplier: 1
        }
      ],
      achievements: [],
      miniGames: [],
      famousAccountants: [],
      combo: {
        active: false,
        clicksInCombo: 0,
        multiplier: 1,
        lastClickTime: 0,
        maxMultiplier: 10,
        comboTimeWindow: 3000,
        baseMultiplier: 1.2,
        speedBonus: 1,
        currentTier: -1,
        degradationRate: 0.2,
        degradationInterval: 500,
        lastDegradationTime: 0,
        tiers: []
      },
      activePowerUps: [],
      features: {},
      prestige: {
        points: 0,
        multiplier: 1,
        cost: 1e6,
        totalResets: 0,
        upgrades: [],
        specializations: [],
        objectives: [],
        currentSeason: {
          id: "declarations",
          name: "Saison des Déclarations",
          description: "",
          active: true,
          objectives: [],
          specializations: [],
          multiplier: 1.2,
          duration: 604800,
          timeLeft: 0
        }
      },
      upgradesTabUnlocked: false,
      statsTabUnlocked: false,
      achievementsTabUnlocked: false,
      prestigeTabUnlocked: false
    };
  });

  describe('Basic Click Mechanics', () => {
    it('should increment entries on click', () => {
      const newState = gameReducer(state, { type: 'CLICK' });
      expect(newState.entries).toBe(state.entriesPerClick);
      expect(newState.totalEntries).toBe(state.entriesPerClick);
      expect(newState.clickCount).toBe(1);
    });

    it('should apply click multiplier from specializations', () => {
      state.entriesPerClick = 2;
      state.prestige.specializations = [{
        id: 'test_spec',
        type: 'click',
        multiplier: 2,
        purchased: true,
        name: 'Test',
        description: 'Test',
        cost: 100
      } as FiscalSpecialization];
      
      const newState = gameReducer(state, { type: 'CLICK' });
      expect(newState.entries).toBe(4); // 2 (base) * 2 (multiplier)
    });

    it('should handle debug mode multiplier correctly', () => {
      state.debugMode = true;
      state.entriesPerClick = 2;
      
      const newState = gameReducer(state, { type: 'CLICK' });
      expect(newState.entries).toBe(2000); // 2 * DEBUG_MULTIPLIER (1000)
    });
  });

  describe('Combo System', () => {
    it('should activate combo on consecutive clicks within time window', () => {
      const firstClick = gameReducer(state, { type: 'CLICK' });
      const secondClick = gameReducer(firstClick, { type: 'CLICK' });
      
      expect(secondClick.combo.active).toBe(true);
      expect(secondClick.combo.multiplier).toBeGreaterThan(1);
      expect(secondClick.combo.clicksInCombo).toBe(2);
    });

    it('should reset combo when time window expires', () => {
      const firstClick = gameReducer(state, { type: 'CLICK' });
      
      // Simulate time passing
      vi.advanceTimersByTime(4000);
      
      const secondClick = gameReducer(firstClick, { type: 'CLICK' });
      expect(secondClick.combo.multiplier).toBe(1);
      expect(secondClick.combo.clicksInCombo).toBe(1);
    });

    it('should not exceed max combo multiplier', () => {
      let currentState = state;
      // Perform multiple clicks
      for (let i = 0; i < 20; i++) {
        currentState = gameReducer(currentState, { type: 'CLICK' });
      }
      
      expect(currentState.combo.multiplier).toBeLessThanOrEqual(currentState.combo.maxMultiplier);
    });
  });

  describe('Collaborator System', () => {
    it('should calculate collaborator cost correctly', () => {
      const baseCost = 10;
      const count = 5;
      const cost = calculateCollaboratorCost(baseCost, count);
      expect(cost).toBeGreaterThan(baseCost);
    });

    it('should buy collaborator when enough entries', () => {
      const collaborator: GameCollaborator = {
        id: 'test_collaborator',
        name: 'Test',
        description: 'Test',
        baseCost: 10,
        baseOutput: 1,
        count: 0,
        unlocked: true
      };
      
      state.collaborators = [collaborator];
      state.entries = 20;
      
      const newState = gameReducer(state, { 
        type: 'BUY_COLLABORATOR',
        id: 'test_collaborator'
      });
      
      const boughtCollaborator = newState.collaborators[0];
      expect(boughtCollaborator).toBeDefined();
      expect(boughtCollaborator?.count).toBe(1);
      expect(newState.entries).toBeLessThan(20);
    });

    it('should calculate entries per second correctly', () => {
      const collaborator: GameCollaborator = {
        id: 'test_collaborator',
        name: 'Test',
        description: 'Test',
        baseCost: 10,
        baseOutput: 2,
        count: 3,
        unlocked: true
      };
      
      state.collaborators = [collaborator];
      const eps = calculateEntriesPerSecond(state);
      expect(eps).toBe(6); // 2 (baseOutput) * 3 (count)
    });

    it('should unlock next collaborator after first purchase', () => {
      const collaborators: GameCollaborator[] = [
        {
          id: 'first',
          name: 'First',
          description: 'First',
          baseCost: 10,
          baseOutput: 1,
          count: 0,
          unlocked: true
        },
        {
          id: 'second',
          name: 'Second',
          description: 'Second',
          baseCost: 100,
          baseOutput: 5,
          count: 0,
          unlocked: false
        }
      ];
      
      state.collaborators = collaborators;
      state.entries = 20;
      
      const newState = gameReducer(state, {
        type: 'BUY_COLLABORATOR',
        id: 'first'
      });
      
      const nextCollaborator = newState.collaborators[1];
      expect(nextCollaborator).toBeDefined();
      expect(nextCollaborator?.unlocked).toBe(true);
    });
  });

  describe('Prestige System', () => {
    it('should not allow prestige without meeting cost requirement', () => {
      state.entries = 100;
      state.prestige.cost = 1e6;
      
      const newState = gameReducer(state, { type: 'PRESTIGE' });
      expect(newState).toEqual(state);
    });

    it('should reset game state but keep prestige upgrades on prestige', () => {
      state.entries = 1e6;
      state.prestige.upgrades = [{
        id: 'test_prestige_upgrade',
        name: 'Test Prestige',
        description: 'Test',
        cost: 1,
        purchased: true,
        unlocked: true,
        effect: (state: GameState) => ({
          ...state,
          prestige: {
            ...state.prestige,
            multiplier: state.prestige.multiplier * 2
          }
        })
      } as Upgrade];

      const newState = gameReducer(state, { type: 'PRESTIGE' });
      expect(newState.entries).toBe(0);
      expect(newState.totalEntries).toBe(0);
      expect(newState.prestige.multiplier).toBeGreaterThan(1);
      expect(newState.prestige.totalResets).toBe(1);
      expect(newState.prestige.upgrades).toEqual(state.prestige.upgrades);
    });

    it('should calculate prestige points correctly', () => {
      state.entries = 1e9; // 1 billion
      state.prestige.cost = 1e6; // 1 million
      
      const newState = gameReducer(state, { type: 'PRESTIGE' });
      expect(newState.prestige.points).toBeGreaterThan(0);
    });
  });

  describe('Game Tick System', () => {
    it('should accumulate entries over time based on collaborators', () => {
      state.collaborators = [{
        id: 'test',
        name: 'Test',
        description: 'Test',
        baseCost: 10,
        baseOutput: 1,
        count: 2,
        unlocked: true
      }];
      
      const deltaTime = 1000; // 1 second
      vi.advanceTimersByTime(deltaTime);
      
      const newState = gameReducer(state, { 
        type: 'TICK',
        timestamp: now + deltaTime
      });
      
      expect(newState.entries).toBe(2); // 1 (baseOutput) * 2 (count) * 1 (second)
    });

    it('should handle debug mode multiplier in tick calculation', () => {
      state.debugMode = true;
      state.collaborators = [{
        id: 'test',
        name: 'Test',
        description: 'Test',
        baseCost: 10,
        baseOutput: 1,
        count: 1,
        unlocked: true
      }];
      
      const deltaTime = 1000;
      vi.advanceTimersByTime(deltaTime);
      
      const newState = gameReducer(state, {
        type: 'TICK',
        timestamp: now + deltaTime
      });
      
      expect(newState.entries).toBe(1000); // 1 * DEBUG_MULTIPLIER (1000)
    });
  });

  describe('Achievement System', () => {
    it('should unlock achievements when conditions are met', () => {
      state.achievements = [{
        id: 'test_achievement',
        name: 'Test Achievement',
        description: 'Test',
        condition: (state: GameState) => state.clickCount >= 1,
        unlocked: false,
        hidden: false
      } as Achievement];
      
      const newState = gameReducer(state, { type: 'CLICK' });
      const clickAchievement = newState.achievements[0];
      expect(clickAchievement).toBeDefined();
      expect(clickAchievement?.unlocked).toBe(true);
    });

    it('should keep achievements unlocked after prestige', () => {
      state.entries = 1e6;
      state.achievements = [{
        id: 'test_achievement',
        name: 'Test Achievement',
        description: 'Test',
        condition: () => true,
        unlocked: true,
        hidden: false
      } as Achievement];
      
      const newState = gameReducer(state, { type: 'PRESTIGE' });
      const prestigeAchievement = newState.achievements[0];
      expect(prestigeAchievement).toBeDefined();
      expect(prestigeAchievement?.unlocked).toBe(true);
    });
  });

  describe('Mini-Game System', () => {
    it('should apply mini-game rewards correctly', () => {
      const miniGame: MiniGame = {
        id: 'test_game',
        name: 'Test Game',
        description: 'Test',
        unlocked: true,
        completed: false,
        active: false,
        timeLeft: 0,
        reward: {
          type: 'multiplier' as const,
          value: 2
        }
      };
      
      state.miniGames = [miniGame];
      state.entriesPerClick = 1;
      
      const newState = gameReducer(state, {
        type: 'COMPLETE_MINIGAME',
        id: 'test_game'
      });
      
      expect(newState.entriesPerClick).toBe(2);
      const completedMiniGame = newState.miniGames[0];
      expect(completedMiniGame).toBeDefined();
      expect(completedMiniGame?.completed).toBe(true);
    });
  });

  describe('Upgrade System', () => {
    it('should unlock statistics tab when buying stats_unlock upgrade', () => {
      // Setup initial state with enough entries to buy the upgrade
      state.entries = 200;
      
      // Find the stats_unlock upgrade
      const statsUpgrade = state.upgrades.find(u => u.id === 'stats_unlock');
      expect(statsUpgrade).toBeDefined();
      expect(statsUpgrade?.unlocked).toBe(true);
      expect(statsUpgrade?.purchased).toBe(false);
      
      // Verify stats tab is locked initially
      const hasStatsUnlocked = state.upgrades.some(u => u.id === 'stats_unlock' && u.purchased);
      expect(hasStatsUnlocked).toBe(false);
      
      // Buy the upgrade
      const newState = gameReducer(state, { 
        type: 'BUY_UPGRADE',
        id: 'stats_unlock'
      });
      
      // Verify the upgrade was purchased
      const updatedUpgrade = newState.upgrades.find(u => u.id === 'stats_unlock');
      expect(updatedUpgrade?.purchased).toBe(true);
      
      // Verify entries were deducted
      expect(newState.entries).toBe(100); // 200 - 100 (upgrade cost)
      
      // Verify stats tab is now unlocked
      const hasStatsUnlockedAfter = newState.upgrades.some(u => u.id === 'stats_unlock' && u.purchased);
      expect(hasStatsUnlockedAfter).toBe(true);
    });
  });

  describe('Game State Management', () => {
    it('should correctly save and load purchased upgrades', () => {
      // Setup initial state with enough entries to buy the upgrade
      state.entries = 200;
      
      // Buy the stats_unlock upgrade
      let newState = gameReducer(state, { 
        type: 'BUY_UPGRADE',
        id: 'stats_unlock'
      });
      
      // Verify the upgrade was purchased
      expect(newState.upgrades.find(u => u.id === 'stats_unlock')?.purchased).toBe(true);
      
      // Simulate saving and loading the game
      newState = gameReducer(state, {
        type: 'LOAD_GAME',
        state: newState
      });
      
      // Verify the upgrade is still marked as purchased after loading
      const loadedUpgrade = newState.upgrades.find(u => u.id === 'stats_unlock');
      expect(loadedUpgrade?.purchased).toBe(true);
      
      // Verify stats tab is still unlocked after loading
      const hasStatsUnlocked = newState.upgrades.some(u => u.id === 'stats_unlock' && u.purchased);
      expect(hasStatsUnlocked).toBe(true);
    });
  });

  describe('Tab Unlocking System', () => {
    it('should unlock upgrades tab permanently once unlocked', () => {
      // Initial state with enough entries to unlock upgrades
      state.entries = 30;
      let newState = gameReducer(state, { type: 'CHECK_UNLOCKS' });
      expect(newState.upgradesTabUnlocked).toBe(true);

      // Entries drop below threshold
      newState.entries = 20;
      newState = gameReducer(newState, { type: 'CHECK_UNLOCKS' });
      expect(newState.upgradesTabUnlocked).toBe(true);
    });

    it('should unlock stats tab when stats upgrade is purchased', () => {
      state.upgrades = state.upgrades.map(u => 
        u.id === 'stats_unlock' ? { ...u, purchased: true } : u
      );
      const newState = gameReducer(state, { type: 'CHECK_UNLOCKS' });
      expect(newState.statsTabUnlocked).toBe(true);
    });

    it('should unlock achievements tab when first achievement is unlocked', () => {
      // Ajouter un succès débloqué à l'état
      const stateWithAchievement = {
        ...state,
        achievements: [
          {
            id: "first_entry",
            name: "Mind the GAAP",
            description: "Votre première écriture automatisée",
            unlocked: true,
            hidden: false,
            condition: (state: GameState) => state.totalEntries >= 1,
          }
        ]
      };
      const newState = gameReducer(stateWithAchievement, { type: 'CHECK_UNLOCKS' });
      expect(newState.achievementsTabUnlocked).toBe(true);
    });

    it('should unlock prestige tab at 1M entries or when prestige points exist', () => {
      // Test with 1M entries
      state.totalEntries = 1_000_000;
      let newState = gameReducer(state, { type: 'CHECK_UNLOCKS' });
      expect(newState.prestigeTabUnlocked).toBe(true);

      // Test with prestige points
      state.totalEntries = 0;
      state.prestige.points = 1;
      newState = gameReducer(state, { type: 'CHECK_UNLOCKS' });
      expect(newState.prestigeTabUnlocked).toBe(true);
    });
  });
});

describe('BUY_COLLABORATOR action', () => {
  it('should buy a collaborator when enough entries', () => {
    const state: GameState = {
      ...initialGameState,
      entries: 100,
      collaborators: [
        {
          id: 'test',
          name: 'Test',
          description: 'Test',
          baseCost: 50,
          baseOutput: 1,
          count: 0,
          unlocked: true,
        },
      ],
    };

    const newState = gameReducer(state, {
      type: 'BUY_COLLABORATOR',
      id: 'test',
    });

    const collaborator = newState.collaborators[0]!;
    expect(newState.entries).toBe(50);
    expect(collaborator.count).toBe(1);
  });
});

describe('Collaborator unlocking', () => {
  it('should unlock collaborators based on previous collaborator count', () => {
    const state: GameState = {
      ...initialGameState,
      collaborators: [
        {
          id: 'test1',
          name: 'Test 1',
          description: 'Test 1',
          baseCost: 50,
          baseOutput: 1,
          count: 5,
          unlocked: true,
        },
        {
          id: 'test2',
          name: 'Test 2',
          description: 'Test 2',
          baseCost: 100,
          baseOutput: 2,
          count: 0,
          unlocked: false,
        },
      ],
    };

    const newState = gameReducer(state, { 
      type: 'TICK',
      timestamp: Date.now() + 100
    });

    const collaborator = newState.collaborators[1]!;
    expect(collaborator.unlocked).toBe(true);
  });
});

describe('Achievement unlocking', () => {
  it('should unlock achievements based on conditions', () => {
    const now = Date.now();
    const state: GameState = {
      ...initialGameState,
      totalEntries: 1000,
      entries: 1000,
      lastTickAt: now,
      achievements: [
        {
          id: 'test',
          name: 'Test',
          description: 'Test',
          unlocked: false,
          hidden: false,
          condition: (state: GameState) => state.totalEntries >= 1000,
        },
      ],
    };

    const newState = gameReducer(state, { 
      type: 'TICK',
      timestamp: now + 100 // Add 100ms to ensure the tick is processed
    });

    const achievement = newState.achievements[0]!;
    expect(achievement.unlocked).toBe(true);
  });

  it('should unlock achievements on click', () => {
    const state: GameState = {
      ...initialGameState,
      achievements: [
        {
          id: 'test',
          name: 'Test',
          description: 'Test',
          unlocked: false,
          hidden: false,
          condition: (state: GameState) => state.clickCount >= 1,
        },
      ],
    };

    const newState = gameReducer(state, { type: 'CLICK' });

    const clickAchievement = newState.achievements[0]!;
    expect(clickAchievement.unlocked).toBe(true);
  });
});

describe('Mini-game completion', () => {
  it('should complete mini-games and apply rewards', () => {
    const state: GameState = {
      ...initialGameState,
      miniGames: [
        {
          id: 'test',
          name: 'Test',
          description: 'Test',
          unlocked: true,
          completed: false,
          active: false,
          timeLeft: 0,
          reward: {
            type: 'multiplier',
            value: 2,
          },
        },
      ],
    };

    const newState = gameReducer(state, {
      type: 'COMPLETE_MINIGAME',
      id: 'test',
    });

    const completedMiniGame = newState.miniGames[0]!;
    expect(completedMiniGame.completed).toBe(true);
  });
}); 