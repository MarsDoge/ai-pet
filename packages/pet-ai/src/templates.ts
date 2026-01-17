import { deriveMood } from "@ai-pet/pet-core";
import type { AiReply, ContextSnapshot, SuggestedAction } from "./types";

const TEMPLATE_LIBRARY: Record<
  string,
  { text: string; suggestedActions: SuggestedAction[]; memoryWrite?: Record<string, unknown> }
> = {
  HUNGRY: {
    text: "My tummy is rumbling. A snack would help!",
    suggestedActions: ["FEED"],
    memoryWrite: { needs: "food" }
  },
  TIRED: {
    text: "I'm running low on energy. A nap sounds perfect.",
    suggestedActions: ["SLEEP"],
    memoryWrite: { needs: "rest" }
  },
  DIRTY: {
    text: "I'm feeling a bit messy. A bath would be great.",
    suggestedActions: ["BATH"],
    memoryWrite: { needs: "clean" }
  },
  BORED: {
    text: "Can we play a quick game?",
    suggestedActions: ["PLAY"],
    memoryWrite: { needs: "play" }
  },
  HAPPY: {
    text: "Everything feels bright and cozy today.",
    suggestedActions: ["PET", "CHAT"],
    memoryWrite: { mood: "happy" }
  },
  CONTENT: {
    text: "I'm comfy and calm. Want to hang out?",
    suggestedActions: ["CHAT"],
    memoryWrite: { mood: "content" }
  }
};

export function buildTemplateReply(context: ContextSnapshot): AiReply {
  const mood = deriveMood(context.pet);
  const fallback = TEMPLATE_LIBRARY[mood] ?? TEMPLATE_LIBRARY.CONTENT;

  return {
    text: fallback.text,
    emotionTag: mood,
    suggestedActions: fallback.suggestedActions,
    memoryWrite: fallback.memoryWrite
  };
}
