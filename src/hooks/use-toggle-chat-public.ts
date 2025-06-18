import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams } from "@tanstack/react-router";
import { toggleChatPublic } from "@/server/chats/toggleChatPublic";
import { queries } from "@/lib/queries";
import type { ChatWithMessages } from "@/server/chats/getChatWithMessages";

export function useToggleChatPublic() {
  const queryClient = useQueryClient();
  const { chatId } = useParams({ from: "/_protected/chat/$chatId" });

  return useMutation({
    mutationFn: () => toggleChatPublic({ data: { chatId } }),
    onMutate: () => {
      const previousChat = queryClient.getQueryData(
        queries.chats.withMessages(chatId).queryKey
      );
      if (!previousChat) return;

      queryClient.setQueryData(
        queries.chats.withMessages(chatId).queryKey,
        (old: ChatWithMessages) => ({
          ...old,
          chat: {
            ...old.chat,
            isPublic: !old.chat.isPublic,
          },
        })
      );

      return { previousChat };
    },
    onError: (error, variables, context) => {
      queryClient.setQueryData(
        queries.chats.withMessages(chatId).queryKey,
        context?.previousChat
      );
    },
  });
}
