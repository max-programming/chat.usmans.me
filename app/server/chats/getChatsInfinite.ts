import { db } from "@/lib/db";
import { createServerFn } from "@tanstack/react-start";
import { desc, eq, lt, and, SQL } from "drizzle-orm";
import { chats } from "@/lib/db/schema";
import { authMiddleware } from "@/auth-middleware";
import { z } from "zod";

export type InfiniteChats = Awaited<ReturnType<typeof getChatsInfinite>>;
export type SidebarChat = InfiniteChats["chats"][number];

export const getChatsInfinite = createServerFn({ method: "GET" })
  .validator(
    z.object({
      limit: z.number().min(1).max(50).default(20),
      cursor: z.string().optional(),
    })
  )
  .middleware([authMiddleware])
  .handler(async ({ data: { limit, cursor }, context }) => {
    const conditions: SQL[] = [eq(chats.userId, context.user.id)];
    if (cursor) {
      conditions.push(lt(chats.createdAt, new Date(cursor)));
    }

    const chatResults = await db.query.chats.findMany({
      columns: {
        id: true,
        title: true,
        createdAt: true,
      },
      where: and(...conditions),
      orderBy: desc(chats.createdAt),
      limit: limit + 1, // Get one extra to determine if there are more pages
    });

    // const chatResults = await db
    //   .select({
    //     id: chats.id,
    //     title: chats.title,
    //     createdAt: chats.createdAt,
    //   })
    //   .from(chats)
    //   .where(and(...conditions))
    //   .orderBy(desc(chats.createdAt))
    //   .limit(limit + 1);

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
