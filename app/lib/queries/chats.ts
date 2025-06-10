import { getChatWithMessages } from "@/server/chats/getChatWithMessages";
import { createQueryKeys } from "@lukemorales/query-key-factory";

export const chats = createQueryKeys("chats", {
  withMessages: (chatId: string) => ({
    queryKey: [chatId],
    queryFn: () => getChatWithMessages({ data: { chatId } }),
  }),
});
