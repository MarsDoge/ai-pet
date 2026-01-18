import type { PetState } from "@ai-pet/pet-core";

const STAT_ITEMS: Array<{ key: keyof PetState; label: string }> = [
  { key: "hunger", label: "饥饿" },
  { key: "energy", label: "精力" },
  { key: "cleanliness", label: "清洁" },
  { key: "fun", label: "快乐" },
  { key: "affection", label: "亲密" }
];

export function StatusPanel({ pet }: { pet: PetState }) {
  const suggestions: string[] = [];
  if (pet.hunger >= 80) suggestions.push("喂食");
  if (pet.energy <= 20) suggestions.push("睡觉");
  if (pet.cleanliness <= 25) suggestions.push("洗澡");
  if (pet.fun <= 30) suggestions.push("玩耍");
  if (pet.affection <= 30) suggestions.push("抚摸");

  return (
    <section className="panel soft">
      <h2 className="section-title">状态</h2>
      <p className="subtle">等级 {pet.level} · {pet.coins} 金币</p>
      <div style={{ marginTop: 8, display: "flex", gap: 8, flexWrap: "wrap" }}>
        {suggestions.length === 0 ? (
          <span className="subtle">状态良好，继续保持吧。</span>
        ) : (
          suggestions.map((item) => (
            <span key={item} className="badge">
              建议 {item}
            </span>
          ))
        )}
      </div>
      <div className="status-grid" style={{ marginTop: 12 }}>
        {STAT_ITEMS.map((item) => (
          <div key={item.key} className="stat-row">
            <span>{item.label}</span>
            <div className="stat-bar">
              <span style={{ width: `${pet[item.key]}%` }} />
            </div>
            <span>{pet[item.key]}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
