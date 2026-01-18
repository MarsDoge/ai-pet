"use client";

import { useRef, useState } from "react";
import { SpeechBubble } from "./SpeechBubble";

type PetStageProps = {
  moodLabel: string;
  message: string;
};

export function PetStage({ moodLabel, message }: PetStageProps) {
  const moodMeta: Record<string, { label: string; emoji: string; className: string }> = {
    HUNGRY: { label: "饥饿", emoji: "🍪", className: "mood-hungry" },
    TIRED: { label: "困倦", emoji: "😴", className: "mood-tired" },
    DIRTY: { label: "脏了", emoji: "🫧", className: "mood-dirty" },
    BORED: { label: "无聊", emoji: "😐", className: "mood-bored" },
    HAPPY: { label: "开心", emoji: "😊", className: "mood-happy" },
    CONTENT: { label: "舒适", emoji: "🙂", className: "mood-content" }
  };
  const meta = moodMeta[moodLabel] ?? { label: moodLabel, emoji: "✨", className: "mood-content" };
  const stageRef = useRef<HTMLDivElement | null>(null);
  const [position, setPosition] = useState({ x: 140, y: 140 });
  const dragOffset = useRef({ x: 0, y: 0 });
  const isDragging = useRef(false);

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    const rect = stageRef.current?.getBoundingClientRect();
    if (!rect) return;
    isDragging.current = true;
    dragOffset.current = {
      x: event.clientX - rect.left - position.x,
      y: event.clientY - rect.top - position.y
    };
    (event.target as HTMLElement).setPointerCapture(event.pointerId);
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging.current) return;
    const rect = stageRef.current?.getBoundingClientRect();
    if (!rect) return;

    const nextX = event.clientX - rect.left - dragOffset.current.x;
    const nextY = event.clientY - rect.top - dragOffset.current.y;
    const maxX = rect.width - 120;
    const maxY = rect.height - 120;

    setPosition({
      x: Math.max(0, Math.min(nextX, maxX)),
      y: Math.max(0, Math.min(nextY, maxY))
    });
  };

  const handlePointerUp = (event: React.PointerEvent<HTMLDivElement>) => {
    isDragging.current = false;
    (event.target as HTMLElement).releasePointerCapture(event.pointerId);
  };

  return (
    <div className="panel pet-stage fade-in" ref={stageRef}>
      <div className="badge" style={{ position: "absolute", right: 18, top: 18 }}>
        心情 {meta.label} {meta.emoji}
      </div>
      <SpeechBubble message={message} />
      <div
        className={`pet-avatar ${meta.className}`}
        role="button"
        aria-label="拖动宠物"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        style={{ transform: `translate(${position.x}px, ${position.y}px)` }}
      >
        <div className="pet-face">
          <span className="pet-eye left" />
          <span className="pet-eye right" />
          <span className="pet-mouth" />
        </div>
      </div>
    </div>
  );
}
