import { db } from "@/lib/db";
import { createServerFn } from "@tanstack/react-start";
import { desc, eq } from "drizzle-orm";
import { chats as chatsTable } from "@/lib/db/schema";
import { authMiddleware } from "@/auth-middleware";

export type SidebarChat = Awaited<ReturnType<typeof getChats>>[number];

export const getChats = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const chats = await db.query.chats.findMany({
      columns: {
        id: true,
        title: true,
        createdAt: true,
      },
      orderBy: desc(chatsTable.createdAt),
      where: eq(chatsTable.userId, context.user.id),
    });

    return chats;
  });
