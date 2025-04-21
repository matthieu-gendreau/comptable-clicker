import { expect, afterEach, beforeEach, vi } from 'vitest';

// Configure les timers pour les tests
beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  vi.restoreAllMocks();
  vi.clearAllTimers();
}); 