import { describe, it, expect, vi, beforeEach } from 'vitest';
import { gameReducer } from '@/reducers/gameReducer';
import { initialGameState } from '@/data/gameInitialState';
import type { GameState, Achievement } from '@/types/game';
import { toast } from 'sonner';

// Mock sonner toast
vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn()
  }
}));

describe('Achievement System', () => {
  let state: GameState;

  beforeEach(() => {
    state = {
      ...initialGameState,
      achievements: [{
        id: 'test_achievement',
        name: 'Test Achievement',
        description: 'Test Description',
        condition: (state: GameState) => state.clickCount >= 1,
        unlocked: false,
        hidden: false
      } as Achievement]
    };
    vi.clearAllMocks();
  });

  it('should show a notification when an achievement is unlocked', () => {
    const newState = gameReducer(state, { type: 'CLICK' });
    const achievement = newState.achievements[0];
    
    // Verify the achievement is unlocked
    expect(achievement?.unlocked).toBe(true);
    
    // Verify that a toast notification was shown
    expect(toast.success).toHaveBeenCalledWith(
      '🏆 Trophée débloqué : Test Achievement',
      { description: 'Test Description' }
    );
  });

  it('should not show a notification for already unlocked achievements', () => {
    // Start with an already unlocked achievement
    const achievement = state.achievements[0];
    if (achievement) {
      achievement.unlocked = true;
    }
    
    gameReducer(state, { type: 'CLICK' });
    
    // Verify no notification was shown
    expect(toast.success).not.toHaveBeenCalled();
  });
}); 