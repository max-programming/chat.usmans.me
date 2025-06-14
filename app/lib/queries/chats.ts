import { getChatsInfinite } from "@/server/chats/getChatsInfinite";
import { getChatTitle } from "@/server/chats/getChatTitle";
import { getChatWithMessages } from "@/server/chats/getChatWithMessages";
import { getPublicChatWithMessages } from "@/server/chats/getPublicChatWithMessages";
import { createQueryKeys } from "@lukemorales/query-key-factory";

export const chats = createQueryKeys("chats", {
  infinite: (limit: number = 20) => ({
    queryKey: ["infinite", limit],
    queryFn: ({ pageParam }: { pageParam?: string }) =>
      getChatsInfinite({ data: { limit, cursor: pageParam } }),
  }),
  withMessages: (chatId: string, isNew?: boolean) => ({
    queryKey: [chatId],
    queryFn: () => getChatWithMessages({ data: { chatId, isNew } }),
  }),
  publicWithMessages: (shareId: string) => ({
    queryKey: ["public", shareId],
    queryFn: () => getPublicChatWithMessages({ data: { shareId } }),
  }),
  getChatTitle: (chatId: string) => ({
    queryKey: ["title", chatId],
    queryFn: () => getChatTitle({ data: { chatId } }),
  }),
});
