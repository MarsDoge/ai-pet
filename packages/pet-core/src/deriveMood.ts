import type { Mood, PetState } from "./types";

const HUNGER_THRESHOLD = 80;
const LOW_ENERGY_THRESHOLD = 20;
const LOW_CLEANLINESS_THRESHOLD = 20;
const LOW_FUN_THRESHOLD = 20;
const HIGH_AFFECTION_THRESHOLD = 80;

export function deriveMood(state: PetState): Mood {
  if (state.hunger >= HUNGER_THRESHOLD) return "HUNGRY";
  if (state.energy <= LOW_ENERGY_THRESHOLD) return "TIRED";
  if (state.cleanliness <= LOW_CLEANLINESS_THRESHOLD) return "DIRTY";
  if (state.fun <= LOW_FUN_THRESHOLD) return "BORED";
  if (state.affection >= HIGH_AFFECTION_THRESHOLD) return "HAPPY";
  return "CONTENT";
}

export const MoodThresholds = {
  HUNGER_THRESHOLD,
  LOW_ENERGY_THRESHOLD,
  LOW_CLEANLINESS_THRESHOLD,
  LOW_FUN_THRESHOLD,
  HIGH_AFFECTION_THRESHOLD
} as const;
