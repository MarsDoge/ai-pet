"use client";

import Link from "next/link";
import { useState } from "react";

type SettingsPanelProps = {
  provider: "none" | "openai" | "deepseek" | "ollama";
  onProviderChange: (provider: SettingsPanelProps["provider"]) => void;
  providerKey: string;
  providerBaseUrl: string;
  providerModel: string;
  onProviderKeyChange: (value: string) => void;
  onProviderBaseUrlChange: (value: string) => void;
  onProviderModelChange: (value: string) => void;
  autoSpeakEnabled: boolean;
  autoSpeakCount: number;
  onToggleAutoSpeak: (enabled: boolean) => void;
  onSaveNow: () => void;
  onExport: () => string;
  onImport: (payload: string) => string | null;
  panels: {
    ai: boolean;
    autoSpeak: boolean;
    saveLoad: boolean;
  };
  onTogglePanel: (panel: keyof SettingsPanelProps["panels"]) => void;
  onProviderAttempt: () => void;
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
  providerKey,
  providerBaseUrl,
  providerModel,
  onProviderKeyChange,
  onProviderBaseUrlChange,
  onProviderModelChange,
  autoSpeakEnabled,
  autoSpeakCount,
  onToggleAutoSpeak,
  onSaveNow,
  onExport,
  onImport,
  panels,
  onTogglePanel,
  onProviderAttempt
}: SettingsPanelProps) {
  const [status, setStatus] = useState<string | null>(null);
  const missingKey = provider !== "none" && providerKey.trim().length === 0;
  const missingModel = provider !== "none" && providerModel.trim().length === 0;
  const showOllamaHint = provider === "ollama" && providerBaseUrl.trim().length === 0;

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
        <div>
          <button className="action-button" type="button" onClick={() => onTogglePanel("ai")}>
            {panels.ai ? "隐藏 AI 设置" : "显示 AI 设置"}
          </button>
          {panels.ai ? (
            <div style={{ display: "grid", gap: 6, marginTop: 8 }}>
              <label className="subtle">AI 提供方</label>
              <select
                value={provider}
                onChange={(event) => {
                  onProviderAttempt();
                  onProviderChange(event.target.value as SettingsPanelProps["provider"]);
                }}
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
              {missingKey ? (
                <span className="subtle">未填写 API Key，聊天将使用模板回复。</span>
              ) : null}
              <input
                type="password"
                value={providerKey}
                onChange={(event) => {
                  onProviderAttempt();
                  onProviderKeyChange(event.target.value);
                }}
                placeholder="API Key（可选）"
                style={{
                  padding: "10px 12px",
                  borderRadius: 12,
                  border: "1px solid var(--border)",
                  fontFamily: "inherit"
                }}
              />
              <input
                type="text"
                value={providerBaseUrl}
                onChange={(event) => {
                  onProviderAttempt();
                  onProviderBaseUrlChange(event.target.value);
                }}
                placeholder="Base URL（可选）"
                style={{
                  padding: "10px 12px",
                  borderRadius: 12,
                  border: "1px solid var(--border)",
                  fontFamily: "inherit"
                }}
              />
              <input
                type="text"
                value={providerModel}
                onChange={(event) => {
                  onProviderAttempt();
                  onProviderModelChange(event.target.value);
                }}
                placeholder="Model（可选）"
                style={{
                  padding: "10px 12px",
                  borderRadius: 12,
                  border: "1px solid var(--border)",
                  fontFamily: "inherit"
                }}
              />
              {missingModel ? <span className="subtle">建议填写 Model 以避免默认不匹配。</span> : null}
              {showOllamaHint ? (
                <span className="subtle">Ollama Base URL 示例：http://localhost:11434/v1</span>
              ) : null}
              <Link className="subtle" href="/provider-setup/">
                配置说明
              </Link>
            </div>
          ) : null}
        </div>

        <div>
          <button className="action-button" type="button" onClick={() => onTogglePanel("autoSpeak")}>
            {panels.autoSpeak ? "隐藏自动说话" : "显示自动说话"}
          </button>
          {panels.autoSpeak ? (
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center", marginTop: 8 }}>
              <button className="action-button" type="button" onClick={() => onToggleAutoSpeak(!autoSpeakEnabled)}>
                {autoSpeakEnabled ? "关闭自动说话" : "开启自动说话"}
              </button>
              <span className="subtle">今日自动说话 {autoSpeakCount} 次</span>
            </div>
          ) : null}
        </div>

        <div>
          <button className="action-button" type="button" onClick={() => onTogglePanel("saveLoad")}>
            {panels.saveLoad ? "隐藏存档工具" : "显示存档工具"}
          </button>
          {panels.saveLoad ? (
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 8 }}>
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
          ) : null}
        </div>

        {status ? <span className="subtle">{status}</span> : null}
      </div>
    </section>
  );
}
