import { getChats } from "@/server/chats/getChats";
import { getChatTitle } from "@/server/chats/getChatTitle";
import { getChatWithMessages } from "@/server/chats/getChatWithMessages";
import { createQueryKeys } from "@lukemorales/query-key-factory";

export const chats = createQueryKeys("chats", {
  all: {
    queryKey: ["all"],
    queryFn: () => getChats(),
  },
  withMessages: (chatId: string, isNew?: boolean) => ({
    queryKey: [chatId],
    queryFn: () => getChatWithMessages({ data: { chatId, isNew } }),
  }),
  getChatTitle: (chatId: string) => ({
    queryKey: ["title", chatId],
    queryFn: () => getChatTitle({ data: { chatId } }),
  }),
});
