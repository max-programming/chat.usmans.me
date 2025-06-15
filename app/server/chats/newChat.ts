import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { chats, messages } from "@/lib/db/schema";
import { db } from "@/lib/db";
import { authMiddleware } from "@/auth-middleware";
import { nanoid } from "nanoid";

const newChatSchema = z.object({
  chatId: z.string(),
  timestamp: z.date().optional(),
});

export type NewChatInput = z.infer<typeof newChatSchema>;

export const newChat = createServerFn({ method: "POST" })
  .validator(newChatSchema)
  .middleware([authMiddleware])
  .handler(async ({ data: { chatId, timestamp }, context }) => {
    const shareId = nanoid(10);
    const defaultTitle = "New Chat";

    await db.insert(chats).values({
      id: chatId,
      title: defaultTitle,
      userId: context.user.id,
      shareId,
      createdAt: timestamp ?? new Date(),
    });

    return {
      id: chatId,
      title: defaultTitle,
      shareId,
    };
  });
