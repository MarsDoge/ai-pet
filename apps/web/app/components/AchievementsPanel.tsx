import type { EventLogEntry } from "@ai-pet/pet-memory";

type Achievement = {
  id: string;
  title: string;
  description: string;
  target: number;
  kind: "actions" | "chat" | "narrative" | "badges";
};

type AchievementsPanelProps = {
  entries: EventLogEntry[];
  claimed: string[];
  badgeDates: string[];
  onClaim: (id: string) => void;
};

const ACHIEVEMENTS: Achievement[] = [
  { id: "actions-10", title: "小小行动家", description: "累计 10 次动作", target: 10, kind: "actions" },
  { id: "actions-50", title: "勤劳的伙伴", description: "累计 50 次动作", target: 50, kind: "actions" },
  { id: "chat-10", title: "聊天达人", description: "累计 10 次聊天", target: 10, kind: "chat" },
  { id: "story-10", title: "故事收藏家", description: "累计 10 条叙事", target: 10, kind: "narrative" },
  { id: "badge-3", title: "坚持三天", description: "累计 3 天领取徽章", target: 3, kind: "badges" },
  { id: "badge-7", title: "一周同行", description: "累计 7 天领取徽章", target: 7, kind: "badges" }
];

const ACTION_TYPES = new Set(["FEED", "PET", "BATH", "PLAY", "SLEEP"]);

function countStats(entries: EventLogEntry[], badgeDates: string[]) {
  let actions = 0;
  let chats = 0;
  let narratives = 0;
  for (const entry of entries) {
    if (ACTION_TYPES.has(entry.type)) actions += 1;
    if (entry.type === "CHAT") chats += 1;
    if (entry.type === "NARRATIVE") narratives += 1;
  }

  return {
    actions,
    chats,
    narratives,
    badges: badgeDates.length
  };
}

export function AchievementsPanel({
  entries,
  claimed,
  badgeDates,
  onClaim
}: AchievementsPanelProps) {
  const stats = countStats(entries, badgeDates);

  return (
    <section className="panel soft">
      <h2 className="section-title">成就墙</h2>
      <p className="subtle">记录里程碑，见证成长。</p>
      <div style={{ marginTop: 12, display: "grid", gap: 10 }}>
        {ACHIEVEMENTS.map((achievement) => {
          const progress =
            achievement.kind === "actions"
              ? stats.actions
              : achievement.kind === "chat"
                ? stats.chats
                : achievement.kind === "narrative"
                  ? stats.narratives
                  : stats.badges;
          const done = progress >= achievement.target;
          const isClaimed = claimed.includes(achievement.id);
          return (
            <div
              key={achievement.id}
              style={{
                display: "grid",
                gap: 8,
                padding: "10px 12px",
                borderRadius: 12,
                border: "1px solid var(--border)",
                background: done ? "rgba(64, 159, 112, 0.12)" : "rgba(255, 255, 255, 0.7)"
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", gap: 8 }}>
                <strong style={{ fontSize: 14 }}>{achievement.title}</strong>
                <span className="subtle">
                  {Math.min(progress, achievement.target)}/{achievement.target}
                </span>
              </div>
              <span className="subtle">{achievement.description}</span>
              <button
                className="action-button"
                type="button"
                disabled={!done || isClaimed}
                onClick={() => onClaim(achievement.id)}
              >
                {isClaimed ? "已领取" : done ? "领取成就" : "未达成"}
              </button>
            </div>
          );
        })}
      </div>
    </section>
  );
}
