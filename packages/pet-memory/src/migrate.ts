import { CURRENT_SAVE_VERSION, type SaveData } from "./types";
import { sanitizeState } from "./saveData";

export type MigrationResult = {
  save: SaveData;
  migrated: boolean;
  fromVersion: number;
};

type MemoryEntry = {
  at: number;
  role: "user" | "pet";
  text: string;
};

type MemoryState = {
  shortTerm: MemoryEntry[];
  longTerm: {
    profile: string;
    preferences: string[];
    notes: Record<string, string>;
  };
};

const DEFAULT_MEMORY: MemoryState = {
  shortTerm: [],
  longTerm: {
    profile: "",
    preferences: [],
    notes: {}
  }
};

function sanitizeMemory(raw: unknown): MemoryState {
  if (!raw || typeof raw !== "object") return DEFAULT_MEMORY;
  const record = raw as Record<string, unknown>;
  const shortTermRaw = Array.isArray(record.shortTerm) ? record.shortTerm : [];
  const shortTerm = shortTermRaw
    .map((entry) => {
      if (!entry || typeof entry !== "object") return null;
      const item = entry as Record<string, unknown>;
      const at = typeof item.at === "number" ? item.at : NaN;
      const role = item.role === "user" || item.role === "pet" ? item.role : null;
      const text = typeof item.text === "string" ? item.text : "";
      if (!Number.isFinite(at) || !role || !text) return null;
      return { at, role, text } satisfies MemoryEntry;
    })
    .filter(Boolean)
    .slice(-20) as MemoryEntry[];
  const longTermRaw =
    record.longTerm && typeof record.longTerm === "object"
      ? (record.longTerm as Record<string, unknown>)
      : {};
  const profile = typeof longTermRaw.profile === "string" ? longTermRaw.profile : "";
  const preferences = Array.isArray(longTermRaw.preferences)
    ? longTermRaw.preferences.filter((item) => typeof item === "string")
    : [];
  const notesRaw =
    longTermRaw.notes && typeof longTermRaw.notes === "object"
      ? (longTermRaw.notes as Record<string, unknown>)
      : {};
  const notes: Record<string, string> = {};
  for (const [key, value] of Object.entries(notesRaw)) {
    if (typeof value === "string") notes[key] = value;
  }

  return {
    shortTerm,
    longTerm: {
      profile,
      preferences,
      notes
    }
  };
}

function migrateV1ToV1(save: SaveData): SaveData {
  const kv = { ...(save.kv ?? {}) };
  if (!kv.memory) {
    kv.memory = DEFAULT_MEMORY;
  } else {
    kv.memory = sanitizeMemory(kv.memory);
  }
  return {
    ...save,
    state: sanitizeState(save.state),
    kv,
    log: [...(save.log ?? [])]
  };
}

export function migrateSaveData(save: SaveData): MigrationResult {
  if (save.version !== CURRENT_SAVE_VERSION) {
    throw new Error(`Unsupported save version: ${save.version}`);
  }

  const migratedSave = migrateV1ToV1(save);
  return {
    save: migratedSave,
    migrated: true,
    fromVersion: save.version
  };
}
