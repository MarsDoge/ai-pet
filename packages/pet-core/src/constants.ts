import type { CoreEventType } from "./events";
import type { StatDelta } from "./types";

export const TICK_INTERVAL_MS = 10 * 60 * 1000;

export const ACTION_DELTAS: Record<CoreEventType, StatDelta> = {
  FEED: { hunger: -20, energy: 2, fun: 1, exp: 3 },
  PET: { affection: 5, fun: 2, exp: 2 },
  BATH: { cleanliness: 25, affection: 1, exp: 3 },
  PLAY: { fun: 15, energy: -5, hunger: 3, exp: 4 },
  SLEEP: { energy: 25, hunger: 5, cleanliness: -2, exp: 2 },
  TICK: { hunger: 1, energy: -1, cleanliness: -1, fun: -1 }
};

export type ItemEffect = {
  id: string;
  name: string;
  actionType: Exclude<CoreEventType, "TICK">;
  delta: StatDelta;
};

export const ITEM_EFFECTS: ItemEffect[] = [
  { id: "food-basic", name: "Crunchy Kibble", actionType: "FEED", delta: { hunger: -10, exp: 1 } },
  { id: "food-berry", name: "Star Berry", actionType: "FEED", delta: { hunger: -15, fun: 2, exp: 2 } },
  { id: "toy-ring", name: "Orbit Ring", actionType: "PLAY", delta: { fun: 8, energy: -2, exp: 2 } },
  { id: "toy-drum", name: "Mini Drum", actionType: "PLAY", delta: { fun: 10, energy: -3, exp: 3 } }
];
