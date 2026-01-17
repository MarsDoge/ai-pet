import type { AiReply, ContextSnapshot } from "./types";
import { buildTemplateReply } from "./templates";

export interface LlmAdapter {
  name: string;
  generateReply(context: ContextSnapshot): Promise<AiReply>;
}

export function createTemplateAdapter(): LlmAdapter {
  return {
    name: "template",
    async generateReply(context: ContextSnapshot): Promise<AiReply> {
      return buildTemplateReply(context);
    }
  };
}
