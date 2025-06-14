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
    await db.insert(messages).values({
      id: data.messageId,
      chatId: data.chatId,
      tokenCount: data.tokenCount,
      content: data.content,
      role: data.role,
      modelName: data.modelName,
    });

    return { chatId: data.chatId, messageId: data.messageId };
  });

export const generateMessageId = createIdGenerator({
  prefix: "msg",
  separator: "-",
  size: 24,
});
