import { useMutation, useQueryClient } from "@tanstack/react-query";
import { newChat, type NewChatInput } from "@/server/chats/newChat";
import { queries } from "../queries";
import type { SidebarChat } from "@/server/chats/getChats";

export function useNewChat() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: NewChatInput) => newChat({ data: input }),
    async onSuccess({ chatId, title }) {
      // await queryClient.invalidateQueries(queries.chats.withMessages(chatId));
      // await queryClient.invalidateQueries(queries.chats.all);
      queryClient.setQueryData(
        queries.chats.all.queryKey,
        (old: SidebarChat[]) => [{ id: chatId, title }, ...old]
      );
    },
  });
}
