import type { CoreEventType } from "@ai-pet/pet-core";

const ACTIONS: Array<{ type: CoreEventType | "CHAT"; label: string; detail: string }> = [
  { type: "FEED", label: "Feed", detail: "Reduce hunger" },
  { type: "PET", label: "Pet", detail: "Boost affection" },
  { type: "BATH", label: "Bath", detail: "Clean up" },
  { type: "PLAY", label: "Play", detail: "Have fun" },
  { type: "SLEEP", label: "Sleep", detail: "Restore energy" },
  { type: "CHAT", label: "Chat", detail: "Say something" }
];

type ActionBarProps = {
  onAction: (type: CoreEventType | "CHAT") => void;
};

export function ActionBar({ onAction }: ActionBarProps) {
  return (
    <section className="panel">
      <h2 className="section-title">Actions</h2>
      <div className="action-grid" style={{ marginTop: 12 }}>
        {ACTIONS.map((action) => (
          <button
            key={action.type}
            type="button"
            className="action-button"
            onClick={() => onAction(action.type)}
          >
            <strong>{action.label}</strong>
            <span className="subtle">{action.detail}</span>
          </button>
        ))}
      </div>
    </section>
  );
}
