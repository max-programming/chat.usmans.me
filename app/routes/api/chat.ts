import { openai } from "@ai-sdk/openai";
import { createAPIFileRoute } from "@tanstack/react-start/api";
import { streamText } from "ai";
import { z } from "zod";

const sendMessageSchema = z.object({
  messages: z.array(
    z.object({
      role: z.enum(["user", "assistant"]),
      content: z.string().trim().min(1, "Message is required"),
    })
  ),
  // model: z.string().optional(),
});

export const APIRoute = createAPIFileRoute("/api/chat")({
  async POST({ request }) {
    try {
      const { messages } = sendMessageSchema.parse(await request.json());

      const result = streamText({
        model: openai("gpt-4o-mini"),
        messages,
      });

      return result.toDataStreamResponse();
    } catch (error) {
      console.error(error);
      return new Response("Internal Server Error", { status: 500 });
    }
  },
});
