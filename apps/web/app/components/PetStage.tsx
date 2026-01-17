"use client";

import { useRef, useState } from "react";
import { SpeechBubble } from "./SpeechBubble";

type PetStageProps = {
  moodLabel: string;
  message: string;
};

export function PetStage({ moodLabel, message }: PetStageProps) {
  const moodMap: Record<string, string> = {
    HUNGRY: "饥饿",
    TIRED: "困倦",
    DIRTY: "脏了",
    BORED: "无聊",
    HAPPY: "开心",
    CONTENT: "舒适"
  };
  const moodText = moodMap[moodLabel] ?? moodLabel;
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
        心情 {moodText}
      </div>
      <SpeechBubble message={message} />
      <div
        className="pet-avatar"
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
