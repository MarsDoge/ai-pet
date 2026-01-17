import { clampLevel, clampNonNegative } from "./clamp";
import type { PetState } from "./types";

export function expToNextLevel(level: number): number {
  const safeLevel = clampLevel(level);
  return 100 + (safeLevel - 1) * 20;
}

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
