import type { InventoryItem } from "./types";

export const STORAGE_KEY = "ai-pet-save";
const parsedLimit = Number(process.env.NEXT_PUBLIC_AUTO_SPEAK_LIMIT_PER_DAY ?? 8);
export const AUTO_SPEAK_LIMIT = Number.isFinite(parsedLimit) && parsedLimit > 0 ? parsedLimit : 8;
export const AUTO_SPEAK_IDLE_MS = 30 * 60 * 1000;
export const AUTO_SPEAK_COOLDOWN_MS = 5 * 60 * 1000;
export const AUTO_SPEAK_POLL_MS = 20 * 1000;

export const DEFAULT_INVENTORY: InventoryItem[] = [
  { id: "food-basic", name: "Crunchy Kibble", kind: "food", actionType: "FEED", quantity: 3 },
  { id: "food-berry", name: "Star Berry", kind: "food", actionType: "FEED", quantity: 2 },
  { id: "toy-ring", name: "Orbit Ring", kind: "toy", actionType: "PLAY", quantity: 2 },
  { id: "toy-drum", name: "Mini Drum", kind: "toy", actionType: "PLAY", quantity: 1 }
];

export const ACTION_MESSAGES = {
  FEED: "Snack time! Feeling fuller already.",
  PET: "That is the good spot. Keep going.",
  BATH: "All fresh and fluffy again.",
  PLAY: "Zoom zoom! That was fun.",
  SLEEP: "Powering down for a cozy nap."
} as const;
