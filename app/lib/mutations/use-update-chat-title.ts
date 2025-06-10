import { useMutation, useQueryClient } from "@tanstack/react-query";
import { queries } from "../queries";
import { updateChatTitle } from "@/server/chats/updateChatTitle";
import type { ChatWithMessages } from "@/server/chats/getChatWithMessages";

export function useUpdateChatTitle() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: { chatId: string; title: string }) =>
      updateChatTitle({ data: input }),
    onSuccess(_, { chatId, title }) {
      queryClient.setQueryData(
        queries.chats.withMessages(chatId).queryKey,
        (old: ChatWithMessages) => {
          return {
            ...old,
            chat: { ...old.chat, title },
          };
        }
      );
    },
  });
}
