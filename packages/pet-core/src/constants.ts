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
