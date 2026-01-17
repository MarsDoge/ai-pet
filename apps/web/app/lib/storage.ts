import { exportSaveData, importSaveData } from "@ai-pet/pet-memory";
import type { SaveData } from "@ai-pet/pet-memory";
import type { AppState } from "./types";
import { STORAGE_KEY } from "./constants";

export function loadSaveData(): SaveData | null {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw) as SaveData;
    return importSaveData(parsed);
  } catch (error) {
    console.error("Failed to load save data", error);
    return null;
  }
}

export function persistSaveData(state: AppState): void {
  if (typeof window === "undefined") return;
  const save = exportSaveData(state.pet, { inventory: state.inventory }, state.log);
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(save));
}

export function buildExportPayload(state: AppState): string {
  const save = exportSaveData(state.pet, { inventory: state.inventory }, state.log);
  return JSON.stringify(save, null, 2);
}

export function importFromPayload(payload: string): SaveData {
  const parsed = JSON.parse(payload) as SaveData;
  return importSaveData(parsed);
}
