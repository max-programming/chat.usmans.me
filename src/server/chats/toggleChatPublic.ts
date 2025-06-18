import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { db } from "@/lib/db";
import { chats } from "@/lib/db/schema";
import { and, eq, not } from "drizzle-orm";
import { authMiddleware } from "@/auth-middleware";

export const toggleChatPublic = createServerFn({ method: "POST" })
  .validator(z.object({ chatId: z.string() }))
  .middleware([authMiddleware])
  .handler(async ({ data: { chatId }, context }) => {
    await db
      .update(chats)
      .set({ isPublic: not(chats.isPublic) })
      .where(and(eq(chats.id, chatId), eq(chats.userId, context.user.id)));
  });
