import { describe, expect, it } from "vitest";
import { migrateSaveData } from "../src/migrate";
import { CURRENT_SAVE_VERSION } from "../src/types";

const baseSave = {
  version: CURRENT_SAVE_VERSION,
  state: {
    hunger: 50,
    energy: 50,
    cleanliness: 50,
    fun: 50,
    affection: 50,
    exp: 0,
    level: 1,
    coins: 0,
    lastTickAt: 0
  },
  kv: {},
  log: []
};

describe("migrateSaveData", () => {
  it("sanitizes state while preserving current version", () => {
    const dirty = {
      ...baseSave,
      state: { ...baseSave.state, hunger: 200, coins: -5 }
    };

    const result = migrateSaveData(dirty);

    expect(result.save.state.hunger).toBe(100);
    expect(result.save.state.coins).toBe(0);
    expect(result.migrated).toBe(true);
    expect(result.fromVersion).toBe(CURRENT_SAVE_VERSION);
  });
});
