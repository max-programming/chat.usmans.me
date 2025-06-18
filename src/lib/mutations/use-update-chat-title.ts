import {
  useMutation,
  useQueryClient,
  type InfiniteData,
} from "@tanstack/react-query";
import { queries } from "../queries";
import { updateChatTitle } from "@/server/chats/updateChatTitle";
import type { ChatWithMessages } from "@/server/chats/getChatWithMessages";
import { resetChat } from "../stores/chat.store";
import type {
  InfiniteChats,
  SidebarChat,
} from "@/server/chats/getChatsInfinite";

export function useUpdateChatTitle() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: { chatId: string; title: string }) =>
      updateChatTitle({ data: input }),
    async onSuccess(_, { chatId, title }) {
      queryClient.setQueryData(
        queries.chats.withMessages(chatId).queryKey,
        (old: ChatWithMessages) => ({
          ...old,
          chat: { ...old.chat, title },
        })
      );

      queryClient.setQueryData<InfiniteData<InfiniteChats>>(
        queries.chats.infinite().queryKey,
        old => {
          if (!old) return old;

          return {
            ...old,
            pages: old.pages.map((page: any) => ({
              ...page,
              chats: page.chats.map((chat: SidebarChat) =>
                chat.id === chatId ? { ...chat, title } : chat
              ),
            })),
          };
        }
      );

      resetChat();
    },
  });
}
