import type { EventLogEntry } from "./types";

export const DEFAULT_EVENT_LOG_LIMIT = 200;

export class EventLog {
  private entries: EventLogEntry[];
  private limit: number;

  constructor(initial: EventLogEntry[] = [], limit: number = DEFAULT_EVENT_LOG_LIMIT) {
    this.limit = limit;
    this.entries = this.truncate(initial);
  }

  list(): EventLogEntry[] {
    return [...this.entries];
  }

  append(entry: EventLogEntry): EventLogEntry[] {
    this.entries = this.truncate([...this.entries, entry]);
    return this.list();
  }

  appendMany(entries: EventLogEntry[]): EventLogEntry[] {
    if (entries.length === 0) return this.list();
    this.entries = this.truncate([...this.entries, ...entries]);
    return this.list();
  }

  private truncate(entries: EventLogEntry[]): EventLogEntry[] {
    if (entries.length <= this.limit) return [...entries];
    return entries.slice(entries.length - this.limit);
  }
}
