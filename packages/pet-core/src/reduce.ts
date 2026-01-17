import { ACTION_DELTAS } from "./constants";
import { clampNonNegative, clampStat, clampState } from "./clamp";
import type { CoreEvent } from "./events";
import type { PetState, ReduceResult, StatDelta, StatKey } from "./types";
import { applyLevelUps } from "./level";

const DELTA_KEYS: StatKey[] = [
  "hunger",
  "energy",
  "cleanliness",
  "fun",
  "affection",
  "exp",
  "level",
  "coins"
];

function applyDelta(state: PetState, delta: StatDelta): PetState {
  const next = {
    ...state,
    hunger: clampStat(state.hunger + (delta.hunger ?? 0)),
    energy: clampStat(state.energy + (delta.energy ?? 0)),
    cleanliness: clampStat(state.cleanliness + (delta.cleanliness ?? 0)),
    fun: clampStat(state.fun + (delta.fun ?? 0)),
    affection: clampStat(state.affection + (delta.affection ?? 0)),
    exp: clampNonNegative(state.exp + (delta.exp ?? 0)),
    level: state.level + (delta.level ?? 0),
    coins: clampNonNegative(state.coins + (delta.coins ?? 0))
  };

  return clampState(next);
}

function diffState(previous: PetState, next: PetState): StatDelta {
  const delta: StatDelta = {};

  for (const key of DELTA_KEYS) {
    const diff = next[key] - previous[key];
    if (diff !== 0) {
      delta[key] = diff;
    }
  }

  return delta;
}

/** Apply a core event and return next state plus numeric delta. */
export function reduce(state: PetState, event: CoreEvent): ReduceResult {
  const baseDelta = ACTION_DELTAS[event.type] ?? {};
  const withDelta = applyDelta(state, baseDelta);
  const leveled = applyLevelUps(withDelta);
  const nextState = {
    ...leveled,
    lastTickAt: Math.max(state.lastTickAt, event.at)
  };
  const delta = diffState(state, nextState);

  return {
    state: nextState,
    delta
  };
}
