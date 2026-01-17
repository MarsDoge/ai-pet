import { CURRENT_SAVE_VERSION, type SaveData } from "./types";
import { sanitizeState } from "./saveData";

export type MigrationResult = {
  save: SaveData;
  migrated: boolean;
  fromVersion: number;
};

function migrateV1ToV1(save: SaveData): SaveData {
  return {
    ...save,
    state: sanitizeState(save.state),
    kv: { ...(save.kv ?? {}) },
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
