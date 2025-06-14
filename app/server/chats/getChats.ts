import { db } from "@/lib/db";
import { createServerFn } from "@tanstack/react-start";
import { desc, eq, lt, and } from "drizzle-orm";
import { chats } from "@/lib/db/schema";
import { authMiddleware } from "@/auth-middleware";
import { z } from "zod";

export type InfiniteChats = Awaited<ReturnType<typeof getChatsInfinite>>;
export type SidebarChat = InfiniteChats["chats"][number];

// New infinite scroll function
export const getChatsInfinite = createServerFn({ method: "GET" })
  .validator(
    z.object({
      limit: z.number().min(1).max(50).default(20),
      cursor: z.string().optional(),
    })
  )
  .middleware([authMiddleware])
  .handler(async ({ data: { limit, cursor }, context }) => {
    const whereCondition = cursor
      ? and(
          eq(chats.userId, context.user.id),
          lt(chats.createdAt, new Date(cursor))
        )
      : eq(chats.userId, context.user.id);

    const chatResults = await db
      .select({
        id: chats.id,
        title: chats.title,
        createdAt: chats.createdAt,
      })
      .from(chats)
      .where(whereCondition)
      .orderBy(desc(chats.createdAt))
      .limit(limit + 1); // Get one extra to determine if there are more pages

    const hasNextPage = chatResults.length > limit;
    const chatsData = hasNextPage ? chatResults.slice(0, -1) : chatResults;

    return {
      chats: chatsData,
      nextCursor: hasNextPage
        ? chatsData[chatsData.length - 1]?.createdAt.toISOString()
        : null,
      hasNextPage,
    };
  });
