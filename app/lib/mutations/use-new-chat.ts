import {
  useMutation,
  useQueryClient,
  type InfiniteData,
} from "@tanstack/react-query";
import { newChat, type NewChatInput } from "@/server/chats/newChat";
import { queries } from "../queries";
import type { InfiniteChats } from "@/server/chats/getChatsInfinite";
import type { ChatWithMessages } from "@/server/chats/getChatWithMessages";

export function useNewChat() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: NewChatInput) => newChat({ data: input }),
    onSuccess({ chatId, title, shareId }) {
      // Update the infinite query data
      queryClient.setQueryData<InfiniteData<InfiniteChats>>(
        queries.chats.infinite(20).queryKey,
        old => {
          if (!old || !old.pages || old.pages.length === 0) return old;

          const newChat = { id: chatId, title, createdAt: new Date() };

          return {
            ...old,
            pages: [
              {
                ...old.pages[0],
                chats: [newChat, ...old.pages[0].chats],
              },
              ...old.pages.slice(1),
            ],
          };
        }
      );
      queryClient.setQueryData(
        queries.chats.withMessages(chatId, true).queryKey,
        (old: ChatWithMessages): ChatWithMessages => ({
          ...old,
          chat: { ...old.chat, title, shareId, isPublic: false },
        })
      );
    },
  });
}
