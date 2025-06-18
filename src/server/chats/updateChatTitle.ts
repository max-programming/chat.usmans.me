import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { db } from "@/lib/db";
import { chats } from "@/lib/db/schema";
import { and, eq } from "drizzle-orm";
import { authMiddleware } from "@/auth-middleware";

export const updateChatTitle = createServerFn({ method: "POST" })
  .validator(z.object({ chatId: z.string(), title: z.string() }))
  .middleware([authMiddleware])
  .handler(async ({ data: { chatId, title }, context }) => {
    await db
      .update(chats)
      .set({ title })
      .where(and(eq(chats.id, chatId), eq(chats.userId, context.user.id)));
  });
