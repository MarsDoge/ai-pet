export type CoreEventType =
  | "FEED"
  | "PET"
  | "BATH"
  | "PLAY"
  | "SLEEP"
  | "TICK";

export interface BaseEvent {
  type: CoreEventType;
  at: number;
}

export type CoreEvent = BaseEvent;
