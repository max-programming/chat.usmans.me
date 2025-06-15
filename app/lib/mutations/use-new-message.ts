import { useMutation, useQueryClient } from "@tanstack/react-query";
import { newMessage, type NewMessageInput } from "@/server/messages/newMessage";
import { queries } from "../queries";
import type { ChatWithMessages } from "@/server/chats/getChatWithMessages";
import { toast } from "sonner";

export function useNewMessage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: NewMessageInput) => newMessage({ data: input }),
    onMutate(input) {
      queryClient.setQueryData(
        queries.chats.withMessages(input.chatId).queryKey,
        (old: ChatWithMessages) => {
          const newMessage = {
            id: input.messageId,
            role: input.role,
            content: input.content,
            modelName: input.modelName,
            tokenCount: input.tokenCount,
          };
          return {
            ...old,
            messages: [...old.messages, newMessage],
          };
        }
      );
    },
    onError(error, variables) {
      console.error("Error adding message", error);
      toast.error("Failed to send message");
      queryClient.setQueryData(
        queries.chats.withMessages(variables.chatId).queryKey,
        (old: ChatWithMessages) => ({
          ...old,
          messages: old.messages.filter(msg => msg.id !== variables.messageId),
        })
      );
    },
  });
}
