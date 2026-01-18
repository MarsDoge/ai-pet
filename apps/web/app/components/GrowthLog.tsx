import type { EventLogEntry } from "@ai-pet/pet-memory";

type GrowthLogProps = {
  entries: EventLogEntry[];
  claimedDates: string[];
};

type DaySummary = {
  date: string;
  actions: number;
  narratives: number;
  chats: number;
  badgeClaimed: boolean;
};

const ACTION_TYPES = new Set(["FEED", "PET", "BATH", "PLAY", "SLEEP"]);

function getDateKey(timestamp: number) {
  return new Date(timestamp).toISOString().slice(0, 10);
}

function summarize(entries: EventLogEntry[], claimedDates: string[]): DaySummary[] {
  const buckets = new Map<string, Omit<DaySummary, "date">>();

  for (const entry of entries) {
    const date = getDateKey(entry.at);
    if (!buckets.has(date)) {
      buckets.set(date, {
        actions: 0,
        narratives: 0,
        chats: 0,
        badgeClaimed: claimedDates.includes(date)
      });
    }
    const bucket = buckets.get(date);
    if (!bucket) continue;
    if (ACTION_TYPES.has(entry.type)) bucket.actions += 1;
    if (entry.type === "CHAT") bucket.chats += 1;
    if (entry.type === "NARRATIVE") bucket.narratives += 1;
  }

  const dates = Array.from(buckets.keys()).sort((a, b) => (a < b ? 1 : -1));
  const recent = dates.slice(0, 7);
  return recent.map((date) => {
    const bucket = buckets.get(date) ?? {
      actions: 0,
      narratives: 0,
      chats: 0,
      badgeClaimed: claimedDates.includes(date)
    };
    return { date, ...bucket };
  });
}

export function GrowthLog({ entries, claimedDates }: GrowthLogProps) {
  const summaries = summarize(entries, claimedDates);

  return (
    <section className="panel soft">
      <h2 className="section-title">成长记录</h2>
      <p className="subtle">最近 7 天的动作、对话与故事汇总。</p>
      <div style={{ marginTop: 12, display: "grid", gap: 10 }}>
        {summaries.length === 0 ? (
          <span className="subtle">暂无记录，先开始互动吧。</span>
        ) : (
          summaries.map((summary) => (
            <div
              key={summary.date}
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
                <strong style={{ fontSize: 14 }}>{summary.date}</strong>
                <span className="subtle">{summary.badgeClaimed ? "徽章已领取" : "徽章未领取"}</span>
              </div>
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                <span className="badge">动作 {summary.actions}</span>
                <span className="badge">对话 {summary.chats}</span>
                <span className="badge">叙事 {summary.narratives}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
}
