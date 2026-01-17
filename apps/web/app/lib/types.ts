import type { CoreEventType, PetState } from "@ai-pet/pet-core";
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
  lastSavedAt?: number;
};
