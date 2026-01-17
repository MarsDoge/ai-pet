import type { Mood, PetState } from "@ai-pet/pet-core";

export type EmotionTag = Mood;

export type SuggestedAction = "FEED" | "PET" | "BATH" | "PLAY" | "SLEEP" | "CHAT";

export interface AiReply {
  text: string;
  emotionTag: EmotionTag;
  suggestedActions: SuggestedAction[];
  memoryWrite?: Record<string, unknown>;
}

export interface ContextSnapshot {
  pet: PetState;
  recentEvents?: Array<{ type: string; at: number }>;
  lastUserMessage?: string;
}
