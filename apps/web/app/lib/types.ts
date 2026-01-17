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

export type AppState = {
  pet: PetState;
  log: EventLogEntry[];
  inventory: InventoryItem[];
  message: string;
  suggestedActions: SuggestedAction[];
  autoSpeakEnabled: boolean;
  autoSpeakCount: number;
  autoSpeakDate: string;
  lastAutoSpeakAt?: number;
  lastInteractionAt: number;
  lastSavedAt?: number;
};
