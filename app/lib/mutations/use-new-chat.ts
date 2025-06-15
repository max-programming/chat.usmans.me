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
    onMutate(input) {
      queryClient.setQueryData(
        queries.chats.withMessages(input.chatId, true).queryKey,
        (): ChatWithMessages => {
          const newChat = {
            id: input.chatId,
            title: "New Chat",
            isPublic: false,
            shareId: null,
          };
          const newMessage = {
            id: input.messageId,
            role: "user" as const,
            content: input.message,
            modelName: null,
            tokenCount: null,
            createdAt: input.timestamp ?? new Date(),
          };
          return {
            chat: newChat,
            messages: [newMessage],
          };
        }
      );
      queryClient.setQueryData<InfiniteData<InfiniteChats>>(
        queries.chats.infinite(20).queryKey,
        old => {
          if (!old || !old.pages || old.pages.length === 0) return old;

          const newChat = {
            id: input.chatId,
            title: "New Chat",
            createdAt: new Date(),
          };

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
    // onSuccess({ chatId, title, shareId }) {
    //   // Update the infinite query data
    //   queryClient.setQueryData<InfiniteData<InfiniteChats>>(
    //     queries.chats.infinite(20).queryKey,
    //     old => {
    //       if (!old || !old.pages || old.pages.length === 0) return old;

    //       const newChat = { id: chatId, title, createdAt: new Date() };

    //       return {
    //         ...old,
    //         pages: [
    //           {
    //             ...old.pages[0],
    //             chats: [newChat, ...old.pages[0].chats],
    //           },
    //           ...old.pages.slice(1),
    //         ],
    //       };
    //     }
    //   );
    //   queryClient.setQueryData(
    //     queries.chats.withMessages(chatId, true).queryKey,
    //     (old: ChatWithMessages): ChatWithMessages => ({
    //       ...old,
    //       chat: { ...old.chat, title, shareId, isPublic: false },
    //     })
    //   );
    // },
  });
}
