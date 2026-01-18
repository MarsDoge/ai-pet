import type { EventLogEntry } from "@ai-pet/pet-memory";

const EVENT_LABELS: Record<string, string> = {
  FEED: "喂食",
  PET: "抚摸",
  BATH: "洗澡",
  PLAY: "玩耍",
  SLEEP: "睡觉",
  CHAT: "聊天",
  AUTO_SPEAK: "自动说话",
  TICK: "时间流逝"
};

const STAT_LABELS: Record<string, string> = {
  hunger: "饥饿",
  energy: "精力",
  cleanliness: "清洁",
  fun: "快乐",
  affection: "亲密",
  exp: "经验",
  level: "等级",
  coins: "金币"
};

type ActionFeedbackProps = {
  entries: EventLogEntry[];
};

function formatDelta(entry: EventLogEntry) {
  if (!entry.delta) return [];
  return Object.entries(entry.delta)
    .map(([key, value]) => {
      const label = STAT_LABELS[key] ?? key;
      const numeric = typeof value === "number" ? value : 0;
      return { label, numeric };
    })
    .filter((entry) => entry.numeric !== 0)
    .map((entry) => {
      const sign = entry.numeric > 0 ? "+" : "";
      return { label: entry.label, value: `${sign}${entry.numeric}`, positive: entry.numeric > 0 };
    });
}

function formatTime(at: number) {
  return new Date(at).toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit" });
}

function formatNote(entry: EventLogEntry) {
  if (!entry.payload || typeof entry.payload !== "object") return "";
  const payload = entry.payload as Record<string, unknown>;
  if (typeof payload.message === "string" && payload.message.trim()) {
    return payload.message;
  }
  if (typeof payload.text === "string" && payload.text.trim()) {
    return payload.text;
  }
  return "";
}

export function ActionFeedback({ entries }: ActionFeedbackProps) {
  const recent = entries.slice(-8).reverse();

  return (
    <section className="panel soft">
      <h2 className="section-title">行动反馈</h2>
      <p className="subtle">最近的动作与变化。</p>
      <div style={{ marginTop: 12, display: "grid", gap: 10 }}>
        {recent.length === 0 ? (
          <span className="subtle">还没有记录，先做点什么吧。</span>
        ) : (
          recent.map((entry, index) => {
            const deltas = formatDelta(entry);
            const note = formatNote(entry);
            return (
              <div
                key={`${entry.type}-${entry.at}-${index}`}
                style={{
                  display: "grid",
                  gap: 6,
                  padding: "10px 12px",
                  borderRadius: 12,
                  border: "1px solid var(--border)",
                  background: "rgba(255, 255, 255, 0.7)"
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", gap: 8 }}>
                  <strong style={{ fontSize: 14 }}>
                    {EVENT_LABELS[entry.type] ?? entry.type}
                  </strong>
                  <span className="subtle">{formatTime(entry.at)}</span>
                </div>
                {note ? <span className="subtle">{note}</span> : null}
                {deltas.length > 0 ? (
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    {deltas.map((delta) => (
                      <span
                        key={`${entry.at}-${delta.label}`}
                        className="badge"
                        style={{
                          background: delta.positive
                            ? "rgba(64, 159, 112, 0.16)"
                            : "rgba(219, 113, 113, 0.16)",
                          color: "var(--text)"
                        }}
                      >
                        {delta.label} {delta.value}
                      </span>
                    ))}
                  </div>
                ) : null}
              </div>
            );
          })
        )}
      </div>
    </section>
  );
}
