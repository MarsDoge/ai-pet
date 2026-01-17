import type { AiReply, ContextSnapshot, SuggestedAction } from "./types";
import { buildTemplateReply } from "./templates";

export type OpenAiCompatibleConfig = {
  apiKey: string;
  baseUrl?: string;
  model: string;
  temperature?: number;
  fetchFn?: typeof fetch;
};

const DEFAULT_SYSTEM_PROMPT =
  "You are a tiny virtual pet. Reply as the pet. Return JSON with keys: text, emotionTag, suggestedActions, memoryWrite.";

const SUGGESTED_ACTIONS: SuggestedAction[] = ["FEED", "PET", "BATH", "PLAY", "SLEEP", "CHAT"];

function sanitizeSuggestedActions(input: unknown): SuggestedAction[] {
  if (!Array.isArray(input)) return [];
  return input.filter((action) => SUGGESTED_ACTIONS.includes(action as SuggestedAction)) as SuggestedAction[];
}

function sanitizeReply(parsed: unknown, context: ContextSnapshot): AiReply {
  if (!parsed || typeof parsed !== "object") {
    return buildTemplateReply(context);
  }

  const record = parsed as Record<string, unknown>;
  const text = typeof record.text === "string" ? record.text : buildTemplateReply(context).text;
  const emotionTag =
    typeof record.emotionTag === "string" ? record.emotionTag : buildTemplateReply(context).emotionTag;
  const suggestedActions = sanitizeSuggestedActions(record.suggestedActions);
  const memoryWrite =
    record.memoryWrite && typeof record.memoryWrite === "object" ? (record.memoryWrite as Record<string, unknown>) : undefined;

  return {
    text,
    emotionTag: emotionTag as AiReply["emotionTag"],
    suggestedActions,
    memoryWrite
  };
}

function parseReply(content: string, context: ContextSnapshot): AiReply {
  try {
    const parsed = JSON.parse(content);
    return sanitizeReply(parsed, context);
  } catch {
    return buildTemplateReply(context);
  }
}

function buildPrompt(context: ContextSnapshot): string {
  const payload = {
    pet: context.pet,
    recentEvents: context.recentEvents ?? [],
    lastUserMessage: context.lastUserMessage ?? ""
  };
  return JSON.stringify(payload);
}

export async function fetchOpenAiCompatibleReply(
  context: ContextSnapshot,
  config: OpenAiCompatibleConfig
): Promise<AiReply> {
  const baseUrl = config.baseUrl ?? "https://api.openai.com/v1";
  const url = `${baseUrl.replace(/\/$/, "")}/chat/completions`;
  const fetcher = config.fetchFn ?? fetch;

  try {
    const response = await fetcher(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${config.apiKey}`
      },
      body: JSON.stringify({
        model: config.model,
        temperature: config.temperature ?? 0.7,
        messages: [
          { role: "system", content: DEFAULT_SYSTEM_PROMPT },
          { role: "user", content: buildPrompt(context) }
        ]
      })
    });

    if (!response.ok) {
      return buildTemplateReply(context);
    }

    const data = (await response.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
    };

    const content = data.choices?.[0]?.message?.content;
    if (!content) return buildTemplateReply(context);

    return parseReply(content, context);
  } catch {
    return buildTemplateReply(context);
  }
}
