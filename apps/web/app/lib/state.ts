import {
  applyTickCompensation,
  createInitialState,
  reduce,
  type CoreEvent,
  type PetState
} from "@ai-pet/pet-core";
import {
  buildTemplateReply,
  createTemplateAdapter,
  fetchOpenAiCompatibleReply
} from "@ai-pet/pet-ai";
import { EventLog } from "@ai-pet/pet-memory";
import type { EventLogEntry, SaveData } from "@ai-pet/pet-memory";
import {
  AUTO_SPEAK_COOLDOWN_MS,
  AUTO_SPEAK_IDLE_MS,
  AUTO_SPEAK_LIMIT,
  DEFAULT_INVENTORY
} from "./constants";
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
  const today = getTodayKey(now);
  return {
    pet: createInitialState({ lastTickAt: now }),
    log: [],
    inventory: DEFAULT_INVENTORY,
    message: "我刚到哦，一起探索吧。",
    suggestedActions: [],
    llmProvider: "none",
    settingsPanels: {
      ai: true,
      autoSpeak: true,
      saveLoad: true
    },
    autoSpeakEnabled: true,
    autoSpeakCount: 0,
    autoSpeakDate: today,
    lastInteractionAt: now
  };
}

type EventOptions = { markInteraction?: boolean };

export function applyEventWithLog(
  state: AppState,
  event: CoreEvent,
  payload?: unknown,
  options: EventOptions = {}
): AppState {
  const result = reduce(state.pet, event);
  const logEntry: EventLogEntry = {
    type: event.type,
    at: event.at,
    delta: result.delta,
    payload
  };

  const eventLog = new EventLog(state.log);
  const log = eventLog.append(logEntry);
  const shouldMarkInteraction = options.markInteraction ?? true;

  return {
    ...state,
    pet: result.state,
    log,
    lastInteractionAt: shouldMarkInteraction ? event.at : state.lastInteractionAt
  };
}

export function applyEventsWithLog(state: AppState, events: CoreEvent[]): AppState {
  return events.reduce(
    (nextState, event) => applyEventWithLog(nextState, event, undefined, { markInteraction: false }),
    state
  );
}

export function applyTickCompensationWithLog(state: AppState, nowMs: number): AppState {
  const { events } = applyTickCompensation(state.pet, nowMs);
  if (events.length === 0) return state;
  return applyEventsWithLog(state, events);
}

type ProviderSettings = {
  provider: "none" | "openai" | "deepseek" | "ollama";
  apiKey?: string;
  baseUrl?: string;
  model?: string;
};

export async function buildAiReply(
  state: AppState,
  providerSettings: ProviderSettings,
  lastUserMessage?: string
) {
  const recentEvents = state.log.slice(-5).map((entry) => ({ type: entry.type, at: entry.at }));
  const context = { pet: state.pet, recentEvents, lastUserMessage };

  if (providerSettings.provider === "none") {
    return buildTemplateReply(context);
  }
  if (!providerSettings.apiKey) {
    throw new Error("missing_api_key");
  }

  const baseUrl = providerSettings.baseUrl;
  const model = providerSettings.model ?? "gpt-4o-mini";

  return fetchOpenAiCompatibleReply(context, {
    apiKey: providerSettings.apiKey,
    baseUrl,
    model
  });
}

