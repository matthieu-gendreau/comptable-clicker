import { describe, it, expect, beforeEach } from '@jest/globals';
import { gameReducer } from '../reducers/gameReducer';
import { initialGameState } from '../data/gameInitialState';
import { GameState, FiscalSpecialization, Upgrade } from '../types/game';

describe('Gameplay Mechanics', () => {
  let state: GameState;

  beforeEach(() => {
    state = {
      ...initialGameState,
      combo: {
        active: false,
        clicksInCombo: 0,
        multiplier: 1,
        lastClickTime: 0,
        maxMultiplier: 2,
        comboTimeWindow: 3000
      }
    };
  });

  describe('Basic Click Mechanics', () => {
    it('should increment entries on click', () => {
      const newState = gameReducer(state, { type: 'CLICK' });
      expect(newState.entries).toBe(state.entriesPerClick);
      expect(newState.totalEntries).toBe(state.entriesPerClick);
      expect(newState.clickCount).toBe(1);
    });

    it('should apply click multiplier correctly', () => {
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
  });

  describe('Combo System', () => {
    it('should activate combo on rapid clicks', () => {
      const now = Date.now();
      state.combo.lastClickTime = now - 1000; // 1 second ago
      state.combo.comboTimeWindow = 3000; // 3 seconds window
      
      const newState = gameReducer(state, { type: 'CLICK' });
      expect(newState.combo.active).toBe(true);
      expect(newState.combo.clicksInCombo).toBe(1);
    });

    it('should increase combo multiplier with consecutive clicks', () => {
      const now = Date.now();
      state.combo = {
        ...state.combo,
        active: true,
        clicksInCombo: 5,
        lastClickTime: now - 500,
        multiplier: 1.5
      };

      const newState = gameReducer(state, { type: 'CLICK' });
      expect(newState.combo.multiplier).toBeGreaterThan(state.combo.multiplier);
      expect(newState.combo.clicksInCombo).toBe(6);
    });

    it('should reset combo after time window expires', () => {
      state.combo = {
        ...state.combo,
        active: true,
        clicksInCombo: 5,
        lastClickTime: Date.now() - 4000, // Outside the 3s window
        multiplier: 1.5
      };

      const newState = gameReducer(state, { type: 'CLICK' });
      expect(newState.combo.multiplier).toBe(1);
      expect(newState.combo.clicksInCombo).toBe(1);
    });
  });

  describe('Upgrades System', () => {
    it('should apply upgrade effects correctly', () => {
      const upgrade: Upgrade = {
        id: 'test_upgrade',
        name: 'Test Upgrade',
        description: 'Test',
        cost: 10,
        purchased: false,
        unlocked: true,
        multiplier: 2,
        effect: (state: GameState) => ({
          ...state,
          entriesPerClick: state.entriesPerClick * 2
        })
      };

      state.upgrades = [upgrade];
      state.entries = 10;

      const newState = gameReducer(state, { type: 'BUY_UPGRADE', id: 'test_upgrade' });
      expect(newState.entriesPerClick).toBe(state.entriesPerClick * 2);
    });

    it('should not apply upgrade if not enough entries', () => {
      const upgrade: Upgrade = {
        id: 'test_upgrade',
        name: 'Test Upgrade',
        description: 'Test',
        cost: 100,
        purchased: false,
        unlocked: true,
        multiplier: 2,
        effect: (state: GameState) => ({
          ...state,
          entriesPerClick: state.entriesPerClick * 2
        })
      };

      state.upgrades = [upgrade];
      state.entries = 50;

      const newState = gameReducer(state, { type: 'BUY_UPGRADE', id: 'test_upgrade' });
      expect(newState.entriesPerClick).toBe(state.entriesPerClick);
    });
  });

  describe('Famous Accountants', () => {
    it('should activate accountant power correctly', () => {
      state.famousAccountants = [{
        id: 'test_accountant',
        name: 'Test Accountant',
        description: 'Test',
        unlocked: true,
        purchased: true,
        active: false,
        power: {
          type: 'click',
          multiplier: 2,
          duration: 30
        },
        cooldown: 300
      }];

      const newState = gameReducer(state, { type: 'ACTIVATE_ACCOUNTANT', id: 'test_accountant' });
      expect(newState.entriesPerClick).toBe(state.entriesPerClick * 2);
    });
  });

  describe('Prestige System', () => {
    it('should reset game state but keep prestige multipliers on prestige', () => {
      state.entries = 1e6;
      state.prestige.upgrades = [{
        id: 'test_prestige_upgrade',
        name: 'Test Prestige',
        description: 'Test',
        cost: 1,
        purchased: true,
        unlocked: true,
        multiplier: 2,
        effect: (state: GameState) => ({
          ...state,
          prestige: {
            ...state.prestige,
            multiplier: state.prestige.multiplier * 2
          }
        })
      }];

      const newState = gameReducer(state, { type: 'PRESTIGE' });
      expect(newState.entries).toBe(0);
      expect(newState.totalEntries).toBe(0);
      expect(newState.prestige.multiplier).toBeGreaterThan(1);
      expect(newState.prestige.totalResets).toBe(1);
    });
  });
}); 