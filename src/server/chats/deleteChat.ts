import { authUserMiddleware } from "@/auth-middleware";
import { db } from "@/lib/db";
import { chats } from "@/lib/db/schema";
import { createServerFn } from "@tanstack/react-start";
import { and, eq } from "drizzle-orm";
import { z } from "zod";

const deleteChatSchema = z.object({
  chatId: z.string().uuid(),
});

export type DeleteChatInput = z.infer<typeof deleteChatSchema>;

export const deleteChat = createServerFn({ method: "POST" })
  .validator(deleteChatSchema)
  .middleware([authUserMiddleware])
  .handler(async ({ data: { chatId }, context }) => {
    await db
      .delete(chats)
      .where(and(eq(chats.id, chatId), eq(chats.userId, context.user.id)));
  });
