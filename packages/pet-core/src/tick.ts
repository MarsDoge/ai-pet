import { TICK_INTERVAL_MS } from "./constants";
import type { CoreEvent } from "./events";
import type { PetState } from "./types";
import { reduce } from "./reduce";

export interface TickCompensationResult {
  state: PetState;
  ticksApplied: number;
  events: CoreEvent[];
}

export function buildTickEvent(at: number): CoreEvent {
  return { type: "TICK", at };
}

/** Apply a single TICK event at the given timestamp. */
export function applyTick(state: PetState, at: number): PetState {
  return reduce(state, buildTickEvent(at)).state;
}

/** Apply tick compensation based on lastTickAt and interval. */
export function applyTickCompensation(
  state: PetState,
  nowMs: number,
  intervalMs: number = TICK_INTERVAL_MS
): TickCompensationResult {
  if (nowMs <= state.lastTickAt) {
    return { state, ticksApplied: 0, events: [] };
  }

  const elapsed = nowMs - state.lastTickAt;
  const ticks = Math.floor(elapsed / intervalMs);
  if (ticks <= 0) {
    return { state, ticksApplied: 0, events: [] };
  }

  let nextState = state;
  const events: CoreEvent[] = [];

  for (let i = 1; i <= ticks; i += 1) {
    const at = state.lastTickAt + intervalMs * i;
    const event = buildTickEvent(at);
    events.push(event);
    nextState = reduce(nextState, event).state;
  }

  return {
    state: nextState,
    ticksApplied: ticks,
    events
  };
}
