import type { EventLogEntry } from "@ai-pet/pet-memory";

type DailyGoalsProps = {
  entries: EventLogEntry[];
  claimedDates: string[];
  onClaim: (dateKey: string) => void;
};

const GOAL_ITEMS: Array<{ id: string; label: string; types: string[] }> = [
  { id: "feed", label: "喂食一次", types: ["FEED"] },
  { id: "play", label: "玩耍一次", types: ["PLAY"] },
  { id: "clean", label: "洗澡一次", types: ["BATH"] },
  { id: "chat", label: "聊天一次", types: ["CHAT"] }
];

function getDateKey(timestamp: number) {
  return new Date(timestamp).toISOString().slice(0, 10);
}

function startOfDay(timestamp: number) {
  const date = new Date(timestamp);
  date.setHours(0, 0, 0, 0);
  return date.getTime();
}

export function DailyGoals({ entries, claimedDates, onClaim }: DailyGoalsProps) {
  const now = Date.now();
  const dayStart = startOfDay(now);
  const todayKey = getDateKey(now);
  const todaysEntries = entries.filter((entry) => entry.at >= dayStart);
  const completed = GOAL_ITEMS.map((goal) => ({
    ...goal,
    done: todaysEntries.some((entry) => goal.types.includes(entry.type))
  }));
  const doneCount = completed.filter((goal) => goal.done).length;
  const allDone = doneCount === completed.length;
  const claimed = claimedDates.includes(todayKey);

  return (
    <section className="panel soft">
      <h2 className="section-title">每日目标</h2>
      <p className="subtle">完成动作即可点亮目标，领取今日徽章。</p>
      <div style={{ marginTop: 12, display: "grid", gap: 8 }}>
        {completed.map((goal) => (
          <div
            key={goal.id}
            style={{
              display: "flex",
              justifyContent: "space-between",
              gap: 8,
              padding: "8px 10px",
              borderRadius: 10,
              border: "1px solid var(--border)",
              background: goal.done ? "rgba(64, 159, 112, 0.12)" : "rgba(255, 255, 255, 0.7)"
            }}
          >
            <span>{goal.label}</span>
            <span className="subtle">{goal.done ? "已完成" : "待完成"}</span>
          </div>
        ))}
      </div>
      <div style={{ marginTop: 12, display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
        <span className="subtle">
          进度 {doneCount}/{completed.length}
        </span>
        <button
          className="action-button"
          type="button"
          onClick={() => onClaim(todayKey)}
          disabled={!allDone || claimed}
        >
          {claimed ? "已领取徽章" : allDone ? "领取徽章" : "完成后领取"}
        </button>
      </div>
    </section>
  );
}
