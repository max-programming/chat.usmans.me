import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { db } from "@/lib/db";
import { chats } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export const updateChatTitle = createServerFn({ method: "POST" })
  .validator(z.object({ chatId: z.string(), title: z.string() }))
  .handler(async ({ data: { chatId, title } }) => {
    await db.update(chats).set({ title }).where(eq(chats.id, chatId));
  });
