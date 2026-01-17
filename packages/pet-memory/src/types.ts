import type { PetState, StatDelta } from "@ai-pet/pet-core";

export const CURRENT_SAVE_VERSION = 1;

export interface EventLogEntry {
  type: string;
  at: number;
  delta?: StatDelta;
  payload?: unknown;
}

export interface SaveData {
  version: number;
  state: PetState;
  kv: Record<string, unknown>;
  log: EventLogEntry[];
}
