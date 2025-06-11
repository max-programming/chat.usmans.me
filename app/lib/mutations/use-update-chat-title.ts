import { useMutation, useQueryClient } from "@tanstack/react-query";
import { queries } from "../queries";
import { updateChatTitle } from "@/server/chats/updateChatTitle";
import type { ChatWithMessages } from "@/server/chats/getChatWithMessages";
import { resetChat } from "../stores/chat.store";
import type { SidebarChat } from "@/server/chats/getChats";

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
      queryClient.setQueryData(
        queries.chats.all.queryKey,
        (old: SidebarChat[]) =>
          old.map(chat => (chat.id === chatId ? { ...chat, title } : chat))
      );
      resetChat();
      // await queryClient.invalidateQueries(queries.chats.all);
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
