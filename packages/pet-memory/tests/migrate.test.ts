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

  it("adds default memory structure when missing or invalid", () => {
    const dirty = {
      ...baseSave,
      kv: {
        memory: {
          shortTerm: [{ at: "bad", role: "user", text: 123 }],
          longTerm: { profile: 123, preferences: ["cats", 1], notes: { mood: "happy", bad: 1 } }
        }
      }
    };

    const result = migrateSaveData(dirty);
    const memory = result.save.kv.memory as { shortTerm: Array<unknown>; longTerm: Record<string, unknown> };

    expect(memory.shortTerm).toHaveLength(0);
    expect(memory.longTerm.profile).toBe("");
    expect(memory.longTerm.preferences).toEqual(["cats"]);
    expect(memory.longTerm.notes).toEqual({ mood: "happy" });
  });
});
