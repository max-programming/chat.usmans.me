import { openai } from "@ai-sdk/openai";
import { anthropic } from "@ai-sdk/anthropic";
import { google } from "@ai-sdk/google";
import { createAPIFileRoute } from "@tanstack/react-start/api";
import { streamText, type LanguageModelV1 } from "ai";
import { z } from "zod";

import type { OpenAIChatModelId } from "@ai-sdk/openai/internal";
import type { AnthropicMessagesModelId } from "@ai-sdk/anthropic/internal";
import type { GoogleGenerativeAILanguageModel } from "@ai-sdk/google/internal";

type ModelId =
  | OpenAIChatModelId
  | AnthropicMessagesModelId
  | GoogleGenerativeAILanguageModel["modelId"];

export type AllowedProviders = z.infer<typeof sendMessageSchema>["provider"];
export type AllowedModels = (typeof allowedModels)[number];

const allowedModels = [
  "gpt-4o-mini",
  "claude-3-haiku-20240307",
  "gemini-2.0-flash-lite",
] as const satisfies ModelId[];
const allowedProviders = ["openai", "anthropic", "google"] as const;

const providerEnum = z.enum(allowedProviders, { message: "Invalid provider" });
const modelEnum = z.enum(allowedModels, { message: "Invalid model" });

const sendMessageSchema = z.object({
  messages: z.array(
    z.object({
      role: z.enum(["user", "assistant"]),
      content: z.string().trim().min(1, "Message is required"),
    })
  ),
  provider: providerEnum.optional().default("openai"),
  model: modelEnum.optional().default("gpt-4o-mini"),
});

export const APIRoute = createAPIFileRoute("/api/chat")({
  async POST({ request }) {
    try {
      const { messages, provider, model } = sendMessageSchema.parse(
        await request.json()
      );
      let modelInstance: LanguageModelV1;
      switch (provider) {
        case "openai":
          modelInstance = openai(model);
          break;
        case "anthropic":
          modelInstance = anthropic("claude-3-5-haiku-latest");
          break;
        case "google":
          modelInstance = google(model);
          break;
      }

      if (!modelInstance) {
        throw new Error("Invalid model or provider");
      }

      const result = streamText({
        model: modelInstance,
        messages,
        onError(error) {
          console.error(error);
        },
      });

      return result.toDataStreamResponse();
    } catch (error) {
      console.error(error);
      return new Response("Internal Server Error", { status: 500 });
    }
  },
});
