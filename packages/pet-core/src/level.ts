import { clampLevel, clampNonNegative } from "./clamp";
import type { PetState } from "./types";

/** Get exp required to reach the next level. */
export function expToNextLevel(level: number): number {
  const safeLevel = clampLevel(level);
  return 100 + (safeLevel - 1) * 20;
}

/** Apply one or more level-ups based on accumulated exp. */
export function applyLevelUps(state: PetState): PetState {
  let level = clampLevel(state.level);
  let exp = clampNonNegative(state.exp);
  let nextExp = expToNextLevel(level);

  while (exp >= nextExp) {
    exp -= nextExp;
    level += 1;
    nextExp = expToNextLevel(level);
  }

  return {
    ...state,
    level,
    exp
  };
}
