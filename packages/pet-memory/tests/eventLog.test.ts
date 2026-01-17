import { describe, expect, it } from "vitest";
import { DEFAULT_EVENT_LOG_LIMIT, EventLog } from "../src/index";

describe("EventLog", () => {
  it("truncates to the latest 200 entries", () => {
    const log = new EventLog();

    for (let i = 0; i < DEFAULT_EVENT_LOG_LIMIT + 5; i += 1) {
      log.append({ type: "TEST", at: i });
    }

    const entries = log.list();
    expect(entries).toHaveLength(DEFAULT_EVENT_LOG_LIMIT);
    expect(entries[0].at).toBe(5);
    expect(entries[entries.length - 1].at).toBe(DEFAULT_EVENT_LOG_LIMIT + 4);
  });
});
