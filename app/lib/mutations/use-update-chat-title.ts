import { useMutation, useQueryClient } from "@tanstack/react-query";
import { queries } from "../queries";
import { updateChatTitle } from "@/server/chats/updateChatTitle";
import type { ChatWithMessages } from "@/server/chats/getChatWithMessages";
import { resetChat } from "../stores/chat.store";

export function useUpdateChatTitle() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: { chatId: string; title: string }) =>
      updateChatTitle({ data: input }),
    async onSuccess(_, { chatId, title }) {
      await queryClient.invalidateQueries(queries.chats.all);
      await queryClient.invalidateQueries(queries.chats.withMessages(chatId));
      resetChat();
      // queryClient.setQueryData(
      //   queries.chats.withMessages(chatId).queryKey,
      //   (old: ChatWithMessages) => {
      //     return {
      //       ...old,
      //       chat: { ...old.chat, title },
      //     };
      //   }
      // );
    },
  });
}
