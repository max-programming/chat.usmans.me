import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { chats, messages } from "@/lib/db/schema";
import { db } from "@/lib/db";
import { authMiddleware } from "@/auth-middleware";
import { generateMessageId } from "../messages/newMessage";

const newChatSchema = z.object({
  message: z.string(),
  chatId: z.string(),
});

export type NewChatInput = z.infer<typeof newChatSchema>;

export const newChat = createServerFn({ method: "POST" })
  .validator(newChatSchema)
  .middleware([authMiddleware])
  .handler(async ({ data: { chatId, message }, context }) => {
    await db.insert(chats).values({
      id: chatId,
      title: "New Chat",
      userId: context.user.id,
    });

    const messageId = generateMessageId();
    await db.insert(messages).values({
      id: messageId,
      chatId,
      content: message,
      role: "user",
    });

    return { chatId, messageId };
  });
