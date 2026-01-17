import { describe, expect, it } from "vitest";
import {
  ACTION_DELTAS,
  clampNonNegative,
  clampStat,
  createInitialState,
  reduce
} from "../src/index";

const baseState = createInitialState({
  hunger: 50,
  energy: 50,
  cleanliness: 50,
  fun: 50,
  affection: 50,
  exp: 0,
  level: 1,
  coins: 10,
  lastTickAt: 0
});

function applyExpectedDelta(state: typeof baseState, delta: Record<string, number | undefined>) {
  return {
    ...state,
    hunger: clampStat(state.hunger + (delta.hunger ?? 0)),
    energy: clampStat(state.energy + (delta.energy ?? 0)),
    cleanliness: clampStat(state.cleanliness + (delta.cleanliness ?? 0)),
    fun: clampStat(state.fun + (delta.fun ?? 0)),
    affection: clampStat(state.affection + (delta.affection ?? 0)),
    exp: clampNonNegative(state.exp + (delta.exp ?? 0)),
    coins: clampNonNegative(state.coins + (delta.coins ?? 0)),
    level: state.level
  };
}

describe("reduce actions", () => {
  for (const [type, delta] of Object.entries(ACTION_DELTAS)) {
    if (type === "TICK") continue;

    it(`applies ${type} deltas`, () => {
      const event = { type: type as keyof typeof ACTION_DELTAS, at: 1000 };
      const result = reduce(baseState, event);
      const expected = applyExpectedDelta(baseState, delta);

      expect(result.state.hunger).toBe(expected.hunger);
      expect(result.state.energy).toBe(expected.energy);
      expect(result.state.cleanliness).toBe(expected.cleanliness);
      expect(result.state.fun).toBe(expected.fun);
      expect(result.state.affection).toBe(expected.affection);
      expect(result.state.exp).toBe(expected.exp);
      expect(result.state.coins).toBe(expected.coins);
      expect(result.state.level).toBe(expected.level);
      expect(result.state.lastTickAt).toBe(1000);

      const deltas = {
        hunger: expected.hunger - baseState.hunger,
        energy: expected.energy - baseState.energy,
        cleanliness: expected.cleanliness - baseState.cleanliness,
        fun: expected.fun - baseState.fun,
        affection: expected.affection - baseState.affection,
        exp: expected.exp - baseState.exp
      };

      for (const [key, diff] of Object.entries(deltas)) {
        if (diff === 0) {
          expect(result.delta[key as keyof typeof deltas]).toBeUndefined();
        } else {
          expect(result.delta[key as keyof typeof deltas]).toBe(diff);
        }
      }
    });
  }
});
