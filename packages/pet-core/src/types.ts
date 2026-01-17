export type Mood = "HUNGRY" | "TIRED" | "DIRTY" | "BORED" | "HAPPY" | "CONTENT";

export type StatKey =
  | "hunger"
  | "energy"
  | "cleanliness"
  | "fun"
  | "affection"
  | "exp"
  | "level"
  | "coins";

export type StatDelta = Partial<Record<StatKey, number>>;

export interface PetState {
  hunger: number;
  energy: number;
  cleanliness: number;
  fun: number;
  affection: number;
  exp: number;
  level: number;
  coins: number;
  lastTickAt: number;
}

export interface ReduceResult {
  state: PetState;
  delta: StatDelta;
}
