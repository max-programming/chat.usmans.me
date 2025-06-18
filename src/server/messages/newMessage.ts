import { authMiddleware, authUserMiddleware } from "@/auth-middleware";
import { db } from "@/lib/db";
import { messages } from "@/lib/db/schema";
import { createServerFn } from "@tanstack/react-start";
import { createIdGenerator } from "ai";
import { z } from "zod";

const newMessageSchema = z.object({
  chatId: z.string(),
  messageId: z.string(),
  content: z.string(),
  role: z.enum(["user", "assistant", "system", "data"]),
  tokenCount: z.number().optional(),
  modelName: z.string().optional(),
});
export type NewMessageInput = z.infer<typeof newMessageSchema>;

export const newMessage = createServerFn({ method: "POST" })
  .validator(newMessageSchema)
  .middleware([authMiddleware])
  .handler(async ({ data }) => {
    const maxRetries = 12; // Up to ~30 seconds total wait time
    const baseDelay = 250; // Start with 250ms

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        await db.insert(messages).values({
          id: data.messageId,
          chatId: data.chatId,
          tokenCount: data.tokenCount,
          content: data.content,
          role: data.role,
          modelName: data.modelName,
        });

        // Success - log if we had to retry
        if (attempt > 1) {
          console.log(
            `Message inserted successfully on attempt ${attempt}/${maxRetries}`
          );
        }

        return { chatId: data.chatId, messageId: data.messageId };
      } catch (error: any) {
        // Check if it's a foreign key constraint error (chat doesn't exist yet)
        const isForeignKeyError =
          error?.code === "23503" || // PostgreSQL foreign key violation
          error?.constraint_name === "messages_chat_id_fkey" ||
          error?.message?.includes("foreign key") ||
          error?.message?.includes("violates foreign key constraint") ||
          error?.message?.includes("messages_chat_id_fkey");

        if (isForeignKeyError && attempt < maxRetries) {
          // Exponential backoff with jitter for cold start scenarios
          const exponentialDelay = baseDelay * Math.pow(1.8, attempt - 1);
          const jitter = Math.random() * 200; // Add some randomness
          const totalDelay = Math.min(exponentialDelay + jitter, 5000); // Cap at 5 seconds

          console.log(
            `Chat not ready yet (attempt ${attempt}/${maxRetries}), retrying in ${Math.round(totalDelay)}ms...`
          );
          await new Promise(resolve => setTimeout(resolve, totalDelay));
          continue;
        }

        // Either not a FK error, or we've exceeded max retries
        console.error(
          `Failed to insert message after ${attempt} attempts:`,
          error
        );
        throw error;
      }
    }

    throw new Error(
      `Failed to insert message after ${maxRetries} attempts - chat may not exist`
    );
  });

export const generateMessageId = createIdGenerator({
  prefix: "msg",
  separator: "-",
  size: 24,
});
