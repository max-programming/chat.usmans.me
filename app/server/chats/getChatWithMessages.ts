import { db } from "@/lib/db";
import { chats, messages } from "@/lib/db/schema";
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { asc, eq } from "drizzle-orm";

export type ChatWithMessages = Awaited<ReturnType<typeof getChatWithMessages>>;
export const getChatWithMessages = createServerFn({ method: "GET" })
  .validator(z.object({ chatId: z.string() }))
  .handler(async ({ data: { chatId } }) => {
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
      .where(eq(chats.id, chatId))
      .innerJoin(messages, eq(chats.id, messages.chatId))
      .orderBy(asc(messages.createdAt));

    return {
      chat: chat[0],
      messages: chat.map(c => ({
        ...c.message,
        createdAt: new Date(c.message.createdAt ?? Date.now()),
      })),
    };
  });
