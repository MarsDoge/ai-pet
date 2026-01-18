import { exportSaveData, importSaveData } from "@ai-pet/pet-memory";
import type { SaveData } from "@ai-pet/pet-memory";
import type { AppState } from "./types";
import { STORAGE_KEY } from "./constants";

type ProviderSettings = {
  provider: "none" | "openai" | "deepseek" | "ollama";
  apiKey?: string;
  baseUrl?: string;
  model?: string;
};

const DEFAULT_PROVIDER_SETTINGS: ProviderSettings = {
  provider: "none",
  model: "gpt-4o-mini"
};

export function loadProviderSettings(): ProviderSettings {
  if (typeof window === "undefined") return DEFAULT_PROVIDER_SETTINGS;
  const raw = window.localStorage.getItem("ai-pet-provider");
  if (!raw) return DEFAULT_PROVIDER_SETTINGS;
  try {
    const parsed = JSON.parse(raw) as ProviderSettings;
    return {
      provider: parsed.provider ?? "none",
      apiKey: parsed.apiKey,
      baseUrl: parsed.baseUrl,
      model: parsed.model ?? DEFAULT_PROVIDER_SETTINGS.model
    };
  } catch {
    return DEFAULT_PROVIDER_SETTINGS;
  }
}

export function persistProviderSettings(settings: ProviderSettings): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem("ai-pet-provider", JSON.stringify(settings));
}

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
  const save = exportSaveData(
    state.pet,
    {
      inventory: state.inventory,
      llmProvider: state.llmProvider,
      settingsPanels: state.settingsPanels,
      providerErrorDismissedAt: state.providerErrorDismissedAt,
      memory: state.memory,
      dailyBadges: state.dailyBadges,
      achievements: state.achievements,
      autoSpeak: {
        enabled: state.autoSpeakEnabled,
        count: state.autoSpeakCount,
        date: state.autoSpeakDate,
        lastAutoSpeakAt: state.lastAutoSpeakAt,
        lastInteractionAt: state.lastInteractionAt
      }
    },
    state.log
  );
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(save));
}

export function buildExportPayload(state: AppState): string {
  const save = exportSaveData(
    state.pet,
    {
      inventory: state.inventory,
      llmProvider: state.llmProvider,
      settingsPanels: state.settingsPanels,
      providerErrorDismissedAt: state.providerErrorDismissedAt,
      memory: state.memory,
      dailyBadges: state.dailyBadges,
      achievements: state.achievements,
      autoSpeak: {
        enabled: state.autoSpeakEnabled,
        count: state.autoSpeakCount,
        date: state.autoSpeakDate,
        lastAutoSpeakAt: state.lastAutoSpeakAt,
        lastInteractionAt: state.lastInteractionAt
      }
    },
    state.log
  );
  return JSON.stringify(save, null, 2);
}

export function importFromPayload(payload: string): SaveData {
  const parsed = JSON.parse(payload) as SaveData;
  return importSaveData(parsed);
}
