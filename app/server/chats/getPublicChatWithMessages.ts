import { db } from "@/lib/db";
import { chats, messages } from "@/lib/db/schema";
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { and, asc, eq } from "drizzle-orm";
import { notFound } from "@tanstack/react-router";

export type PublicChatWithMessages = Awaited<
  ReturnType<typeof getPublicChatWithMessages>
>;

export const getPublicChatWithMessages = createServerFn({ method: "GET" })
  .validator(z.object({ shareId: z.string() }))
  .handler(async ({ data: { shareId } }) => {
    const chat = await db
      .select({
        id: chats.id,
        title: chats.title,
        isPublic: chats.isPublic,
        shareId: chats.shareId,
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
      .where(and(eq(chats.shareId, shareId), eq(chats.isPublic, true)))
      .innerJoin(messages, eq(chats.id, messages.chatId))
      .orderBy(asc(messages.createdAt));

    if (chat.length === 0) {
      console.log("Public chat not found", shareId);
      throw notFound();
    }

    const { message, ...chatWithoutMessages } = chat[0];

    return {
      chat: chatWithoutMessages,
      messages: chat.map(c => c.message),
    };
  });
