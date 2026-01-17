export type CoreEventType =
  | "FEED"
  | "PET"
  | "BATH"
  | "PLAY"
  | "SLEEP"
  | "TICK";

/** Core deterministic event with timestamp in ms. */
export interface BaseEvent {
  type: CoreEventType;
  at: number;
}

export type CoreEvent = BaseEvent;
