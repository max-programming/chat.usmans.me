import {
  useMutation,
  useQueryClient,
  type InfiniteData,
} from "@tanstack/react-query";
import { newChat, type NewChatInput } from "@/server/chats/newChat";
import { queries } from "../queries";
import type { InfiniteChats } from "@/server/chats/getChats";

export function useNewChat() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: NewChatInput) => newChat({ data: input }),
    async onSuccess({ chatId, title }) {
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
    },
  });
}
