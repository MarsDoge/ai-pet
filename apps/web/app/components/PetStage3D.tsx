"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import type { Group } from "three";
import { Color } from "three";
import { SpeechBubble } from "./SpeechBubble";

type PetStage3DProps = {
  moodLabel: string;
  message: string;
};

const MOOD_STYLES: Record<string, { color: string; speed: number; bob: number }> = {
  HUNGRY: { color: "#f6b45f", speed: 1.2, bob: 0.08 },
  TIRED: { color: "#b4c9d6", speed: 0.5, bob: 0.03 },
  DIRTY: { color: "#c6a78a", speed: 0.8, bob: 0.05 },
  BORED: { color: "#d8c9b6", speed: 0.7, bob: 0.04 },
  HAPPY: { color: "#f07f5f", speed: 1.6, bob: 0.1 },
  CONTENT: { color: "#f4a77a", speed: 1.0, bob: 0.06 }
};

function PetMesh({ moodLabel }: { moodLabel: string }) {
  const groupRef = useRef<Group>(null);
  const style = MOOD_STYLES[moodLabel] ?? MOOD_STYLES.CONTENT;
  const bodyColor = useMemo(() => new Color(style.color), [style.color]);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (!groupRef.current) return;
    groupRef.current.rotation.y = Math.sin(t * style.speed) * 0.25;
    groupRef.current.position.y = 0.25 + Math.sin(t * style.speed) * style.bob;
  });

  return (
    <group ref={groupRef} position={[0, 0.25, 0]}>
      <mesh castShadow>
        <sphereGeometry args={[0.6, 32, 32]} />
        <meshStandardMaterial color={bodyColor} roughness={0.4} metalness={0.05} />
      </mesh>
      <mesh position={[-0.18, 0.1, 0.52]}>
        <sphereGeometry args={[0.06, 16, 16]} />
        <meshStandardMaterial color="#2f1f15" />
      </mesh>
      <mesh position={[0.18, 0.1, 0.52]}>
        <sphereGeometry args={[0.06, 16, 16]} />
        <meshStandardMaterial color="#2f1f15" />
      </mesh>
      <mesh position={[0, -0.08, 0.52]}>
        <torusGeometry args={[0.1, 0.03, 12, 24, Math.PI]} />
        <meshStandardMaterial color="#2f1f15" />
      </mesh>
    </group>
  );
}

export function PetStage3D({ moodLabel, message }: PetStage3DProps) {
  const moodMap: Record<string, string> = {
    HUNGRY: "饥饿",
    TIRED: "困倦",
    DIRTY: "脏了",
    BORED: "无聊",
    HAPPY: "开心",
    CONTENT: "舒适"
  };
  const moodText = moodMap[moodLabel] ?? moodLabel;

  return (
    <div className="panel pet-stage pet-stage-3d fade-in">
      <div className="badge" style={{ position: "absolute", right: 18, top: 18 }}>
        心情 {moodText}
      </div>
      <SpeechBubble message={message} />
      <div className="pet-canvas">
        <Canvas camera={{ position: [0, 1.6, 3.2], fov: 50 }}>
          <ambientLight intensity={0.7} />
          <directionalLight position={[2, 4, 2]} intensity={0.8} />
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
            <circleGeometry args={[1.6, 32]} />
            <meshStandardMaterial color="#ffffff" opacity={0.7} transparent />
          </mesh>
          <PetMesh moodLabel={moodLabel} />
        </Canvas>
      </div>
    </div>
  );
}
