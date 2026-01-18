"use client";

import type { EventLogEntry } from "@ai-pet/pet-memory";
import { useMemo, useState } from "react";

type NarrativePayload = {
  text?: string;
  tags?: string[];
  source?: "chat" | "auto_speak";
};

type NarrativeTimelineProps = {
  entries: EventLogEntry[];
};

function formatTime(at: number) {
  return new Date(at).toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit" });
}

function getNarrative(entry: EventLogEntry): NarrativePayload | null {
  if (entry.type !== "NARRATIVE") return null;
  if (!entry.payload || typeof entry.payload !== "object") return null;
  return entry.payload as NarrativePayload;
}

export function NarrativeTimeline({ entries }: NarrativeTimelineProps) {
  const [sourceFilter, setSourceFilter] = useState<"all" | "chat" | "auto_speak">("all");
  const [tagFilter, setTagFilter] = useState<string>("全部");
  const [limit, setLimit] = useState<number>(8);

  const { narratives, tags } = useMemo(() => {
    const all = entries
      .map((entry) => ({ entry, payload: getNarrative(entry) }))
      .filter((item) => item.payload?.text) as Array<{
      entry: EventLogEntry;
      payload: NarrativePayload;
    }>;

    const tagSet = new Set<string>();
    for (const item of all) {
      item.payload.tags?.forEach((tag) => tagSet.add(tag));
    }

    return {
      narratives: all,
      tags: ["全部", ...Array.from(tagSet)]
    };
  }, [entries]);

  const filtered = narratives
    .filter((item) => (sourceFilter === "all" ? true : item.payload.source === sourceFilter))
    .filter((item) => (tagFilter === "全部" ? true : item.payload.tags?.includes(tagFilter)))
    .slice(-limit)
    .reverse();

  return (
    <section className="panel soft">
      <h2 className="section-title">叙事时间线</h2>
      <p className="subtle">记录宠物的即时心声与互动片段。</p>
      <div style={{ marginTop: 12, display: "flex", gap: 8, flexWrap: "wrap" }}>
        <select
          value={sourceFilter}
          onChange={(event) => setSourceFilter(event.target.value as "all" | "chat" | "auto_speak")}
          style={{
            padding: "6px 10px",
            borderRadius: 10,
            border: "1px solid var(--border)",
            background: "rgba(255, 255, 255, 0.9)",
            fontFamily: "inherit"
          }}
        >
          <option value="all">全部来源</option>
          <option value="chat">对话片段</option>
          <option value="auto_speak">自言自语</option>
        </select>
        <select
          value={tagFilter}
          onChange={(event) => setTagFilter(event.target.value)}
          style={{
            padding: "6px 10px",
            borderRadius: 10,
            border: "1px solid var(--border)",
            background: "rgba(255, 255, 255, 0.9)",
            fontFamily: "inherit"
          }}
        >
          {tags.map((tag) => (
            <option key={tag} value={tag}>
              {tag}
            </option>
          ))}
        </select>
        <select
          value={limit}
          onChange={(event) => setLimit(Number(event.target.value))}
          style={{
            padding: "6px 10px",
            borderRadius: 10,
            border: "1px solid var(--border)",
            background: "rgba(255, 255, 255, 0.9)",
            fontFamily: "inherit"
          }}
        >
          {[4, 8, 12, 20].map((value) => (
            <option key={value} value={value}>
              最近 {value} 条
            </option>
          ))}
        </select>
      </div>
      <div style={{ marginTop: 12, display: "grid", gap: 10 }}>
        {filtered.length === 0 ? (
          <span className="subtle">还没有故事片段，先聊聊吧。</span>
        ) : (
          filtered.map(({ entry, payload }) => (
            <div
              key={`${entry.at}-${payload?.text}`}
              style={{
                display: "grid",
                gap: 6,
                padding: "10px 12px",
                borderRadius: 12,
                border: "1px solid var(--border)",
                background: "rgba(255, 255, 255, 0.65)"
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", gap: 8 }}>
                <span className="subtle">{payload?.source === "auto_speak" ? "自言自语" : "对话片段"}</span>
                <span className="subtle">{formatTime(entry.at)}</span>
              </div>
              <strong style={{ fontSize: 14 }}>{payload?.text}</strong>
              {payload?.tags && payload.tags.length > 0 ? (
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                  {payload.tags.map((tag) => (
                    <span key={`${entry.at}-${tag}`} className="badge">
                      {tag}
                    </span>
                  ))}
                </div>
              ) : null}
            </div>
          ))
        )}
      </div>
    </section>
  );
}
