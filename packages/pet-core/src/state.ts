import { clampState } from "./clamp";
import type { PetState } from "./types";

export const DEFAULT_PET_STATE: PetState = {
  hunger: 30,
  energy: 70,
  cleanliness: 70,
  fun: 60,
  affection: 50,
  exp: 0,
  level: 1,
  coins: 0,
  lastTickAt: 0
};

export function createInitialState(overrides: Partial<PetState> = {}): PetState {
  return clampState({
    ...DEFAULT_PET_STATE,
    ...overrides
  });
}
