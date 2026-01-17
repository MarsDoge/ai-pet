import type { InventoryItem } from "./types";

export const STORAGE_KEY = "ai-pet-save";
const parsedLimit = Number(process.env.NEXT_PUBLIC_AUTO_SPEAK_LIMIT_PER_DAY ?? 8);
export const AUTO_SPEAK_LIMIT = Number.isFinite(parsedLimit) && parsedLimit > 0 ? parsedLimit : 8;
export const AUTO_SPEAK_IDLE_MS = 30 * 60 * 1000;
export const AUTO_SPEAK_COOLDOWN_MS = 5 * 60 * 1000;
export const AUTO_SPEAK_POLL_MS = 20 * 1000;

export const DEFAULT_INVENTORY: InventoryItem[] = [
  { id: "food-basic", name: "酥脆小饼干", kind: "food", actionType: "FEED", quantity: 3 },
  { id: "food-berry", name: "星星莓", kind: "food", actionType: "FEED", quantity: 2 },
  { id: "toy-ring", name: "星环玩具", kind: "toy", actionType: "PLAY", quantity: 2 },
  { id: "toy-drum", name: "迷你小鼓", kind: "toy", actionType: "PLAY", quantity: 1 }
];

export type ActionMessageType = "FEED" | "PET" | "BATH" | "PLAY" | "SLEEP";

export const ACTION_MESSAGES: Record<ActionMessageType, string> = {
  FEED: "开饭啦！肚子舒服多了。",
  PET: "对，就是这里，再来一点。",
  BATH: "洗干净啦，香喷喷的。",
  PLAY: "嗷呜！玩得好开心。",
  SLEEP: "开始充电，小睡一下。"
};
