import { useMutation, useQueryClient } from "@tanstack/react-query";
import { newMessage, type NewMessageInput } from "@/server/messages/newMessage";
import { queries } from "../queries";
import type { ChatWithMessages } from "@/server/chats/getChatWithMessages";

export function useNewMessage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: NewMessageInput) => newMessage({ data: input }),
    onSuccess(data, variables) {
      const messageId = data.messageId;
      const newMessage = {
        id: messageId,
        role: variables.role,
        content: variables.content,
        modelName: variables.modelName,
        tokenCount: variables.tokenCount,
      };

      queryClient.setQueryData(
        queries.chats.withMessages(variables.chatId).queryKey,
        (old: ChatWithMessages) => ({
          ...old,
          messages: [...old.messages, newMessage],
        })
      );
    },
  });
}
