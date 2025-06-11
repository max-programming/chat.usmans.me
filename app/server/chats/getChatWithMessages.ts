import { db } from "@/lib/db";
import { chats, messages } from "@/lib/db/schema";
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { and, asc, eq } from "drizzle-orm";
import { authMiddleware } from "@/auth-middleware";

export type ChatWithMessages = Awaited<ReturnType<typeof getChatWithMessages>>;
export const getChatWithMessages = createServerFn({ method: "GET" })
  .validator(z.object({ chatId: z.string() }))
  .middleware([authMiddleware])
  .handler(async ({ data: { chatId }, context }) => {
    const chat = await db
      .select({
        id: chats.id,
        title: chats.title,
        message: {
          id: messages.id,
          role: messages.role,
          content: messages.content,
          modelName: messages.modelName,
          tokenCount: messages.tokenCount,
          createdAt: messages.createdAt,
        },
      })
      .from(chats)
      .where(and(eq(chats.id, chatId), eq(chats.userId, context.user.id)))
      .innerJoin(messages, eq(chats.id, messages.chatId))
      .orderBy(asc(messages.createdAt));
    if (chat.length === 0) {
      return {
        chat: {
          id: chatId,
          title: "New Chat",
        },
        messages: [],
      };
    }

    return {
      chat: chat[0],
      messages: chat.map(c => c.message),
    };
  });
