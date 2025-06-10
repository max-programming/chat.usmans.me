import { db } from "@/lib/db";
import { messages } from "@/lib/db/schema";
import { createServerFn } from "@tanstack/react-start";
import { generateId } from "ai";
import { z } from "zod";

const newMessageSchema = z.object({
  chatId: z.string(),
  messageId: z.string().optional().default(generateId),
  content: z.string(),
  role: z.enum(["user", "assistant", "system", "data"]),
  tokenCount: z.number().optional(),
});
export type NewMessageInput = z.infer<typeof newMessageSchema>;

export const newMessage = createServerFn({ method: "POST" })
  .validator(newMessageSchema)
  .handler(
    async ({ data: { chatId, content, role, tokenCount, messageId } }) => {
      await db.insert(messages).values({
        id: messageId,
        chatId,
        tokenCount,
        content,
        role,
      });

      return { chatId, messageId };
    }
  );
