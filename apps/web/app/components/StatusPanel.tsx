import type { PetState } from "@ai-pet/pet-core";

const STAT_ITEMS: Array<{ key: keyof PetState; label: string }> = [
  { key: "hunger", label: "Hunger" },
  { key: "energy", label: "Energy" },
  { key: "cleanliness", label: "Cleanliness" },
  { key: "fun", label: "Fun" },
  { key: "affection", label: "Affection" }
];

export function StatusPanel({ pet }: { pet: PetState }) {
  return (
    <section className="panel soft">
      <h2 className="section-title">Vitals</h2>
      <p className="subtle">Level {pet.level} · {pet.coins} coins</p>
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
