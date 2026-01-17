import {
  clampNonNegative,
  clampState,
  createInitialState,
  type PetState
} from "@ai-pet/pet-core";
import type { SaveData } from "./types";
import { CURRENT_SAVE_VERSION } from "./types";

function toNumber(value: unknown, fallback: number): number {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  return fallback;
}

export function sanitizeState(input: Partial<PetState>): PetState {
  const base = createInitialState();
  const state: PetState = {
    hunger: toNumber(input.hunger, base.hunger),
    energy: toNumber(input.energy, base.energy),
    cleanliness: toNumber(input.cleanliness, base.cleanliness),
    fun: toNumber(input.fun, base.fun),
    affection: toNumber(input.affection, base.affection),
    exp: toNumber(input.exp, base.exp),
    level: toNumber(input.level, base.level),
    coins: toNumber(input.coins, base.coins),
    lastTickAt: toNumber(input.lastTickAt, base.lastTickAt)
  };

  return {
    ...clampState(state),
    lastTickAt: clampNonNegative(state.lastTickAt)
  };
}

export function exportSaveData(
  state: PetState,
  kv: Record<string, unknown>,
  log: SaveData["log"],
  version: number = CURRENT_SAVE_VERSION
): SaveData {
  return {
    version,
    state,
    kv: { ...kv },
    log: [...log]
  };
}

export function importSaveData(data: SaveData, version: number = CURRENT_SAVE_VERSION): SaveData {
  if (data.version !== version) {
    throw new Error(`Unsupported save version: ${data.version}`);
  }

  return {
    version,
    state: sanitizeState(data.state),
    kv: { ...(data.kv ?? {}) },
    log: [...(data.log ?? [])]
  };
}
