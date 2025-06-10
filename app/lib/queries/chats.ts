import { getChats } from "@/server/chats/getChats";
import { getChatWithMessages } from "@/server/chats/getChatWithMessages";
import { createQueryKeys } from "@lukemorales/query-key-factory";

export const chats = createQueryKeys("chats", {
  all: {
    queryKey: ["all"],
    queryFn: () => getChats(),
  },
  withMessages: (chatId: string) => ({
    queryKey: [chatId],
    queryFn: () => getChatWithMessages({ data: { chatId } }),
  }),
});
