import { describe, expect, it } from "vitest";
import { KVStore } from "../src/index";

describe("KVStore", () => {
  it("merges patches on set", () => {
    const store = new KVStore({ hunger: 10, mood: "HAPPY" });

    const next = store.set({ hunger: 20, coins: 5 });

    expect(next).toEqual({ hunger: 20, mood: "HAPPY", coins: 5 });
    expect(store.get()).toEqual({ hunger: 20, mood: "HAPPY", coins: 5 });
  });
});
