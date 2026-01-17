import type { InventoryItem } from "./types";

export const STORAGE_KEY = "ai-pet-save";

export const DEFAULT_INVENTORY: InventoryItem[] = [
  { id: "food-basic", name: "Crunchy Kibble", kind: "food", actionType: "FEED", quantity: 3 },
  { id: "food-berry", name: "Star Berry", kind: "food", actionType: "FEED", quantity: 2 },
  { id: "toy-ring", name: "Orbit Ring", kind: "toy", actionType: "PLAY", quantity: 2 },
  { id: "toy-drum", name: "Mini Drum", kind: "toy", actionType: "PLAY", quantity: 1 }
];

export const CHAT_TEMPLATES = {
  CONTENT: "Feels nice to just hang out with you.",
  HAPPY: "Best day ever. Keep those head pats coming!",
  HUNGRY: "My tummy is rumbling. Got any snacks?",
  TIRED: "I could curl up for a nap.",
  DIRTY: "I might need a bath. Just saying.",
  BORED: "Can we play something fun?"
} as const;

export const ACTION_MESSAGES = {
  FEED: "Snack time! Feeling fuller already.",
  PET: "That is the good spot. Keep going.",
  BATH: "All fresh and fluffy again.",
  PLAY: "Zoom zoom! That was fun.",
  SLEEP: "Powering down for a cozy nap.",
  CHAT: "I'm all ears."
} as const;