export async function applyChat(
  state: AppState,
  at: number,
  providerSettings: ProviderSettings,
  lastUserMessage?: string
): Promise<AppState> {
  let reply = null;
  let errorMessage = "";

  try {
    reply = await buildAiReply(state, providerSettings, lastUserMessage);
  } catch (error) {
    if (error instanceof Error && error.message === "missing_api_key") {
      errorMessage = "未填写 API Key，已切换为模板回复。";
    } else {
      errorMessage = "AI 请求失败，已切换为模板回复。";
    }
    reply = buildTemplateReply({
      pet: state.pet,
      recentEvents: state.log.slice(-5).map((entry) => ({ type: entry.type, at: entry.at })),
      lastUserMessage
    });
  }
  const eventLog = new EventLog(state.log);
  const log = eventLog.append({
    type: "CHAT",
    at,
    payload: {
      message: lastUserMessage,
      reply: reply.text,
      suggestedActions: reply.suggestedActions,
      error: errorMessage || undefined
    }
  });

  return {
    ...state,
    message: errorMessage ? `${errorMessage} ${reply.text}` : reply.text,
    suggestedActions: reply.suggestedActions,
    log,
    lastInteractionAt: at
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
  const nextState = applyEventWithLog(
    { ...state, inventory: updatedInventory },
    event,
    { itemId: target.id },
    { markInteraction: true }
  );

  return {
    ...nextState,
    message: `${target.name} 已使用。${target.kind === "food" ? "真香。" : "太好玩了。"}`
  };
}

type AutoSpeakSettings = {
  enabled: boolean;
  count: number;
  date: string;
  lastAutoSpeakAt?: number;
  lastInteractionAt?: number;
};

function hydrateProvider(raw: unknown): AppState["llmProvider"] {
  if (raw === "openai" || raw === "deepseek" || raw === "ollama") return raw;
  return "none";
}

function hydratePanels(raw: unknown): AppState["settingsPanels"] {
  if (!raw || typeof raw !== "object") {
    return { ai: true, autoSpeak: true, saveLoad: true };
  }

  const record = raw as Record<string, unknown>;
  return {
    ai: typeof record.ai === "boolean" ? record.ai : true,
    autoSpeak: typeof record.autoSpeak === "boolean" ? record.autoSpeak : true,
    saveLoad: typeof record.saveLoad === "boolean" ? record.saveLoad : true
  };
}

function getTodayKey(now: number): string {
  return new Date(now).toISOString().slice(0, 10);
}

function hydrateAutoSpeak(raw: unknown, now: number): AutoSpeakSettings {
  const today = getTodayKey(now);
  if (!raw || typeof raw !== "object") {
    return { enabled: true, count: 0, date: today, lastInteractionAt: now };
  }

  const record = raw as Record<string, unknown>;
  const enabled = typeof record.enabled === "boolean" ? record.enabled : true;
  const date = typeof record.date === "string" ? record.date : today;
  const count = typeof record.count === "number" ? Math.max(0, record.count) : 0;
  const lastAutoSpeakAt = typeof record.lastAutoSpeakAt === "number" ? record.lastAutoSpeakAt : undefined;
  const lastInteractionAt = typeof record.lastInteractionAt === "number" ? record.lastInteractionAt : now;

  return { enabled, count, date, lastAutoSpeakAt, lastInteractionAt };
}

export function loadFromSaveData(save: SaveData, now: number): AppState {
  const inventory = hydrateInventory(save.kv?.inventory);
  const llmProvider = hydrateProvider(save.kv?.llmProvider);
  const settingsPanels = hydratePanels(save.kv?.settingsPanels);
  const autoSpeak = hydrateAutoSpeak(save.kv?.autoSpeak, now);
  const base: AppState = {
    pet: { ...save.state, lastTickAt: save.state.lastTickAt ?? 0 },
    log: save.log ?? [],
    inventory,
    message: "欢迎回来。",
    suggestedActions: [],
    llmProvider,
    settingsPanels,
    autoSpeakEnabled: autoSpeak.enabled,
    autoSpeakCount: autoSpeak.date === getTodayKey(now) ? autoSpeak.count : 0,
    autoSpeakDate: getTodayKey(now),
    lastAutoSpeakAt: autoSpeak.lastAutoSpeakAt,
    lastInteractionAt: autoSpeak.lastInteractionAt ?? now
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

type AutoSpeakReason = "HUNGRY" | "TIRED" | "DIRTY" | "IDLE";

const AUTO_SPEAK_MESSAGES: Record<AutoSpeakReason, string> = {
  HUNGRY: "我有点饿了，有没有好吃的？",
  TIRED: "有点累了，想睡一会儿。",
  DIRTY: "身上有点脏，能帮我洗洗吗？",
  IDLE: "好久没动静了，我们做点什么吧？"
};

function getAutoSpeakReason(state: AppState, now: number): AutoSpeakReason | null {
  if (state.pet.hunger >= 80) return "HUNGRY";
  if (state.pet.energy <= 20) return "TIRED";
  if (state.pet.cleanliness <= 20) return "DIRTY";
  if (now - state.lastInteractionAt >= AUTO_SPEAK_IDLE_MS) return "IDLE";
  return null;
}

function resetDailyCountIfNeeded(state: AppState, now: number): AppState {
  const today = getTodayKey(now);
  if (state.autoSpeakDate === today) return state;

  return {
    ...state,
    autoSpeakDate: today,
    autoSpeakCount: 0
  };
}

export function applyAutoSpeak(
  state: AppState,
  now: number,
  providerSettings: ProviderSettings
): AppState {
  const normalized = resetDailyCountIfNeeded(state, now);
  if (!normalized.autoSpeakEnabled) return normalized;
  if (normalized.autoSpeakCount >= AUTO_SPEAK_LIMIT) return normalized;
  if (
    normalized.lastAutoSpeakAt &&
    now - normalized.lastAutoSpeakAt < AUTO_SPEAK_COOLDOWN_MS
  ) {
    return normalized;
  }

  const reason = getAutoSpeakReason(normalized, now);
  if (!reason) return normalized;

  const reply = buildTemplateReply({
    pet: normalized.pet,
    recentEvents: normalized.log.slice(-5).map((entry) => ({ type: entry.type, at: entry.at }))
  });
  const eventLog = new EventLog(normalized.log);
  const log = eventLog.append({
    type: "AUTO_SPEAK",
    at: now,
    payload: { reason, text: AUTO_SPEAK_MESSAGES[reason], suggestedActions: reply.suggestedActions }
  });

  return {
    ...normalized,
    message: AUTO_SPEAK_MESSAGES[reason],
    suggestedActions: reply.suggestedActions,
    log,
    autoSpeakCount: normalized.autoSpeakCount + 1,
    lastAutoSpeakAt: now
  };
}
