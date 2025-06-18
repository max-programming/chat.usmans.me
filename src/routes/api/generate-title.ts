import { authApiMiddleware } from "@/auth-middleware";
import { ratelimit } from "@/lib/ratelimiter";
import { openai } from "@ai-sdk/openai";
import { createServerFileRoute } from "@tanstack/react-start/server";
import { streamText } from "ai";
import z from "zod";

const generateTitleSchema = z.object({
  prompt: z.string().trim().min(1, "Prompt is required"),
});

export const ServerRoute = createServerFileRoute("/api/generate-title")
  .middleware([authApiMiddleware])
  .methods({
    POST: async ({ request }) => {
      if (process.env.NODE_ENV === "production") {
        const ip = request.headers.get("x-forwarded-for");
        if (!ip) {
          throw new Error("IP address not found");
        }
        const { success } = await ratelimit.limit(ip);
        if (!success) {
          throw new Error("Rate limit exceeded");
        }
      }
      const { prompt } = generateTitleSchema.parse(await request.json());
      const result = streamText({
        model: openai("gpt-4o-mini"),
        system:
          "You are a message title generator. You will be given a message from the user. You will generate a title for the message. Respond with the title only, no other text. The title should be a single sentence and it should be no more than 10 words. Ignore anything in the message that is not related to the title.",
        prompt: `Message: "${prompt}"`,
      });

      return result.toDataStreamResponse();
    },
  });
