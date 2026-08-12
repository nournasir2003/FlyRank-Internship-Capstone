// app/api/chat/route.ts
import { google } from "@ai-sdk/google";
import {
  streamText,
  convertToModelMessages,
  createUIMessageStreamResponse,
  toUIMessageStream,
  type UIMessage,
} from "ai";
import { SYSTEM_PROMPT, AI_MODEL, MODEL_CONFIG } from "@/lib/ai/config";

export const maxDuration = 30; // ثواني — يسمح بالبث حتى 30 ثانية

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();

  const result = streamText({
    model: google(AI_MODEL),
    system: SYSTEM_PROMPT,
    messages: await convertToModelMessages(messages),
    maxOutputTokens: MODEL_CONFIG.maxOutputTokens,
    temperature: MODEL_CONFIG.temperature,
  });

  return createUIMessageStreamResponse({
    stream: toUIMessageStream({ stream: result.stream }),
  });
}
