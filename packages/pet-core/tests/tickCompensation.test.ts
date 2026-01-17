import { describe, expect, it } from "vitest";
import {
  ACTION_DELTAS,
  TICK_INTERVAL_MS,
  applyTickCompensation,
  clampStat
} from "../src/index";

const baseState = {
  hunger: 50,
  energy: 50,
  cleanliness: 50,
  fun: 50,
  affection: 50,
  exp: 0,
  level: 1,
  coins: 0,
  lastTickAt: 0
};

function expectAfterTicks(ticks: number, nowMs: number) {
  const delta = ACTION_DELTAS.TICK;
  const result = applyTickCompensation(baseState, nowMs);

  expect(result.ticksApplied).toBe(ticks);
  expect(result.events).toHaveLength(ticks);
  expect(result.state.lastTickAt).toBe(ticks * TICK_INTERVAL_MS);

  const expected = {
    hunger: clampStat(baseState.hunger + (delta.hunger ?? 0) * ticks),
    energy: clampStat(baseState.energy + (delta.energy ?? 0) * ticks),
    cleanliness: clampStat(baseState.cleanliness + (delta.cleanliness ?? 0) * ticks),
    fun: clampStat(baseState.fun + (delta.fun ?? 0) * ticks)
  };

  expect(result.state.hunger).toBe(expected.hunger);
  expect(result.state.energy).toBe(expected.energy);
  expect(result.state.cleanliness).toBe(expected.cleanliness);
  expect(result.state.fun).toBe(expected.fun);
}

describe("tick compensation", () => {
  it("applies 1h worth of ticks", () => {
    expectAfterTicks(6, 60 * 60 * 1000);
  });

  it("applies 6h worth of ticks", () => {
    expectAfterTicks(36, 6 * 60 * 60 * 1000);
  });

  it("applies 24h worth of ticks with clamping", () => {
    expectAfterTicks(144, 24 * 60 * 60 * 1000);
  });
});
