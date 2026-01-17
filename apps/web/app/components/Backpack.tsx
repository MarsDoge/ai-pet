import type { InventoryItem } from "../lib/types";

type BackpackProps = {
  items: InventoryItem[];
  onUse: (id: string) => void;
};

export function Backpack({ items, onUse }: BackpackProps) {
  return (
    <section className="panel soft">
      <h2 className="section-title">背包</h2>
      <p className="subtle">点击物品立即使用。</p>
      <div className="inventory-grid" style={{ marginTop: 12 }}>
        {items.map((item) => (
          <div key={item.id} className="inventory-card">
            <strong>{item.name}</strong>
            <p className="subtle">{item.kind === "food" ? "食物" : "玩具"} · 数量 {item.quantity}</p>
            <button className="action-button" type="button" onClick={() => onUse(item.id)}>
              使用
            </button>
          </div>
        ))}
        {items.length === 0 ? <p className="subtle">背包空空。</p> : null}
      </div>
    </section>
  );
}
