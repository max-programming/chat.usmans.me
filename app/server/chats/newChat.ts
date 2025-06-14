import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { chats, messages } from "@/lib/db/schema";
import { db } from "@/lib/db";
import { authMiddleware, authUserMiddleware } from "@/auth-middleware";
import { generateMessageId } from "../messages/newMessage";
import { nanoid } from "nanoid";

const newChatSchema = z.object({
  message: z.string(),
  chatId: z.string(),
  timestamp: z.date().optional(),
});

export type NewChatInput = z.infer<typeof newChatSchema>;

export const newChat = createServerFn({ method: "POST" })
  .validator(newChatSchema)
  .middleware([authMiddleware])
  .handler(async ({ data: { chatId, message, timestamp }, context }) => {
    const shareId = nanoid(10);
    const defaultTitle = "New Chat";
    await db.insert(chats).values({
      id: chatId,
      title: defaultTitle,
      userId: context.user.id,
      shareId,
      createdAt: timestamp ?? new Date(),
    });

    const messageId = generateMessageId();
    await db.insert(messages).values({
      id: messageId,
      chatId,
      content: message,
      role: "user",
    });

    return { chatId, messageId, title: defaultTitle, shareId };
  });
