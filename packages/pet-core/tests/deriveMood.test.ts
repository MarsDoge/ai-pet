import { describe, expect, it } from "vitest";
import { createInitialState, deriveMood, MoodThresholds } from "../src/index";

const baseState = createInitialState();

describe("deriveMood", () => {
  it("returns HUNGRY when hunger is at or above threshold", () => {
    const state = { ...baseState, hunger: MoodThresholds.HUNGER_THRESHOLD };
    expect(deriveMood(state)).toBe("HUNGRY");
  });

  it("prioritizes hunger over other low stats", () => {
    const state = {
      ...baseState,
      hunger: MoodThresholds.HUNGER_THRESHOLD,
      energy: MoodThresholds.LOW_ENERGY_THRESHOLD
    };
    expect(deriveMood(state)).toBe("HUNGRY");
  });

  it("returns TIRED when energy is low and not hungry", () => {
    const state = {
      ...baseState,
      hunger: MoodThresholds.HUNGER_THRESHOLD - 1,
      energy: MoodThresholds.LOW_ENERGY_THRESHOLD
    };
    expect(deriveMood(state)).toBe("TIRED");
  });

  it("returns DIRTY when cleanliness is low", () => {
    const state = {
      ...baseState,
      energy: MoodThresholds.LOW_ENERGY_THRESHOLD + 1,
      cleanliness: MoodThresholds.LOW_CLEANLINESS_THRESHOLD
    };
    expect(deriveMood(state)).toBe("DIRTY");
  });

  it("returns BORED when fun is low", () => {
    const state = {
      ...baseState,
      cleanliness: MoodThresholds.LOW_CLEANLINESS_THRESHOLD + 1,
      fun: MoodThresholds.LOW_FUN_THRESHOLD
    };
    expect(deriveMood(state)).toBe("BORED");
  });

  it("returns HAPPY when affection is high", () => {
    const state = {
      ...baseState,
      fun: MoodThresholds.LOW_FUN_THRESHOLD + 1,
      affection: MoodThresholds.HIGH_AFFECTION_THRESHOLD
    };
    expect(deriveMood(state)).toBe("HAPPY");
  });

  it("returns CONTENT when no thresholds are met", () => {
    const state = { ...baseState, affection: MoodThresholds.HIGH_AFFECTION_THRESHOLD - 1 };
    expect(deriveMood(state)).toBe("CONTENT");
  });
});
