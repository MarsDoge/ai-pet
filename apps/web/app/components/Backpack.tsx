import type { InventoryItem } from "../lib/types";

type BackpackProps = {
  items: InventoryItem[];
  onUse: (id: string) => void;
};

export function Backpack({ items, onUse }: BackpackProps) {
  return (
    <section className="panel soft">
      <h2 className="section-title">Backpack</h2>
      <p className="subtle">Tap an item to use it immediately.</p>
      <div className="inventory-grid" style={{ marginTop: 12 }}>
        {items.map((item) => (
          <div key={item.id} className="inventory-card">
            <strong>{item.name}</strong>
            <p className="subtle">{item.kind} · qty {item.quantity}</p>
            <button className="action-button" type="button" onClick={() => onUse(item.id)}>
              Use
            </button>
          </div>
        ))}
        {items.length === 0 ? <p className="subtle">Backpack empty.</p> : null}
      </div>
    </section>
  );
}
