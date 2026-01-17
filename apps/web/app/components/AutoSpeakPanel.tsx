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
      <h2 className="section-title">Auto Speak</h2>
      <p className="subtle">Automatic messages when needs are urgent or idle.</p>
      <div style={{ marginTop: 12, display: "flex", gap: 12, flexWrap: "wrap" }}>
        <button
          className="action-button"
          type="button"
          onClick={() => onToggle(!enabled)}
        >
          {enabled ? "Disable" : "Enable"}
        </button>
        <span className="subtle">
          {count}/{AUTO_SPEAK_LIMIT} today
        </span>
      </div>
    </section>
  );
}
