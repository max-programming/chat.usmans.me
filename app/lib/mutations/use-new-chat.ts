import { useMutation } from "@tanstack/react-query";
import { newChat, type NewChatInput } from "@/server/chats/newChat";

export function useNewChat() {
  return useMutation({
    mutationFn: (input: NewChatInput) => newChat({ data: input }),
  });
}
