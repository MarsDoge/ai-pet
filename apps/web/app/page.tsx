"use client";

import { useEffect, useMemo, useState } from "react";
import { deriveMood, type CoreEvent } from "@ai-pet/pet-core";
import { importFromPayload, loadSaveData, persistSaveData, buildExportPayload } from "./lib/storage";
import { ACTION_MESSAGES } from "./lib/constants";
import {
  applyChat,
  applyEventWithLog,
  applyInventoryUse,
  createInitialAppState,
  loadFromSaveData
} from "./lib/state";
import type { AppState } from "./lib/types";
import { ActionBar } from "./components/ActionBar";
import { Backpack } from "./components/Backpack";
import { PetStage } from "./components/PetStage";
import { SaveLoadPanel } from "./components/SaveLoadPanel";
import { StatusPanel } from "./components/StatusPanel";

export default function HomePage() {
  const [state, setState] = useState<AppState>(() => createInitialAppState(Date.now()));
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const now = Date.now();
    const save = loadSaveData();
    if (save) {
      setState(loadFromSaveData(save, now));
    } else {
      setState(createInitialAppState(now));
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    persistSaveData(state);
  }, [hydrated, state]);

  const moodLabel = useMemo(() => deriveMood(state.pet), [state.pet]);

  const handleAction = (type: CoreEvent["type"] | "CHAT") => {
    const now = Date.now();
    if (type === "CHAT") {
      setState((prev) => applyChat({ ...prev, message: ACTION_MESSAGES.CHAT }, now));
      return;
    }

    const event: CoreEvent = { type, at: now };
    setState((prev) => ({
      ...applyEventWithLog(prev, event),
      message: ACTION_MESSAGES[type]
    }));
  };

  const handleUseItem = (id: string) => {
    const now = Date.now();
    setState((prev) => applyInventoryUse(prev, id, now));
  };

  const handleExport = () => buildExportPayload(state);

  const handleImport = (payload: string) => {
    try {
      const save = importFromPayload(payload);
      setState(loadFromSaveData(save, Date.now()));
      return null;
    } catch (error) {
      console.error(error);
      return "Import failed. Check the JSON format and version.";
    }
  };

  const handleSaveNow = () => {
    persistSaveData(state);
    setState((prev) => ({ ...prev, lastSavedAt: Date.now() }));
  };

  return (
    <main>
      <header className="fade-in">
        <span className="badge">offline-ready</span>
        <h1 style={{ marginTop: 12, fontSize: "clamp(28px, 5vw, 44px)" }}>
          AI Pet Playground
        </h1>
        <p className="subtle">Deterministic care loop. No AI required.</p>
      </header>

      <div className="app-shell">
        <div className="stagger" style={{ display: "grid", gap: 24 }}>
          <PetStage moodLabel={moodLabel} message={state.message} />
          <StatusPanel pet={state.pet} />
        </div>

        <div className="stagger" style={{ display: "grid", gap: 24 }}>
          <ActionBar onAction={handleAction} />
          <Backpack items={state.inventory} onUse={handleUseItem} />
          <SaveLoadPanel
            onExport={handleExport}
            onImport={handleImport}
            onSaveNow={handleSaveNow}
            lastSavedAt={state.lastSavedAt}
          />
        </div>
      </div>
    </main>
  );
}
