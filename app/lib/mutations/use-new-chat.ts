import { useMutation } from "@tanstack/react-query";
import { newChat, type NewChatInput } from "@/server/chats/newChat";
// import { queries } from "../queries";

export function useNewChat() {
  // const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: NewChatInput) => newChat({ data: input }),
    // async onSuccess({ chatId }) {
    //   await queryClient.invalidateQueries(queries.chats.withMessages(chatId));
    //   await queryClient.invalidateQueries(queries.chats.all);
    // },
  });
}
