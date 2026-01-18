"use client";

import { useEffect, useMemo, useState } from "react";
import { deriveMood, type CoreEvent } from "@ai-pet/pet-core";
import {
  buildExportPayload,
  importFromPayload,
  loadProviderSettings,
  loadSaveData,
  persistProviderSettings,
  persistSaveData
} from "./lib/storage";
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
import { ActionFeedback } from "./components/ActionFeedback";
import { AchievementsPanel } from "./components/AchievementsPanel";
import { Backpack } from "./components/Backpack";
import { ChatPanel } from "./components/ChatPanel";
import { DailyGoals } from "./components/DailyGoals";
import { GrowthLog } from "./components/GrowthLog";
import { MemoryPanel } from "./components/MemoryPanel";
import { NarrativeTimeline } from "./components/NarrativeTimeline";
import { PetStage3D } from "./components/PetStage3D";
import { ProviderErrorBanner } from "./components/ProviderErrorBanner";
import { SaveLoadPanel } from "./components/SaveLoadPanel";
import { SettingsPanel } from "./components/SettingsPanel";
import { StatusPanel } from "./components/StatusPanel";

export default function HomePage() {
  const [state, setState] = useState<AppState>(() => createInitialAppState(Date.now()));
  const [hydrated, setHydrated] = useState(false);
  const [providerSettings, setProviderSettings] = useState(() => loadProviderSettings());
  const [storyTab, setStoryTab] = useState<"feedback" | "narrative" | "growth" | "memory">("feedback");

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
    persistProviderSettings(providerSettings);
  }, [hydrated, providerSettings]);

  useEffect(() => {
    if (!hydrated) return;
    const interval = window.setInterval(() => {
      setState((prev) => applyAutoSpeak(prev, Date.now(), providerSettings));
    }, AUTO_SPEAK_POLL_MS);

    return () => window.clearInterval(interval);
  }, [hydrated, providerSettings]);

  const moodLabel = useMemo(() => deriveMood(state.pet), [state.pet]);

  const handleAction = async (type: CoreEvent["type"] | "CHAT") => {
    const now = Date.now();
    if (type === "CHAT") {
      const snapshot = state;
      const settings = providerSettings;
      const next = await applyChat(snapshot, now, settings);
      setState((prev) => (prev === snapshot ? next : prev));
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

  const handleChatSend = async (message: string) => {
    const now = Date.now();
    const snapshot = state;
    const settings = providerSettings;
    const next = await applyChat(snapshot, now, settings, message);
    setState((prev) => (prev === snapshot ? next : prev));
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

      <ProviderErrorBanner
        message={state.providerErrorDismissedAt ? undefined : state.providerError}
        onDismiss={() =>
          setState((prev) => ({
            ...prev,
            providerError: undefined,
            providerErrorDismissedAt: Date.now()
          }))
        }
      />

      <div className="app-shell">
        <div className="side-column stagger">
          <PetStage3D moodLabel={moodLabel} message={state.message} />
          <StatusPanel pet={state.pet} />
        </div>

        <div className="main-column stagger">
          <ActionBar onAction={handleAction} />
          <ChatPanel
            onSend={handleChatSend}
            reply={state.message}
            suggestedActions={state.suggestedActions}
          />
          <div className="tab-bar panel soft">
            {[
              { id: "feedback", label: "行动反馈" },
              { id: "narrative", label: "叙事时间线" },
              { id: "growth", label: "成长记录" },
              { id: "memory", label: "记忆回顾" }
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                className={`tab-button ${storyTab === tab.id ? "active" : ""}`}
                onClick={() => setStoryTab(tab.id as typeof storyTab)}
              >
                {tab.label}
              </button>
            ))}
          </div>
          <div className="tab-content">
            {storyTab === "feedback" ? <ActionFeedback entries={state.log} /> : null}
            {storyTab === "narrative" ? <NarrativeTimeline entries={state.log} /> : null}
            {storyTab === "growth" ? <GrowthLog entries={state.log} claimedDates={state.dailyBadges} /> : null}
            {storyTab === "memory" ? <MemoryPanel memory={state.memory} /> : null}
          </div>
          <details className="panel soft collapsible">
            <summary>每日目标</summary>
            <div className="collapsible-body">
              <DailyGoals
                entries={state.log}
                claimedDates={state.dailyBadges}
                onClaim={(dateKey) =>
                  setState((prev) =>
                    prev.dailyBadges.includes(dateKey)
                      ? prev
                      : { ...prev, dailyBadges: [...prev.dailyBadges, dateKey] }
                  )
                }
              />
            </div>
          </details>
          <details className="panel soft collapsible">
            <summary>成就墙</summary>
            <div className="collapsible-body">
              <AchievementsPanel
                entries={state.log}
                badgeDates={state.dailyBadges}
                claimed={state.achievements}
                onClaim={(id) =>
                  setState((prev) =>
                    prev.achievements.includes(id)
                      ? prev
                      : { ...prev, achievements: [...prev.achievements, id] }
                  )
                }
              />
            </div>
          </details>
          <SettingsPanel
            provider={state.llmProvider}
            onProviderChange={(provider) => {
              setState((prev) => ({ ...prev, llmProvider: provider }));
              setProviderSettings((prev) => ({ ...prev, provider }));
            }}
            providerKey={providerSettings.apiKey ?? ""}
            providerBaseUrl={providerSettings.baseUrl ?? ""}
            providerModel={providerSettings.model ?? ""}
            onProviderKeyChange={(value) => setProviderSettings((prev) => ({ ...prev, apiKey: value }))}
            onProviderBaseUrlChange={(value) => setProviderSettings((prev) => ({ ...prev, baseUrl: value }))}
            onProviderModelChange={(value) => setProviderSettings((prev) => ({ ...prev, model: value }))}
            onProviderAttempt={() =>
              setState((prev) => ({
                ...prev,
                providerError: undefined,
                providerErrorDismissedAt: undefined
              }))
            }
            autoSpeakEnabled={state.autoSpeakEnabled}
            autoSpeakCount={state.autoSpeakCount}
            onToggleAutoSpeak={handleToggleAutoSpeak}
            onSaveNow={handleSaveNow}
            onExport={handleExport}
            onImport={handleImport}
            panels={state.settingsPanels}
            onTogglePanel={(panel) =>
              setState((prev) => ({
                ...prev,
                settingsPanels: { ...prev.settingsPanels, [panel]: !prev.settingsPanels[panel] }
              }))
            }
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
