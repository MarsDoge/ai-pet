"use client";

import { AUTO_SPEAK_LIMIT } from "../lib/constants";

type AutoSpeakPanelProps = {
  enabled: boolean;
  count: number;
  onToggle: (enabled: boolean) => void;
};

export function AutoSpeakPanel({ enabled, count, onToggle }: AutoSpeakPanelProps) {
  return (
    <section className="panel">
      <h2 className="section-title">自动说话</h2>
      <p className="subtle">需求紧急或长时间闲置时自动提示。</p>
      <div style={{ marginTop: 12, display: "flex", gap: 12, flexWrap: "wrap" }}>
        <button
          className="action-button"
          type="button"
          onClick={() => onToggle(!enabled)}
        >
          {enabled ? "关闭" : "开启"}
        </button>
        <span className="subtle">
          今日 {count}/{AUTO_SPEAK_LIMIT}
        </span>
      </div>
    </section>
  );
}
