import { describe, expect, it } from "vitest";
import {
  CURRENT_SAVE_VERSION,
  exportSaveData,
  importSaveData,
  sanitizeState
} from "../src/index";

const baseState = {
  hunger: 50,
  energy: 50,
  cleanliness: 50,
  fun: 50,
  affection: 50,
  exp: 10,
  level: 2,
  coins: 5,
  lastTickAt: 1200
};

describe("SaveData", () => {
  it("round-trips export/import", () => {
    const save = exportSaveData(
      baseState,
      {
        foo: "bar",
        inventory: [{ id: "food-basic", name: "Crunchy Kibble", kind: "food", quantity: 1 }],
        autoSpeak: { enabled: true, count: 2, date: "2026-01-17" }
      },
      [{ type: "TICK", at: 1200 }]
    );
    const loaded = importSaveData(save);

    expect(loaded.version).toBe(CURRENT_SAVE_VERSION);
    expect(loaded.state).toEqual(baseState);
    expect(loaded.kv).toEqual({
      foo: "bar",
      inventory: [{ id: "food-basic", name: "Crunchy Kibble", kind: "food", quantity: 1 }],
      autoSpeak: { enabled: true, count: 2, date: "2026-01-17" }
    });
    expect(loaded.log).toEqual([{ type: "TICK", at: 1200 }]);
  });

  it("rejects unsupported versions", () => {
    const save = exportSaveData(baseState, {}, [], 999);

    expect(() => importSaveData(save)).toThrow("Unsupported save version");
  });

  it("clamps invalid numeric values", () => {
    const dirty = {
      hunger: 200,
      energy: -5,
      cleanliness: 10,
      fun: 200,
      affection: 0,
      exp: -20,
      level: 0,
      coins: -1,
      lastTickAt: -100
    };

    const clean = sanitizeState(dirty);

    expect(clean.hunger).toBe(100);
    expect(clean.energy).toBe(0);
    expect(clean.fun).toBe(100);
    expect(clean.exp).toBe(0);
    expect(clean.level).toBe(1);
    expect(clean.coins).toBe(0);
    expect(clean.lastTickAt).toBe(0);
  });
});
