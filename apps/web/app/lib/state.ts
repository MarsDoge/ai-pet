import {
  applyTickCompensation,
  createInitialState,
  deriveMood,
  reduce,
  type CoreEvent,
  type PetState
} from "@ai-pet/pet-core";
import { EventLog } from "@ai-pet/pet-memory";
import type { EventLogEntry, SaveData } from "@ai-pet/pet-memory";
import { CHAT_TEMPLATES, DEFAULT_INVENTORY } from "./constants";
import type { AppState, InventoryItem } from "./types";

export function hydrateInventory(raw: unknown): InventoryItem[] {
  if (!Array.isArray(raw)) return DEFAULT_INVENTORY;
  const safe = raw
    .filter((item) => item && typeof item === "object")
    .map((item) => {
      const record = item as Partial<InventoryItem>;
      if (!record.id || !record.name || !record.kind || !record.actionType) return null;
      const quantity = typeof record.quantity === "number" && record.quantity > 0 ? record.quantity : 1;
      return {
        id: record.id,
        name: record.name,
        kind: record.kind,
        actionType: record.actionType,
        quantity
      } satisfies InventoryItem;
    })
    .filter(Boolean) as InventoryItem[];

  return safe.length > 0 ? safe : DEFAULT_INVENTORY;
}

export function createInitialAppState(now: number): AppState {
  return {
    pet: createInitialState({ lastTickAt: now }),
    log: [],
    inventory: DEFAULT_INVENTORY,
    message: "Just arrived. Let's explore together."
  };
}

export function applyEventWithLog(state: AppState, event: CoreEvent, payload?: unknown): AppState {
  const result = reduce(state.pet, event);
  const logEntry: EventLogEntry = {
    type: event.type,
    at: event.at,
    delta: result.delta,
    payload
  };

  const eventLog = new EventLog(state.log);
  const log = eventLog.append(logEntry);

  return {
    ...state,
    pet: result.state,
    log
  };
}

export function applyEventsWithLog(state: AppState, events: CoreEvent[]): AppState {
  return events.reduce((nextState, event) => applyEventWithLog(nextState, event), state);
}

export function applyTickCompensationWithLog(state: AppState, nowMs: number): AppState {
  const { events } = applyTickCompensation(state.pet, nowMs);
  if (events.length === 0) return state;
  return applyEventsWithLog(state, events);
}

export function buildChatMessage(state: AppState): string {
  const mood = deriveMood(state.pet);
  return CHAT_TEMPLATES[mood];
}

export function applyChat(state: AppState, at: number): AppState {
  const message = buildChatMessage(state);
  const eventLog = new EventLog(state.log);
  const log = eventLog.append({ type: "CHAT", at, payload: { message } });

  return {
    ...state,
    message,
    log
  };
}

export function applyInventoryUse(state: AppState, itemId: string, at: number): AppState {
  const target = state.inventory.find((item) => item.id === itemId);
  if (!target || target.quantity <= 0) return state;

  const updatedInventory = state.inventory
    .map((item) =>
      item.id === itemId ? { ...item, quantity: Math.max(0, item.quantity - 1) } : item
    )
    .filter((item) => item.quantity > 0);

  const event: CoreEvent = { type: target.actionType, at };
  const nextState = applyEventWithLog({ ...state, inventory: updatedInventory }, event, {
    itemId: target.id
  });

  return {
    ...nextState,
    message: `${target.name} used. ${target.kind === "food" ? "Yum." : "That was fun."}`
  };
}

export function loadFromSaveData(save: SaveData, now: number): AppState {
  const inventory = hydrateInventory(save.kv?.inventory);
  const base: AppState = {
    pet: { ...save.state, lastTickAt: save.state.lastTickAt ?? 0 },
    log: save.log ?? [],
    inventory,
    message: "Welcome back."
  };

  return applyTickCompensationWithLog(base, now);
}

export function buildExportState(state: AppState): AppState {
  return {
    ...state,
    pet: {
      ...state.pet,
      lastTickAt: state.pet.lastTickAt
    }
  };
}
