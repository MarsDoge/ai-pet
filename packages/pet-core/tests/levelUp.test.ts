import { describe, expect, it } from "vitest";
import { applyLevelUps, expToNextLevel, reduce } from "../src/index";

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

describe("level-up logic", () => {
  it("levels up when exp meets the threshold", () => {
    const target = expToNextLevel(1);
    const state = { ...baseState, exp: target - 2 };
    const result = reduce(state, { type: "PET", at: 1000 });

    expect(result.state.level).toBe(2);
    expect(result.state.exp).toBe(0);
  });

  it("does not level up when exp is below the threshold", () => {
    const target = expToNextLevel(1);
    const state = { ...baseState, exp: target - 3 };
    const result = reduce(state, { type: "PET", at: 1000 });

    expect(result.state.level).toBe(1);
    expect(result.state.exp).toBe(target - 1);
  });

  it("supports multiple level-ups", () => {
    const state = { ...baseState, exp: 220, level: 1 };
    const result = applyLevelUps(state);

    expect(result.level).toBe(3);
    expect(result.exp).toBe(0);
  });
});
