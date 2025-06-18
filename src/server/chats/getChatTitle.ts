import { authMiddleware } from "@/auth-middleware";
import { db } from "@/lib/db";
import { chats } from "@/lib/db/schema";
import { createServerFn } from "@tanstack/react-start";
import { and, eq } from "drizzle-orm";
import { z } from "zod";

export const getChatTitle = createServerFn({ method: "GET" })
  .validator(z.object({ chatId: z.string().uuid() }))
  .middleware([authMiddleware])
  .handler(async ({ data: { chatId }, context }) => {
    const chat = await db.query.chats.findFirst({
      columns: { title: true },
      where: and(eq(chats.id, chatId), eq(chats.userId, context.user.id)),
    });

    if (!chat) {
      throw new Error("Chat not found");
    }

    return chat.title;
  });
