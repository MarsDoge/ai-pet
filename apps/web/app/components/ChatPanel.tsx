"use client";

import { useState } from "react";
import type { SuggestedAction } from "@ai-pet/pet-ai";

type ChatPanelProps = {
  onSend: (message: string) => void;
  reply: string;
  suggestedActions: SuggestedAction[];
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
      <h2 className="section-title">Chat</h2>
      <p className="subtle">Template replies are used when no LLM is configured.</p>
      <div style={{ marginTop: 12, display: "grid", gap: 8 }}>
        <div className="speech-bubble" style={{ position: "relative", top: "auto", left: "auto" }}>
          <strong style={{ fontSize: 14 }}>{reply}</strong>
        </div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {suggestedActions.length === 0 ? (
            <span className="subtle">No suggestions yet.</span>
          ) : (
            suggestedActions.map((action) => (
              <span key={action} className="badge">
                {action}
              </span>
            ))
          )}
        </div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <input
            type="text"
            value={message}
            placeholder="Say hello..."
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
            Send
          </button>
        </div>
      </div>
    </section>
  );
}
