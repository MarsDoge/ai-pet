"use client";

import { useState } from "react";

type SettingsPanelProps = {
  provider: "none" | "openai" | "deepseek" | "ollama";
  onProviderChange: (provider: SettingsPanelProps["provider"]) => void;
  autoSpeakEnabled: boolean;
  autoSpeakCount: number;
  onToggleAutoSpeak: (enabled: boolean) => void;
  onSaveNow: () => void;
  onExport: () => string;
  onImport: (payload: string) => string | null;
};

const PROVIDER_LABELS: Record<SettingsPanelProps["provider"], string> = {
  none: "关闭",
  openai: "OpenAI",
  deepseek: "DeepSeek",
  ollama: "Ollama"
};

export function SettingsPanel({
  provider,
  onProviderChange,
  autoSpeakEnabled,
  autoSpeakCount,
  onToggleAutoSpeak,
  onSaveNow,
  onExport,
  onImport
}: SettingsPanelProps) {
  const [status, setStatus] = useState<string | null>(null);

  const handleExport = async () => {
    const payload = onExport();
    try {
      await navigator.clipboard.writeText(payload);
      setStatus("已复制 JSON 到剪贴板。");
    } catch {
      setStatus("复制失败，请在存档面板中手动导出。");
    }
  };

  const handleImport = () => {
    const payload = window.prompt("请粘贴导出的 JSON：");
    if (!payload) return;
    const result = onImport(payload);
    setStatus(result ?? "导入成功。");
  };

  const handleSave = () => {
    onSaveNow();
    setStatus("已保存。");
  };

  return (
    <section className="panel">
      <h2 className="section-title">设置</h2>
      <div style={{ display: "grid", gap: 12, marginTop: 12 }}>
        <div style={{ display: "grid", gap: 6 }}>
          <label className="subtle">AI 提供方</label>
          <select
            value={provider}
            onChange={(event) => onProviderChange(event.target.value as SettingsPanelProps["provider"])}
            style={{
              padding: "10px 12px",
              borderRadius: 12,
              border: "1px solid var(--border)",
              fontFamily: "inherit"
            }}
          >
            {Object.entries(PROVIDER_LABELS).map(([key, label]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </select>
        </div>

        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
          <button className="action-button" type="button" onClick={() => onToggleAutoSpeak(!autoSpeakEnabled)}>
            {autoSpeakEnabled ? "关闭自动说话" : "开启自动说话"}
          </button>
          <span className="subtle">今日自动说话 {autoSpeakCount} 次</span>
        </div>

        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <button className="action-button" type="button" onClick={handleSave}>
            快速保存
          </button>
          <button className="action-button" type="button" onClick={handleExport}>
            复制 JSON
          </button>
          <button className="action-button" type="button" onClick={handleImport}>
            快速导入
          </button>
        </div>

        {status ? <span className="subtle">{status}</span> : null}
      </div>
    </section>
  );
}
