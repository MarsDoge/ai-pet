import type { MemoryEntry, MemoryState } from "../lib/types";

type MemoryPanelProps = {
  memory: MemoryState;
};

function formatTime(at: number) {
  return new Date(at).toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit" });
}

function formatRole(role: MemoryEntry["role"]) {
  return role === "user" ? "你" : "宠物";
}

export function MemoryPanel({ memory }: MemoryPanelProps) {
  const shortTerm = memory.shortTerm.slice(-8).reverse();
  const { profile, preferences, notes } = memory.longTerm;
  const noteEntries = Object.entries(notes);

  return (
    <section className="panel soft">
      <h2 className="section-title">记忆回顾</h2>
      <p className="subtle">短期对话与长期偏好摘要。</p>

      <div style={{ marginTop: 12, display: "grid", gap: 12 }}>
        <div style={{ display: "grid", gap: 8 }}>
          <strong style={{ fontSize: 14 }}>短期记忆</strong>
          {shortTerm.length === 0 ? (
            <span className="subtle">暂无对话记录。</span>
          ) : (
            shortTerm.map((entry) => (
              <div
                key={`${entry.at}-${entry.role}`}
                style={{
                  display: "grid",
                  gap: 4,
                  padding: "8px 10px",
                  borderRadius: 10,
                  border: "1px solid var(--border)",
                  background: "rgba(255, 255, 255, 0.7)"
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", gap: 8 }}>
                  <span className="subtle">{formatRole(entry.role)}</span>
                  <span className="subtle">{formatTime(entry.at)}</span>
                </div>
                <span>{entry.text}</span>
              </div>
            ))
          )}
        </div>

        <div style={{ display: "grid", gap: 8 }}>
          <strong style={{ fontSize: 14 }}>长期记忆</strong>
          <div style={{ display: "grid", gap: 8 }}>
            <div style={{ display: "grid", gap: 4 }}>
              <span className="subtle">性格画像</span>
              <span>{profile || "尚未形成描述。"}</span>
            </div>
            <div style={{ display: "grid", gap: 4 }}>
              <span className="subtle">偏好</span>
              {preferences.length === 0 ? (
                <span>暂无偏好记录。</span>
              ) : (
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                  {preferences.map((item) => (
                    <span key={item} className="badge">
                      {item}
                    </span>
                  ))}
                </div>
              )}
            </div>
            <div style={{ display: "grid", gap: 4 }}>
              <span className="subtle">记事本</span>
              {noteEntries.length === 0 ? (
                <span>暂无记录。</span>
              ) : (
                noteEntries.map(([key, value]) => (
                  <div
                    key={key}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      gap: 8,
                      padding: "6px 8px",
                      borderRadius: 8,
                      border: "1px solid var(--border)",
                      background: "rgba(255, 255, 255, 0.6)"
                    }}
                  >
                    <span className="subtle">{key}</span>
                    <span>{value}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
