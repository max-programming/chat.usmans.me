import { useMutation } from "@tanstack/react-query";
import { newMessage, type NewMessageInput } from "@/server/messages/newMessage";

export function useNewMessage() {
  return useMutation({
    mutationFn: (input: NewMessageInput) => newMessage({ data: input }),
  });
}
