import {
  useMutation,
  useQueryClient,
  type InfiniteData,
} from "@tanstack/react-query";
import { newChat, type NewChatInput } from "@/server/chats/newChat";
import { queries } from "../queries";
import type { InfiniteChats } from "@/server/chats/getChatsInfinite";
import type { ChatWithMessages } from "@/server/chats/getChatWithMessages";
import { toast } from "sonner";

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
        queries.chats.infinite().queryKey,
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
    onError(error, variables) {
      console.error("Error adding chat", error);
      toast.error("Failed to start chat");
      queryClient.setQueryData(
        queries.chats.withMessages(variables.chatId, true).queryKey,
        (old: ChatWithMessages) => ({ ...old, messages: [] })
      );
      queryClient.setQueryData<InfiniteData<InfiniteChats>>(
        queries.chats.infinite().queryKey,
        old => {
          if (!old || !old.pages || old.pages.length === 0) return old;
          return {
            ...old,
            pages: [
              {
                ...old.pages[0],
                chats: old.pages[0].chats.filter(
                  chat => chat.id !== variables.chatId
                ),
              },
              ...old.pages.slice(1),
            ],
          };
        }
      );
    },
  });
}
