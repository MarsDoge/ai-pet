import type { PetState } from "./types";

export const STAT_MIN = 0;
export const STAT_MAX = 100;
export const LEVEL_MIN = 1;

export function clamp(value: number, min: number, max: number): number {
  if (value < min) return min;
  if (value > max) return max;
  return value;
}

export function clampStat(value: number): number {
  return clamp(value, STAT_MIN, STAT_MAX);
}

export function clampNonNegative(value: number): number {
  return value < 0 ? 0 : value;
}

export function clampLevel(value: number): number {
  return value < LEVEL_MIN ? LEVEL_MIN : value;
}

/** Clamp all numeric fields into their legal ranges. */
export function clampState(state: PetState): PetState {
  return {
    ...state,
    hunger: clampStat(state.hunger),
    energy: clampStat(state.energy),
    cleanliness: clampStat(state.cleanliness),
    fun: clampStat(state.fun),
    affection: clampStat(state.affection),
    exp: clampNonNegative(state.exp),
    coins: clampNonNegative(state.coins),
    level: clampLevel(state.level)
  };
}
