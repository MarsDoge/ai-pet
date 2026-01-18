import type { EventLogEntry } from "@ai-pet/pet-memory";

type NarrativePayload = {
  text?: string;
  tags?: string[];
  source?: "chat" | "auto_speak";
};

type NarrativeTimelineProps = {
  entries: EventLogEntry[];
};

function formatTime(at: number) {
  return new Date(at).toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit" });
}

function getNarrative(entry: EventLogEntry): NarrativePayload | null {
  if (entry.type !== "NARRATIVE") return null;
  if (!entry.payload || typeof entry.payload !== "object") return null;
  return entry.payload as NarrativePayload;
}

export function NarrativeTimeline({ entries }: NarrativeTimelineProps) {
  const narratives = entries
    .map((entry) => ({ entry, payload: getNarrative(entry) }))
    .filter((item) => item.payload?.text)
    .slice(-8)
    .reverse();

  return (
    <section className="panel soft">
      <h2 className="section-title">叙事时间线</h2>
      <p className="subtle">记录宠物的即时心声与互动片段。</p>
      <div style={{ marginTop: 12, display: "grid", gap: 10 }}>
        {narratives.length === 0 ? (
          <span className="subtle">还没有故事片段，先聊聊吧。</span>
        ) : (
          narratives.map(({ entry, payload }) => (
            <div
              key={`${entry.at}-${payload?.text}`}
              style={{
                display: "grid",
                gap: 6,
                padding: "10px 12px",
                borderRadius: 12,
                border: "1px solid var(--border)",
                background: "rgba(255, 255, 255, 0.65)"
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", gap: 8 }}>
                <span className="subtle">{payload?.source === "auto_speak" ? "自言自语" : "对话片段"}</span>
                <span className="subtle">{formatTime(entry.at)}</span>
              </div>
              <strong style={{ fontSize: 14 }}>{payload?.text}</strong>
              {payload?.tags && payload.tags.length > 0 ? (
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                  {payload.tags.map((tag) => (
                    <span key={`${entry.at}-${tag}`} className="badge">
                      {tag}
                    </span>
                  ))}
                </div>
              ) : null}
            </div>
          ))
        )}
      </div>
    </section>
  );
}
