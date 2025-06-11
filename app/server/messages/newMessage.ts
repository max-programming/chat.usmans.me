import { authMiddleware } from "@/auth-middleware";
import { db } from "@/lib/db";
import { messages } from "@/lib/db/schema";
import { createServerFn } from "@tanstack/react-start";
import { createIdGenerator } from "ai";
import { z } from "zod";

const newMessageSchema = z.object({
  chatId: z.string(),
  messageId: z.string().optional(),
  content: z.string(),
  role: z.enum(["user", "assistant", "system", "data"]),
  tokenCount: z.number().optional(),
});
export type NewMessageInput = z.infer<typeof newMessageSchema>;

export const newMessage = createServerFn({ method: "POST" })
  .validator(newMessageSchema)
  .middleware([authMiddleware])
  .handler(
    async ({
      data: {
        chatId,
        content,
        role,
        tokenCount,
        messageId = generateMessageId(),
      },
    }) => {
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

export const generateMessageId = createIdGenerator({
  prefix: "msg",
  separator: "-",
  size: 24,
});
