"use client";

import { useEffect, useMemo, useState } from "react";
import { deriveMood, type CoreEvent } from "@ai-pet/pet-core";
import { buildExportPayload, importFromPayload, loadSaveData, persistSaveData } from "./lib/storage";
import { ACTION_MESSAGES, AUTO_SPEAK_POLL_MS, type ActionMessageType } from "./lib/constants";
import {
  applyChat,
  applyAutoSpeak,
  applyEventWithLog,
  applyInventoryUse,
  createInitialAppState,
  loadFromSaveData
} from "./lib/state";
import type { AppState } from "./lib/types";
import { ActionBar } from "./components/ActionBar";
import { AutoSpeakPanel } from "./components/AutoSpeakPanel";
import { Backpack } from "./components/Backpack";
import { ChatPanel } from "./components/ChatPanel";
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

  useEffect(() => {
    if (!hydrated) return;
    const interval = window.setInterval(() => {
      setState((prev) => applyAutoSpeak(prev, Date.now()));
    }, AUTO_SPEAK_POLL_MS);

    return () => window.clearInterval(interval);
  }, [hydrated]);

  const moodLabel = useMemo(() => deriveMood(state.pet), [state.pet]);

  const handleAction = (type: CoreEvent["type"] | "CHAT") => {
    const now = Date.now();
    if (type === "CHAT") {
      setState((prev) => applyChat(prev, now));
      return;
    }

    const event: CoreEvent = { type, at: now };
    setState((prev) => ({
      ...applyEventWithLog(prev, event),
      message: ACTION_MESSAGES[type as ActionMessageType] ?? prev.message
    }));
  };

  const handleUseItem = (id: string) => {
    const now = Date.now();
    setState((prev) => applyInventoryUse(prev, id, now));
  };

  const handleChatSend = (message: string) => {
    const now = Date.now();
    setState((prev) => applyChat(prev, now, message));
  };

  const handleToggleAutoSpeak = (enabled: boolean) => {
    setState((prev) => ({ ...prev, autoSpeakEnabled: enabled }));
  };

  const handleExport = () => buildExportPayload(state);

  const handleImport = (payload: string) => {
    try {
      const save = importFromPayload(payload);
      setState(loadFromSaveData(save, Date.now()));
      return null;
    } catch (error) {
      console.error(error);
      return "导入失败，请检查 JSON 格式与版本。";
    }
  };

  const handleSaveNow = () => {
    persistSaveData(state);
    setState((prev) => ({ ...prev, lastSavedAt: Date.now() }));
  };

  return (
    <main>
      <header className="fade-in">
        <span className="badge">离线可用</span>
        <h1 style={{ marginTop: 12, fontSize: "clamp(28px, 5vw, 44px)" }}>
          AI 宠物小屋
        </h1>
        <p className="subtle">确定性养成循环，无需 AI 也能玩。</p>
      </header>

      <div className="app-shell">
        <div className="stagger" style={{ display: "grid", gap: 24 }}>
          <PetStage moodLabel={moodLabel} message={state.message} />
          <StatusPanel pet={state.pet} />
        </div>

        <div className="stagger" style={{ display: "grid", gap: 24 }}>
          <ActionBar onAction={handleAction} />
          <ChatPanel
            onSend={handleChatSend}
            reply={state.message}
            suggestedActions={state.suggestedActions}
          />
          <AutoSpeakPanel
            enabled={state.autoSpeakEnabled}
            count={state.autoSpeakCount}
            onToggle={handleToggleAutoSpeak}
          />
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
