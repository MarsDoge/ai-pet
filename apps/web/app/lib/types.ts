import type { CoreEventType, PetState } from "@ai-pet/pet-core";
import type { SuggestedAction } from "@ai-pet/pet-ai";
import type { EventLogEntry } from "@ai-pet/pet-memory";

export type InventoryItem = {
  id: string;
  name: string;
  kind: "food" | "toy";
  actionType: CoreEventType;
  quantity: number;
};

export type MemoryEntry = {
  at: number;
  role: "user" | "pet";
  text: string;
};

export type LongTermMemory = {
  profile: string;
  preferences: string[];
  notes: Record<string, string>;
};

export type MemoryState = {
  shortTerm: MemoryEntry[];
  longTerm: LongTermMemory;
};

export type AppState = {
  pet: PetState;
  log: EventLogEntry[];
  inventory: InventoryItem[];
  message: string;
  providerError?: string;
  providerErrorDismissedAt?: number;
  suggestedActions: SuggestedAction[];
  llmProvider: "none" | "openai" | "deepseek" | "ollama";
  settingsPanels: {
    ai: boolean;
    autoSpeak: boolean;
    saveLoad: boolean;
  };
  memory: MemoryState;
  dailyBadges: string[];
  autoSpeakEnabled: boolean;
  autoSpeakCount: number;
  autoSpeakDate: string;
  lastAutoSpeakAt?: number;
  lastInteractionAt: number;
  lastSavedAt?: number;
};
