"use client";

import { useState } from "react";
import type { SuggestedAction } from "@ai-pet/pet-ai";

type ChatPanelProps = {
  onSend: (message: string) => void;
  reply: string;
  suggestedActions: SuggestedAction[];
};

const ACTION_LABELS: Record<SuggestedAction, string> = {
  FEED: "喂食",
  PET: "抚摸",
  BATH: "洗澡",
  PLAY: "玩耍",
  SLEEP: "睡觉",
  CHAT: "聊天"
};

export function ChatPanel({ onSend, reply, suggestedActions }: ChatPanelProps) {
  const [message, setMessage] = useState("");

  const handleSend = () => {
    if (!message.trim()) return;
    onSend(message.trim());
    setMessage("");
  };

  return (
    <section className="panel soft">
      <h2 className="section-title">对话</h2>
      <p className="subtle">未配置 LLM 时将使用模板回复。</p>
      <div style={{ marginTop: 12, display: "grid", gap: 8 }}>
        <div className="speech-bubble" style={{ position: "relative", top: "auto", left: "auto" }}>
          <strong style={{ fontSize: 14 }}>{reply}</strong>
        </div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {suggestedActions.length === 0 ? (
            <span className="subtle">暂无建议动作。</span>
          ) : (
            suggestedActions.map((action) => (
              <span key={action} className="badge">
                {ACTION_LABELS[action]}
              </span>
            ))
          )}
        </div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <input
            type="text"
            value={message}
            placeholder="说点什么..."
            onChange={(event) => setMessage(event.target.value)}
            style={{
              flex: 1,
              minWidth: 180,
              padding: "10px 12px",
              borderRadius: 12,
              border: "1px solid var(--border)",
              fontFamily: "inherit"
            }}
          />
          <button className="action-button" type="button" onClick={handleSend}>
            发送
          </button>
        </div>
      </div>
    </section>
  );
}
