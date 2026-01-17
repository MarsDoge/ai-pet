import type { PetState } from "@ai-pet/pet-core";

const STAT_ITEMS: Array<{ key: keyof PetState; label: string }> = [
  { key: "hunger", label: "饥饿" },
  { key: "energy", label: "精力" },
  { key: "cleanliness", label: "清洁" },
  { key: "fun", label: "快乐" },
  { key: "affection", label: "亲密" }
];

export function StatusPanel({ pet }: { pet: PetState }) {
  return (
    <section className="panel soft">
      <h2 className="section-title">状态</h2>
      <p className="subtle">等级 {pet.level} · {pet.coins} 金币</p>
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
