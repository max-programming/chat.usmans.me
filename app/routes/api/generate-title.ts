import { openai } from "@ai-sdk/openai";
import { createAPIFileRoute } from "@tanstack/react-start/api";
import { streamText } from "ai";
import z from "zod";

const generateTitleSchema = z.object({
  prompt: z.string().trim().min(1, "Prompt is required"),
});

export const APIRoute = createAPIFileRoute("/api/generate-title")({
  POST: async ({ request }) => {
    const { prompt } = generateTitleSchema.parse(await request.json());
    const result = streamText({
      model: openai("gpt-4o-mini"),
      system:
        "You are a helpful assistant that generates a simple title for an LLM chat. You will be given an initial message from the user. You only return the title text and it should be short, single sentence, no fillers",
      prompt,
    });

    return result.toDataStreamResponse();
  },
});
