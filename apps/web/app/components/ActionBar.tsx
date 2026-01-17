import type { CoreEventType } from "@ai-pet/pet-core";

const ACTIONS: Array<{ type: CoreEventType | "CHAT"; label: string; detail: string }> = [
  { type: "FEED", label: "喂食", detail: "降低饥饿" },
  { type: "PET", label: "抚摸", detail: "提升亲密" },
  { type: "BATH", label: "洗澡", detail: "变干净" },
  { type: "PLAY", label: "玩耍", detail: "增加快乐" },
  { type: "SLEEP", label: "睡觉", detail: "恢复精力" },
  { type: "CHAT", label: "聊天", detail: "说点什么" }
];

type ActionBarProps = {
  onAction: (type: CoreEventType | "CHAT") => void;
};

export function ActionBar({ onAction }: ActionBarProps) {
  return (
    <section className="panel">
      <h2 className="section-title">动作</h2>
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
