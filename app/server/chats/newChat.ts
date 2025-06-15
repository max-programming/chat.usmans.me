import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { chats, messages } from "@/lib/db/schema";
import { db } from "@/lib/db";
import { authMiddleware } from "@/auth-middleware";
import { nanoid } from "nanoid";

const newChatSchema = z.object({
  chatId: z.string(),
  message: z.string(),
  messageId: z.string(),
  timestamp: z.date().optional(),
});

export type NewChatInput = z.infer<typeof newChatSchema>;

export const newChat = createServerFn({ method: "POST" })
  .validator(newChatSchema)
  .middleware([authMiddleware])
  .handler(
    async ({ data: { chatId, message, messageId, timestamp }, context }) => {
      await db.transaction(async tx => {
        const shareId = nanoid(10);
        const defaultTitle = "New Chat";

        await tx.insert(chats).values({
          id: chatId,
          title: defaultTitle,
          userId: context.user.id,
          shareId,
          createdAt: timestamp ?? new Date(),
        });

        await tx.insert(messages).values({
          id: messageId,
          chatId,
          content: message,
          role: "user",
        });
      });
    }
  );
